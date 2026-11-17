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
export const PLANNED_CONDITION_IDS = [
  'mh-susceptibility',
  'acute-porphyria',
  'myasthenia-gravis',
  'myotonic-dystrophy',
  'pheochromocytoma',
  'carcinoid-syndrome',
];

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
  {
    id: 'carcinoid-syndrome',
    name: 'Carcinoid syndrome',
    aliases: ['carcinoid tumor', 'carcinoid crisis', 'neuroendocrine tumor'],
    chapter: 17,
    plan: {
      preop: [
        'Give octreotide 24 to 48 hours before surgery and continue it through the procedure: somatostatin analogues can prevent a carcinoid crisis.',
        'Look for right-sided heart disease (fibrosis of the tricuspid and pulmonary valves), dehydration and electrolyte loss from diarrhea, and wheezing.',
      ],
      intraop: [
        'Use invasive arterial pressure monitoring: blood pressure can change rapidly.',
        'Give octreotide again before the tumor is handled; it attenuates most adverse hemodynamic responses.',
        'Carcinoid crisis: intense flushing, diarrhea, tachycardia, and hypertension or hypotension, sometimes with bronchospasm.',
        'Bronchospasm is often resistant to treatment, and beta agonists can worsen it through mediator release; octreotide and antihistamines with ipratropium have been used.',
        'Drugs not known to release mediators: propofol, etomidate, vecuronium, cisatracurium, rocuronium, fentanyl, sufentanil, alfentanil, remifentanil and all inhalation agents (desflurane may suit liver metastases).',
        'Epidural analgesia is safe after adequate octreotide treatment if the local anesthetic is given gradually with careful hemodynamic monitoring.',
      ],
      avoid: [
        'Histamine-releasing drugs.',
        'Drugs that may provoke mediator release: succinylcholine, mivacurium, atracurium, epinephrine, norepinephrine, dopamine, isoproterenol and thiopental.',
      ],
      postop: [
        'Delayed awakening has been described; plan ICU monitoring when needed.',
        'Symptoms can persist after palliative surgery or with metastases.',
        'Ondansetron is a good antiemetic for these patients.',
      ],
    },
    sourceIds: ['stoelting-8e'],
  },
  {
    id: 'acute-porphyria',
    name: 'Acute porphyrias',
    aliases: ['porphyria', 'acute intermittent porphyria', 'aip', 'variegate porphyria', 'hereditary coproporphyria'],
    chapter: 18,
    plan: {
      preop: [
        'Ask about family history: a silent porphyria can present for the first time after a triggering drug.',
        'Examine and record any neuropathy and autonomic instability, especially before a regional block.',
        'Keep fasting short; if a long fast is unavoidable, give a glucose-containing infusion, because caloric restriction can precipitate an attack.',
        'Decide before surgery which drug in each class you may need (antibiotics, antihypertensives, antiarrhythmics and others) is safe. The American Porphyria Foundation keeps a drug database.',
      ],
      intraop: [
        'Regional anesthesia is not contraindicated, and no local anesthetic is known to have triggered an attack; watch for hypotension with autonomic neuropathy or hypovolemia.',
        'Propofol is well tolerated for induction. Nitrous oxide, isoflurane, sevoflurane and desflurane are considered safe, as are most IV opioids, depolarizing and nondepolarizing relaxants and their reversal drugs.',
        'Benzodiazepines, proton pump inhibitors and H2 blockers can be used before surgery.',
        'Expect blood pressure lability from autonomic dysfunction.',
        'Several possible triggers together are more dangerous than any single drug.',
      ],
      avoid: [
        'Barbiturates (thiopental, methohexital), etomidate and ketamine.',
        'Ketorolac, amiodarone and many calcium channel blockers (check each one before giving it).',
      ],
      postop: [
        'If an attack is suspected, watch skeletal muscle strength and cranial nerve function: weakness warns of respiratory failure and aspiration. Postoperative ventilation is rarely needed.',
        'Ondansetron or scopolamine for PONV; codeine, oxycodone, hydrocodone, acetaminophen and many NSAIDs for pain. Tramadol has insufficient evidence.',
        'Treating a crisis: remove triggers, hydrate, give carbohydrate, correct electrolytes including magnesium, and give IV heme early in a severe attack.',
      ],
    },
    sourceIds: ['stoelting-8e'],
  },
  entry('lesch-nyhan', 'Lesch-Nyhan syndrome', 18),
  entry('hemochromatosis', 'Hemochromatosis', 18, ['haemochromatosis']),
  entry('wilson-disease', 'Wilson disease', 18, ['hepatolenticular degeneration']),
  // Kidney
  entry('goodpasture', 'Goodpasture syndrome', 21, ['anti-gbm disease']),
  entry('polycystic-kidney', 'Polycystic kidney disease', 21, ['adpkd']),
  entry('bartter-gitelman', 'Bartter and Gitelman syndromes', 21, ['bartter syndrome', 'gitelman syndrome']),
  entry('fanconi-syndrome', 'Fanconi syndrome', 21),
  // Endocrine
  {
    id: 'pheochromocytoma',
    name: 'Pheochromocytoma',
    aliases: ['phaeochromocytoma', 'pheo', 'catecholamine-secreting tumor'],
    chapter: 22,
    plan: {
      preop: [
        'Start alpha blockade first (phenoxybenzamine most often; prazosin or doxazosin are alternatives). Aim for normal blood pressure, relief of symptoms and resolution of ST-T changes and arrhythmias. The best duration is unknown: 3 days to 2 weeks or longer.',
        'Add a beta blocker only after alpha blockade, for heart rate above 120 or arrhythmias.',
        'Phenoxybenzamine has been stopped 24 to 48 hours before surgery to avoid vascular unresponsiveness after the tumor is removed.',
        'Correct hypovolemia. A calcium channel blocker or metyrosine can be added in resistant cases.',
      ],
      intraop: [
        'Place an arterial line before induction. A central venous line is usually enough; a PA catheter or TEE helps with very active tumors or cardiac involvement.',
        'Expect systolic pressure above 200 mmHg during pneumoperitoneum and tumor handling even after alpha blockade. Have nitroprusside (the agent of choice), phentolamine, nitroglycerin, labetalol, esmolol and magnesium ready.',
        'Expect hypotension after the tumor veins are ligated: a large positive fluid balance and vasopressors are usually needed, and the response to vasopressors may be blunted. Lightening anesthesia helps.',
        'Treat ventricular arrhythmias with lidocaine or a beta blocker such as esmolol.',
        'Minimize fear, stress, pain, shivering, hypoxia and hypercarbia: all release catecholamines.',
      ],
      avoid: [
        'A nonselective beta blocker before alpha blockade: unopposed alpha vasoconstriction can cause a hypertensive crisis.',
        'Histamine releasers (morphine, atracurium).',
        'Vagolytic or sympathomimetic drugs: atropine, ketamine, pancuronium, succinylcholine.',
      ],
      postop: [
        'Check blood glucose: insulin rises after resection and hypoglycemia can occur.',
        'Give glucocorticoids after bilateral adrenalectomy or when hypoadrenalism is possible.',
        'About half of patients stay hypertensive for several days, because catecholamines take 7 to 10 days to normalize. If hypertension persists, consider a missed tumor, renal ischemia or essential hypertension.',
      ],
    },
    sourceIds: ['stoelting-8e'],
  },
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
  {
    id: 'myotonic-dystrophy',
    name: 'Myotonic dystrophy',
    aliases: ['myotonia dystrophica', 'dystrophia myotonica', 'steinert disease', 'dm1'],
    chapter: 24,
    plan: {
      preop: [
        'Look for cardiomyopathy and conduction disease: first-degree heart block is common, and complete heart block can cause sudden death.',
        'Assess respiratory muscle weakness. Pharyngeal and chest wall weakness raise aspiration risk; central sleep apnea and hypersomnolence add to sensitivity to sedatives.',
        'Many patients reach surgery with the myotonia unrecognized.',
      ],
      intraop: [
        'Keep the patient warm and prevent shivering: cold and shivering trigger myotonia.',
        'TIVA may be preferable to volatile agents, which can aggravate cardiomyopathy and conduction problems. Expect increased sensitivity to propofol, opioids and benzodiazepines.',
        'The response to nondepolarizing relaxants is normal, but existing weakness may make them unnecessary, which also avoids neostigmine.',
        'Myotonic contraction from surgical handling or diathermy is not relieved by relaxants or general or regional anesthesia; local anesthetic infiltration of the muscle, phenytoin, quinine or procainamide may help (quinine and procainamide can worsen conduction).',
        'Epidural anesthesia is considered safe.',
      ],
      avoid: [
        'Succinylcholine: it can cause prolonged myotonia that relaxants and anesthesia cannot reverse.',
        'Other myotonia triggers: methohexital, etomidate, neostigmine, hypothermia, and mechanical or electrical stimulation.',
      ],
      postop: [
        'Watch breathing closely: weak respiratory muscles add to any residual opioid, benzodiazepine or propofol effect. Perioperative complications are mainly cardiopulmonary.',
      ],
    },
    sourceIds: ['stoelting-8e'],
  },
  entry('nemaline', 'Nemaline rod myopathy', 24),
  entry('myotonia-congenita', 'Myotonia congenita', 24),
  entry('paramyotonia-congenita', 'Paramyotonia congenita', 24),
  entry('periodic-paralysis', 'Periodic paralysis (hyperkalemic and hypokalemic)', 24, ['hyperkalemic periodic paralysis', 'hypokalemic periodic paralysis']),
  entry('central-core', 'Central core disease', 24, ['ccd']),
  entry('centronuclear', 'Centronuclear myopathy', 24, ['myotubular myopathy']),
  entry('mitochondrial-myopathy', 'Mitochondrial myopathies', 24, ['mitochondrial disease']),
  {
    id: 'myasthenia-gravis',
    name: 'Myasthenia gravis',
    aliases: ['mg'],
    chapter: 24,
    plan: {
      preop: [
        'Tell the patient they may stay intubated and ventilated after surgery.',
        'After transsternal thymectomy, the need for ventilation correlated with disease longer than 6 years, pyridostigmine above 750 mg a day, vital capacity below 2.9 L and COPD unrelated to myasthenia.',
        'Bulbar weakness brings a high aspiration risk. Look for associated thyroid and other autoimmune disease.',
        'Infection, electrolyte disturbance, stress, surgery and some antibiotics (especially aminoglycosides) can worsen weakness.',
      ],
      intraop: [
        'Patients are very sensitive to nondepolarizing relaxants: if one is needed, reduce the initial dose by one-half to two-thirds and titrate with a nerve stimulator.',
        'Patients are resistant to succinylcholine (ED95 about 2.6 times normal), but usual doses still usually give adequate intubating conditions.',
        'Intubation is often possible without a relaxant, and volatile agents can reduce or remove the need for one.',
        'After rocuronium, sugammadex may reverse more reliably than neostigmine with glycopyrrolate.',
      ],
      avoid: [
        'Nondepolarizing relaxants in usual doses or without neuromuscular monitoring.',
        'Opioids for maintenance where possible: their respiratory effects can last into recovery.',
      ],
      postop: [
        'Delay extubation until respiratory function is clearly good: strength can seem adequate early and fall again a few hours later.',
        'Plan postoperative ventilation for patients who meet the risk criteria.',
      ],
    },
    sourceIds: ['stoelting-8e'],
  },
  entry('lambert-eaton', 'Lambert-Eaton myasthenic syndrome', 24, ['eaton-lambert syndrome', 'myasthenic syndrome', 'lems']),
  {
    id: 'mh-susceptibility',
    name: 'Malignant hyperthermia susceptibility',
    aliases: ['mh', 'mhs', 'malignant hyperthermia'],
    chapter: 24,
    plan: {
      preop: [
        'Plan a trigger-free anesthetic: any combination of sedation, TIVA or regional anesthesia.',
        'Have the MH cart with dantrolene immediately available.',
        'Treat central core disease and King-Denborough syndrome as MH susceptible unless proven otherwise; Duchenne and Becker muscular dystrophies are also highly associated.',
      ],
      intraop: [
        'Prepare the machine: remove the vaporizers, change the CO2 absorbent and the breathing circuit, and fit activated charcoal filters on the inspiratory and expiratory limbs.',
        'Flush with fresh gas at 10 to 15 L/min for 10 to 15 minutes (some authors suggest up to 60 minutes for modern machines), then confirm the gas analyzer reads zero volatile agent in both limbs.',
        'Early signs of a crisis: rising EtCO2, tachycardia, tachypnea, masseter or generalized rigidity, mixed acidosis, sweating, mottled skin, arrhythmias and labile blood pressure. A rising temperature is a later sign.',
      ],
      avoid: [
        'All halogenated volatile anesthetics: sevoflurane, desflurane, isoflurane, halothane, enflurane and methoxyflurane.',
        'Succinylcholine.',
      ],
      postop: [
        'After masseter rigidity from succinylcholine, observe for 12 to 24 hours (EtCO2, urine, creatine kinase, potassium and blood gases). MHAUS advises creatine kinase and urine myoglobin every 6 hours for 36 hours.',
        'After a crisis, admit to ICU for at least 24 hours and continue dantrolene, because recurrence is common. Crisis steps and dantrolene doses are in SOS › MH.',
      ],
    },
    crisis: 'mh',
    sourceIds: ['stoelting-8e'],
  },
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
