// ============================================================================
// ANESTHASSIST ROUTINE CHECKLISTS & PACU SBAR
// ============================================================================

import { RoutineChecklistItem } from '../types/anesthesia';

export const WHO_SAFETY_CHECKLIST: RoutineChecklistItem[] = [
  // Before Induction of Anesthesia (Sign In)
  {
    id: 'who-signin-1',
    section: 'Sign In (Before Induction)',
    text: 'Patient identity, surgical site, procedure, and consent verified',
  },
  {
    id: 'who-signin-2',
    section: 'Sign In (Before Induction)',
    text: 'Surgical site marked by surgeon (or not applicable)',
  },
  {
    id: 'who-signin-3',
    section: 'Sign In (Before Induction)',
    text: 'Anesthesia machine check completed & emergency suction verified working',
  },
  {
    id: 'who-signin-4',
    section: 'Sign In (Before Induction)',
    text: 'Pulse oximeter on patient and functioning with audible tone',
  },
  {
    id: 'who-signin-5',
    section: 'Sign In (Before Induction)',
    text: 'Known allergy status checked and communicated to all OR staff',
  },
  {
    id: 'who-signin-6',
    section: 'Sign In (Before Induction)',
    text: 'Difficult airway / aspiration risk evaluated & rescue equipment ready',
  },
  {
    id: 'who-signin-7',
    section: 'Sign In (Before Induction)',
    text: 'Risk of > 500 mL blood loss (7 mL/kg in children) assessed & adequate IV access verified',
  },

  // Before Skin Incision (Time Out)
  {
    id: 'who-timeout-1',
    section: 'Time Out (Before Incision)',
    text: 'All team members introduced by name and role',
  },
  {
    id: 'who-timeout-2',
    section: 'Time Out (Before Incision)',
    text: 'Surgeon, anesthesia professional, and nurse verbally confirm patient name, site, procedure',
  },
  {
    id: 'who-timeout-3',
    section: 'Time Out (Before Incision)',
    text: 'Prophylactic antibiotics administered within 60 minutes prior to incision (or N/A)',
  },
  {
    id: 'who-timeout-4',
    section: 'Time Out (Before Incision)',
    text: 'Surgeon reviews anticipated critical steps, operative duration, and blood loss',
  },
  {
    id: 'who-timeout-5',
    section: 'Time Out (Before Incision)',
    text: 'Anesthesia team reviews patient-specific hemodynamic and airway concerns',
  },
  {
    id: 'who-timeout-6',
    section: 'Time Out (Before Incision)',
    text: 'Nursing team confirms sterility, indicator results, and instrument availability',
  },
];

export const EXTUBATION_CRITERIA_CHECKLIST: RoutineChecklistItem[] = [
  {
    id: 'ext-neuro-1',
    section: 'Neuromuscular & Consciousness',
    text: 'Sustained head lift / leg lift for > 5 seconds, strong handshake, following commands',
  },
  {
    id: 'ext-neuro-2',
    section: 'Neuromuscular & Consciousness',
    text: 'Train-of-Four (TOF) ratio > 0.9 objectively verified or complete reversal administered',
  },
  {
    id: 'ext-vent-1',
    section: 'Ventilatory Mechanics',
    text: 'Spontaneous tidal volume > 5 mL/kg, respiratory rate 10-25 bpm, smooth regular rhythm',
  },
  {
    id: 'ext-vent-2',
    section: 'Ventilatory Mechanics',
    text: 'Negative Inspiratory Force (NIF) < -20 to -30 cmH2O; Vital Capacity > 10-15 mL/kg',
  },
  {
    id: 'ext-gas-1',
    section: 'Gas Exchange & Oxygenation',
    text: 'Adequate SpO2 (> 95% on FiO2 <= 0.40 or baseline room air equivalent)',
  },
  {
    id: 'ext-gas-2',
    section: 'Gas Exchange & Oxygenation',
    text: 'Normocapnia / end-tidal CO2 < 45-50 mmHg with stable spontaneous minute ventilation',
  },
  {
    id: 'ext-airway-1',
    section: 'Airway Protection & Secretions',
    text: 'Brisk intact gag and cough reflexes; oral cavity thoroughly suctioned',
  },
  {
    id: 'ext-airway-2',
    section: 'Airway Protection & Secretions',
    text: 'Positive qualitative endotracheal cuff-leak test if laryngeal edema risk exists',
  },
  {
    id: 'ext-hemo-1',
    section: 'Hemodynamic & Metabolic Stability',
    text: 'Hemodynamically stable without escalating vasopressor requirements; normothermic (core temp > 36.0°C)',
  },
];
