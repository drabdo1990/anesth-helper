import { describe, expect, it } from 'vitest';
import { ventSteps } from '../ventFlow';
import { PLATEAU_LIMIT_CMH2O } from '../calc/ventilation';

const base = { scenario: undefined, heightCm: null, sex: null, mlPerKgPbw: null, respiratoryRate: null, peepCmH2O: null, plateauCmH2O: null, ageYears: 40 } as const;
const done = (s: ReturnType<typeof ventSteps>, id: string) => s.find((x) => x.id === id)!.done;

describe('ventSteps', () => {
  it('nothing done at start', () => expect(ventSteps({ ...base }).every((x) => !x.done)).toBe(true));
  it('plateau at limit ok, above not', () => {
    expect(done(ventSteps({ ...base, plateauCmH2O: PLATEAU_LIMIT_CMH2O }), 'plateau')).toBe(true);
    expect(done(ventSteps({ ...base, plateauCmH2O: PLATEAU_LIMIT_CMH2O + 1 }), 'plateau')).toBe(false);
  });
  it('pediatric never marks VT done', () => {
    const sc = { id: 'x', name: 'x', tidalVolumeMlPerKgPbw: { target: 6, min: 4, max: 8 }, sourceIds: [] };
    expect(done(ventSteps({ ...base, ageYears: 8, scenario: sc, mlPerKgPbw: 6 }), 'vt')).toBe(false);
  });
  it('scenario without VT range is not auto-done', () => {
    const sc = { id: 'laparoscopic', name: 'l', sourceIds: [] };
    expect(done(ventSteps({ ...base, scenario: sc, mlPerKgPbw: 6 }), 'vt')).toBe(false);
  });
});
