// Airway device sizing reference. Only rules traceable to a named source are included.
// Anything else (adult ETT size, adult blades, face masks, double-lumen tubes, bougie sizing)
// is listed in AIRWAY_UNSOURCED and shown as "No high-quality source value specified".

import type { AirwayDeviceRule } from './types';

/** Pediatric ETT validity window in years (the source calculator covers ages 1 to 8). */
export const PEDS_ETT_AGE_RANGE_YEARS = { min: 1, max: 8 } as const;

export interface PedsEttFormula {
  id: string;
  label: string;
  /** ID (mm) = ageYears / 4 + constant */
  constant: number;
  cuffed: boolean;
  sourceId: string;
}

export const PEDS_ETT_FORMULAS: PedsEttFormula[] = [
  { id: 'cuffed-msd', label: 'Cuffed: age/4 + 3.5', constant: 3.5, cuffed: true, sourceId: 'msd-peds-ett' },
  { id: 'cuffed-iowa', label: 'Cuffed (alternate): age/4 + 3', constant: 3, cuffed: true, sourceId: 'iowa-peds-ett' },
  { id: 'uncuffed-msd', label: 'Uncuffed: age/4 + 4', constant: 4, cuffed: false, sourceId: 'msd-peds-ett' },
];

/** Oral ETT depth (cm) = 3 x internal diameter (mm), per the MSD calculator source. */
export const PEDS_ETT_DEPTH_FACTOR = 3;

export interface LmaSizeBand {
  size: string;
  /** Patient weight band in kg: from (exclusive) to (inclusive); null = open ended. */
  fromKg: number | null;
  toKg: number | null;
  maxCuffVolumeMl: number;
}

/** LMA Classic sizes by weight (Teleflex); cuff volumes from the e-safe table (ceiling, not target). */
export const LMA_BANDS: LmaSizeBand[] = [
  { size: '1', fromKg: null, toKg: 5, maxCuffVolumeMl: 4 },
  { size: '1.5', fromKg: 5, toKg: 10, maxCuffVolumeMl: 7 },
  { size: '2', fromKg: 10, toKg: 20, maxCuffVolumeMl: 10 },
  { size: '2.5', fromKg: 20, toKg: 30, maxCuffVolumeMl: 14 },
  { size: '3', fromKg: 30, toKg: 50, maxCuffVolumeMl: 20 },
  { size: '4', fromKg: 50, toKg: 70, maxCuffVolumeMl: 30 },
  { size: '5', fromKg: 70, toKg: 100, maxCuffVolumeMl: 40 },
  { size: '6', fromKg: 100, toKg: null, maxCuffVolumeMl: 50 },
];

export const LMA_MAX_CUFF_PRESSURE_CMH2O = 60;

export interface BladeBand {
  label: string;
  /** Age band in months: from (inclusive) to (exclusive). */
  fromMonths: number;
  toMonths: number;
  blade: string;
}

/** Pediatric laryngoscope blade by age (WikEM). Ages not listed here have no sourced value. */
export const PEDS_BLADES: BladeBand[] = [
  { label: 'Neonate', fromMonths: 0, toMonths: 1, blade: 'Miller 0' },
  { label: 'About 6 months to 1 year', fromMonths: 6, toMonths: 12, blade: 'Miller 1' },
  { label: '2 to 3 years', fromMonths: 24, toMonths: 48, blade: 'Miller 1.5' },
  { label: '4 to 6 years', fromMonths: 48, toMonths: 84, blade: 'Miller 2 or Macintosh 2' },
];

export const AIRWAY_RULES: AirwayDeviceRule[] = [
  {
    id: 'peds-ett-cuffed',
    device: 'Endotracheal tube, cuffed',
    population: 'pediatric',
    basis: 'age',
    sizeRange: 'Age 1 to 8 years',
    depth: 'Oral depth = 3 x internal diameter (cm)',
    cautions: [
      'Two published cuffed formulas differ by 0.5 mm; check the alternate value and have the next size up and down ready.',
      'Confirm tube position with capnography and auscultation; check cuff pressure.',
    ],
    sourceIds: ['msd-peds-ett', 'iowa-peds-ett', 'asa-airway-2022'],
  },
  {
    id: 'peds-ett-uncuffed',
    device: 'Endotracheal tube, uncuffed',
    population: 'pediatric',
    basis: 'age',
    sizeRange: 'Age 1 to 8 years',
    depth: 'Oral depth = 3 x internal diameter (cm)',
    sourceIds: ['msd-peds-ett'],
  },
  {
    id: 'lma-classic',
    device: 'Laryngeal mask airway (LMA Classic)',
    population: 'adult',
    basis: 'weight',
    sizeRange: 'Size 1 to 6 by weight band',
    cautions: [
      'Weight-based sizing is approximate.',
      'Maximum cuff volume is a ceiling, not a target. Maximum cuff pressure 60 cmH2O.',
    ],
    sourceIds: ['teleflex-lma', 'esafe-lma-cuff'],
  },
  {
    id: 'peds-blade',
    device: 'Laryngoscope blade',
    population: 'pediatric',
    basis: 'age',
    cautions: ['Verify against a current pediatric resuscitation reference.'],
    sourceIds: ['wikem-peds-airway'],
  },
  {
    id: 'opa',
    device: 'Oropharyngeal airway',
    population: 'adult',
    basis: 'clinical',
    recommendedSize: 'Landmark: centre of the incisors to the angle of the mandible, measured with the airway on the face',
    sourceIds: ['rch-airway'],
  },
  {
    id: 'npa',
    device: 'Nasopharyngeal airway',
    population: 'adult',
    basis: 'clinical',
    recommendedSize: 'Landmark: tip of the nose to the tragus',
    sourceIds: ['wikem-peds-airway'],
  },
  {
    id: 'adult-ett',
    device: 'Endotracheal tube (adult)',
    population: 'adult',
    basis: 'sex',
    sizeRange: 'Female 7.0–7.5 mm ID, Male 8.0–8.5 mm ID',
    depth: 'Female 20–22 cm, Male 22–24 cm to teeth',
    sourceIds: ['oxford-miller-airway'],
  },
  {
    id: 'dlt',
    device: 'Double-lumen endobronchial tube (DLT)',
    population: 'adult',
    basis: 'height',
    sizeRange: '<165 cm: 35–37 Fr, 165–178 cm: 37–39 Fr, >178 cm: 39–41 Fr',
    sourceIds: ['oxford-miller-airway'],
  },
];

