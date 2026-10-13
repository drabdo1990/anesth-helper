import { describe, expect, it } from 'vitest';
import { buildHandoffSummary, EMPTY_HANDOFF, scrubFreeText, type HandoffInput } from '../handoff';

const filled: HandoffInput = {
  ...EMPTY_HANDOFF,
  procedureCategory: 'General surgery',
  asaStatus: 'II',
  airway: 'Oral ETT',
  inductionAgents: ['Propofol', 'Fentanyl'],
  maintenance: 'Volatile',
  opioids: ['Fentanyl'],
  neuromuscularBlockade: ['Rocuronium'],
  fluidsMl: '1000',
  bloodLossMl: '50',
  ventMode: 'Volume control (VC)',
  ventTidalVolumeMl: '450',
  ventRespiratoryRate: '12',
  ventPeepCmH2O: '5',
  ventFio2Percent: '40',
  emergenceAnalgesiaPlan: 'Reversal then multimodal analgesia',
};

describe('scrubFreeText', () => {
  it.each([
    'MRN 12345678',
    'call 0551234567',
    'born 12/03/1980',
    'john@example.com',
    'Dr Smith did it',
    'surgeon was late',
    'DOB unknown',
    'x'.repeat(61),
  ])('rejects %s', (text) => {
    expect(scrubFreeText(text).ok).toBe(false);
  });

  it('accepts a short clinical note', () => {
    expect(scrubFreeText('  multimodal   analgesia ')).toEqual({ ok: true, text: 'multimodal analgesia' });
    expect(scrubFreeText('a'.repeat(60))).toEqual({ ok: true, text: 'a'.repeat(60) });
  });
});

describe('buildHandoffSummary', () => {
  it('includes only entered fields', () => {
    const { text, omitted } = buildHandoffSummary(filled);
    expect(omitted).toEqual([]);
    expect(text).toContain('Procedure: General surgery');
    expect(text).toContain('ASA status: II');
    expect(text).toContain('Induction agents: Propofol, Fentanyl');
    expect(text).toContain('Fluids: 1000 mL');
    expect(text).toContain('Blood loss: 50 mL');
    expect(text).toContain('Ventilation: Volume control (VC); VT: 450 mL; RR: 12 breaths/min; PEEP: 5 cmH2O; FiO2: 40 %');
    expect(text).toContain('Emergence / analgesia plan: Reversal then multimodal analgesia');
  });

  it('never adds fixed clinical claims or biometrics', () => {
    const { text } = buildHandoffSummary(EMPTY_HANDOFF);
    expect(text).not.toMatch(/NKDA|TOF|kg|BMI|cm/i);
    expect(text).toBe('--- ANESTHESIA HANDOFF (anonymous) ---\nNo patient identifiers included.');
  });

  it('omits free text that fails the scrub and reports it', () => {
    const { text, omitted } = buildHandoffSummary({ ...filled, emergenceAnalgesiaPlan: 'MRN 99887766' });
    expect(text).not.toContain('99887766');
    expect(omitted).toEqual(['Emergence / analgesia plan']);
  });

  it('omits non-numeric numeric fields', () => {
    const { text, omitted } = buildHandoffSummary({ ...filled, fluidsMl: 'John' });
    expect(text).not.toContain('John');
    expect(omitted).toContain('Fluids');
  });

  it('scrubs the procedure detail too', () => {
    const { text, omitted } = buildHandoffSummary({ ...filled, procedureOther: 'Dr Ahmed' });
    expect(text).not.toContain('Ahmed');
    expect(omitted).toContain('Procedure detail');
  });
});
