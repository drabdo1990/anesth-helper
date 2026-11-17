import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
});

import { useAppStore } from '../useAppStore';

describe('assess state', () => {
  beforeEach(() => useAppStore.getState().newCase());

  it('persists only the creatinine unit, never the creatinine or the score answers', () => {
    const persisted = useAppStore.persist.getOptions().partialize!(useAppStore.getState()) as Record<string, unknown>;
    const keys = Object.keys(persisted);
    expect(keys).toContain('creatinineUnit');
    for (const forbidden of ['patient', 'creatinineUmolL', 'scoreAnswers', 'medsTaken']) expect(keys).not.toContain(forbidden);
  });

  it('toggles a score item on and off', () => {
    useAppStore.getState().toggleScoreItem('rcri-ihd');
    expect(useAppStore.getState().scoreAnswers['rcri-ihd']).toBe(true);
    useAppStore.getState().toggleScoreItem('rcri-ihd');
    expect(useAppStore.getState().scoreAnswers['rcri-ihd']).toBe(false);
  });

  it('New case clears creatinine and score answers', () => {
    useAppStore.getState().setPatient({ creatinineUmolL: 150 });
    useAppStore.getState().toggleScoreItem('rcri-ihd');
    useAppStore.getState().newCase();
    expect(useAppStore.getState().patient.creatinineUmolL).toBeNull();
    expect(useAppStore.getState().scoreAnswers).toEqual({});
  });

  it('toggles a medication class on and off', () => {
    useAppStore.getState().toggleMedTaken('doac');
    expect(useAppStore.getState().medsTaken.doac).toBe(true);
    useAppStore.getState().toggleMedTaken('doac');
    expect(useAppStore.getState().medsTaken.doac).toBe(false);
  });

  it('New case clears the ticked medications', () => {
    useAppStore.getState().toggleMedTaken('sglt2i');
    useAppStore.getState().newCase();
    expect(useAppStore.getState().medsTaken).toEqual({});
  });
});
