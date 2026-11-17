import { describe, expect, it } from 'vitest';
import { CONDITIONS, PLANNED_CONDITION_IDS, STOELTING_CHAPTERS } from '../conditions';
import { SOURCE_BY_ID } from '../sources';

describe('conditions', () => {
  it('have unique ids and unique names', () => {
    expect(new Set(CONDITIONS.map((c) => c.id)).size).toBe(CONDITIONS.length);
    expect(new Set(CONDITIONS.map((c) => c.name.toLowerCase())).size).toBe(CONDITIONS.length);
  });

  it('is the full first list, so an entry cannot be dropped by accident', () => {
    expect(CONDITIONS.length).toBe(110);
  });

  it('each point to a Stoelting 8e chapter that exists', () => {
    for (const c of CONDITIONS) expect(STOELTING_CHAPTERS[c.chapter], c.id).toBeTruthy();
  });

  it('each cite Stoelting 8e, and every cited source is registered', () => {
    for (const c of CONDITIONS) {
      expect(c.sourceIds, c.id).toContain('stoelting-8e');
      for (const id of c.sourceIds) expect(SOURCE_BY_ID[id], `${c.id} -> ${id}`).toBeDefined();
    }
  });

  it('carry a plan only for the planned ids, so an index entry never shows invented text', () => {
    expect(CONDITIONS.filter((c) => c.plan).map((c) => c.id).sort()).toEqual([...PLANNED_CONDITION_IDS].sort());
    for (const c of CONDITIONS.filter((x) => !x.plan)) expect(Object.keys(c).sort(), c.id).toEqual(['aliases', 'chapter', 'id', 'name', 'sourceIds']);
  });

  it('has lower-case aliases with no duplicates within a record', () => {
    for (const c of CONDITIONS) {
      for (const a of c.aliases) expect(a, c.id).toBe(a.toLowerCase());
      expect(new Set(c.aliases).size, c.id).toBe(c.aliases.length);
    }
  });
});
