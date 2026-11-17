// Diseases tab (spec step 7): a searchable list of uncommon conditions, rare diseases first.
// Every record points to its chapter in Stoelting's Anesthesia and Co-Existing Disease, 8th edition (2022).
// Only records with a `plan` carry clinical statements; every other record is a pointer to the chapter.

export interface ConditionPlan {
  preop: string[];
  intraop: string[];
  avoid: string[];
  postop: string[];
}

export interface ConditionRecord {
  id: string;
  name: string;
  /** Lower-case other names and abbreviations the search also matches. */
  aliases: string[];
  /** Chapter number in Stoelting 8e; the title is in STOELTING_CHAPTERS. */
  chapter: number;
  plan?: ConditionPlan;
  /** The SOS panel this plan links to. */
  crisis?: 'mh';
  sourceIds: string[];
}

export const STOELTING_CHAPTERS: Record<number, string> = {
  2: 'Anesthetic Considerations for Obstructive Lung Disease',
  3: 'Restrictive Respiratory Diseases and Lung Transplantation',
  7: 'Congenital Heart Disease',
  8: 'Abnormalities of Cardiac Conduction and Cardiac Rhythm',
  10: 'Heart Failure and Cardiomyopathies',
  12: 'Vascular Disease',
  13: 'Diseases Affecting the Brain',
  14: 'Disorders of the Spine and Spinal Cord',
  15: 'Diseases of the Autonomic and Peripheral Nervous Systems',
  16: 'Diseases of the Liver and Biliary Tract',
  17: 'Diseases of the Gastrointestinal System',
  18: 'Inborn Errors of Metabolism',
  21: 'Renal Disease',
  22: 'Endocrine Disease',
  23: 'Hematologic Disorders',
  24: 'Skin and Collagen Disorders',
  26: 'Diseases Related to Immune System Dysfunction',
  27: 'Cancer',
  29: 'Psychiatric Disease, Substance Use Disorders, and Drug Overdose',
  31: 'Pediatric Diseases',
};

/** The user's own NotebookLM notebook. Opens only for accounts it is shared with; the app sends nothing to it. */
export const PROJECT_NOTEBOOK_URL = 'https://notebooklm.google.com/notebook/1ce36864-79d5-4dbc-b3fa-51b63c6a401f';

/** Conditions with a written plan. Task 2 of the conditions plan fills these in. */
export const PLANNED_CONDITION_IDS: string[] = [];

const entry = (id: string, name: string, chapter: number, aliases: string[] = []): ConditionRecord => ({
  id,
  name,
  aliases,
  chapter,
  sourceIds: ['stoelting-8e'],
});

