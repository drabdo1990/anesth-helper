import { describe, expect, it } from 'vitest';
import { DOAC_RULE, GLP1_RULE, PERIOP_RULES, SGLT2_RULE, type PeriopDrug } from '../periopMeds';
import { ASRA_RULES } from '../periopAsra';
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

  it('cite sources that exist, and every drug is cited by its rule and backed by a label (label cards) or a primary text (guideline cards)', () => {
    for (const r of PERIOP_RULES) {
      expect(r.sourceIds.length, r.id).toBeGreaterThan(0);
      for (const id of r.sourceIds) expect(SOURCE_BY_ID[id], `${r.id} -> ${id}`).toBeDefined();
      for (const d of r.drugs) {
        expect(r.sourceIds, `${r.id} lists ${d.id}'s source`).toContain(d.sourceId);
        const expected = r.section === "Manufacturers' labels" ? 'label' : 'primary';
        expect(SOURCE_BY_ID[d.sourceId].verification, d.id).toBe(expected);
      }
    }
  });

  it('put every rule under a section heading', () => {
    for (const r of PERIOP_RULES) expect(r.section.length, r.id).toBeGreaterThan(0);
  });

  it('give every drug at least one timing, and a non-empty restart statement where it has one', () => {
    for (const d of PERIOP_RULES.flatMap((r) => r.drugs)) {
      expect(d.timings.length, d.id).toBeGreaterThan(0);
      if (d.restart !== undefined) expect(d.restart.length, d.id).toBeGreaterThan(0);
    }
    for (const d of [...SGLT2_RULE.drugs, ...DOAC_RULE.drugs]) expect(d.restart, `${d.id} is a label card and always has a restart`).toBeDefined();
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

  it('DOAC label card: always carries the caution that its timings are not ASRA neuraxial intervals, and names the ASRA card', () => {
    expect(DOAC_RULE.cautions?.some((c) => c.includes('ASRA') && /spinal|epidural|neuraxial/i.test(c))).toBe(true);
    expect(DOAC_RULE.cautions?.some((c) => c.includes('DOACs: spinal, epidural or deep block (ASRA)'))).toBe(true);
  });

  it('GLP-1: points to the comparison and states no timing of its own', () => {
    expect(GLP1_RULE.drugs).toEqual([]);
    expect(GLP1_RULE.action).toBe('individualise');
    expect(GLP1_RULE.summary).not.toMatch(/\b\d+\s*(h|hours?|days?|weeks?)\b/i);
  });

  const asraDrug = (ruleId: string, drugId: string): PeriopDrug => {
    const d = ASRA_RULES.find((r) => r.id === ruleId)?.drugs.find((x) => x.id === drugId);
    if (!d) throw new Error(`missing ${ruleId} / ${drugId}`);
    return d;
  };
  const everything = (d: PeriopDrug) => [...d.timings.map((t) => t.text), ...(d.catheter ?? []), d.restart ?? ''].join(' | ');

  it('ASRA: has the seven cards, all in the ASRA section and citing the ASRA source', () => {
    expect(ASRA_RULES.map((r) => r.id)).toEqual(['asra-warfarin', 'asra-ufh', 'asra-lmwh', 'asra-fondaparinux', 'asra-doac', 'asra-antiplatelet', 'asra-thrombolytic']);
    for (const r of ASRA_RULES) {
      expect(r.section, r.id).toBe('ASRA: spinal, epidural and deep blocks');
      expect(r.sourceIds, r.id).toEqual(['asra-anticoag-2025']);
      expect(r.cautions?.some((c) => c.includes('spinal, epidural or deep plexus/peripheral block')), r.id).toBe(true);
    }
  });

  const ASRA_PINS: Array<[string, string, string]> = [
    ['asra-warfarin', 'warfarin', 'stopped 5 days prior to the planned procedure'],
    ['asra-warfarin', 'warfarin', 'removed when the INR is <1.5'],
    ['asra-ufh', 'ufh-iv', 'minimum of 4–6 hours'],
    ['asra-ufh', 'ufh-iv', 'minimum of 1 hour after needle placement'],
    ['asra-ufh', 'ufh-sc', 'minimum of 12 hours after subcutaneous heparin'],
    ['asra-ufh', 'ufh-sc', 'minimum of 24 hours after subcutaneous heparin'],
    ['asra-lmwh', 'lmwh', 'at least 12 hours after low-dose LMWH'],
    ['asra-lmwh', 'lmwh', 'at least 24 hours prior to needle/catheter placement'],
    ['asra-fondaparinux', 'fondaparinux', '36 hours (young patients) to 42 hours (elderly patients)'],
    ['asra-fondaparinux', 'fondaparinux', 'minimum of 58 hours'],
    ['asra-fondaparinux', 'fondaparinux', 'minimum of 70 hours'],
    ['asra-fondaparinux', 'fondaparinux', 'minimum of 105 hours'],
    ['asra-doac', 'apixaban-asra', 'high dose of apixaban be discontinued at least 72 hours'],
    ['asra-doac', 'apixaban-asra', 'low dose of apixaban be discontinued for at least 36 hours'],
    ['asra-doac', 'edoxaban-asra', 'high dose of edoxaban be discontinued for at least 72 hours'],
    ['asra-doac', 'rivaroxaban-asra', 'high dose of rivaroxaban be discontinued for at least 72 hours'],
    ['asra-doac', 'rivaroxaban-asra', 'low dose of rivaroxaban be discontinued for at least 24 hours (30 hours if CrCl <30 mL/min)'],
    ['asra-doac', 'dabigatran-asra', 'discontinued for at least 72 hours in patients with a CrCl ≥50 mL/min'],
    ['asra-doac', 'dabigatran-asra', 'discontinued for 120 hours in patients with a CrCl 30–49 mL/min'],
    ['asra-doac', 'dabigatran-asra', 'low dose of dabigatran be discontinued for at least 48 hours'],
    ['asra-antiplatelet', 'thienopyridines', '5–7 days for clopidogrel, and 7–10 days for prasugrel'],
    ['asra-antiplatelet', 'ticagrelor', 'is 5 days'],
    ['asra-antiplatelet', 'cilostazol', 'avoided for 2 days'],
    ['asra-antiplatelet', 'cangrelor', 'avoided for 3 hours'],
    ['asra-thrombolytic', 'thrombolytics', 'against needle placement for at least 48 hours'],
  ];

  it.each(ASRA_PINS)('ASRA %s / %s says "%s"', (ruleId, drugId, text) => {
    expect(everything(asraDrug(ruleId, drugId))).toContain(text);
  });

  it('ASRA: every statement ends the way ASRA ends it (a grade or a full stop), so none was cut short', () => {
    for (const r of ASRA_RULES) {
      const texts = [...(r.cautions ?? []), ...r.drugs.flatMap((d) => [...d.timings.map((t) => t.text), ...(d.catheter ?? []), ...(d.restart ? [d.restart] : [])])];
      for (const t of texts) expect(t, `${r.id}: ...${t.slice(-60)}`).toMatch(/(\(grade [A-Z0-9]+\)|\.)$/);
    }
  });

  it('ASRA DOAC card: says the app cannot tell the dose, and warfarin and aspirin have no restart line', () => {
    expect(ASRA_RULES.find((r) => r.id === 'asra-doac')?.cautions?.some((c) => c.includes('cannot tell which dose'))).toBe(true);
    expect(asraDrug('asra-warfarin', 'warfarin').restart).toBeUndefined();
    expect(asraDrug('asra-antiplatelet', 'aspirin-nsaids').restart).toBeUndefined();
  });
});
