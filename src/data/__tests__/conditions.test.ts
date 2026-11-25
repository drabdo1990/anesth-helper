import { describe, expect, it } from 'vitest';
import { CONDITIONS, PLANNED_CONDITION_IDS, STOELTING_CHAPTERS, emergencyEntry, subspecialtyEntry } from '../conditions';
import { DATA_VERSION, SOURCE_BY_ID } from '../sources';

describe('conditions', () => {
  it('have unique ids and unique names', () => {
    expect(new Set(CONDITIONS.map((c) => c.id)).size).toBe(CONDITIONS.length);
    expect(new Set(CONDITIONS.map((c) => c.name.toLowerCase())).size).toBe(CONDITIONS.length);
  });

  it('registers all 110 Stoelting entries + 24 acute emergencies + 19 subspecialty cards (153 total)', () => {
    expect(CONDITIONS).toHaveLength(153);
  });

  it('uses updated data version 2026.11.25-draft27 and registers anesthesia-considerations', () => {
    expect(DATA_VERSION).toBe('2026.11.25-draft27');
    expect(SOURCE_BY_ID['anesthesia-considerations']).toBeDefined();
  });

  it('each point to an existing Stoelting 8e chapter or declare a category', () => {
    for (const c of CONDITIONS) {
      if (c.chapter !== undefined) {
        expect(STOELTING_CHAPTERS[c.chapter], c.id).toBeTruthy();
      } else {
        expect(c.category?.trim().length, c.id).toBeGreaterThan(0);
      }
    }
  });

  it('each cite Stoelting 8e or Anesthesia Considerations, and every cited source is registered', () => {
    for (const c of CONDITIONS) {
      const hasStoelting = c.sourceIds.includes('stoelting-8e');
      const hasConsiderations = c.sourceIds.includes('anesthesia-considerations');
      expect(hasStoelting || hasConsiderations, c.id).toBe(true);
      for (const id of c.sourceIds) expect(SOURCE_BY_ID[id], `${c.id} -> ${id}`).toBeDefined();
    }
  });

  it('emergencyEntry creates Acute Intraoperative Emergencies records cleanly', () => {
    const sample = emergencyEntry(
      'sample-emg',
      'Sample emergency',
      ['sample alias'],
      {
        preop: ['Preop line > 10 chars'],
        intraop: ['Intraop line > 10 chars'],
        avoid: ['Avoid line > 10 chars'],
        postop: ['Postop line > 10 chars'],
      },
      { crisis: 'last', checklistId: 'crisis-anaphylaxis' },
    );
    expect(sample.category).toBe('Acute Intraoperative Emergencies');
    expect(sample.chapter).toBeUndefined();
    expect(sample.sourceIds).toEqual(['anesthesia-considerations']);
    expect(sample.crisis).toBe('last');
    expect(sample.checklistId).toBe('crisis-anaphylaxis');
  });

  it('subspecialtyEntry assigns custom subspecialty category cleanly', () => {
    const sample = subspecialtyEntry(
      'sample-sub',
      'Sample subspecialty',
      'Cardiac',
      ['sample card'],
      {
        preop: ['Preop line > 10 chars'],
        intraop: ['Intraop line > 10 chars'],
        avoid: ['Avoid line > 10 chars'],
        postop: ['Postop line > 10 chars'],
      },
    );
    expect(sample.category).toBe('Cardiac');
    expect(sample.chapter).toBeUndefined();
    expect(sample.sourceIds).toEqual(['anesthesia-considerations']);
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

const plan = (id: string) => {
  const p = CONDITIONS.find((c) => c.id === id)?.plan;
  if (!p) throw new Error(`no plan for ${id}`);
  return p;
};
const text = (lines: string[]) => lines.join(' ');

describe('condition plans', () => {
  it('covers the core 6 rare diseases and all planned conditions', () => {
    const core6 = ['acute-porphyria', 'carcinoid-syndrome', 'mh-susceptibility', 'myasthenia-gravis', 'myotonic-dystrophy', 'pheochromocytoma'];
    for (const id of core6) {
      expect(PLANNED_CONDITION_IDS).toContain(id);
    }
  });

  it('have every section filled and no empty line', () => {
    for (const id of PLANNED_CONDITION_IDS) {
      const p = plan(id);
      for (const section of [p.preop, p.intraop, p.avoid, p.postop]) {
        expect(section.length, id).toBeGreaterThan(0);
        for (const l of section) expect(l.trim().length, id).toBeGreaterThan(10);
      }
    }
  });

  it('keep the safety-critical statements', () => {
    expect(text(plan('mh-susceptibility').avoid)).toMatch(/volatile/);
    expect(text(plan('mh-susceptibility').avoid)).toMatch(/Succinylcholine/);
    expect(text(plan('acute-porphyria').avoid)).toMatch(/etomidate/);
    expect(text(plan('acute-porphyria').avoid)).toMatch(/ketamine/);
    expect(text(plan('acute-porphyria').avoid)).toMatch(/Barbiturates/);
    expect(text(plan('myotonic-dystrophy').avoid)).toMatch(/Succinylcholine/);
    expect(text(plan('pheochromocytoma').avoid)).toMatch(/beta blocker before alpha blockade/);
    expect(text(plan('carcinoid-syndrome').preop)).toMatch(/octreotide 24 to 48 hours before surgery/);
    expect(text(plan('myasthenia-gravis').intraop)).toMatch(/one-half to two-thirds/);
  });

  it('send MH to the SOS panel instead of retyping dantrolene doses', () => {
    expect(CONDITIONS.find((c) => c.id === 'mh-susceptibility')?.crisis).toBe('mh');
    for (const id of PLANNED_CONDITION_IDS) expect(JSON.stringify(plan(id)), id).not.toMatch(/mg\/kg/);
  });

  it('keeps emergency safety-critical statements and cross-links', () => {
    expect(text(plan('airway-fire').intraop)).toMatch(/halt fresh gas flow/i);
    expect(text(plan('airway-fire').intraop)).toMatch(/extubate|remove.*tube/i);
    expect(text(plan('tension-pneumothorax').avoid)).toMatch(/nitrous oxide/i);
    expect(text(plan('tension-pneumothorax').intraop)).toMatch(/needle/i);
    expect(text(plan('venous-air-embolism').avoid)).toMatch(/nitrous oxide/i);
    expect(text(plan('venous-air-embolism').postop)).toMatch(/Durant/i);
    expect(text(plan('total-spinal').avoid)).toMatch(/reverse Trendelenburg/i);
    expect(text(plan('transfusion-reaction').intraop)).toMatch(/halt.*transfusion|stop.*transfusion/i);
    expect(text(plan('transfusion-reaction').avoid)).toMatch(/discarding/i);
    expect(CONDITIONS.find((c) => c.id === 'last-toxicity')?.crisis).toBe('last');
    expect(CONDITIONS.find((c) => c.id === 'anaphylaxis')?.checklistId).toBe('crisis-anaphylaxis');
    expect(CONDITIONS.find((c) => c.id === 'bronchospasm')?.checklistId).toBe('crisis-bronchospasm');
    expect(CONDITIONS.find((c) => c.id === 'laryngospasm')?.checklistId).toBe('crisis-laryngospasm');
  });

  it('keeps cardiac, vascular, and pulmonary hypertension safety lines', () => {
    expect(text(plan('aortic-stenosis').avoid)).toMatch(/tachycardia/i);
    expect(text(plan('hocm').avoid)).toMatch(/inotropes|epinephrine/i);
    expect(text(plan('cardiac-tamponade').intraop)).toMatch(/spontaneous ventilation/i);
    expect(text(plan('aortic-dissection').intraop)).toMatch(/beta-blocker/i);
    expect(text(plan('pulmonary-hypertension').avoid)).toMatch(/hypoxia/i);
  });

  it('keeps airway, thoracic OLV, and critical care safety lines', () => {
    expect(text(plan('ludwig-angina').avoid)).toMatch(/spontaneous|NMBDs|neuromuscular/i);
    expect(text(plan('post-thyroidectomy-hematoma').intraop)).toMatch(/sutures|staples|decompress/i);
    expect(text(plan('copd-bullous-emphysema').avoid)).toMatch(/nitrous oxide|N2O/i);
    expect(text(plan('thoracic-olv').intraop)).toMatch(/CPAP|PEEP/i);
    expect(text(plan('brain-death-donor').intraop)).toMatch(/Rule of 100s|vasopressin/i);
  });
});
