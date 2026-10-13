import { useMemo } from 'react';
import { computeBiometrics, type BiometricResult } from '../lib/calc/biometrics';
import { useAppStore } from './useAppStore';

/** Derived biometrics for the current patient. Blank until both weight and height are entered. */
export const useBiometricResult = (): BiometricResult => {
  const tbwKg = useAppStore((s) => s.patient.tbwKg);
  const heightCm = useAppStore((s) => s.patient.heightCm);
  const sex = useAppStore((s) => s.patient.sex);
  return useMemo(() => {
    if (tbwKg === null || heightCm === null) {
      return { ok: false, error: 'Enter actual weight and height.' } as const;
    }
    return computeBiometrics({ tbwKg, heightCm, sex });
  }, [tbwKg, heightCm, sex]);
};
