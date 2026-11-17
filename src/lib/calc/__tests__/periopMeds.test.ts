import { describe, expect, it } from 'vitest';
import { DOAC_RULE, PERIOP_RULES } from '../../../data/periopMeds';
import { matchTimings } from '../periopMeds';

const dabigatran = DOAC_RULE.drugs.find((d) => d.id === 'dabigatran')!;
const apixaban = DOAC_RULE.drugs.find((d) => d.id === 'apixaban')!;

const byWhen = (m: ReturnType<typeof matchTimings>, text: string) => m.find((x) => x.timing.when?.includes(text))!;

describe('matchTimings (dabigatran by creatinine clearance)', () => {
  it('CrCl exactly 50 takes the 1 to 2 day line', () => {
    const m = matchTimings(dabigatran, 50);
    expect(byWhen(m, '50 mL/min or more').match).toBe('yes');
    expect(byWhen(m, 'below 50').match).toBe('no');
  });

  it('CrCl 49.9 takes the 3 to 5 day line', () => {
    const m = matchTimings(dabigatran, 49.9);
    expect(byWhen(m, '50 mL/min or more').match).toBe('no');
    expect(byWhen(m, 'below 50').match).toBe('yes');
  });

  it('without a CrCl both lines stay visible and are marked unknown', () => {
    const m = matchTimings(dabigatran, null);
    expect(byWhen(m, '50 mL/min or more').match).toBe('unknown');
    expect(byWhen(m, 'below 50').match).toBe('unknown');
  });

  it('the unconditional line is always shown', () => {
    expect(matchTimings(dabigatran, 80).filter((x) => x.match === 'always')).toHaveLength(1);
  });
});

describe('matchTimings (unconditional drugs)', () => {
  it('apixaban keeps both lines, marked always, whatever the CrCl', () => {
    for (const crcl of [null, 20, 90]) {
      const m = matchTimings(apixaban, crcl);
      expect(m).toHaveLength(2);
      expect(m.every((x) => x.match === 'always')).toBe(true);
    }
  });
});

describe('CrCl-conditional timings never leave a gap or an overlap', () => {
  it.each([0, 10, 29.9, 49.99, 50, 50.01, 89, 150])('CrCl %s matches exactly one conditional line per drug', (crcl) => {
    for (const drug of PERIOP_RULES.flatMap((r) => r.drugs)) {
      const conditional = matchTimings(drug, crcl).filter((x) => x.match !== 'always');
      if (conditional.length === 0) continue;
      expect(conditional.filter((x) => x.match === 'yes'), `${drug.id} at ${crcl}`).toHaveLength(1);
    }
  });
});
