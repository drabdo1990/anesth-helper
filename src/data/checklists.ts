// OR checklists. Structure only: no device-specific steps and no numeric thresholds, because no
// named checklist source was supplied. Replace or extend these with your institutional checklists
// (tag them 'local-protocol'). Items are anonymous: progress is stored without any patient data.

import type { ChecklistRecord } from './types';

const generic = ['app-generic'];

const BASE_CHECKLISTS: ChecklistRecord[] = [
  {
    id: 'pre-induction',
    title: 'Pre-induction',
    items: [
      { id: 'pre-patient', text: 'Patient identity confirmed', sourceIds: generic },
      { id: 'pre-procedure', text: 'Procedure confirmed', sourceIds: generic },
      { id: 'pre-side', text: 'Side / site confirmed (if applicable)', sourceIds: generic },
      { id: 'pre-consent', text: 'Consent confirmed', sourceIds: generic },
      { id: 'pre-fasting', text: 'Fasting status confirmed', sourceIds: generic },
      { id: 'pre-allergies', text: 'Allergies reviewed', sourceIds: generic },
      { id: 'pre-airway-assess', text: 'Airway assessment done', sourceIds: generic },
      { id: 'pre-iv', text: 'IV access adequate', sourceIds: generic },
      { id: 'pre-monitoring', text: 'Monitoring applied and working', sourceIds: generic },
      { id: 'pre-blood', text: 'Blood availability confirmed (if needed)', sourceIds: generic },
      { id: 'pre-equipment', text: 'Equipment check complete', sourceIds: generic },
      { id: 'pre-drugs', text: 'Drugs prepared and labeled', sourceIds: generic },
      { id: 'pre-suction', text: 'Suction available and working', sourceIds: generic },
      { id: 'pre-dif-airway', text: 'Difficult-airway equipment available', sourceIds: generic },
    ],
  },
  {
    id: 'machine-check',
    title: 'Anesthesia machine / breathing system',
    note: 'Use your institutional checklist. This is a generic structure only and contains no device-specific steps.',
    items: [
      { id: 'mach-local', text: 'Institutional pre-use checklist completed', sourceIds: generic },
      { id: 'mach-power-gas', text: 'Power and gas supply confirmed', sourceIds: generic },
      { id: 'mach-circuit', text: 'Breathing system assembled and leak-tested', sourceIds: generic },
      { id: 'mach-vent', text: 'Ventilator working', sourceIds: generic },
      { id: 'mach-scavenge', text: 'Scavenging connected', sourceIds: generic },
      { id: 'mach-alarms', text: 'Monitors and alarms working', sourceIds: generic },
      { id: 'mach-backup', text: 'Backup means of ventilation available', sourceIds: generic },
    ],
  },
  {
    id: 'intra-op',
    title: 'Intraoperative safety prompts',
    items: [
      { id: 'intra-position', text: 'Positioning and pressure points', sourceIds: generic },
      { id: 'intra-temp', text: 'Temperature', sourceIds: generic },
      { id: 'intra-fluids', text: 'Fluids', sourceIds: generic },
      { id: 'intra-blood', text: 'Blood loss', sourceIds: generic },
      { id: 'intra-nmb', text: 'Neuromuscular blockade monitoring', sourceIds: generic },
      { id: 'intra-abx', text: 'Antibiotic redosing due?', sourceIds: generic },
      { id: 'intra-vent', text: 'Ventilation checks', sourceIds: generic },
      { id: 'intra-infusions', text: 'Vasopressor and infusion checks', sourceIds: generic },
    ],
  },
  {
    id: 'emergence',
    title: 'Emergence and extubation',
    items: [
      { id: 'em-reversal', text: 'Reversal given or blockade resolved', sourceIds: generic },
      { id: 'em-ventilation', text: 'Adequate spontaneous ventilation', sourceIds: generic },
      { id: 'em-oxygenation', text: 'Adequate oxygenation', sourceIds: generic },
      { id: 'em-reflexes', text: 'Airway protective reflexes present', sourceIds: generic },
      { id: 'em-hemo', text: 'Hemodynamically stable', sourceIds: generic },
      { id: 'em-temp', text: 'Temperature acceptable', sourceIds: generic },
      { id: 'em-suction', text: 'Suction available', sourceIds: generic },
      { id: 'em-risk', text: 'Extubation risk factors identified', sourceIds: generic },
    ],
  },
];

// Notebook-sourced checklists (sections 5.2-5.4). Item text is quoted from the notebook; no step is added to it.
const ASA_MONITORING = ['asa-1986', 'miller-6e'];
const NORA = ['asa-1994-nora', 'miller-6e'];

