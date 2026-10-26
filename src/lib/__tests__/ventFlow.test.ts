import { describe, expect, it } from 'vitest';
import { ventSteps } from '../ventFlow';
import { PLATEAU_LIMIT_CMH2O } from '../calc/ventilation';

const base = { scenario: undefined, heightCm: null, sex: null, mlPerKgPbw: null, respiratoryRate: null, peepCmH2O: null, plateauCmH2O: null, ageYears: 40 } as const;
const done = (s: ReturnType<typeof ventSteps>, id: string) => s.find((x) => x.id === id)!.done;
const ards = { id: 'ards', name: 'ARDS', tidalVolumeMlPerKgPbw: { target: 6, min: 4, max: 8 }, sourceIds: [] };

describe('ventSteps', () => {
  it('nothing done at start', () => expect(ventSteps({ ...base }).every((x) => !x.done)).toBe(true));
  it('VT is not done until height + sex are entered, even with a preset mL/kg', () => {
    expect(done(ventSteps({ ...base, scenario: ards, mlPerKgPbw: 6 }), 'vt')).toBe(false);
    expect(done(ventSteps({ ...base, scenario: ards, mlPerKgPbw: 6, heightCm: 170, sex: 'male' }), 'vt')).toBe(true);
  });
  it('VT at the range edge is still done, outside is not', () => {
    const p = { ...base, scenario: ards, heightCm: 170, sex: 'male' } as const;
    expect(done(ventSteps({ ...p, mlPerKgPbw: 8 }), 'vt')).toBe(true);
    expect(done(ventSteps({ ...p, mlPerKgPbw: 8.5 }), 'vt')).toBe(false);
  });
  it('plateau at limit ok, above not', () => {
    expect(done(ventSteps({ ...base, plateauCmH2O: PLATEAU_LIMIT_CMH2O }), 'plateau')).toBe(true);
    expect(done(ventSteps({ ...base, plateauCmH2O: PLATEAU_LIMIT_CMH2O + 1 }), 'plateau')).toBe(false);
  });
  it('pediatric never marks VT done', () => {
    expect(done(ventSteps({ ...base, ageYears: 8, heightCm: 130, sex: 'male', scenario: ards, mlPerKgPbw: 6 }), 'vt')).toBe(false);
  });
  it('scenario without VT range is not auto-done and says so', () => {
    const sc = { id: 'laparoscopic', name: 'l', sourceIds: [] };
    const s = ventSteps({ ...base, heightCm: 170, sex: 'male', scenario: sc, mlPerKgPbw: 6 });
    expect(done(s, 'vt')).toBe(false);
    expect(s.find((x) => x.id === 'vt')!.hint).toMatch(/judgement/);
  });
});
