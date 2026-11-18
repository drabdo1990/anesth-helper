import { entry, type ConditionRecord } from './types';

export const CARDIOVASCULAR_CONDITIONS: ConditionRecord[] = [
  entry('tetralogy-of-fallot', 'Tetralogy of Fallot', 7, ['tof', 'tet spells']),
  entry('eisenmenger-syndrome', 'Eisenmenger syndrome', 7),
  entry('transposition-great-arteries', 'Transposition of the great arteries', 7, ['tga']),
  entry('hypoplastic-left-heart', 'Hypoplastic left heart syndrome', 7, ['hlhs']),
  entry('long-qt', 'Long QT syndrome', 8, ['lqts', 'torsades de pointes']),
  entry('brugada', 'Brugada syndrome', 8),
  entry('wpw', 'Wolff-Parkinson-White syndrome', 8, ['wpw', 'pre-excitation']),
  entry('takotsubo', 'Stress (takotsubo) cardiomyopathy', 10, ['takotsubo', 'broken heart syndrome']),
  entry('peripartum-cardiomyopathy', 'Peripartum cardiomyopathy', 10, ['ppcm']),
  entry('polyarteritis-nodosa', 'Polyarteritis nodosa', 12, ['pan']),
];
