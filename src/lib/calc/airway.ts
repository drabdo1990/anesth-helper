// Airway sizing calculations. Pure functions over the sourced tables in src/data/airwayDevices.ts.
// Out-of-range or unsourced requests return { ok: false } so the UI can show NO_SOURCE_VALUE.

import {
  LMA_BANDS,
  PEDS_BLADES,
  PEDS_ETT_AGE_RANGE_YEARS,
  PEDS_ETT_DEPTH_FACTOR,
  PEDS_ETT_FORMULAS,
  type BladeBand,
  type LmaSizeBand,
} from '../../data/airwayDevices';

export type Unsourced = { ok: false; reason: string };

export interface PedsEttResult {
  ok: true;
  formulaId: string;
  /** Unrounded internal diameter (mm). */
  idMm: number;
  /** Nearest 0.5 mm, for display. */
  idRoundedMm: number;
  /** Oral depth: 3 x unrounded ID. */
  depthCm: number;
}

export const roundToHalf = (n: number): number => Math.round(n * 2) / 2;

export const pedsEtt = (ageYears: number, formulaId: string): PedsEttResult | Unsourced => {
  const formula = PEDS_ETT_FORMULAS.find((f) => f.id === formulaId);
  if (!formula) return { ok: false, reason: 'Unknown formula.' };
  if (!Number.isFinite(ageYears) || ageYears < PEDS_ETT_AGE_RANGE_YEARS.min || ageYears > PEDS_ETT_AGE_RANGE_YEARS.max) {
    return {
      ok: false,
      reason: `Source formula covers ages ${PEDS_ETT_AGE_RANGE_YEARS.min} to ${PEDS_ETT_AGE_RANGE_YEARS.max} years.`,
    };
  }
  const idMm = ageYears / 4 + formula.constant;
  return {
    ok: true,
    formulaId,
    idMm,
    idRoundedMm: roundToHalf(idMm),
    depthCm: PEDS_ETT_DEPTH_FACTOR * idMm,
  };
};

export interface LmaResult {
  ok: true;
  band: LmaSizeBand;
  /** Set when the weight sits exactly on a boundary shared with the next size up. */
  borderlineNext?: LmaSizeBand;
}

/** Bands run (fromKg, toKg]: a weight exactly on a boundary is flagged with the next size up. */
export const lmaSizeForWeight = (weightKg: number): LmaResult | Unsourced => {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return { ok: false, reason: 'Weight must be greater than 0 kg.' };
  const idx = LMA_BANDS.findIndex(
    (b) => (b.fromKg === null || weightKg > b.fromKg) && (b.toKg === null || weightKg <= b.toKg),
  );
  if (idx < 0) return { ok: false, reason: 'No band for this weight.' };
  const band = LMA_BANDS[idx];
  const next = LMA_BANDS[idx + 1];
  const onBoundary = band.toKg !== null && weightKg === band.toKg && next !== undefined;
  return onBoundary ? { ok: true, band, borderlineNext: next } : { ok: true, band };
};

export const pedsBladeForAge = (ageMonths: number): BladeBand | null => {
  if (!Number.isFinite(ageMonths) || ageMonths < 0) return null;
  return PEDS_BLADES.find((b) => ageMonths >= b.fromMonths && ageMonths < b.toMonths) ?? null;
};
