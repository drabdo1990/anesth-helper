import { subspecialtyEntry, type ConditionRecord } from './types';

export const SUBSPECIALTY_NEURO_ENDO_CONDITIONS: ConditionRecord[] = [
  subspecialtyEntry(
    'traumatic-brain-injury',
    'Traumatic brain injury (TBI)',
    'Neuroanesthesia',
    ['tbi', 'head trauma', 'subdural hematoma', 'epidural hematoma'],
    {
      preop: [
        'Assess Glasgow Coma Scale, pupillary reactivity, cervical spine clearance status (assume unstable C-spine until cleared), and concurrent hemorrhagic trauma.',
        'Establish arterial line and hyperosmolar agents early without delaying emergent surgical hematoma evacuation.',
      ],
      intraop: [
        'Prevent secondary brain injury strictly: eliminate hypoxemia and even single episodes of hypotension; maintain CPP (MAP - ICP) cleanly using isotonic fluids and vasopressors.',
        'Maintain 30-degree head-up tilt (once spine protected), midline neck alignment, normocarbia/mild hypocapnia, normothermia, and normoglycemia.',
        'Intubate using manual inline cervical stabilization and video laryngoscopy while avoiding blood pressure spikes or drops.',
      ],
      avoid: [
        'Hypotonic fluids (D5W, half-normal saline, lactated Ringer), which worsen cerebral edema, and glucose-containing solutions.',
        'Nitrous oxide (increases cerebral blood flow and ICP, expands pneumocephalus) and high PEEP impeding venous return.',
        'Systemic hypotension and unguarded cervical extension.',
      ],
      postop: [
        'Keep intubated and sedated for neuro-ICU admission with invasive ICP/CPP and temperature control.',
        'Perform postoperative serial head CT and coagulation/TEG checks (TBI triggers consumptive coagulopathy).',
      ],
    },
  ),
  subspecialtyEntry(
    'intracranial-aneurysm-sah',
    'Intracranial aneurysm & subarachnoid hemorrhage',
    'Neuroanesthesia',
    ['sah', 'subarachnoid hemorrhage', 'cerebral aneurysm', 'cerebral vasospasm'],
    {
      preop: [
        'Assess Hunt-Hess / WFNS clinical grade, Fisher CT grade, electrocardiographic changes (neurogenic stunned myocardium), hyponatremia (SIADH vs cerebral salt wasting), and nimodipine adherence.',
        'Insert arterial line before induction for beat-to-beat blood pressure tracking.',
      ],
      intraop: [
        'Prevent aneurysmal re-rupture before clipping/coiling by eliminating transmural pressure spikes (MAP - ICP) during laryngoscopy, pin placement, and incision.',
        'Treat cerebral vasospasm with euvolemic induced hypertension and intra-arterial vasodilators; prepare temporary clipping burst suppression (propofol) and adenosine cardiac pause if needed.',
        'Use isotonic crystalloids, preserve normocarbia and normothermia.',
      ],
      avoid: [
        'Acute hypertensive surges before aneurysm securing, or abrupt excessive hyperventilation causing acute ICP drop and increased transmural tension.',
        'Hyperthermia, hyperglycemia, and excessive PEEP.',
      ],
      postop: [
        'Perform early controlled emergence to verify intact neurologic status when pre-op grade permits.',
        'Monitor closely in neuro-ICU for delayed cerebral ischemia/vasospasm (days 3–14), hydrocephalus, and hyponatremia.',
      ],
    },
  ),
  subspecialtyEntry(
    'awake-craniotomy-mass',
    'Supratentorial mass lesion & awake craniotomy',
    'Neuroanesthesia',
    ['awake craniotomy', 'brain tumor', 'eloquent cortex', 'supratentorial tumor'],
    {
      preop: [
        'Evaluate tumor mass effect, midline shift, preexisting seizures, motor/speech deficits, and psychological suitability for awake language/motor mapping.',
        'Administer preoperative antiepileptics, dexamethasone for vasogenic edema, and explain every OR phase thoroughly.',
      ],
      intraop: [
        'Perform bilateral scalp blocks (supraorbital, supratrochlear, zygomaticotemporal, auriculotemporal, lesser/greater occipital nerves) using carefully calculated non-toxic LA totals.',
        'Titrate asleep-awake-asleep (LMA/TIVA) or monitored anesthesia care (dexmedetomidine + remifentanil) preserving smooth emergence and clear communication during cortical mapping.',
        'Keep iced sterile saline immediately ready on the surgical field to abort mapping-induced cortical seizures.',
      ],
      avoid: [
        'Hypercapnia or airway obstruction causing acute cerebral swelling and herniation through the craniotomy defect.',
        'Heavy oversedation during mapping or sudden emergence coughing/vomiting in Mayfield head pins.',
      ],
      postop: [
        'Monitor neurologic exam serially in neuro-ICU, maintain systolic blood pressure control to prevent resection-bed hemorrhage, and watch for post-op seizures.',
      ],
    },
  ),
  subspecialtyEntry(
    'acute-spinal-cord-injury',
    'Acute spinal cord injury & neurogenic shock',
    'Neuroanesthesia',
    ['acute sci', 'spinal cord injury', 'neurogenic shock', 'spinal shock'],
    {
      preop: [
        'Document sensory/motor level, preserve rigid immobilization, and distinguish hypovolemic shock from neurogenic shock (vasodilation + bradycardia when injury is above T6 / cardiac accelerators T1–T4).',
        'Assess diaphragmatic/intercostal compromise in cervical injuries (C3–C5 phrenic loss requires immediate intubation).',
      ],
      intraop: [
        'Intubate using awake fiberoptic or video laryngoscopy with continuous manual inline stabilization.',
        'Treat neurogenic shock with cautious isotonic volume plus norepinephrine/phenylephrine and atropine/glycopyrrolate for severe bradycardia; maintain elevated MAP targets (typically 85–90 mmHg) for cord perfusion.',
        'Use TIVA (propofol/remifentanil) without volatile/NMBDs when neuromonitoring (SSEPs/MEPs) is active.',
      ],
      avoid: [
        'Succinylcholine beyond 24–48 hours after acute denervating spinal cord injury due to proliferation of extrajunctional acetylcholine receptors causing fatal hyperkalemia.',
        'Unguarded neck extension or hypotension impairing penumbral cord blood flow.',
      ],
      postop: [
        'Transfer intubated to ICU for high cervical injuries or prolonged prone surgery; monitor vital capacity and autonomic dysreflexia emergence later.',
      ],
    },
  ),
  subspecialtyEntry(
    'maoi-ssri-serotonin-syndrome',
    'MAOIs, SSRIs & serotonin syndrome',
    'Psychiatric',
    ['maoi', 'ssri', 'serotonin syndrome', 'phenelzine', 'tranylcypromine', 'linezolid'],
    {
      preop: [
        'Screen carefully for irreversible/reversible MAOIs (phenelzine, tranylcypromine, selegiline, linezolid, methylene blue) and SSRIs/SNRIs; modern practice generally continues chronic psychiatric meds carefully rather than stopping abruptly.',
        'Plan direct-acting vasopressors and opioid-sparing multimodal analgesia.',
      ],
      intraop: [
        'Use direct-acting alpha-agonists (phenylephrine, norepinephrine) at reduced initial titrations when hypotension occurs in MAOI-treated patients.',
        'Recognize acute serotonin syndrome: neuromuscular clonus, hyperreflexia, ocular clonus, agitation, diaphoresis, tachycardia, and hyperthermia; differentiate from MH and NMS.',
        'Treat serotonin syndrome aggressively with trigger cessation, benzodiazepines, active cooling, and cyproheptadine.',
      ],
      avoid: [
        'Indirect-acting sympathomimetics (ephedrine) in MAOI patients (causes catastrophic hypertensive crisis via massive norepinephrine release).',
        'Serotonergic opioids (meperidine, tramadol, methadone, dextromethorphan), methylene blue, and high-dose ondansetron combinations precipitating Type I excitatory serotonin crisis.',
      ],
      postop: [
        'Monitor closely for delayed hyperthermia, rhabdomyolysis, or clonus in PACU/ICU if serotonergic drugs were given.',
      ],
    },
  ),
  subspecialtyEntry(
    'lithium-ect',
    'Lithium therapy & electroconvulsive therapy (ECT)',
    'Psychiatric',
    ['lithium toxicity', 'electroconvulsive therapy', 'ect'],
    {
      preop: [
        'Check serum lithium level, renal function, TSH, and sodium (dehydration/NSAIDs/thiazides precipitate lithium toxicity); consider holding lithium 24–48 h prior to elective major surgery or ECT.',
        'For ECT: assess cardiac comorbidities, intracranial lesions/aneurysm (contraindications to ICP spikes), and pacemaker/ICD status.',
      ],
      intraop: [
        'Expect lithium to prolong BOTH depolarizing (succinylcholine) and nondepolarizing neuromuscular blockade; titrate NMBDs carefully with nerve stimulator.',
        'For ECT: induce light anesthesia (methohexital/etomidate/propofol), pre-oxygenate + hyperventilate to lower seizure threshold, insert bite block, apply cuffed limb tourniquet for motor observation, and give succinylcholine.',
        'Anticipate acute ECT parasympathetic surge (bradycardia/asystole -> treat with atropine/glycopyrrolate) followed immediately by marked sympathetic hypertension/tachycardia (esmolol/labetalol).',
      ],
      avoid: [
        'NSAIDs, ACE inhibitors, and thiazide diuretics in lithium-treated patients (reduce renal lithium clearance and trigger neurotoxicity).',
        'Excessive propofol or benzodiazepine doses during ECT (blunt seizure duration) and omitting soft molar bite blocks (tongue/dental injury).',
      ],
      postop: [
        'Verify full neuromuscular recovery, airway reflexes, and hemodynamic return to baseline in PACU.',
        'Monitor urine output for lithium-induced nephrogenic diabetes insipidus.',
      ],
    },
  ),
  subspecialtyEntry(
    'substance-use-withdrawal',
    'Substance use disorders & acute withdrawal',
    'Psychiatric',
    ['alcohol withdrawal', 'opioid use disorder', 'buprenorphine', 'cocaine'],
    {
      preop: [
        'Distinguish acute intoxication (decreases anesthetic MAC) from chronic substance tolerance (increases hepatic enzyme induction and MAC requirements).',
        'Continue baseline MOUD (methadone or buprenorphine) perioperatively alongside regional/multimodal analgesia rather than tapering acutely before surgery.',
      ],
      intraop: [
        'For acute cocaine intoxication: control severe chest pain/hypertension with IV benzodiazepines, nitroglycerin, or phentolamine/alpha+beta titrated agents.',
        'Administer IV thiamine BEFORE any dextrose bolus in chronic alcohol misuse to prevent Wernicke encephalopathy.',
        'Expect high opioid requirements in chronic tolerance; combine ketamine, lidocaine, dexmedetomidine, acetaminophen, and regional blocks.',
      ],
      avoid: [
        'Unopposed beta-blockade in acute cocaine intoxication (theoretical risk of unopposed alpha-mediated coronary vasoconstriction and hypertension).',
        'Mixed agonist-antagonists (nalbuphine/butorphanol) or abrupt naloxone reversal in physically opioid-dependent patients (precipitates severe acute withdrawal/pulmonary edema).',
      ],
      postop: [
        'Monitor aggressively for delayed alcohol withdrawal (CIWA protocol, 24–72 h tremor, autonomic storm, delirium tremens) and treat early with benzodiazepines.',
        'Coordinate inpatient acute pain/addiction medicine consultation before discharge.',
      ],
    },
  ),
  subspecialtyEntry(
    'central-anticholinergic-syndrome',
    'Central anticholinergic syndrome',
    'Toxicities',
    ['anticholinergic toxicity', 'anticholinergic syndrome', 'physostigmine'],
    {
      preop: [
        'Identify high-risk anticholinergic exposures: scopolamine patches, atropine, antihistamines (diphenhydramine), promethazine, tricyclic antidepressants, and antipsychotics.',
        'Evaluate baseline cognitive reserve in elderly patients where central sensitivity is highest.',
      ],
      intraop: [
        'Recognize the classic toxidrome ("hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter"): delirium/coma, mydriasis, dry flushed skin, hyperthermia, tachycardia, and urinary retention.',
        'Rule out hypoxia, hypercapnia, residual anesthetics, hypoglycemia, and stroke first.',
        'Treat confirmed refractory central agitation or somnolence with slow titrated IV physostigmine (tertiary amine that crosses the blood-brain barrier).',
      ],
      avoid: [
        'Neostigmine or pyridostigmine to treat central delirium (quaternary amines do NOT cross the blood-brain barrier).',
        'Physostigmine in tricyclic antidepressant overdose with widened QRS intervals (risk of asystole/seizures).',
      ],
      postop: [
        'Observe in PACU for 2 to 4 hours after physostigmine due to its short half-life (recurrence of somnolence/delirium) and have atropine ready for cholinergic bradycardia.',
      ],
    },
  ),
  subspecialtyEntry(
    'co-cyanide-toxicity',
    'Carbon monoxide & cyanide toxicity',
    'Toxicities',
    ['carbon monoxide poisoning', 'cyanide toxicity', 'smoke inhalation', 'nitroprusside toxicity'],
    {
      preop: [
        'Suspect dual CO and cyanide toxicity in enclosed-space fire victims (soot in sputum, singed nasal hairs, altered consciousness) or cyanide toxicity during prolonged high-dose sodium nitroprusside infusions.',
        'Draw arterial co-oximetry immediately rather than relying on standard pulse oximetry.',
      ],
      intraop: [
        'Deliver 100% inspired oxygen immediately (shortens carboxyhemoglobin half-life from 4–5 h on room air to < 1 h) and prepare hyperbaric oxygen for severe CO neurologic/cardiac injury.',
        'Suspect cyanide when severe high-anion-gap lactic acidosis, unexplained hypotension, and abnormally high mixed venous oxygen saturation ("bright red venous blood") develop.',
        'Treat cyanide immediately with IV hydroxocobalamin (cyanocobalamin conversion, safe in smoke inhalation) or sodium thiosulfate/nitrites.',
      ],
      avoid: [
        'Trusting standard two-wavelength SpO2 readings in carbon monoxide poisoning (falsely reads 98%–100% due to identical light absorption by oxy- and carboxyhemoglobin).',
        'Administering methemoglobin-forming nitrites to fire victims who already have high carboxyhemoglobin (worsens oxygen delivery); prefer hydroxocobalamin.',
      ],
      postop: [
        'Note transient harmless reddish skin/urine discoloration and colorimetric laboratory interference after hydroxocobalamin.',
        'Admit to ICU for serial lactate clearance, co-oximetry, and delayed neuropsychiatric/burn airway follow-up.',
      ],
    },
  ),
  subspecialtyEntry(
    'organophosphate-pseudocholinesterase',
    'Organophosphate toxicity & pseudocholinesterase deficiency',
    'Toxicities',
    ['organophosphate poisoning', 'pseudocholinesterase deficiency', 'dibucaine number', 'butyrylcholinesterase'],
    {
      preop: [
        'Screen personal and family history for prolonged paralysis after succinylcholine or mivacurium (autosomal recessive butyrylcholinesterase deficiency; atypical homozygotes show low dibucaine number ~20).',
        'For organophosphate exposure: wear full PPE decontamination gear and check plasma cholinesterase suppression.',
      ],
      intraop: [
        'Organophosphate cholinergic crisis (SLUDGE / DUMBBBELS: bronchorrhea, bronchospasm, bradycardia, miosis, weakness): administer early titrated IV atropine until pulmonary secretions clear, PLUS pralidoxime (2-PAM) before enzyme aging.',
        'Suspect pseudocholinesterase deficiency when succinylcholine paralysis fails to recover within 15–30 minutes (or train-of-four shows Phase II block after prolonged exposure).',
        'Keep patients with prolonged unexpected succinylcholine/mivacurium block deeply sedated and mechanically ventilated until complete quantitative neuromuscular recovery.',
      ],
      avoid: [
        'Succinylcholine, mivacurium, and ester local anesthetics in known butyrylcholinesterase deficiency.',
        'Neostigmine reversal in Phase I/II succinylcholine block before confirming spontaneous recovery (may paradoxically worsen paralysis), or succinylcholine in acute organophosphate poisoning.',
      ],
      postop: [
        'Wean ventilation only after sustained TOF >= 0.9; send dibucaine number and plasma cholinesterase testing once acute recovery stabilizes and provide medical alert documentation.',
      ],
    },
  ),
];
