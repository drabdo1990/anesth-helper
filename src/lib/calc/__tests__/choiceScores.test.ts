import { describe, expect, it } from 'vitest';
import { FOUR_AT } from '../../../data/choiceScores';
import { choiceScoreResult } from '../choiceScores';

const answers = (...picks: number[]): Record<string, number> => Object.fromEntries(FOUR_AT.items.map((it, i) => [it.id, picks[i]]));
const ok = (r: ReturnType<typeof choiceScoreResult>) => {
  if (r.kind !== 'ok') throw new Error(`expected ok, got incomplete: ${r.missing.join(', ')}`);
  return r;
};

describe('4AT', () => {
  it.each([
    [[0, 0, 0, 0], 0, 'Delirium or cognitive impairment unlikely'],
    [[0, 1, 0, 0], 1, 'Possible cognitive impairment'],
    [[0, 2, 1, 0], 3, 'Possible cognitive impairment'],
    [[2, 0, 0, 0], 4, 'Possible delirium +/- cognitive impairment'],
    [[0, 0, 0, 1], 4, 'Possible delirium +/- cognitive impairment'],
    [[0, 2, 2, 0], 4, 'Possible delirium +/- cognitive impairment'],
    [[2, 2, 2, 1], 12, 'Possible delirium +/- cognitive impairment'],
  ])('choices %j -> %s points, %s', (picks, points, band) => {
    const r = ok(choiceScoreResult(FOUR_AT, answers(...picks)));
    expect(r.points).toBe(points);
    expect(r.band.label).toBe(band);
    expect(r.max).toBe(12);
  });

  it('mild sleepiness on waking scores 0, the same as normal alertness', () => {
    expect(ok(choiceScoreResult(FOUR_AT, answers(1, 0, 0, 0))).points).toBe(0);
  });

  it('is incomplete, and names the missing items, until every item is answered; nothing is defaulted', () => {
    const r = choiceScoreResult(FOUR_AT, { [FOUR_AT.items[0].id]: 0, [FOUR_AT.items[1].id]: 0 });
    expect(r.kind).toBe('incomplete');
    if (r.kind === 'incomplete') expect(r.missing).toEqual(['Attention', 'Acute change or fluctuating course']);
    expect(choiceScoreResult(FOUR_AT, {}).kind).toBe('incomplete');
  });

  it('treats an out-of-range option index as unanswered', () => {
    expect(choiceScoreResult(FOUR_AT, answers(0, 0, 0, 5)).kind).toBe('incomplete');
    expect(choiceScoreResult(FOUR_AT, answers(0, 0, 0, -1)).kind).toBe('incomplete');
  });
});
