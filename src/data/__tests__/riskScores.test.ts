import { describe, expect, it } from 'vitest';
import { RISK_SCORES } from '../riskScores';
import { SOURCE_BY_ID } from '../sources';

describe('risk score records', () => {
  it('cite sources that exist in the registry', () => {
    for (const s of RISK_SCORES) {
      expect(s.sourceIds.length, s.id).toBeGreaterThan(0);
      for (const id of s.sourceIds) expect(SOURCE_BY_ID[id], `${s.id} -> ${id}`).toBeDefined();
    }
  });

  it('have unique item ids across all scores', () => {
    const ids = RISK_SCORES.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('have bands that start at 0, ascend, and stay within the item count', () => {
    for (const s of RISK_SCORES) {
      expect(s.bands[0].min, s.id).toBe(0);
      for (let k = 1; k < s.bands.length; k++) expect(s.bands[k].min, s.id).toBeGreaterThan(s.bands[k - 1].min);
      expect(s.bands[s.bands.length - 1].min, s.id).toBeLessThanOrEqual(s.items.length);
    }
  });
});
