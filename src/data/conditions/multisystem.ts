import { entry, type ConditionRecord } from './types';

export const MULTISYSTEM_CONDITIONS: ConditionRecord[] = [
  // Liver, gut and metabolism
  entry('gilbert', 'Gilbert syndrome', 16),
  entry('crigler-najjar', 'Crigler-Najjar syndrome', 16),
  entry('achalasia', 'Achalasia', 17),
  entry('zollinger-ellison', 'Zollinger-Ellison syndrome', 17, ['gastrinoma']),
  entry(
    'carcinoid-syndrome',
    'Carcinoid syndrome',
    17,
    ['carcinoid tumor', 'carcinoid crisis', 'neuroendocrine tumor'],
    {
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
  ),
  // Kidney
  entry('goodpasture', 'Goodpasture syndrome', 21, ['anti-gbm disease']),
  entry('polycystic-kidney', 'Polycystic kidney disease', 21, ['adpkd']),
  entry('bartter-gitelman', 'Bartter and Gitelman syndromes', 21, ['bartter syndrome', 'gitelman syndrome']),
  entry('fanconi-syndrome', 'Fanconi syndrome', 21),
  // Skin and connective tissue
  entry('epidermolysis-bullosa', 'Epidermolysis bullosa', 24, ['eb']),
  entry('pemphigus', 'Pemphigus', 24),
  entry('mastocytosis', 'Mastocytosis', 24, ['urticaria pigmentosa']),
  entry('scleroderma', 'Scleroderma', 24, ['systemic sclerosis']),
  entry('pseudoxanthoma-elasticum', 'Pseudoxanthoma elasticum', 24),
  entry('ehlers-danlos', 'Ehlers-Danlos syndrome', 24, ['eds']),
  entry('marfan', 'Marfan syndrome', 24),
  // Malignant hyperthermia
  entry(
    'mh-susceptibility',
    'Malignant hyperthermia susceptibility',
    24,
    ['mh', 'mhs', 'malignant hyperthermia'],
    {
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
    'mh',
  ),
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
