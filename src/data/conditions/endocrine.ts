import { entry, type ConditionRecord } from './types';

export const ENDOCRINE_CONDITIONS: ConditionRecord[] = [
  // Inborn errors of metabolism (Ch 18)
  entry(
    'acute-porphyria',
    'Acute porphyrias',
    18,
    ['porphyria', 'acute intermittent porphyria', 'aip', 'variegate porphyria', 'hereditary coproporphyria'],
    {
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
  ),
  entry('lesch-nyhan', 'Lesch-Nyhan syndrome', 18),
  entry('hemochromatosis', 'Hemochromatosis', 18, ['haemochromatosis']),
  entry('wilson-disease', 'Wilson disease', 18, ['hepatolenticular degeneration']),
  // Endocrine disease (Ch 22)
  entry(
    'pheochromocytoma',
    'Pheochromocytoma',
    22,
    ['phaeochromocytoma', 'pheo', 'catecholamine-secreting tumor'],
    {
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
  ),
  entry('insulinoma', 'Insulinoma', 22),
  entry('cushing', 'Cushing syndrome (hypercortisolism)', 22, ['hypercortisolism', 'cushing disease']),
  entry('conn', 'Primary hyperaldosteronism (Conn syndrome)', 22, ['conn syndrome', 'hyperaldosteronism']),
  entry('acromegaly', 'Acromegaly', 22),
];
