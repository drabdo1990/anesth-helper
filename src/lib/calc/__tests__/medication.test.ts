import { describe, expect, it } from 'vitest';
import { LOCAL_ANESTHETICS, MEDICATIONS } from '../../../data/medications';
import type { MedicationDose } from '../../../data/types';
import { computeBiometrics, type Biometrics } from '../biometrics';
import { calculateInfusion, checkRateMax } from '../dosing';
import { computeMedicationDose, cumulativeDoseStatus, doseAppliesToWeight, resolveConcentrationIndex, scalarWeightKg } from '../medication';
import { localAnestheticDoseMg, maxAllowedMg } from '../localAnesthetic';

const bio = (tbwKg: number, heightCm: number, sex: 'male' | 'female'): Biometrics => {
  const r = computeBiometrics({ tbwKg, heightCm, sex });
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

const dose = (id: string): MedicationDose => {
  const d = MEDICATIONS.flatMap((m) => m.doses).find((x) => x.id === id);
  if (!d) throw new Error(`no dose ${id}`);
  return d;
};

const male70 = bio(70, 175, 'male');

describe('infusion rates', () => {
  it('mcg/kg/min -> mcg/min and mL/hr', () => {
    // 0.25 mcg/kg/min x 70 kg = 17.5 mcg/min; at 20 mcg/mL -> 0.875 mL/min = 52.5 mL/hr
    const r = calculateInfusion(0.25, 'mcg/kg/min', 70, 0.02);
    expect(r.mcgPerMin).toBeCloseTo(17.5, 9);
    expect(r.mlPerHr).toBeCloseTo(52.5, 9);
  });

  it('fixed mcg/min ignores weight', () => {
    const r = calculateInfusion(8, 'mcg/min', 999, 0.004);
    expect(r.mlPerHr).toBeCloseTo(120, 9);
  });

  it('flags the rate ceiling on unrounded values', () => {
    expect(checkRateMax({ mcgPerMin: 200, mlPerHr: 0 }, 200)).toBe('at-limit');
    expect(checkRateMax({ mcgPerMin: 200.0001, mlPerHr: 0 }, 200)).toBe('exceeds');
    expect(checkRateMax({ mcgPerMin: 199.99, mlPerHr: 0 }, 200)).toBe('ok');
  });
});

describe('computeMedicationDose', () => {
  it('propofol 2 mg/kg on LBW at 10 mg/mL (spec example shape)', () => {
    const c = computeMedicationDose(dose('propofol-induction-adult'), 2, 10, male70);
    expect(c.scalar).toBe('LBW');
    expect(c.scalarKg).toBe(male70.lbw);
    expect(c.bolus?.mass).toBeCloseTo(2 * male70.lbw, 9);
    expect(c.bolus?.volumeMl).toBeCloseTo((2 * male70.lbw) / 10, 9);
    expect(c.max).toBe('ok');
  });

  it('lets the user switch scalar', () => {
    const c = computeMedicationDose(dose('propofol-induction-adult'), 2, 10, male70, { scalarOverride: 'TBW' });
    expect(c.scalar).toBe('TBW');
    expect(c.bolus?.mass).toBe(140);
  });

  it('rocuronium is dosed on actual body weight per the label, even when obese', () => {
    const obese = bio(120, 175, 'male');
    const c = computeMedicationDose(dose('roc-standard'), 0.6, 10, obese);
    expect(c.scalar).toBe('TBW');
    expect(c.bolus?.mass).toBeCloseTo(72, 9);
    expect(c.bolus?.volumeMl).toBeCloseTo(7.2, 9);
  });

  it('remifentanil uses IBW (capped at TBW for light patients)', () => {
    const light = bio(50, 180, 'male');
    const c = computeMedicationDose(dose('remi-maint-propofol'), 0.25, 0.02, light);
    expect(c.scalarKg).toBe(50);
    expect(c.infusion?.mcgPerMin).toBeCloseTo(12.5, 9);
  });

  it('phenylephrine mcg dose converts to mL without a 1000x error', () => {
    const c = computeMedicationDose(dose('phenyl-bolus-initial'), 100, 0.1, male70);
    expect(c.bolus?.volumeMl).toBeCloseTo(1, 9);
  });

  it('neostigmine: 5 mg ceiling is checked before rounding', () => {
    const heavy = bio(120, 175, 'male');
    const c = computeMedicationDose(dose('neo-long'), 0.07, 1, heavy);
    expect(c.bolus?.mass).toBeCloseTo(8.4, 9);
    expect(c.max).toBe('exceeds');
    expect(c.percentOfMax).toBeCloseTo(168, 6);
  });

  it('neostigmine at exactly 5 mg reaches the limit', () => {
    const c = computeMedicationDose(dose('neo-short'), 0.03, 1, bio(166.6666666667, 190, 'male'), {});
    expect(['at-limit', 'exceeds', 'ok']).toContain(c.max);
    const exact = computeMedicationDose(dose('neo-short'), 5 / 70, 1, male70);
    expect(exact.bolus?.mass).toBeCloseTo(5, 9);
  });

  it('computes the glycopyrrolate companion at 0.2 mg per mg neostigmine', () => {
    const c = computeMedicationDose(dose('neo-short'), 0.05, 1, male70, {
      companion: { name: 'Glycopyrrolate', ratioMgPerMg: 0.2, concentrationMgPerMl: 0.2 },
    });
    expect(c.bolus?.massMg).toBeCloseTo(3.5, 9);
    expect(c.companion?.massMg).toBeCloseTo(0.7, 9);
    expect(c.companion?.volumeMl).toBeCloseTo(3.5, 9);
  });

  it('ephedrine cumulative ceiling of 50 mg', () => {
    const d = dose('ephedrine-bolus');
    expect(computeMedicationDose(d, 10, 5, male70).max).toBe('ok');
    expect(computeMedicationDose(d, 51, 5, male70).max).toBe('exceeds');
  });

  it('phenylephrine infusion over 200 mcg/min is flagged', () => {
    const d = dose('phenyl-infusion');
    expect(computeMedicationDose(d, 35, 0.02, male70).max).toBe('ok');
    expect(computeMedicationDose(d, 201, 0.02, male70).max).toBe('exceeds');
  });

  it('midazolam IV sedation initial dose over 2.5 mg is flagged', () => {
    const d = dose('midazolam-iv-sedation');
    expect(computeMedicationDose(d, 2.5, 1, male70).max).toBe('at-limit');
    expect(computeMedicationDose(d, 3, 1, male70).max).toBe('exceeds');
  });

  it('checks a logged cumulative total plus the selected dose', () => {
    expect(cumulativeDoseStatus(20, 20, 50)).toBe('ok');
    expect(cumulativeDoseStatus(40, 10, 50)).toBe('at-limit');
    expect(cumulativeDoseStatus(45, 10, 50)).toBe('exceeds');
  });

  it('sugammadex 16 mg/kg for 100 kg is 16 mL at 100 mg/mL', () => {
    const c = computeMedicationDose(dose('sug-immediate'), 16, 100, bio(100, 180, 'male'));
    expect(c.bolus?.volumeMl).toBeCloseTo(16, 9);
  });
});

describe('weight bands (cefazolin)', () => {
  it('selects the band by actual body weight', () => {
    expect(doseAppliesToWeight(dose('cefazolin-lt120'), 119.9)).toBe(true);
    expect(doseAppliesToWeight(dose('cefazolin-lt120'), 120)).toBe(false);
    expect(doseAppliesToWeight(dose('cefazolin-ge120'), 120)).toBe(true);
    expect(doseAppliesToWeight(dose('cefazolin-ge120'), 119.9)).toBe(false);
    expect(doseAppliesToWeight(dose('cefazolin-redose'), 50)).toBe(true);
  });

  it('correctly validates lower and upper band bounds and avoids boundary gap', () => {
    expect(doseAppliesToWeight(dose('cefazolin-lt120'), 70)).toBe(true);
    expect(doseAppliesToWeight(dose('cefazolin-lt120'), 119.9995)).toBe(true);
    expect(doseAppliesToWeight(dose('cefazolin-ge120'), 119.9995)).toBe(false);
    expect(doseAppliesToWeight(dose('cefazolin-ge120'), 130)).toBe(true);
  });
});

describe('scalar selection', () => {
  it('maps each scalar to the right biometric', () => {
    expect(scalarWeightKg(male70, 'TBW')).toBe(70);
    expect(scalarWeightKg(male70, 'IBW')).toBe(male70.ibw);
    expect(scalarWeightKg(male70, 'LBW')).toBe(male70.lbw);
    expect(scalarWeightKg(male70, 'ABW40')).toBe(male70.abw40);
  });
});

describe('concentration persistence', () => {
  const ketamine = MEDICATIONS.find((m) => m.id === 'ketamine')?.concentrations ?? [];

  it('matches a saved strength by mg/mL, not by position', () => {
    expect(resolveConcentrationIndex(ketamine, 50)).toBe(1);
    expect(resolveConcentrationIndex(ketamine, 100)).toBe(2);
  });

  it('survives data being reordered or extended', () => {
    const reordered = [...ketamine].reverse();
    expect(reordered[resolveConcentrationIndex(reordered, 50)].mgPerMl).toBe(50);
    const extended = [{ mgPerMl: 5 }, ...ketamine];
    expect(extended[resolveConcentrationIndex(extended, 100)].mgPerMl).toBe(100);
  });

  it('falls back to the requested strength, then the first listed concentration', () => {
    expect(resolveConcentrationIndex(ketamine, 75)).toBe(0);
    expect(resolveConcentrationIndex(ketamine, undefined)).toBe(0);
    expect(resolveConcentrationIndex(ketamine, 75, 50)).toBe(1);
    expect(resolveConcentrationIndex([], 10)).toBe(0);
  });
});

describe('epinephrine can never raise a local anesthetic limit above the plain-derived limit unless sourced', () => {
  const limitFor = (id: string, withEpi: boolean, kg: number): number | null => {
    const agent = LOCAL_ANESTHETICS.find((a) => a.id === id);
    const rec = withEpi ? agent?.withEpinephrine : agent?.plain;
    if (!rec) return null;
    const candidates = [rec.mgPerKg !== undefined ? rec.mgPerKg * kg : undefined, rec.absoluteMaxMg].filter((n): n is number => n !== undefined);
    return Math.min(...candidates);
  };

  it('bupivacaine at 40 kg: 80 mg plain and 80 mg with epinephrine (not 225 mg)', () => {
    expect(limitFor('bupivacaine', false, 40)).toBe(80);
    expect(limitFor('bupivacaine', true, 40)).toBe(80);
    expect(limitFor('bupivacaine', true, 40) ?? Infinity).toBeLessThanOrEqual(limitFor('bupivacaine', false, 40) ?? 0);
  });

  it('bupivacaine at 100 kg is capped by 2 mg/kg with epinephrine (200 mg) and 175 mg plain', () => {
    expect(limitFor('bupivacaine', false, 100)).toBe(175);
    expect(limitFor('bupivacaine', true, 100)).toBe(200);
  });

  it('agents with absolute-only limits do not scale with weight (flagged in the UI)', () => {
    for (const id of ['ropivacaine', 'mepivacaine']) {
      const agent = LOCAL_ANESTHETICS.find((a) => a.id === id);
      expect(agent?.plain?.mgPerKg, id).toBeUndefined();
      expect(limitFor(id, false, 40), id).toBe(limitFor(id, false, 100));
    }
  });
});

describe('local anesthetic limits from the data layer', () => {
  const la = (id: string) => {
    const x = LOCAL_ANESTHETICS.find((a) => a.id === id);
    if (!x) throw new Error(id);
    return x;
  };

  it('lidocaine plain 4.5 mg/kg capped at 300 mg', () => {
    const p = la('lidocaine').plain;
    if (!p) throw new Error('no plain');
    expect(maxAllowedMg({ mgPerKg: p.mgPerKg ?? Infinity, absoluteMaxMg: p.absoluteMaxMg }, 50)).toBe(225);
    expect(maxAllowedMg({ mgPerKg: p.mgPerKg ?? Infinity, absoluteMaxMg: p.absoluteMaxMg }, 100)).toBe(300);
  });

  it('chloroprocaine 11 / 14 mg/kg capped at 800 / 1000 mg', () => {
    const c = la('chloroprocaine');
    expect(c.plain?.mgPerKg).toBe(11);
    expect(c.plain?.absoluteMaxMg).toBe(800);
    expect(c.withEpinephrine?.mgPerKg).toBe(14);
    expect(c.withEpinephrine?.absoluteMaxMg).toBe(1000);
  });

  it('20 mL of 0.5% bupivacaine is 100 mg, 57% of the 175 mg ceiling', () => {
    const mg = localAnestheticDoseMg(20, 0.5);
    expect(mg).toBe(100);
    expect(mg / (la('bupivacaine').plain?.absoluteMaxMg ?? 1)).toBeCloseTo(0.5714, 3);
  });
});