const NOTEBOOK_CHECKLISTS: ChecklistRecord[] = [
  {
    id: 'two-bag-test',
    title: 'Pre-case "two-bag" test (AAGBI 2012)',
    note: 'Do this after the breathing system, vaporisers and ventilator have been checked individually (Fundamentals of Anesthesia 4e, Ch 46, p. 905). Follow your institutional checklist for your machine.',
    items: [
      { id: 'twobag-attach', text: 'Attach the patient end of the breathing system (including angle piece and filter) to a test lung or bag', sourceIds: ['aagbi-2012'] },
      { id: 'twobag-manual', text: 'Set fresh gas flow to 5 L/min and ventilate manually. Check the whole breathing system is patent and the unidirectional valves are moving. Check the APL valve by squeezing both bags', sourceIds: ['aagbi-2012'] },
      { id: 'twobag-vent-vaporisers', text: 'Turn on the ventilator to ventilate the test lung. Turn off the fresh gas flow, or reduce it to a minimum. Open and close each vaporiser in turn. There should be no loss of volume in the system', sourceIds: ['aagbi-2012'] },
    ],
  },
  {
    id: 'fda-ventilator-check',
    title: 'Pre-case ventilator check (FDA 1993 excerpts)',
    note: 'Excerpts from the FDA 1993 apparatus checkout (step 12 ventilator test, step 13 monitors). The vaporizer interlock, fit, fill and leak item was transcribed earlier and was not located in the notebook text retrieved: confirm it against the full checkout. Follow your institutional checklist for your machine.',
    items: [
      { id: 'fda-second-bag', text: 'Attach a second breathing bag to the Y-piece', sourceIds: ['fda-1993'] },
      { id: 'fda-bellows', text: 'Ventilator ON: bellows deliver the appropriate tidal volume on inspiration and fill completely on expiration', sourceIds: ['fda-1993'] },
      { id: 'fda-valves', text: 'Verify unidirectional valves, vaporizer interlocks, and vaporizer fit, fill and leaks', sourceIds: ['fda-1993'] },
      { id: 'fda-analyzers', text: 'Check and calibrate the capnometer and O2 analyzer', sourceIds: ['fda-1993'] },
    ],
  },
  {
    id: 'asa-monitoring',
    title: 'ASA basic monitoring standards',
    note: 'Transcribed from the project notebook (Miller 6e p. 2027).',
    items: [
      { id: 'asa-presence', text: 'Qualified anesthesia personnel continuously present', sourceIds: ASA_MONITORING },
      { id: 'asa-oxygenation', text: 'Oxygenation: inspired O2 low-limit alarm and SpO2', sourceIds: ASA_MONITORING },
      { id: 'asa-ventilation', text: 'Ventilation: ETCO2 and disconnect alarm', sourceIds: ASA_MONITORING },
      { id: 'asa-circulation', text: 'Circulation: ECG and NIBP at intervals of 5 minutes at most', sourceIds: ASA_MONITORING },
      { id: 'asa-temperature', text: 'Temperature evaluated', sourceIds: ASA_MONITORING },
    ],
  },
  {
    id: 'nora-mri',
    title: 'Non-operating-room anesthesia (NORA / MRI)',
    note: 'Transcribed from the project notebook (Miller 6e p. 2025).',
    items: [
      { id: 'nora-o2', text: 'Dedicated reliable O2 source plus a full backup cylinder', sourceIds: NORA },
      { id: 'nora-suction', text: 'Reliable suction and scavenging', sourceIds: NORA },
      { id: 'nora-monitors', text: 'Full ASA monitors and a self-inflating hand resuscitator bag (AMBU)', sourceIds: NORA },
      { id: 'nora-mr', text: 'MR Safe / MR Conditional / MR Unsafe status verified for all equipment', sourceIds: NORA },
    ],
  },
];

export const CHECKLISTS: ChecklistRecord[] = [...BASE_CHECKLISTS, ...NOTEBOOK_CHECKLISTS];

/** Selectable options for the handoff generator. These are categories, not clinical values. */
export const HANDOFF_OPTIONS = {
  asaStatus: ['I', 'II', 'III', 'IV', 'V', 'VI', 'I-E', 'II-E', 'III-E', 'IV-E', 'V-E'],
  airway: ['Face mask', 'Supraglottic airway', 'Oral ETT', 'Nasal ETT', 'Double-lumen tube', 'Tracheostomy', 'Own airway'],
  maintenance: ['Volatile', 'TIVA', 'Regional / neuraxial', 'MAC / sedation', 'Combined'],
  procedureCategories: ['General surgery', 'Orthopedic', 'Obstetric', 'Cardiac', 'Thoracic', 'Neuro', 'ENT', 'Urology', 'Vascular', 'Pediatric', 'Other'],
} as const;
