// OR checklists. Structure only: no device-specific steps and no numeric thresholds, because no
// named checklist source was supplied. Replace or extend these with your institutional checklists
// (tag them 'local-protocol'). Items are anonymous: progress is stored without any patient data.

import type { ChecklistRecord } from './types';

const generic = ['app-generic'];

export const CHECKLISTS: ChecklistRecord[] = [
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

/** Selectable options for the handoff generator. These are categories, not clinical values. */
export const HANDOFF_OPTIONS = {
  asaStatus: ['I', 'II', 'III', 'IV', 'V', 'VI', 'I-E', 'II-E', 'III-E', 'IV-E', 'V-E'],
  airway: ['Face mask', 'Supraglottic airway', 'Oral ETT', 'Nasal ETT', 'Double-lumen tube', 'Tracheostomy', 'Own airway'],
  maintenance: ['Volatile', 'TIVA', 'Regional / neuraxial', 'MAC / sedation', 'Combined'],
  procedureCategories: ['General surgery', 'Orthopedic', 'Obstetric', 'Cardiac', 'Thoracic', 'Neuro', 'ENT', 'Urology', 'Vascular', 'Pediatric', 'Other'],
} as const;
