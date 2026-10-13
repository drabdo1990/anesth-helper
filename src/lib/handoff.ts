// Anonymous handoff summary. Only user-selected categories and short numeric parameters are
// included. Free text is limited and scrubbed so identifiers cannot be copied into the summary.

export const MAX_FREE_TEXT_LENGTH = 60;

export interface HandoffInput {
  procedureCategory: string;
  procedureOther: string;
  asaStatus: string;
  airway: string;
  inductionAgents: string[];
  maintenance: string;
  opioids: string[];
  neuromuscularBlockade: string[];
  fluidsMl: string;
  bloodLossMl: string;
  ventMode: string;
  ventTidalVolumeMl: string;
  ventRespiratoryRate: string;
  ventPeepCmH2O: string;
  ventFio2Percent: string;
  emergenceAnalgesiaPlan: string;
}

export const EMPTY_HANDOFF: HandoffInput = {
  procedureCategory: '',
  procedureOther: '',
  asaStatus: '',
  airway: '',
  inductionAgents: [],
  maintenance: '',
  opioids: [],
  neuromuscularBlockade: [],
  fluidsMl: '',
  bloodLossMl: '',
  ventMode: '',
  ventTidalVolumeMl: '',
  ventRespiratoryRate: '',
  ventPeepCmH2O: '',
  ventFio2Percent: '',
  emergenceAnalgesiaPlan: '',
};

export type ScrubResult = { ok: true; text: string } | { ok: false; reason: string };

const LONG_DIGITS = /\d{6,}/;
const DATE_LIKE = /\b\d{1,4}[/.-]\d{1,2}[/.-]\d{1,4}\b/;
const EMAIL_LIKE = /@/;
const ID_WORDS = /\b(mrn|dob|ssn|nid|passport|phone|tel|id\s*[:#]|name\s*[:#]|dr\.?|doctor|surgeon|mr\.?|mrs\.?|ms\.?)\b/i;

/** Reject free text that looks like it carries an identifier. Deliberately conservative. */
export const scrubFreeText = (raw: string): ScrubResult => {
  const text = raw.trim().replace(/\s+/g, ' ');
  if (text.length > MAX_FREE_TEXT_LENGTH) {
    return { ok: false, reason: `Keep notes to ${MAX_FREE_TEXT_LENGTH} characters.` };
  }
  if (LONG_DIGITS.test(text)) return { ok: false, reason: 'Long numbers look like an ID (MRN, phone). Remove them.' };
  if (DATE_LIKE.test(text)) return { ok: false, reason: 'Dates are not allowed (possible date of birth).' };
  if (EMAIL_LIKE.test(text)) return { ok: false, reason: 'Email-like text is not allowed.' };
  if (ID_WORDS.test(text)) return { ok: false, reason: 'Names, titles and ID labels are not allowed.' };
  return { ok: true, text };
};

const isNumeric = (s: string): boolean => s.trim() !== '' && Number.isFinite(Number(s));

const line = (label: string, value: string): string | null => (value.trim() ? `${label}: ${value.trim()}` : null);

const list = (label: string, values: string[]): string | null =>
  values.length > 0 ? `${label}: ${values.join(', ')}` : null;

/**
 * Build the summary. Fields that fail validation (non-numeric numbers, unsafe free text) are
 * omitted rather than copied. Returns the text plus the names of any omitted fields.
 */
export const buildHandoffSummary = (input: HandoffInput): { text: string; omitted: string[] } => {
  const omitted: string[] = [];

  const num = (label: string, value: string, unit: string): string | null => {
    if (value.trim() === '') return null;
    if (!isNumeric(value)) {
      omitted.push(label);
      return null;
    }
    return `${label}: ${Number(value)} ${unit}`;
  };

  const free = (label: string, value: string): string | null => {
    if (value.trim() === '') return null;
    const r = scrubFreeText(value);
    if (!r.ok) {
      omitted.push(label);
      return null;
    }
    return `${label}: ${r.text}`;
  };

  const procedure = [input.procedureCategory, free('Procedure detail', input.procedureOther)?.replace('Procedure detail: ', '')]
    .filter((s): s is string => Boolean(s))
    .join(' - ');

  const vent = [
    input.ventMode.trim() ? input.ventMode.trim() : null,
    num('VT', input.ventTidalVolumeMl, 'mL'),
    num('RR', input.ventRespiratoryRate, 'breaths/min'),
    num('PEEP', input.ventPeepCmH2O, 'cmH2O'),
    num('FiO2', input.ventFio2Percent, '%'),
  ]
    .filter((s): s is string => Boolean(s))
    .join('; ');

  const lines = [
    '--- ANESTHESIA HANDOFF (anonymous) ---',
    procedure ? `Procedure: ${procedure}` : null,
    line('ASA status', input.asaStatus),
    line('Airway', input.airway),
    list('Induction agents', input.inductionAgents),
    line('Maintenance', input.maintenance),
    list('Opioids', input.opioids),
    list('Neuromuscular blockade', input.neuromuscularBlockade),
    num('Fluids', input.fluidsMl, 'mL'),
    num('Blood loss', input.bloodLossMl, 'mL'),
    vent ? `Ventilation: ${vent}` : null,
    free('Emergence / analgesia plan', input.emergenceAnalgesiaPlan),
    'No patient identifiers included.',
  ].filter((s): s is string => Boolean(s));

  return { text: lines.join('\n'), omitted };
};
