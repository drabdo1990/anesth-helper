import { describe, expect, it } from 'vitest';
import { DOAC_RULE, GLP1_RULE, PERIOP_RULES, SGLT2_RULE } from '../periopMeds';
import { SOURCE_BY_ID } from '../sources';

const drug = (rule: typeof DOAC_RULE, id: string) => {
  const d = rule.drugs.find((x) => x.id === id);
  if (!d) throw new Error(`missing drug ${id}`);
  return d;
};

describe('perioperative medication rules', () => {
  it('have unique rule ids and unique drug ids', () => {
    const ruleIds = PERIOP_RULES.map((r) => r.id);
    expect(new Set(ruleIds).size).toBe(ruleIds.length);
    const drugIds = PERIOP_RULES.flatMap((r) => r.drugs.map((d) => d.id));
    expect(new Set(drugIds).size).toBe(drugIds.length);
  });

  it('cite sources that exist, and every drug is cited by its rule and backed by a product label', () => {
    for (const r of PERIOP_RULES) {
      expect(r.sourceIds.length, r.id).toBeGreaterThan(0);
      for (const id of r.sourceIds) expect(SOURCE_BY_ID[id], `${r.id} -> ${id}`).toBeDefined();
      for (const d of r.drugs) {
        expect(r.sourceIds, `${r.id} lists ${d.id}'s source`).toContain(d.sourceId);
        expect(SOURCE_BY_ID[d.sourceId].verification, d.id).toBe('label');
      }
    }
  });

  it('give every drug at least one timing and a restart statement', () => {
    for (const d of PERIOP_RULES.flatMap((r) => r.drugs)) {
      expect(d.timings.length, d.id).toBeGreaterThan(0);
      expect(d.restart.length, d.id).toBeGreaterThan(0);
    }
  });

  it('SGLT2: ertugliflozin says 4 days, the other three say 3 days', () => {
    expect(drug(SGLT2_RULE, 'ertugliflozin').timings[0].text).toContain('at least 4 days');
    for (const id of ['empagliflozin', 'dapagliflozin', 'canagliflozin']) {
      expect(drug(SGLT2_RULE, id).timings[0].text, id).toContain('at least 3 days');
    }
  });

  it('DOAC: apixaban shows both the 48-hour and the 24-hour line', () => {
    const texts = drug(DOAC_RULE, 'apixaban').timings.map((t) => t.text).join(' | ');
    expect(texts).toContain('at least 48 hours');
    expect(texts).toContain('at least 24 hours');
  });

  it('DOAC: dabigatran has a 1 to 2 day line at CrCl 50 or more and a 3 to 5 day line below 50', () => {
    const t = drug(DOAC_RULE, 'dabigatran').timings;
    expect(t.find((x) => x.crclMin === 50)?.text).toContain('1 to 2 days');
    expect(t.find((x) => x.crclBelow === 50)?.text).toContain('3 to 5 days');
  });

  it('DOAC: always carries the caution that label timings are not ASRA neuraxial intervals', () => {
    expect(DOAC_RULE.cautions?.some((c) => c.includes('ASRA') && /spinal|epidural|neuraxial/i.test(c))).toBe(true);
  });

  it('GLP-1: points to the comparison and states no timing of its own', () => {
    expect(GLP1_RULE.drugs).toEqual([]);
    expect(GLP1_RULE.action).toBe('individualise');
    expect(GLP1_RULE.summary).not.toMatch(/\b\d+\s*(h|hours?|days?|weeks?)\b/i);
  });
});