export interface AdultAirwayRule {
  sex: 'male' | 'female';
  idRangeMm: string;
  frenchRange: string;
  oralDepthRangeCm: string;
  blade: string;
  sourceIds: string[];
}

export const ADULT_AIRWAY_RULES: Record<'male' | 'female', AdultAirwayRule> = {
  female: {
    sex: 'female',
    idRangeMm: '7.0–7.5',
    frenchRange: '28–30',
    oralDepthRangeCm: '20–22',
    blade: 'Macintosh 3',
    sourceIds: ['oxford-miller-airway'],
  },
  male: {
    sex: 'male',
    idRangeMm: '8.0–8.5',
    frenchRange: '32–34',
    oralDepthRangeCm: '22–24',
    blade: 'Macintosh 3–4',
    sourceIds: ['oxford-miller-airway'],
  },
};

export interface DltBand {
  minHeightCm: number | null;
  maxHeightCm: number | null;
  sizeFr: string;
  category: string;
  sourceIds: string[];
}

export const DLT_BANDS: DltBand[] = [
  {
    minHeightCm: null,
    maxHeightCm: 165,
    sizeFr: '35–37 Fr',
    category: 'Short (< 165 cm / < 5\'5")',
    sourceIds: ['oxford-miller-airway'],
  },
  {
    minHeightCm: 165,
    maxHeightCm: 178,
    sizeFr: '37–39 Fr',
    category: 'Medium (165–178 cm / 5\'5"–5\'10")',
    sourceIds: ['oxford-miller-airway'],
  },
  {
    minHeightCm: 178,
    maxHeightCm: null,
    sizeFr: '39–41 Fr',
    category: 'Tall (> 178 cm / > 5\'10")',
    sourceIds: ['oxford-miller-airway'],
  },
];

export interface AirwayEquipmentItem {
  title: string;
  points: string[];
  sourceIds: string[];
}

/** Adjunct equipment reference from the project notebook (section 3.4, Miller 6e p. 1019, 1209). */
export const AIRWAY_EQUIPMENT_REFERENCE: AirwayEquipmentItem[] = [
  {
    title: 'Facemasks',
    points: [
      'Adult anatomic masks: Small (#3), Medium (#4), Large (#5).',
      'Pediatric: Newborn, Infant and Child sizes, and the flat Rendell-Baker-Soucek mask (minimal dead space).',
    ],
    sourceIds: ['miller-6e'],
  },
  {
    title: 'Guedel oropharyngeal airway sizes',
    points: ['Sizes 000 to 0 (50 mm), 1 (60 mm), 2 (70 mm), 3 (80 mm), 4 (90 mm), 5 (100 mm).'],
    sourceIds: ['miller-6e'],
  },
  {
    title: 'Disaster / portable emergency airway kit (RADAR)',
    points: [
      'LMA size 2 and size 4.',
      'Laryngoscope handle with MAC 3 and Miller 2 blades.',
      'Cuffed ETT 4.0 mm and 7.0 mm.',
      'OPA 60, 70, 80 and 90 mm.',
      'Resuscitator bags: adult and pediatric facemask, and a pediatric AMBU bag (up to 600 mL tidal volume).',
    ],
    sourceIds: ['miller-6e'],
  },
];

/** Airway topics with no sourced size/depth in this build. */
export const AIRWAY_UNSOURCED: string[] = [
  'Adult nasal ETT depth (exact cm)',
  'Video laryngoscope blade geometry selection',
  'Face-mask sizing by face contour',
  'Bougie and stylet internal caliber selection',
  'Pediatric ETT outside standard 1 to 8 years formulas',
];

/** Principles shown on the Airway tab, from the ASA difficult airway guideline. */
export const AIRWAY_PRINCIPLES: { text: string; sourceIds: string[] }[] = [
  { text: 'Preoxygenate and keep supplemental oxygen going throughout airway management.', sourceIds: ['asa-airway-2022'] },
  { text: 'Confirm tracheal intubation with capnography.', sourceIds: ['asa-airway-2022'] },
  { text: 'Limit repeated attempts at any one technique; track time and oxygen saturation.', sourceIds: ['asa-airway-2022'] },
  { text: 'Escalate early when ventilation or oxygenation fails; do not delay invasive airway access when CICO is declared.', sourceIds: ['asa-airway-2022'] },
];
