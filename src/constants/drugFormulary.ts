// ============================================================================
// ANESTHASSIST CLINICAL DRUG FORMULARY
// ============================================================================

import { FormularyDrug, LocalAnestheticEntry } from '../types/anesthesia';

export const DRUG_FORMULARY: FormularyDrug[] = [
  // --------------------------------------------------------------------------
  // INDUCTION AGENTS
  // --------------------------------------------------------------------------
  {
    id: 'propofol',
    name: 'Propofol',
    genericName: 'Diprivan',
    category: 'Induction',
    subcategory: 'GABA-A Agonist Hypnotic',
    concentrationMgPerMl: 10, // 1% = 10 mg/mL
    concentrationDisplay: '10 mg/mL (1%)',
    clinicalPearl:
      'Dosed strictly on Lean Body Weight (LBW) in obesity to avoid profound hypotension and apnea. Titrate slower in elderly, hypovolemic, or hemodynamically compromised patients.',
    onset: '30 - 45 sec',
    duration: '5 - 10 min',
    dosing: [
      {
        id: 'propofol-adult',
        label: 'Healthy Adult (1.5 - 2.5 mg/kg LBW)',
        weightScalar: 'LBW',
        minDosePerKg: 1.5,
        maxDosePerKg: 2.5,
        unit: 'mg/kg',
        notes: 'Dosed on Lean Body Weight (LBW). Standard induction titration.',
      },
      {
        id: 'propofol-elderly',
        label: 'Elderly / Fragile (1.0 - 1.5 mg/kg LBW)',
        weightScalar: 'LBW',
        minDosePerKg: 1.0,
        maxDosePerKg: 1.5,
        unit: 'mg/kg',
        notes: 'Titrate slowly; prolonged arm-brain circulation time.',
      },
    ],
  },
  {
    id: 'etomidate',
    name: 'Etomidate',
    genericName: 'Amidate',
    category: 'Induction',
    subcategory: 'Carboxylated Imidazole',
    concentrationMgPerMl: 2, // 2 mg/mL
    concentrationDisplay: '2 mg/mL (0.2%)',
    clinicalPearl:
      'Cardiostable induction agent of choice in severe cardiac disease, severe aortic stenosis, or hypovolemic shock. Causes transient adrenal 11-beta-hydroxylase inhibition; high incidence of myoclonus.',
    onset: '15 - 30 sec',
    duration: '3 - 8 min',
    dosing: [
      {
        id: 'etomidate-standard',
        label: 'Cardiostable (0.2 - 0.3 mg/kg TBW)',
        weightScalar: 'TBW',
        minDosePerKg: 0.2,
        maxDosePerKg: 0.3,
        unit: 'mg/kg',
        notes: 'Dosed on Total Body Weight (TBW). Highly cardiostable hemodynamics.',
      },
    ],
  },
  {
    id: 'ketamine',
    name: 'Ketamine',
    genericName: 'Ketalar',
    category: 'Induction',
    subcategory: 'NMDA Antagonist / Dissociative',
    concentrationMgPerMl: 50, // 50 mg/mL
    concentrationDisplay: '50 mg/mL (5%)',
    clinicalPearl:
      'Potent bronchodilator and sympathomimetic. Ideal for hemodynamically unstable trauma, acute bronchospasm, or tamponade. Preserves airway reflexes at lower doses. Direct myocardial depressant if catecholamine depleted.',
    onset: '30 - 60 sec (IV)',
    duration: '10 - 20 min',
    dosing: [
      {
        id: 'ketamine-induction',
        label: 'IV Induction (1 - 2 mg/kg TBW)',
        weightScalar: 'TBW',
        minDosePerKg: 1.0,
        maxDosePerKg: 2.0,
        unit: 'mg/kg',
        notes: 'Dosed on Total Body Weight (TBW). Bronchodilator; preserves respiratory drive.',
      },
      {
        id: 'ketamine-adjunct',
        label: 'Low-Dose Analgesic Adjunct (0.25 - 0.5 mg/kg)',
        weightScalar: 'TBW',
        minDosePerKg: 0.25,
        maxDosePerKg: 0.5,
        unit: 'mg/kg',
        notes: 'Sub-anesthetic dose for multimodal pain control and opioid sparing.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // NEUROMUSCULAR BLOCKING AGENTS (NMBAs)
  // --------------------------------------------------------------------------
  {
    id: 'rocuronium',
    name: 'Rocuronium',
    genericName: 'Zemuron',
    category: 'NMBA',
    subcategory: 'Non-Depolarizing Aminosteroid',
    concentrationMgPerMl: 10, // 10 mg/mL
    concentrationDisplay: '10 mg/mL (1%)',
    clinicalPearl:
      'Dosed on Ideal Body Weight (IBW) to prevent prolonged paralysis in obese patients. RSI dose (1.2 mg/kg on IBW) achieves intubation conditions in ~60s comparable to succinylcholine, but extends recovery to 60-90 min.',
    onset: '60 - 90 sec',
    duration: '35 - 75 min',
    dosing: [
      {
        id: 'roc-standard',
        label: 'Standard Intubation (0.6 mg/kg IBW - 2x ED95)',
        weightScalar: 'IBW',
        minDosePerKg: 0.6,
        maxDosePerKg: 0.6,
        unit: 'mg/kg',
        notes: 'Dosed on Ideal Body Weight (IBW). Standard elective intubation (30-40 min block).',
      },
      {
        id: 'roc-rsi',
        label: 'RSI Intubation (1.2 mg/kg IBW - 4x ED95)',
        weightScalar: 'IBW',
        minDosePerKg: 1.2,
        maxDosePerKg: 1.2,
        unit: 'mg/kg',
        notes: 'Provides rapid intubating conditions in ~60s. High-dose Sugammadex (16 mg/kg) available for rescue.',
      },
    ],
  },
  {
    id: 'succinylcholine',
    name: 'Succinylcholine',
    genericName: 'Anectine / Quelicin',
    category: 'NMBA',
    subcategory: 'Depolarizing NMBA',
    concentrationMgPerMl: 20, // 20 mg/mL
    concentrationDisplay: '20 mg/mL (2%)',
    clinicalPearl:
      'Dosed on Total Body Weight (TBW) due to increased pseudocholinesterase activity and extracellular fluid volume in obesity. Absolute ceiling capped at 200 mg. Raises serum potassium by 0.5 mEq/L.',
    onset: '30 - 60 sec',
    duration: '4 - 10 min',
    dosing: [
      {
        id: 'sux-rsi',
        label: 'RSI / Laryngospasm (1.0 - 1.5 mg/kg TBW)',
        weightScalar: 'TBW',
        minDosePerKg: 1.0,
        maxDosePerKg: 1.5,
        unit: 'mg/kg',
        absoluteMaxDose: 200,
        notes: 'Dosed on Total Body Weight (TBW). Absolute ceiling capped at 200 mg.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // REVERSALS
  // --------------------------------------------------------------------------
  {
    id: 'sugammadex',
    name: 'Sugammadex',
    genericName: 'Bridion',
    category: 'Reversal',
    subcategory: 'Cyclodextrin Encapsulator',
    concentrationMgPerMl: 100, // 100 mg/mL
    concentrationDisplay: '100 mg/mL (10%)',
    clinicalPearl:
      'Dosed strictly on Actual Body Weight (TBW). Binds steroidal NMBAs (Rocuronium > Vecuronium). Reverses paralysis without cholinergic side effects. Advise hormonal contraceptive users to use backup barrier method for 7 days.',
    onset: '1.5 - 3 min',
    duration: 'Renal excretion (half-life ~2h)',
    dosing: [
      {
        id: 'sug-mod',
        label: 'Moderate Block (2 mg/kg TBW - >=2 TOF twitches)',
        weightScalar: 'TBW',
        minDosePerKg: 2.0,
        maxDosePerKg: 2.0,
        unit: 'mg/kg',
        notes: 'Must use TBW. Reappearance of 2nd twitch (T2) on train-of-four.',
      },
      {
        id: 'sug-deep',
        label: 'Deep Block (4 mg/kg TBW - PTC 1-2)',
        weightScalar: 'TBW',
        minDosePerKg: 4.0,
        maxDosePerKg: 4.0,
        unit: 'mg/kg',
        notes: '0 twitches on TOF with 1-2 responses on post-tetanic count (PTC).',
      },
      {
        id: 'sug-rescue',
        label: 'Immediate Rescue (16 mg/kg TBW - Post-Roc 1.2)',
        weightScalar: 'TBW',
        minDosePerKg: 16.0,
        maxDosePerKg: 16.0,
        unit: 'mg/kg',
        notes: 'Emergency reversal within 3 min of high-dose rocuronium (1.2 mg/kg) induction.',
      },
    ],
  },
  {
    id: 'neostigmine',
    name: 'Neostigmine + Glycopyrrolate',
    genericName: 'Prostigmin + Robinul',
    category: 'Reversal',
    subcategory: 'AChE Inhibitor + Antimuscarinic',
    concentrationMgPerMl: 1, // 1 mg/mL
    concentrationDisplay: 'Neostigmine 1 mg/mL | Glyco 0.2 mg/mL',
    companionDrugNote: 'Co-administer Glycopyrrolate 0.2 mg per 1 mg Neostigmine (capped at 1.0 mg).',
    clinicalPearl:
      'Administer ONLY after 4 twitches are visible on TOF with demonstrable fade. Neostigmine 0.05 mg/kg (capped at 5 mg). Co-administer Glycopyrrolate (0.01 mg/kg capped at 1.0 mg; ratio 0.2 mg glyco per 1 mg neo) to prevent severe bradycardia.',
    onset: '5 - 10 min',
    duration: '40 - 60 min',
    dosing: [
      {
        id: 'neo-reversal',
        label: 'Standard Reversal (0.05 mg/kg TBW, Max 5 mg)',
        weightScalar: 'TBW',
        minDosePerKg: 0.05,
        maxDosePerKg: 0.05,
        unit: 'mg/kg',
        absoluteMaxDose: 5.0,
        notes: 'Dosed on Total Body Weight (TBW). Neostigmine capped at 5 mg; Glycopyrrolate capped at 1 mg.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // VASOPRESSORS
  // --------------------------------------------------------------------------
  {
    id: 'phenylephrine',
    name: 'Phenylephrine Bolus',
    genericName: 'Neo-Synephrine',
    category: 'Vasopressor',
    subcategory: 'Pure Alpha-1 Agonist',
    concentrationMgPerMl: 0.1, // 100 mcg/mL = 0.1 mg/mL
    concentrationDisplay: '100 mcg/mL (Diluted Syringe)',
    clinicalPearl:
      'Pure alpha-1 vasoconstrictor. Increases SVR and MAP with reflex bradycardia. Standard diluted bolus concentration is 100 mcg/mL. Typical bolus: 0.5 - 1.0 mL (50 - 100 mcg).',
    onset: '10 - 20 sec',
    duration: '5 - 15 min',
    dosing: [
      {
        id: 'phenylephrine-bolus',
        label: 'Bolus Titration (50 - 100 mcg)',
        weightScalar: 'FIXED',
        minDosePerKg: 50,
        maxDosePerKg: 100,
        unit: 'mcg',
        notes: 'Standard dilute syringe (100 mcg/mL). Bolus volume: 0.5 – 1.0 mL.',
      },
    ],
  },
  {
    id: 'ephedrine',
    name: 'Ephedrine Bolus',
    genericName: 'Ephedrine Sulfate',
    category: 'Vasopressor',
    subcategory: 'Mixed Direct/Indirect Sympathomimetic',
    concentrationMgPerMl: 5, // 5 mg/mL
    concentrationDisplay: '5 mg/mL (Diluted Syringe)',
    clinicalPearl:
      'Mixed indirect/direct alpha and beta-1/beta-2 agonist. Increases HR, contractility, and SVR. Ideal for hypotension with relative bradycardia. Dilution: 50 mg in 10 mL saline = 5 mg/mL. Typical bolus: 1 - 2 mL (5 - 10 mg). Tachyphylaxis occurs with repeat dosing.',
    onset: '30 - 60 sec',
    duration: '10 - 20 min',
    dosing: [
      {
        id: 'ephedrine-bolus',
        label: 'Bolus Titration (5 - 10 mg)',
        weightScalar: 'FIXED',
        minDosePerKg: 5,
        maxDosePerKg: 10,
        unit: 'mg',
        notes: 'Standard dilute syringe (5 mg/mL). Bolus volume: 1.0 – 2.0 mL.',
      },
    ],
  },

  // --------------------------------------------------------------------------
  // EMERGENCY AGENTS
  // --------------------------------------------------------------------------
  {
    id: 'intralipid-20',
    name: '20% Lipid Emulsion (LAST Rescue)',
    genericName: 'Intralipid 20%',
    category: 'Emergency',
    subcategory: 'Local Anesthetic Systemic Toxicity Rescue',
    concentrationMgPerMl: 1, // 1:1 volume representation
    concentrationDisplay: '20% Emulsion (0.2 g/mL)',
    clinicalPearl:
      'First-line antidote for LAST. Initial Bolus: 1.5 mL/kg over 2-3 min (max 100 mL). May repeat bolus 1-2 times for persistent cardiovascular collapse. Continuous Infusion: 0.25 mL/kg/min (15 mL/kg/hr). Maximum total cumulative dose: 12 mL/kg over first 30 min.',
    onset: 'Immediate',
    duration: 'Continue for at least 10 min after stability',
    dosing: [
      {
        id: 'intralipid-bolus',
        label: 'Initial Bolus (1.5 mL/kg over 2-3 min, Max 100 mL)',
        weightScalar: 'TBW',
        minDosePerKg: 1.5,
        maxDosePerKg: 1.5,
        unit: 'mL/kg',
        absoluteMaxDose: 100,
        notes: 'Max initial bolus 100 mL. Repeat once or twice for persistent arrest.',
        isEmergencyAlert: true,
      },
      {
        id: 'intralipid-infusion',
        label: 'Continuous Infusion (0.25 mL/kg/min = 15 mL/kg/hr)',
        weightScalar: 'TBW',
        minDosePerKg: 0.25,
        maxDosePerKg: 0.25,
        unit: 'mL/kg',
        notes: 'Infusion rate in mL/min. Multiply by 60 for mL/hr pump setting.',
        isEmergencyAlert: true,
      },
    ],
  },
  {
    id: 'ryanodex',
    name: 'Ryanodex (Modern Nanocrystalline Dantrolene)',
    genericName: 'Dantrolene Sodium Suspension',
    category: 'Emergency',
    subcategory: 'Rapid Reconstitution MH Antagonist',
    concentrationMgPerMl: 50, // 250 mg / 5 mL vial = 50 mg/mL
    concentrationDisplay: '250 mg / 5 mL vial (50 mg/mL)',
    clinicalPearl:
      'Modern formulation. Initial dose: 2.5 mg/kg IV push. Dissolves in ONLY 5 mL sterile water in < 1 minute! One single vial provides sufficient initial bolus for patients up to 100 kg.',
    onset: '< 1 min',
    duration: 'Half-life 4-8 hours',
    dosing: [
      {
        id: 'ryanodex-bolus',
        label: 'Initial MH Bolus (2.5 mg/kg TBW)',
        weightScalar: 'TBW',
        minDosePerKg: 2.5,
        maxDosePerKg: 2.5,
        unit: 'mg/kg',
        notes: 'Each 250 mg vial reconstitutes in 5 mL sterile water. Push immediately.',
        isEmergencyAlert: true,
      },
    ],
  },
  {
    id: 'dantrolene',
    name: 'Dantrolene Sodium (Dantrium / Revonto)',
    genericName: 'Dantrolene Sodium',
    category: 'Emergency',
    subcategory: 'Malignant Hyperthermia Ryanodine Antagonist',
    concentrationMgPerMl: 0.333, // 20 mg vial in 60 mL sterile water (~0.333 mg/mL)
    concentrationDisplay: '20 mg / 60 mL vial (0.33 mg/mL)',
    clinicalPearl:
      'Initial dose: 2.5 mg/kg IV push. Each 20 mg vial contains 3 g mannitol and requires reconstitution with 60 mL sterile water without preservative (WARM sterile water dissolves faster). Need ~9-12 vials for typical adult.',
    onset: '2 - 3 min',
    duration: 'Half-life 4-8 hours',
    dosing: [
      {
        id: 'dantrolene-bolus',
        label: 'Initial MH Bolus (2.5 mg/kg TBW, 20 mg Vials)',
        weightScalar: 'TBW',
        minDosePerKg: 2.5,
        maxDosePerKg: 2.5,
        unit: 'mg/kg',
        notes: 'Requires 60 mL warm sterile water PER 20 mg vial. Assign multiple assistants to reconstitute.',
        isEmergencyAlert: true,
      },
    ],
  },
];

export const LOCAL_ANESTHETICS: LocalAnestheticEntry[] = [
  {
    id: 'lidocaine',
    name: 'Lidocaine (Xylocaine)',
    maxPlainMgPerKg: 4.5,
    maxEpiMgPerKg: 7.0,
    absoluteMaxPlainMg: 300,
    absoluteMaxEpiMg: 500,
    standardConcentrations: [
      { label: '0.5% (5 mg/mL)', percent: 0.5, mgPerMl: 5 },
      { label: '1.0% (10 mg/mL)', percent: 1.0, mgPerMl: 10 },
      { label: '1.5% (15 mg/mL)', percent: 1.5, mgPerMl: 15 },
      { label: '2.0% (20 mg/mL)', percent: 2.0, mgPerMl: 20 },
    ],
    clinicalNotes:
      'Intermediate-duration amino-amide. Epinephrine reduces systemic absorption, prolongs duration, and increases safe ceiling from 4.5 mg/kg (max 300 mg) to 7.0 mg/kg (max 500 mg).',
  },
  {
    id: 'bupivacaine',
    name: 'Bupivacaine (Marcaine)',
    maxPlainMgPerKg: 2.0,
    maxEpiMgPerKg: 2.5,
    absoluteMaxPlainMg: 175,
    absoluteMaxEpiMg: 225,
    standardConcentrations: [
      { label: '0.25% (2.5 mg/mL)', percent: 0.25, mgPerMl: 2.5 },
      { label: '0.5% (5 mg/mL)', percent: 0.5, mgPerMl: 5.0 },
      { label: '0.75% (7.5 mg/mL)', percent: 0.75, mgPerMl: 7.5 },
    ],
    clinicalNotes:
      'Long-acting amino-amide with high cardiotoxicity (avid binding to cardiac fast sodium channels; slow dissociation). Bupivacaine LAST is refractory to defibrillation; requires immediate 20% Lipid Emulsion.',
  },
  {
    id: 'ropivacaine',
    name: 'Ropivacaine (Naropin)',
    maxPlainMgPerKg: 3.0,
    maxEpiMgPerKg: 3.5,
    absoluteMaxPlainMg: 225,
    absoluteMaxEpiMg: 250,
    standardConcentrations: [
      { label: '0.2% (2 mg/mL)', percent: 0.2, mgPerMl: 2.0 },
      { label: '0.5% (5 mg/mL)', percent: 0.5, mgPerMl: 5.0 },
      { label: '0.75% (7.5 mg/mL)', percent: 0.75, mgPerMl: 7.5 },
      { label: '1.0% (10 mg/mL)', percent: 1.0, mgPerMl: 10.0 },
    ],
    clinicalNotes:
      'Pure S-(-)-enantiomer. Significantly reduced cardiotoxicity/CNS toxicity compared to racemic bupivacaine with greater sensory/motor differentiation.',
  },
  {
    id: 'mepivacaine',
    name: 'Mepivacaine (Carbocaine)',
    maxPlainMgPerKg: 4.5,
    maxEpiMgPerKg: 7.0,
    absoluteMaxPlainMg: 300,
    absoluteMaxEpiMg: 400,
    standardConcentrations: [
      { label: '1.0% (10 mg/mL)', percent: 1.0, mgPerMl: 10 },
      { label: '1.5% (15 mg/mL)', percent: 1.5, mgPerMl: 15 },
      { label: '2.0% (20 mg/mL)', percent: 2.0, mgPerMl: 20 },
    ],
    clinicalNotes:
      'Intermediate-acting amino-amide. Similar profile to lidocaine with mild vasoconstrictive properties at lower doses; longer duration of action.',
  },
  {
    id: 'chloroprocaine',
    name: 'Chloroprocaine (Nesacaine)',
    maxPlainMgPerKg: 11.0,
    maxEpiMgPerKg: 14.0,
    absoluteMaxPlainMg: 800,
    absoluteMaxEpiMg: 1000,
    standardConcentrations: [
      { label: '2.0% (20 mg/mL)', percent: 2.0, mgPerMl: 20 },
      { label: '3.0% (30 mg/mL)', percent: 3.0, mgPerMl: 30 },
    ],
    clinicalNotes:
      'Ultra-rapid onset amino-ester rapidly hydrolyzed by plasma pseudocholinesterase. Extremely short half-life (< 1 min); lowest systemic toxicity risk.',
  },
];
