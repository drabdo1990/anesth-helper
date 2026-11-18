import { entry, type ConditionRecord } from './types';

export const NEUROLOGIC_CONDITIONS: ConditionRecord[] = [
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
  // Muscle and neuromuscular junction
  entry('duchenne', 'Duchenne muscular dystrophy', 24, ['dmd', 'pseudohypertrophic muscular dystrophy']),
  entry('becker', 'Becker muscular dystrophy', 24),
  entry('limb-girdle', 'Limb-girdle muscular dystrophy', 24),
  entry('fshd', 'Facioscapulohumeral muscular dystrophy', 24, ['fshd']),
  entry('oculopharyngeal', 'Oculopharyngeal dystrophy', 24),
  entry('emery-dreifuss', 'Emery-Dreifuss muscular dystrophy', 24),
  entry(
    'myotonic-dystrophy',
    'Myotonic dystrophy',
    24,
    ['myotonia dystrophica', 'dystrophia myotonica', 'steinert disease', 'dm1'],
    {
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
  ),
  entry('nemaline', 'Nemaline rod myopathy', 24),
  entry('myotonia-congenita', 'Myotonia congenita', 24),
  entry('paramyotonia-congenita', 'Paramyotonia congenita', 24),
  entry('periodic-paralysis', 'Periodic paralysis (hyperkalemic and hypokalemic)', 24, ['hyperkalemic periodic paralysis', 'hypokalemic periodic paralysis']),
  entry('central-core', 'Central core disease', 24, ['ccd']),
  entry('centronuclear', 'Centronuclear myopathy', 24, ['myotubular myopathy']),
  entry('mitochondrial-myopathy', 'Mitochondrial myopathies', 24, ['mitochondrial disease']),
  entry(
    'myasthenia-gravis',
    'Myasthenia gravis',
    24,
    ['mg'],
    {
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
  ),
  entry('lambert-eaton', 'Lambert-Eaton myasthenic syndrome', 24, ['eaton-lambert syndrome', 'myasthenic syndrome', 'lems']),
];
