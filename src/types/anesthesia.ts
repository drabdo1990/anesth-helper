// ============================================================================
// ANESTHASSIST CLINICAL TYPES & INTERFACES
// ============================================================================

export type Sex = 'male' | 'female';
export type WeightScalar = 'TBW' | 'IBW' | 'LBW' | 'ABW40' | 'FIXED';
export type DrugCategory = 'Induction' | 'NMBA' | 'Reversal' | 'Vasopressor' | 'Emergency';

export interface PatientMetrics {
  tbwKg: number;
  heightCm: number;
  sex: Sex;
}

export interface DerivedWeights {
  tbw: number;
  ibw: number;
  abw40: number;
  lbw: number;
  bmi: number;
}

export interface DoseTier {
  id: string;
  label: string;
  weightScalar: WeightScalar;
  minDosePerKg: number;
  maxDosePerKg: number;
  unit: 'mg/kg' | 'mcg/kg' | 'mg' | 'mcg' | 'mL/kg';
  absoluteMaxDose?: number;
  notes?: string;
  isEmergencyAlert?: boolean;
}

export interface FormularyDrug {
  id: string;
  name: string;
  genericName?: string;
  category: DrugCategory;
  subcategory?: string;
  concentrationMgPerMl: number; // e.g. 10 for 1% Propofol, 0.1 for 100 mcg/mL Phenylephrine
  concentrationDisplay: string;
  dosing: DoseTier[];
  clinicalPearl: string;
  onset?: string;
  duration?: string;
  companionDrugNote?: string;
}

export interface ComputedDose {
  drugId: string;
  drugName: string;
  tierId: string;
  tierLabel: string;
  appliedScalar: WeightScalar;
  scalarWeightUsedKg: number;
  massRangeDisplay: string;
  volumeRangeDisplayMl: string;
  minMass: number;
  maxMass: number;
  minVolumeMl: number;
  maxVolumeMl: number;
  isCapped: boolean;
  absoluteMaxDose?: number;
  notes?: string;
  companionDrug?: {
    name: string;
    doseDisplay: string;
    volumeDisplay: string;
  };
}

export interface LocalAnestheticEntry {
  id: 'lidocaine' | 'bupivacaine' | 'ropivacaine' | 'mepivacaine' | 'chloroprocaine';
  name: string;
  maxPlainMgPerKg: number;
  maxEpiMgPerKg: number;
  absoluteMaxPlainMg: number;
  absoluteMaxEpiMg: number;
  standardConcentrations: { label: string; percent: number; mgPerMl: number }[];
  clinicalNotes: string;
}

export interface LocalAdministeredInput {
  id: string;
  drugId: LocalAnestheticEntry['id'];
  concentrationPercent: number; // e.g. 0.5 for 0.5%
  volumeGivenMl: number;        // in mL
  withEpi: boolean;
}

export interface MultiDrugToxicityReport {
  blocks: {
    id: string;
    name: string;
    doseMg: number;
    fraction: number; // doseMg / maxSafeDoseMg
    maxAllowedMg: number;
    isOverCeiling: boolean;
  }[];
  totalFraction: number;
  percentageUsed: number;
  status: 'safe' | 'caution' | 'toxic';
}

export interface CrisisChecklistItem {
  id: string;
  text: string;
  critical?: boolean;
  notes?: string;
}

export interface CrisisProtocol {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  color: 'red' | 'amber' | 'cyan' | 'purple';
  emergencyCallBanner?: string;
  checklist: CrisisChecklistItem[];
  calculatorType?: 'lipid' | 'mh' | 'cico';
}

export interface RoutineChecklistItem {
  id: string;
  section: string;
  text: string;
  subtext?: string;
}
