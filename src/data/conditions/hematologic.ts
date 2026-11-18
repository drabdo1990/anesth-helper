import { entry, type ConditionRecord } from './types';

export const HEMATOLOGIC_CONDITIONS: ConditionRecord[] = [
  entry('thalassemia', 'Thalassemia', 23, ['thalassaemia']),
  entry('hereditary-spherocytosis', 'Hereditary spherocytosis', 23),
  entry('g6pd', 'G6PD deficiency', 23, ['glucose-6-phosphate dehydrogenase deficiency', 'favism']),
  entry('sickle-cell', 'Sickle cell disease', 23, ['sickle cell anemia', 'sickle cell anaemia', 'hbss']),
  entry('methemoglobinemia', 'Methemoglobinemia', 23, ['methaemoglobinaemia']),
  entry('polycythemia-vera', 'Polycythemia vera', 23, ['polycythaemia vera']),
  entry('hemophilia', 'Hemophilia A and B', 23, ['haemophilia', 'factor viii deficiency', 'factor ix deficiency']),
  entry('von-willebrand', 'von Willebrand disease', 23, ['vwd']),
  entry('antiphospholipid', 'Antiphospholipid syndrome', 23, ['aps', 'lupus anticoagulant']),
];