export const CONDITIONS: ConditionRecord[] = [
  // Respiratory
  entry('cystic-fibrosis', 'Cystic fibrosis', 2, ['cf']),
  entry('primary-ciliary-dyskinesia', 'Primary ciliary dyskinesia', 2, ['kartagener syndrome', 'pcd']),
  entry('sarcoidosis', 'Sarcoidosis', 3),
  entry('lymphangioleiomyomatosis', 'Lymphangioleiomyomatosis', 3, ['lam']),
  // Heart
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
  // Brain, spine and nerves
  entry('moyamoya', 'Moyamoya disease', 13),
  entry('chiari', 'Chiari malformation', 13, ['arnold-chiari malformation']),
  entry('tuberous-sclerosis', 'Tuberous sclerosis', 13),
  entry('neurofibromatosis', 'Neurofibromatosis', 13, ['von recklinghausen disease', 'nf1']),
  entry('huntington', 'Huntington disease', 13, ['huntington chorea']),
  entry('multiple-sclerosis', 'Multiple sclerosis', 13, ['ms']),
  entry('kearns-sayre', 'Kearns-Sayre syndrome', 13, ['kearns-sayer syndrome']),
  entry('autonomic-hyperreflexia', 'Autonomic hyperreflexia (chronic spinal cord injury)', 14, ['autonomic dysreflexia']),
  entry('als', 'Amyotrophic lateral sclerosis', 14, ['als', 'motor neuron disease', 'lou gehrig disease']),
  entry('friedreich-ataxia', 'Friedreich ataxia', 14),
  entry('multiple-system-atrophy', 'Multiple system atrophy', 15, ['msa', 'shy-drager syndrome']),
  entry('pots', 'Postural orthostatic tachycardia syndrome', 15, ['pots']),
  entry('paraganglioma', 'Paraganglioma', 15),
  entry('familial-dysautonomia', 'Familial dysautonomia', 15, ['riley-day syndrome']),
  entry('charcot-marie-tooth', 'Charcot-Marie-Tooth disease', 15, ['cmt', 'hereditary motor and sensory neuropathy']),
  entry('guillain-barre', 'Guillain-Barré syndrome', 15, ['gbs', 'acute inflammatory demyelinating polyneuropathy', 'aidp']),
  // Liver, gut and metabolism
  entry('gilbert', 'Gilbert syndrome', 16),
  entry('crigler-najjar', 'Crigler-Najjar syndrome', 16),
  entry('achalasia', 'Achalasia', 17),
  entry('zollinger-ellison', 'Zollinger-Ellison syndrome', 17, ['gastrinoma']),
  entry('carcinoid-syndrome', 'Carcinoid syndrome', 17, ['carcinoid tumor', 'carcinoid crisis', 'neuroendocrine tumor']),
  entry('acute-porphyria', 'Acute porphyrias', 18, ['porphyria', 'acute intermittent porphyria', 'aip', 'variegate porphyria', 'hereditary coproporphyria']),
  entry('lesch-nyhan', 'Lesch-Nyhan syndrome', 18),
  entry('hemochromatosis', 'Hemochromatosis', 18, ['haemochromatosis']),
  entry('wilson-disease', 'Wilson disease', 18, ['hepatolenticular degeneration']),
  // Kidney
  entry('goodpasture', 'Goodpasture syndrome', 21, ['anti-gbm disease']),
  entry('polycystic-kidney', 'Polycystic kidney disease', 21, ['adpkd']),
  entry('bartter-gitelman', 'Bartter and Gitelman syndromes', 21, ['bartter syndrome', 'gitelman syndrome']),
  entry('fanconi-syndrome', 'Fanconi syndrome', 21),
  // Endocrine
  entry('pheochromocytoma', 'Pheochromocytoma', 22, ['phaeochromocytoma', 'pheo', 'catecholamine-secreting tumor']),
  entry('insulinoma', 'Insulinoma', 22),
  entry('cushing', 'Cushing syndrome (hypercortisolism)', 22, ['hypercortisolism', 'cushing disease']),
  entry('conn', 'Primary hyperaldosteronism (Conn syndrome)', 22, ['conn syndrome', 'hyperaldosteronism']),
  entry('acromegaly', 'Acromegaly', 22),
  // Blood
  entry('thalassemia', 'Thalassemia', 23, ['thalassaemia']),
  entry('hereditary-spherocytosis', 'Hereditary spherocytosis', 23),
  entry('g6pd', 'G6PD deficiency', 23, ['glucose-6-phosphate dehydrogenase deficiency', 'favism']),
  entry('sickle-cell', 'Sickle cell disease', 23, ['sickle cell anemia', 'sickle cell anaemia', 'hbss']),
  entry('methemoglobinemia', 'Methemoglobinemia', 23, ['methaemoglobinaemia']),
  entry('polycythemia-vera', 'Polycythemia vera', 23, ['polycythaemia vera']),
  entry('hemophilia', 'Hemophilia A and B', 23, ['haemophilia', 'factor viii deficiency', 'factor ix deficiency']),
  entry('von-willebrand', 'von Willebrand disease', 23, ['vwd']),
  entry('antiphospholipid', 'Antiphospholipid syndrome', 23, ['aps', 'lupus anticoagulant']),
  // Skin and connective tissue
  entry('epidermolysis-bullosa', 'Epidermolysis bullosa', 24, ['eb']),
  entry('pemphigus', 'Pemphigus', 24),
  entry('mastocytosis', 'Mastocytosis', 24, ['urticaria pigmentosa']),
  entry('scleroderma', 'Scleroderma', 24, ['systemic sclerosis']),
  entry('pseudoxanthoma-elasticum', 'Pseudoxanthoma elasticum', 24),
  entry('ehlers-danlos', 'Ehlers-Danlos syndrome', 24, ['eds']),
  entry('marfan', 'Marfan syndrome', 24),
  // Muscle and neuromuscular junction
  entry('duchenne', 'Duchenne muscular dystrophy', 24, ['dmd', 'pseudohypertrophic muscular dystrophy']),
  entry('becker', 'Becker muscular dystrophy', 24),
  entry('limb-girdle', 'Limb-girdle muscular dystrophy', 24),
  entry('fshd', 'Facioscapulohumeral muscular dystrophy', 24, ['fshd']),
  entry('oculopharyngeal', 'Oculopharyngeal dystrophy', 24),
  entry('emery-dreifuss', 'Emery-Dreifuss muscular dystrophy', 24),
  entry('myotonic-dystrophy', 'Myotonic dystrophy', 24, ['myotonia dystrophica', 'dystrophia myotonica', 'steinert disease', 'dm1']),
  entry('nemaline', 'Nemaline rod myopathy', 24),
  entry('myotonia-congenita', 'Myotonia congenita', 24),
  entry('paramyotonia-congenita', 'Paramyotonia congenita', 24),
  entry('periodic-paralysis', 'Periodic paralysis (hyperkalemic and hypokalemic)', 24, ['hyperkalemic periodic paralysis', 'hypokalemic periodic paralysis']),
  entry('central-core', 'Central core disease', 24, ['ccd']),
  entry('centronuclear', 'Centronuclear myopathy', 24, ['myotubular myopathy']),
  entry('mitochondrial-myopathy', 'Mitochondrial myopathies', 24, ['mitochondrial disease']),
  entry('myasthenia-gravis', 'Myasthenia gravis', 24, ['mg']),
  entry('lambert-eaton', 'Lambert-Eaton myasthenic syndrome', 24, ['eaton-lambert syndrome', 'myasthenic syndrome', 'lems']),
  entry('mh-susceptibility', 'Malignant hyperthermia susceptibility', 24, ['mh', 'mhs', 'malignant hyperthermia']),
  // Bone and joints
  entry('kyphoscoliosis', 'Kyphoscoliosis', 24, ['scoliosis']),
  entry('ankylosing-spondylitis', 'Ankylosing spondylitis', 24, ['bamboo spine']),
  entry('paget', 'Paget disease of bone', 24),
  entry('achondroplasia', 'Achondroplasia', 24, ['dwarfism']),
  entry('russell-silver', 'Russell-Silver syndrome', 24, ['silver-russell syndrome']),
  entry('tracheomegaly', 'Tracheomegaly', 24, ['mounier-kuhn syndrome']),
  entry('prader-willi', 'Prader-Willi syndrome', 24),
  entry('prune-belly', 'Prune-belly syndrome', 24, ['eagle-barrett syndrome']),
  entry('meige', 'Meige syndrome', 24),
  entry('spasmodic-dysphonia', 'Spasmodic dysphonia', 24),
  entry('chondrodysplasia-calcificans', 'Chondrodysplasia calcificans', 24),
  entry('erythromelalgia', 'Erythromelalgia', 24),
  entry('klippel-feil', 'Klippel-Feil syndrome', 24),
  entry('osteogenesis-imperfecta', 'Osteogenesis imperfecta', 24, ['brittle bone disease', 'oi']),
  entry('fop', 'Fibrodysplasia ossificans progressiva', 24, ['fop']),
  // Immune, cancer and psychiatric
  entry('hereditary-angioedema', 'Hereditary angioedema', 26, ['hae', 'c1 esterase inhibitor deficiency']),
  entry('svc-syndrome', 'Superior vena cava / superior mediastinal syndrome', 27, ['anterior mediastinal mass', 'svc obstruction']),
  entry('nms', 'Neuroleptic malignant syndrome', 29, ['nms']),
  // Pediatric
  entry('cdh', 'Congenital diaphragmatic hernia', 31, ['cdh']),
  entry('ea-tef', 'Esophageal atresia and tracheoesophageal fistula', 31, ['tef', 'oesophageal atresia']),
  entry('spina-bifida', 'Spina bifida', 31, ['myelomeningocele']),
  entry('sma', 'Spinal muscular atrophy', 31, ['sma', 'werdnig-hoffmann disease']),
  entry('pierre-robin', 'Pierre Robin sequence', 31),
  entry('hemifacial-microsomia', 'Hemifacial microsomia', 31, ['goldenhar syndrome']),
  entry('treacher-collins', 'Treacher Collins syndrome', 31),
  entry('apert', 'Apert syndrome', 31),
  entry('crouzon', 'Crouzon syndrome', 31),
  entry('laryngeal-papillomatosis', 'Laryngeal papillomatosis', 31, ['recurrent respiratory papillomatosis']),
  entry('down-syndrome', 'Down syndrome (trisomy 21)', 31, ['trisomy 21']),
];
