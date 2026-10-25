import { describe, expect, it } from 'vitest';
import { airwaySummary } from '../airwaySummary';

describe('airwaySummary', () => {
  it('adult with no sex gives no ETT value', () => {
    const r = airwaySummary({ population: 'adult', ageYears: 40, sex: null, heightCm: 170, weightKg: 70 });
    expect('idRangeMm' in r.ett).toBe(false);
  });
  it('pediatric age 5 gives an ETT size', () => {
    const r = airwaySummary({ population: 'pediatric', ageYears: 5, sex: null, heightCm: null, weightKg: 18 });
    expect('idRoundedMm' in r.ett).toBe(true);
  });
  it('missing weight gives no LMA', () => {
    const r = airwaySummary({ population: 'adult', ageYears: 40, sex: 'male', heightCm: 170, weightKg: null });
    expect('band' in r.lma).toBe(false);
  });
});
