// ============================================================================
// ANESTHASSIST EMERGENCY CRISIS PROTOCOLS
// Interactive Triage, Calculations & Clinical Emergency Steps
// ============================================================================

import { CrisisProtocol } from '../types/anesthesia';

export const CRISIS_PROTOCOLS: CrisisProtocol[] = [
  {
    id: 'last',
    title: 'Local Anesthetic Systemic Toxicity (LAST)',
    shortTitle: 'LAST Rescue',
    subtitle: 'ASRA 20% Lipid Emulsion Protocol & Advanced Resuscitation',
    color: 'cyan',
    emergencyCallBanner: 'Alert Resuscitation Team & Request Lipid Rescue Cart',
    calculatorType: 'lipid',
    checklist: [
      {
        id: 'last-1',
        text: 'Stop Local Anesthetic injection immediately & Call for Help / Lipid Rescue Cart',
        critical: true,
      },
      {
        id: 'last-2',
        text: 'Airway & Oxygenation: 100% O2 via bag-mask or ETT. Avoid hypoventilation / hypercapnia (acidosis exacerbates local toxicity).',
        critical: true,
      },
      {
        id: 'last-3',
        text: 'Seizure Management: Benzodiazepines first-line (Midazolam 1-2 mg IV). Avoid Propofol in cardiovascular instability.',
        critical: false,
      },
      {
        id: 'last-4',
        text: 'ACLS Modification: REDUCE Epinephrine boluses to < 1 mcg/kg (e.g., 10-50 mcg). AVOID Vasopressin.',
        critical: true,
        notes: 'Animal data demonstrates impaired lipid rescue efficacy with high-dose epinephrine or vasopressin.',
      },
      {
        id: 'last-5',
        text: 'AVOID antiarrhythmics: Lidocaine, Procainamide, Calcium Channel Blockers, Beta Blockers.',
        critical: true,
      },
      {
        id: 'last-6',
        text: 'Administer 20% Lipid Emulsion initial bolus: 1.5 mL/kg over 2-3 min (capped at 100 mL).',
        critical: true,
      },
      {
        id: 'last-7',
        text: 'Start continuous 20% Lipid Emulsion infusion: 0.25 mL/kg/min (15 mL/kg/hr).',
        critical: true,
      },
      {
        id: 'last-8',
        text: 'If hemodynamic instability persists: Repeat bolus 1-2 times & double infusion rate to 0.5 mL/kg/min.',
        critical: false,
      },
      {
        id: 'last-9',
        text: 'Maximum cumulative dose: 12 mL/kg over the first 30 minutes.',
        critical: false,
      },
      {
        id: 'last-10',
        text: 'Alert nearest Perfusion / ECMO / Cardiopulmonary Bypass service early if refractory.',
        critical: true,
      },
    ],
  },
  {
    id: 'mh',
    title: 'Malignant Hyperthermia (MH) Crisis',
    shortTitle: 'MH Crisis',
    subtitle: 'MHAUS Hypermetabolic Ryanodine Receptor Protocol',
    color: 'red',
    emergencyCallBanner: 'MHAUS Hotline: 1-800-644-9737 (Toll-Free 24/7 Hotline)',
    calculatorType: 'mh',
    checklist: [
      {
        id: 'mh-1',
        text: 'STOP all volatile anesthetics (Sevo, Des, Iso) & Succinylcholine immediately.',
        critical: true,
      },
      {
        id: 'mh-2',
        text: 'Hyperventilate with 100% O2 at highest fresh gas flow (>= 10 L/min). Place activated charcoal filters if available.',
        critical: true,
      },
      {
        id: 'mh-3',
        text: 'Declare MH EMERGENCY & Call for Help: Mobilize entire OR team & retrieve MH Cart.',
        critical: true,
      },
      {
        id: 'mh-4',
        text: 'Alert surgical team: Conclude or abort surgical procedure immediately.',
        critical: true,
      },
      {
        id: 'mh-5',
        text: 'Administer Dantrolene / Ryanodex initial bolus: 2.5 mg/kg IV push rapidly.',
        critical: true,
        notes: 'Ryanodex: 1 vial = 250 mg in 5 mL. Dantrium/Revonto: 20 mg per vial in 60 mL warm sterile water.',
      },
      {
        id: 'mh-6',
        text: 'Repeat Dantrolene 1 mg/kg every 5-10 min until hyperthermia, ETCO2, and rigidity abate (up to 10 mg/kg cumulative).',
        critical: false,
      },
      {
        id: 'mh-7',
        text: 'Active Cooling: Cold IV normal saline, gastric/bladder lavage, ice packs to groin, axillae, and neck. STOP cooling when temp < 38.5°C.',
        critical: false,
      },
      {
        id: 'mh-8',
        text: 'Treat Hyperkalemia: Calcium Chloride (10 mg/kg), Regular Insulin 10 units + D50 50 mL, Sodium Bicarb 1-2 mEq/kg.',
        critical: true,
        notes: 'DO NOT administer calcium channel blockers (causes hyperkalemic cardiovascular collapse with dantrolene).',
      },
      {
        id: 'mh-9',
        text: 'Treat Metabolic Acidosis: Sodium Bicarbonate 1-2 mEq/kg guided by ABG.',
        critical: false,
      },
      {
        id: 'mh-10',
        text: 'Maintain Urine Output: Place Foley catheter; target diuresis > 1-2 mL/kg/hr to prevent myoglobinuric renal failure.',
        critical: false,
      },
      {
        id: 'mh-11',
        text: 'Call MHAUS Hotline: 1-800-644-9737 (outside US: 1-209-417-3722) for real-time guidance.',
        critical: true,
      },
    ],
  },
  {
    id: 'cico',
    title: 'Difficult Airway / CICO Pathway',
    shortTitle: 'DAS / CICO',
    subtitle: "Can't Intubate, Can't Oxygenate (Plan A -> B -> C -> D eFONA)",
    color: 'amber',
    emergencyCallBanner: "CAN'T INTUBATE, CAN'T OXYGENATE - PREPARE FRONT OF NECK ACCESS",
    calculatorType: 'cico',
    checklist: [
      {
        id: 'cico-plan-a',
        text: 'PLAN A: Facemask & Tracheal Intubation',
        critical: true,
        notes: 'Optimize head/neck positioning, 100% O2, video laryngoscopy + bougie, max 3 intubation attempts (+1 by senior).',
      },
      {
        id: 'cico-plan-a-fail',
        text: 'Failed Intubation Declared -> Proceed to Plan B',
        critical: false,
      },
      {
        id: 'cico-plan-b',
        text: 'PLAN B: Supraglottic Airway Device (SAD / LMA) Rescue',
        critical: true,
        notes: 'Insert 2nd-generation SAD (e.g., i-gel, ProSeal). Max 2 attempts. Confirm oxygenation and ventilation via capnography.',
      },
      {
        id: 'cico-plan-b-fail',
        text: 'Failed SAD Ventilation -> Proceed to Plan C',
        critical: false,
      },
      {
        id: 'cico-plan-c',
        text: 'PLAN C: Facemask Oxygenation & Wake Up Attempt',
        critical: true,
        notes: '2-person two-handed facemask with oral/nasal airway. Reverse neuromuscular blockade (Sugammadex 16 mg/kg).',
      },
      {
        id: 'cico-plan-c-fail',
        text: "DECLARE CICO: CAN'T INTUBATE, CAN'T OXYGENATE! CALL FOR IMMEDIATE SURGICAL AIRWAY ASSISTANCE.",
        critical: true,
      },
      {
        id: 'cico-plan-d',
        text: 'PLAN D: Emergency Front of Neck Access (eFONA) - "Scalpel, Bougie, Tube"',
        critical: true,
        notes: 'Position neck in full extension. Laryngeal handshake to locate cricothyroid membrane.',
      },
      {
        id: 'cico-plan-d-step1',
        text: 'Step 1: Transverse stab incision through skin & cricothyroid membrane with #10 or #20 scalpel blade.',
        critical: true,
      },
      {
        id: 'cico-plan-d-step2',
        text: 'Step 2: Rotate scalpel 90 degrees towards feet. Slide coudé tip of bougie along blade into trachea.',
        critical: true,
      },
      {
        id: 'cico-plan-d-step3',
        text: 'Step 3: Remove scalpel. Railroad cuffed 6.0 mm tracheal tube over bougie into trachea.',
        critical: true,
      },
      {
        id: 'cico-plan-d-step4',
        text: 'Step 4: Inflate cuff, confirm ventilation with continuous waveform capnography, secure tube.',
        critical: true,
      },
    ],
  },
];
