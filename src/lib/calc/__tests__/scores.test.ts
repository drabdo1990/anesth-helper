import { describe, expect, it } from 'vitest';
import { RCRI, STOP_BANG } from '../../../data/riskScores';
import { scoreResult, type ScoreContext } from '../scores';
import { creatinineToUmol } from '../units';

const ctx: ScoreContext = { ageYears: 40, sex: 'female', bmi: 25, creatinineUmolL: creatinineToUmol(1, 'mgdl') };

const ok = (r: ReturnType<typeof scoreResult>) => {
  if (r.kind !== 'ok') throw new Error(`expected ok, got incomplete: ${r.missing.join(', ')}`);
  return r;
};

/** The first n manual (not derived) item ids of a score, as ticked answers. */
const ticked = (score: typeof RCRI, n: number): Record<string, boolean> =>
  Object.fromEntries(score.items.filter((i) => !i.derive).slice(0, n).map((i) => [i.id, true]));

describe('RCRI', () => {
  it.each([
    [0, '0 factors'],
    [1, '1 factor'],
    [2, '2 factors'],
    [3, '3 or more factors'],
    [5, '3 or more factors'],
  ])('%s ticked items -> %s', (n, label) => {
    const r = ok(scoreResult(RCRI, ticked(RCRI, n), ctx));
    expect(r.points).toBe(n);
    expect(r.band.label).toBe(label);
  });

  it('counts creatinine exactly 2.0 mg/dL as NOT above the threshold, and 2.1 as above', () => {
    expect(ok(scoreResult(RCRI, {}, { ...ctx, creatinineUmolL: creatinineToUmol(2.0, 'mgdl') })).points).toBe(0);
    expect(ok(scoreResult(RCRI, {}, { ...ctx, creatinineUmolL: creatinineToUmol(2.1, 'mgdl') })).points).toBe(1);
  });

  it('adds the creatinine point to the ticked ones: 2 ticked + creatinine 2.1 = 3', () => {
    const r = ok(scoreResult(RCRI, ticked(RCRI, 2), { ...ctx, creatinineUmolL: creatinineToUmol(2.1, 'mgdl') }));
    expect(r.points).toBe(3);
    expect(r.max).toBe(6);
  });

  it('is incomplete until creatinine is entered, never a low score', () => {
    expect(scoreResult(RCRI, {}, { ...ctx, creatinineUmolL: null })).toEqual({ kind: 'incomplete', missing: ['serum creatinine'] });
  });
});

describe('STOP-Bang', () => {
  it.each([
    [2, 'Low risk'],
    [3, 'Intermediate risk'],
    [4, 'Intermediate risk'],
    [5, 'High risk'],
  ])('%s manual yes answers (derived items all no) -> %s', (n, label) => {
    expect(ok(scoreResult(STOP_BANG, ticked(STOP_BANG, n), ctx)).band.label).toBe(label);
  });

  it('fills age, sex and BMI from the patient: man, 60 y, BMI 36 -> 3 points', () => {
    const r = ok(scoreResult(STOP_BANG, {}, { ageYears: 60, sex: 'male', bmi: 36, creatinineUmolL: null }));
    expect(r.points).toBe(3);
    expect(r.band.label).toBe('Intermediate risk');
  });

  it('counts age exactly 50 and BMI exactly 35 as NOT above', () => {
    expect(ok(scoreResult(STOP_BANG, {}, { ageYears: 50, sex: 'female', bmi: 35, creatinineUmolL: null })).points).toBe(0);
  });

  it('ignores a manual tick on a derived item', () => {
    expect(ok(scoreResult(STOP_BANG, { 'sb-male': true, 'sb-age': true }, ctx)).points).toBe(0);
  });

  it('is incomplete, not "Low risk", when age, sex and BMI are all missing', () => {
    expect(scoreResult(STOP_BANG, {}, { ageYears: null, sex: null, bmi: null, creatinineUmolL: null })).toEqual({
      kind: 'incomplete',
      missing: ['weight and height (BMI)', 'age', 'biological sex'],
    });
  });
});
