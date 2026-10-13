// Turns a sourced MedicationDose + a chosen value + patient biometrics into mass, volume/rate and
// maximum-dose status. Pure. All limit checks use unrounded numbers.

import type { AbsoluteMax, MedicationDose, WeightScalar } from '../../data/types';
import type { Biometrics } from './biometrics';
import {
  calculateDose,
  calculateInfusion,
  checkAbsoluteMax,
  checkRateMax,
  type DoseResult,
  type InfusionResult,
  type MaxDoseStatus,
} from './dosing';

export const scalarWeightKg = (b: Biometrics, scalar: WeightScalar): number => {
  switch (scalar) {
    case 'TBW':
      return b.tbw;
    case 'IBW':
      return b.ibw;
    case 'LBW':
      return b.lbw;
    case 'ABW40':
      return b.abw40;
  }
};

/**
 * Index of the saved concentration (matched by strength in mg/mL, never by position).
 * Falls back to the first listed concentration when the saved strength no longer exists.
 */
export const resolveConcentrationIndex = (
  concentrations: ReadonlyArray<{ mgPerMl: number }>,
  savedMgPerMl: number | undefined,
): number => {
  if (savedMgPerMl === undefined) return 0;
  const i = concentrations.findIndex((c) => c.mgPerMl === savedMgPerMl);
  return i >= 0 ? i : 0;
};

const PER_KG_UNITS = new Set(['mg/kg', 'mcg/kg', 'mcg/kg/min']);

export const isWeightBased = (dose: MedicationDose): boolean => PER_KG_UNITS.has(dose.unit);

/** Whether a dose applies at this actual body weight (cefazolin bands). */
export const doseAppliesToWeight = (dose: MedicationDose, tbwKg: number): boolean => {
  const band = dose.weightBandKg;
  if (!band) return true;
  if (band.min !== undefined && tbwKg < band.min) return false;
  if (band.max !== undefined && tbwKg > band.max) return false;
  return true;
};

export type RangeStatus = 'in-range' | 'below-source-range' | 'above-source-range';

export const rangeStatus = (dose: MedicationDose, value: number): RangeStatus => {
  if (dose.min !== undefined && value < dose.min) return 'below-source-range';
  if (dose.max !== undefined && value > dose.max) return 'above-source-range';
  return 'in-range';
};

export interface DoseComputation {
  kind: 'bolus' | 'infusion';
  value: number;
  unit: MedicationDose['unit'];
  scalar?: WeightScalar;
  scalarKg?: number;
  bolus?: DoseResult;
  infusion?: InfusionResult;
  range: RangeStatus;
  max: MaxDoseStatus;
  /** Percent of the absolute maximum reached (unrounded), if a maximum applies. */
  percentOfMax?: number;
  absoluteMax?: AbsoluteMax;
  companion?: { name: string; massMg: number; volumeMl: number };
}

export interface ComputeOptions {
  /** Overrides the dose's scalar (user switch on the card). */
  scalarOverride?: WeightScalar;
  /** Resolved absolute maximum (after local-protocol resolution); defaults to the dose's own. */
  absoluteMax?: AbsoluteMax;
  companion?: { name: string; ratioMgPerMg: number; concentrationMgPerMl: number };
}

export const computeMedicationDose = (
  dose: MedicationDose,
  value: number,
  concentrationMgPerMl: number,
  biometrics: Biometrics,
  options: ComputeOptions = {},
): DoseComputation => {
  const scalar = isWeightBased(dose) ? (options.scalarOverride ?? dose.scalar ?? 'TBW') : undefined;
  const scalarKg = scalar ? scalarWeightKg(biometrics, scalar) : undefined;
  const weight = scalarKg ?? biometrics.tbw;
  const absoluteMax = options.absoluteMax ?? dose.absoluteMax;
  const range = rangeStatus(dose, value);

  if (dose.unit === 'mcg/kg/min' || dose.unit === 'mcg/min') {
    const infusion = calculateInfusion(value, dose.unit, weight, concentrationMgPerMl);
    const max: MaxDoseStatus =
      absoluteMax?.unit === 'mcg/min' ? checkRateMax(infusion, absoluteMax.value) : 'ok';
    return {
      kind: 'infusion',
      value,
      unit: dose.unit,
      scalar,
      scalarKg,
      infusion,
      range,
      max,
      percentOfMax:
        absoluteMax?.unit === 'mcg/min' ? (infusion.mcgPerMin / absoluteMax.value) * 100 : undefined,
      absoluteMax,
    };
  }

  const bolus = calculateDose(value, dose.unit, weight, concentrationMgPerMl);
  let max: MaxDoseStatus = 'ok';
  let percentOfMax: number | undefined;
  if (absoluteMax && absoluteMax.unit !== 'mcg/min') {
    max = checkAbsoluteMax(bolus, { value: absoluteMax.value, unit: absoluteMax.unit });
    const actual =
      absoluteMax.unit === 'mL' ? bolus.volumeMl : absoluteMax.unit === 'mcg' ? bolus.massMg * 1000 : bolus.massMg;
    percentOfMax = (actual / absoluteMax.value) * 100;
  }

  const companion = options.companion
    ? (() => {
        const massMg = bolus.massMg * options.companion.ratioMgPerMg;
        return {
          name: options.companion.name,
          massMg,
          volumeMl: massMg / options.companion.concentrationMgPerMl,
        };
      })()
    : undefined;

  return { kind: 'bolus', value, unit: dose.unit, scalar, scalarKg, bolus, range, max, percentOfMax, absoluteMax, companion };
};
