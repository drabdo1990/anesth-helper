import { CARDIOVASCULAR_CONDITIONS } from './cardiovascular';
import { RESPIRATORY_CONDITIONS } from './respiratory';
import { NEUROLOGIC_CONDITIONS } from './neurologic';
import { ENDOCRINE_CONDITIONS } from './endocrine';
import { HEMATOLOGIC_CONDITIONS } from './hematologic';
import { MULTISYSTEM_CONDITIONS } from './multisystem';
import { EMERGENCY_CONDITIONS } from './emergencies';
import { SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS } from './subspecialtyCardioThoracic';
import { SUBSPECIALTY_NEURO_ENDO_CONDITIONS } from './subspecialtyNeuroEndo';
import { SUBSPECIALTY_POPULATIONS_CONDITIONS } from './subspecialtyPopulations';
import type { ConditionRecord } from './types';

export const CONDITIONS: ConditionRecord[] = [
  ...RESPIRATORY_CONDITIONS,
  ...CARDIOVASCULAR_CONDITIONS,
  ...NEUROLOGIC_CONDITIONS,
  ...ENDOCRINE_CONDITIONS,
  ...HEMATOLOGIC_CONDITIONS,
  ...MULTISYSTEM_CONDITIONS,
  ...EMERGENCY_CONDITIONS,
  ...SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS,
  ...SUBSPECIALTY_NEURO_ENDO_CONDITIONS,
  ...SUBSPECIALTY_POPULATIONS_CONDITIONS,
];

export { CARDIOVASCULAR_CONDITIONS } from './cardiovascular';
export { RESPIRATORY_CONDITIONS } from './respiratory';
export { NEUROLOGIC_CONDITIONS } from './neurologic';
export { ENDOCRINE_CONDITIONS } from './endocrine';
export { HEMATOLOGIC_CONDITIONS } from './hematologic';
export { MULTISYSTEM_CONDITIONS } from './multisystem';
export { EMERGENCY_CONDITIONS } from './emergencies';
export { SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS } from './subspecialtyCardioThoracic';
export { SUBSPECIALTY_NEURO_ENDO_CONDITIONS } from './subspecialtyNeuroEndo';
export { SUBSPECIALTY_POPULATIONS_CONDITIONS } from './subspecialtyPopulations';

export { PLANNED_CONDITION_IDS } from './plannedIds';
export * from './types';
