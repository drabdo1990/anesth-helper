import { entry, type ConditionRecord } from './types';

export const RESPIRATORY_CONDITIONS: ConditionRecord[] = [
  entry('cystic-fibrosis', 'Cystic fibrosis', 2, ['cf']),
  entry('primary-ciliary-dyskinesia', 'Primary ciliary dyskinesia', 2, ['kartagener syndrome', 'pcd']),
  entry('sarcoidosis', 'Sarcoidosis', 3),
  entry('lymphangioleiomyomatosis', 'Lymphangioleiomyomatosis', 3, ['lam']),
];
