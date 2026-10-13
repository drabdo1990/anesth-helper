// Ventilation reference. Only tidal-volume and plateau limits that trace to a named source are
// encoded. Respiratory rate, PEEP, FiO2 and I:E are NOT supplied as defaults; they are entered by
// the user, because no verified source value was available (see each scenario's `unsourced`).

import type { VentilationScenario } from './types';

export const VENTILATION_SCENARIOS: VentilationScenario[] = [
  {
    id: 'ards',
    name: 'ARDS / lung-protective',
    tidalVolumeMlPerKgPbw: { target: 6, min: 4, max: 8 },
    plateauPressureLimit: 30,
    cautions: [
      'Use predicted body weight (PBW), never actual body weight.',
      'If plateau pressure stays above 30 cmH2O at 6 mL/kg PBW, consider reducing toward 4 mL/kg PBW.',
    ],
    unsourced: ['Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: ['ats-ards-2017'],
  },
  {
    id: 'periop-adult',
    name: 'Normal adult (intraoperative)',
    tidalVolumeMlPerKgPbw: { target: 6, min: 6, max: 8, targetIsAssumed: true },
    plateauPressureLimit: 30,
    cautions: [
      'The source gives a 6-8 mL/kg PBW range and a plateau below 28-30 cmH2O; it does not name a single target, so the lower bound is used as the starting point.',
      'The source states the right PEEP level is unsettled: no PEEP default is supplied.',
    ],
    unsourced: ['Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: ['esaic-periop-vent'],
  },
  {
    id: 'laparoscopic',
    name: 'Laparoscopic surgery',
    unsourced: ['Tidal volume', 'Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: [],
  },
  {
    id: 'obesity',
    name: 'Obesity / bariatric',
    cautions: ['Tidal volume should still be calculated from PBW, not actual body weight.'],
    unsourced: ['Tidal volume range', 'Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: [],
  },
  {
    id: 'one-lung',
    name: 'One-lung ventilation',
    unsourced: ['Tidal volume', 'Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: [],
  },
  {
    id: 'pediatric',
    name: 'Pediatric',
    cautions: ['The Devine PBW formula is for adults. It is not valid for children.'],
    unsourced: ['Tidal volume', 'Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: [],
  },
  {
    id: 'obstetric',
    name: 'Obstetric',
    unsourced: ['Tidal volume', 'Respiratory rate', 'PEEP', 'FiO2', 'I:E ratio'],
    sourceIds: [],
  },
];

export interface ReferenceItem {
  title: string;
  points: string[];
  sourceIds: string[];
}

/** Non-numeric, generic reference prompts. Not from a named guideline: clinician review required. */
export const VENT_MODES: ReferenceItem[] = [
  { title: 'Volume control (VC)', points: ['Set tidal volume; pressure varies with compliance and resistance.'], sourceIds: ['app-generic'] },
  { title: 'Pressure control (PC)', points: ['Set inspiratory pressure; tidal volume varies. Watch delivered volume.'], sourceIds: ['app-generic'] },
  { title: 'Pressure support (PSV)', points: ['Patient-triggered, pressure-supported breaths; needs spontaneous effort and a backup plan.'], sourceIds: ['app-generic'] },
  { title: 'SIMV', points: ['Set mandatory breaths synchronized to patient effort, with spontaneous breaths between.'], sourceIds: ['app-generic'] },
];

export const VENT_ALARMS: ReferenceItem[] = [
  { title: 'High airway pressure', points: ['Treat as a real problem until excluded: check the patient, circuit and tube.'], sourceIds: ['app-generic'] },
  { title: 'Low airway pressure / disconnection', points: ['Check the circuit connections, the cuff and the machine.'], sourceIds: ['app-generic'] },
  { title: 'Low or high minute ventilation', points: ['Compare with your set tidal volume and rate; look for leak, obstruction or patient effort.'], sourceIds: ['app-generic'] },
  { title: 'Apnea', points: ['Confirm capnography waveform and chest movement; start manual ventilation if absent.'], sourceIds: ['app-generic'] },
];

export const VENT_TROUBLESHOOTING: ReferenceItem[] = [
  { title: 'High airway pressure', points: ['Disconnect and hand-ventilate to separate a patient problem from a machine problem.', 'Think: tube position or kink, secretions, bronchospasm, pneumothorax, abdominal or positioning cause, depth of block.'], sourceIds: ['app-generic'] },
  { title: 'Low tidal volume', points: ['Check for leak (cuff, circuit, mask), disconnection, or a mode change.'], sourceIds: ['app-generic'] },
  { title: 'Hypoxemia', points: ['Give 100% oxygen and confirm ventilation; check tube position and the circuit before other causes.'], sourceIds: ['app-generic'] },
  { title: 'Hypercapnia', points: ['Check minute ventilation, circuit and absorbent; consider increased CO2 production.'], sourceIds: ['app-generic'] },
  { title: 'Circuit leak', points: ['Leak-test the circuit and check the cuff; use a self-inflating bag as backup.'], sourceIds: ['app-generic'] },
  { title: 'Auto-PEEP', points: ['Look for an expiratory flow that does not return to zero; allow longer expiration and disconnect briefly if the patient is unstable.'], sourceIds: ['app-generic'] },
];
