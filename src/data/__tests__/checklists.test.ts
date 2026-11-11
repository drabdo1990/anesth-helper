import { describe, expect, it } from 'vitest';
import { CHECKLISTS, CHECKLIST_GROUPS } from '../checklists';
import { CICO_PLANS, LAST_STEPS, MH_STEPS } from '../emergencies';

describe('checklists', () => {
  it('puts every checklist in a known group', () => {
    for (const c of CHECKLISTS) expect(CHECKLIST_GROUPS, c.id).toContain(c.group);
  });

  it('has unique checklist ids', () => {
    const ids = CHECKLISTS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('offers checklists for airway, ventilation and regional topics', () => {
    for (const group of ['Airway', 'Ventilation', 'Regional']) {
      const lists = CHECKLISTS.filter((c) => c.group === group);
      expect(lists.length, group).toBeGreaterThan(0);
      for (const c of lists) expect(c.items.length, c.id).toBeGreaterThan(0);
    }
  });

  // Ticks are stored by item id, so a duplicate would tick two unrelated items at once.
  it('has item ids that are unique across checklists and emergency steps', () => {
    const ids = [
      ...CHECKLISTS.flatMap((c) => c.items.map((i) => i.id)),
      ...[...LAST_STEPS, ...MH_STEPS, ...CICO_PLANS.flatMap((p) => p.steps)].map((s) => s.id),
    ];
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });
});
