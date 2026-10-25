import type { FlowStep } from './flow';
import type { VentilationScenario } from '../data/types';
import { PLATEAU_LIMIT_CMH2O } from './calc/ventilation';

export interface VentFlowInput {
  scenario?: VentilationScenario; ageYears: number | null;
  heightCm: number | null; sex: 'male' | 'female' | null;
  mlPerKgPbw: number | null; respiratoryRate: number | null;
  peepCmH2O: number | null; plateauCmH2O: number | null;
}

export const ventSteps = (i: VentFlowInput): FlowStep[] => {
  const r = i.scenario?.tidalVolumeMlPerKgPbw;
  const peds = i.scenario?.id === 'pediatric' || (i.ageYears != null && i.ageYears < 18);
  const limit = i.scenario?.plateauPressureLimit ?? PLATEAU_LIMIT_CMH2O;
  return [
    { id: 'scenario', label: 'Pick scenario', done: !!i.scenario },
    { id: 'pbw', label: 'Height + sex (predicted body weight)', done: i.heightCm != null && i.sex != null },
    { id: 'vt', label: 'Set tidal volume in range', done: !peds && !!r && i.mlPerKgPbw != null && i.mlPerKgPbw >= r.min && i.mlPerKgPbw <= r.max,
      hint: peds ? 'Pediatric: no adult target' : !r ? 'No sourced range: clinician judgement' : undefined },
    { id: 'rate-peep', label: 'Set rate and PEEP', done: i.respiratoryRate != null && i.peepCmH2O != null },
    { id: 'plateau', label: `Plateau <= ${limit} cmH2O`, done: i.plateauCmH2O != null && i.plateauCmH2O <= limit },
  ];
};
