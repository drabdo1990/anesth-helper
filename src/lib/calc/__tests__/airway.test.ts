import { describe, expect, it } from 'vitest';
import { lmaSizeForWeight, pedsBladeForAge, pedsEtt, roundToHalf } from '../airway';

describe('pediatric ETT', () => {
  it('cuffed = age/4 + 3.5, depth = 3 x ID', () => {
    const r = pedsEtt(4, 'cuffed-msd');
    if (!r.ok) throw new Error('expected ok');
    expect(r.idMm).toBe(4.5);
    expect(r.idRoundedMm).toBe(4.5);
    expect(r.depthCm).toBe(13.5);
  });

  it('alternate cuffed formula age/4 + 3 is 0.5 mm smaller', () => {
    const a = pedsEtt(8, 'cuffed-msd');
    const b = pedsEtt(8, 'cuffed-iowa');
    if (!a.ok || !b.ok) throw new Error('expected ok');
    expect(a.idMm - b.idMm).toBe(0.5);
  });

  it('uncuffed = age/4 + 4', () => {
    const r = pedsEtt(4, 'uncuffed-msd');
    if (!r.ok) throw new Error('expected ok');
    expect(r.idMm).toBe(5);
    expect(r.depthCm).toBe(15);
  });

  it('depth uses the unrounded ID', () => {
    const r = pedsEtt(5, 'cuffed-msd');
    if (!r.ok) throw new Error('expected ok');
    expect(r.idMm).toBe(4.75);
    expect(r.idRoundedMm).toBe(5);
    expect(r.depthCm).toBe(14.25);
  });

  it.each([0.5, 0.99, 8.01, 12, Number.NaN])('has no sourced value at age %s', (age) => {
    expect(pedsEtt(age, 'cuffed-msd').ok).toBe(false);
  });

  it('rejects an unknown formula', () => {
    expect(pedsEtt(4, 'nope').ok).toBe(false);
  });

  it('rounds to the nearest 0.5', () => {
    expect(roundToHalf(4.2)).toBe(4);
    expect(roundToHalf(4.3)).toBe(4.5);
    expect(roundToHalf(4.75)).toBe(5);
  });
});

describe('LMA size by weight', () => {
  it.each([
    [3, '1'],
    [7, '1.5'],
    [15, '2'],
    [25, '2.5'],
    [40, '3'],
    [60, '4'],
    [85, '5'],
    [120, '6'],
  ])('%s kg -> size %s', (kg, size) => {
    const r = lmaSizeForWeight(kg);
    if (!r.ok) throw new Error('expected ok');
    expect(r.band.size).toBe(size);
    expect(r.borderlineNext).toBeUndefined();
  });

  it('flags a weight exactly on a band boundary with the next size', () => {
    const r = lmaSizeForWeight(50);
    if (!r.ok) throw new Error('expected ok');
    expect(r.band.size).toBe('3');
    expect(r.borderlineNext?.size).toBe('4');
  });

  it('50.1 kg is size 4 with no boundary flag', () => {
    const r = lmaSizeForWeight(50.1);
    if (!r.ok) throw new Error('expected ok');
    expect(r.band.size).toBe('4');
    expect(r.borderlineNext).toBeUndefined();
  });

  it('returns cuff volume ceilings', () => {
    const r = lmaSizeForWeight(60);
    if (!r.ok) throw new Error('expected ok');
    expect(r.band.maxCuffVolumeMl).toBe(30);
  });

  it.each([0, -1, Number.NaN])('rejects weight %s', (kg) => {
    expect(lmaSizeForWeight(kg).ok).toBe(false);
  });
});

describe('pediatric blade by age', () => {
  it('returns sourced bands', () => {
    expect(pedsBladeForAge(0)?.blade).toBe('Miller 0');
    expect(pedsBladeForAge(8)?.blade).toBe('Miller 1');
    expect(pedsBladeForAge(30)?.blade).toBe('Miller 1.5');
    expect(pedsBladeForAge(60)?.blade).toBe('Miller 2 or Macintosh 2');
  });

  it('returns null where the source has no value', () => {
    expect(pedsBladeForAge(3)).toBeNull();
    expect(pedsBladeForAge(18)).toBeNull();
    expect(pedsBladeForAge(120)).toBeNull();
    expect(pedsBladeForAge(-1)).toBeNull();
  });
});
