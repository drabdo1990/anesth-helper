import { adultEttAndBlade, dltSizeForHeight, lmaSizeForWeight, pedsBladeForAge, pedsEtt } from './airway';

export interface AirwaySummaryInput {
  population: 'adult' | 'pediatric';
  ageYears: number | null; sex: 'male' | 'female' | null;
  heightCm: number | null; weightKg: number | null;
}
const none = { ok: false as const, reason: 'Enter patient value' };

export const airwaySummary = (i: AirwaySummaryInput) => {
  const ped = i.population === 'pediatric';
  return {
    ett: ped ? (i.ageYears == null ? none : pedsEtt(i.ageYears, 'cuffed-msd')) : adultEttAndBlade(i.sex),
    ettUncuffed: ped && i.ageYears != null ? pedsEtt(i.ageYears, 'uncuffed-msd') : none,
    blade: ped ? (i.ageYears == null ? null : pedsBladeForAge(i.ageYears * 12)) : adultEttAndBlade(i.sex),
    lma: i.weightKg == null ? none : lmaSizeForWeight(i.weightKg),
    dlt: ped ? none : dltSizeForHeight(i.heightCm, i.ageYears),
  };
};
