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
  subspecialtyEntry(
    'diabetes-dka-hhs',
    'Diabetes mellitus, DKA & HHS',
    'Endocrinology',
    ['diabetes', 'dka', 'hhs', 'diabetic ketoacidosis', 'gastroparesis'],
    {
      preop: [
        'Assess end-organ disease: silent coronary ischemia, autonomic neuropathy (resting tachycardia, orthostasis, severe gastroparesis -> consider RSI), nephropathy, and stiff-joint syndrome ("prayer sign" limiting atlanto-occipital extension).',
        'Check baseline POC glucose, electrolytes, and anion gap; defer purely elective surgery in active DKA/HHS until volume, acidosis, and hypokalemia are corrected.',
      ],
      intraop: [
        'Maintain moderate glycemic targets (140–180 mg/dL) with hourly POC glucose checks and titrated short-acting IV insulin when needed.',
        'In emergency surgery with DKA/HHS: continue isotonic saline resuscitation, careful potassium repletion, and insulin infusion while avoiding rapid osmotic shifts.',
      ],
      avoid: [
        'Tight aggressive insulin targets (< 110 mg/dL) that trigger severe unnoticed intraoperative hypoglycemia under general anesthesia.',
        'Starting insulin before correcting critical hypokalemia (< 3.3 mEq/L) or using SGLT2 inhibitors prior to major fasting (euglycemic DKA risk).',
      ],
      postop: [
        'Check blood glucose in PACU and transition smoothly back to basal-bolus subcutaneous insulin once oral intake is established.',
      ],
    },
  ),
  subspecialtyEntry(
    'hyperthyroidism-thyroid-storm',
    'Hyperthyroidism & thyroid storm',
    'Endocrinology',
    ['thyroid storm', 'hyperthyroidism', 'graves disease', 'thyrotoxicosis'],
    {
      preop: [
        'Defer elective surgery until clinically euthyroid using antithyroid thionamides (methimazole/PTU) and beta-blockers.',
        'Evaluate neck imaging for retrosternal goiter, tracheal deviation/compression, and airway compromise.',
      ],
      intraop: [
        'Recognize thyroid storm (high fever, severe tachycardia/AF, heart failure, agitation — closely mimics malignant hyperthermia, though CK/acidosis are milder).',
        'Treat storm systematically: 1) beta-blocker (esmolol/propranolol), 2) thionamide (PTU/methimazole) FIRST, 3) potassium iodide (Lugol solution) 1 hour AFTER thionamide, 4) stress-dose hydrocortisone, and 5) active cooling.',
      ],
      avoid: [
        'Sympathetic stimulants (ketamine, ephedrine, pancuronium, atropine, epinephrine-containing local anesthetics) in poorly controlled thyrotoxicosis.',
        'Aspirin for fever control (displaces thyroid hormone from binding proteins and worsens free T3/T4 toxicity) or giving iodine before thionamide blockade.',
      ],
      postop: [
        'Transfer to ICU after storm crisis and inspect vocal cord mobility and neck patency after thyroidectomy.',
        'Monitor serially for acute hypocalcemia (Chvostek/Trousseau signs, QT prolongation) from parathyroid stunning.',
      ],
    },
  ),
  subspecialtyEntry(
    'hypothyroidism-myxedema',
    'Hypothyroidism & myxedema coma',
    'Endocrinology',
    ['hypothyroidism', 'myxedema coma'],
    {
      preop: [
        'Mild/subclinical hypothyroidism can proceed safely; overt severe hypothyroidism or myxedema coma (hypothermia, hyponatremia, bradycardia, hypoventilation, pericardial effusion) requires delaying elective surgery until thyroid replacement.',
        'Assess airway for macroglossia/goiter and check baseline sodium and cortisol axis.',
      ],
      intraop: [
        'Anticipate exquisite sensitivity to all sedatives, opioids, and volatile agents (minimal MAC reduction is modest clinically, but myocardial/respiratory depression and delayed drug clearance are marked).',
        'Maintain active warming, gentle fluid titration, and invasive monitoring in severe cases; treat myxedema coma emergently with IV levothyroxine PLUS stress hydrocortisone.',
      ],
      avoid: [
        'Heavy preoperative sedatives, excessive vasodilators, and rapid aggressive warming prior to intravascular volume support (vasodilation unmasks hypotension).',
        'Administering IV thyroxine without concurrent stress steroids when coexisting adrenal insufficiency is possible.',
      ],
      postop: [
        'Keep patients with severe hypothyroidism closely monitored (ICU/step-down) for prolonged emergence, hyponatremia, and blunted hypoxic/hypercapnic ventilatory drive.',
      ],
    },
  ),
  subspecialtyEntry(
    'adrenal-insufficiency',
    'Adrenal insufficiency & adrenal crisis',
    'Endocrinology',
    ['addison disease', 'adrenal crisis', 'adrenal insufficiency', 'steroid suppression'],
    {
      preop: [
        'Identify primary adrenal failure (Addison disease) or secondary HPA-axis suppression from chronic systemic/high-dose inhaled corticosteroids.',
        'Plan perioperative stress-dose hydrocortisone scaled to surgical stress (morning home dose for minor cases; supplemental IV hydrocortisone for moderate/major surgery).',
      ],
      intraop: [
        'Suspect acute adrenal crisis upon unexplained catecholamine-refractory hypotension, hypoglycemia, hyponatremia, and hyperkalemia.',
        'Treat immediately with IV hydrocortisone bolus, isotonic saline with dextrose resuscitation, and vasopressors while correcting electrolyte shifts.',
      ],
      avoid: [
        'Etomidate for induction or infusions in patients at risk for adrenal crisis or septic shock (potently inhibits 11-beta-hydroxylase cortisol synthesis for 24–48 h).',
        'Omitting maintenance morning steroids prior to anesthesia.',
      ],
      postop: [
        'Taper stress-dose hydrocortisone back to baseline maintenance over 2 to 3 days while monitoring electrolytes and blood glucose.',
      ],
    },
  ),
  subspecialtyEntry(
    'cirrhosis-esld',
    'Cirrhosis, portal hypertension & ESLD',
    'Hepatic',
    ['cirrhosis', 'portal hypertension', 'esld', 'child pugh', 'meld'],
    {
      preop: [
        'Stratify severity via MELD and Child-Pugh scores (Child C carries prohibitive elective surgical mortality); evaluate ascites (full-stomach/RSI, impaired FRC), encephalopathy, hepatopulmonary syndrome (platypnea-orthodeoxia), and portopulmonary hypertension.',
        'Assess baseline INR, platelets, fibrinogen (rebalanced hemostasis), and renal function (hepatorenal risk).',
      ],
      intraop: [
        'Preserve hepatic arterial and portal venous oxygen delivery by maintaining normal MAP/preload and avoiding severe hyperventilation.',
        'Prefer organ-independent elimination agents (cisatracurium, remifentanil, sevoflurane/desflurane) and expect elevated volume of distribution for hydrophilic drugs.',
        'Administer albumin replacement carefully during large-volume paracentesis to prevent paracentesis-induced circulatory dysfunction.',
      ],
      avoid: [
        'Halothane, hypotension, severe hypocapnia, and high PEEP (sharply reduce hepatic blood flow).',
        'Preoperative sedatives precipitating hepatic encephalopathy, or large acetaminophen/NSAID loads.',
      ],
      postop: [
        'Monitor closely for delayed clearance of sedatives, worsening encephalopathy, hypoglycemia, GI variceal bleeding, and acute kidney injury.',
      ],
    },
  ),
  subspecialtyEntry(
    'acute-liver-failure',
    'Acute (fulminant) liver failure',
    'Hepatic',
    ['fulminant hepatic failure', 'acute liver failure', 'alf'],
    {
      preop: [
        'Differentiate from chronic cirrhosis: acute liver failure presents rapidly with severe coagulopathy, cerebral edema/intracranial hypertension, refractory hypoglycemia, and distributive vasodilatory shock.',
        'Coordinate neurology/ICU neuro-protection plan and viscoelastic coagulation testing (TEG/ROTEM).',
      ],
      intraop: [
        'Maintain cerebral perfusion pressure, 30-degree head elevation, mild hypocapnia, and active normothermia.',
        'Infuse continuous dextrose with frequent POC glucose monitoring and treat vasodilatory shock with norepinephrine/vasopressin.',
      ],
      avoid: [
        'Hepatotoxic medications, hypotonic IV fluids (worsen brain swelling), and unnecessary blind prophylactic FFP that obscures neurologic exams or worsens cerebral hyperemia.',
        'Neuraxial anesthesia in acute hepatic coagulopathy.',
      ],
      postop: [
        'Transfer intubated directly to liver ICU for continuous ICP, glucose, ammonia, and transplant candidacy monitoring.',
      ],
    },
  ),
  subspecialtyEntry(
    'esrd-renal-transplant',
    'End-stage renal disease (ESRD) & renal transplant',
    'Renal',
    ['esrd', 'ckd', 'dialysis', 'renal transplant'],
    {
      preop: [
        'Verify timing of last hemodialysis, pre/post-dialysis weight, serum potassium (defer elective cases with acute hyperkalemia or ECG changes), metabolic acidosis, anemia, and uremic bleeding.',
        'Inspect and label all arteriovenous (AV) fistulas/grafts: strictly zero blood pressure cuffs, venipuncture, or tourniquets on that extremity.',
      ],
      intraop: [
        'Choose drugs independent of renal clearance (cisatracurium, atracurium, propofol, fentanyl/remifentanil) and confirm full TOF reversal (avoid sugammadex in severe ESRD per local label if alternative exists).',
        'For renal transplantation: maintain adequate intravascular volume and normotension/mild hypertension prior to clamp release to ensure prompt graft perfusion.',
        'Pad AV fistula limbs meticulously and confirm palpable thrill throughout surgery.',
      ],
      avoid: [
        'Succinylcholine when serum potassium is elevated (> 5.5 mEq/L) or rising, and avoid NSAIDs, meperidine (normeperidine accumulation -> seizures), and morphine metabolite accumulation (M6G).',
        'Blood pressure cuffs or peripheral IVs placed on an AV fistula arm.',
      ],
      postop: [
        'Re-check potassium and AV fistula thrill in PACU; treat post-op hyperkalemia emergently with calcium, insulin-dextrose, beta-agonist, and dialysis.',
      ],
    },
  ),
  subspecialtyEntry(
    'turp-syndrome',
    'TURP syndrome & acute hyponatremia',
    'Renal',
    ['turp syndrome', 'hyponatremia', 'glycine toxicity', 'hysteroscopy fluid overload'],
    {
      preop: [
        'Assess baseline cardiac and renal reserve in patients scheduled for prolonged transurethral resection or hysteroscopic procedures using hypotonic non-conductive irrigation (glycine 1.5%, sorbitol, mannitol).',
        'Limit surgical irrigation bag height (< 60 cm above bladder) and operative resection time (< 60 min).',
      ],
      intraop: [
        'Spinal anesthesia (to T10 level) enables early clinical detection of CNS symptoms (restlessness, confusion, nausea, visual disturbances/transient blindness from glycine) plus bladder perforation signs.',
        'Recognize volume overload (hypertension, bradycardia, pulmonary edema) shifting to hyponatremic hypotension and seizures.',
        'Stop surgery immediately upon suspicion, secure airway if obtunded, give IV loop diuretic (furosemide), and check STAT serum sodium and osmolality.',
      ],
      avoid: [
        'Overly rapid sodium correction (> 8–10 mEq/L in 24 hours), which risks osmotic demyelination syndrome (central pontine myelinolysis); reserve 3% hypertonic saline strictly for severe symptomatic seizures/coma.',
        'Heavy intraoperative sedation under neuraxial anesthesia that masks early restless CNS warning signs.',
      ],
      postop: [
        'Monitor serum sodium every 2 to 4 hours in ICU/step-down until steady normalization and neurological clarity return.',
      ],
    },
  ),
  subspecialtyEntry(
    'dic',
    'Disseminated intravascular coagulation (DIC)',
    'Hematology',
    ['dic', 'disseminated intravascular coagulation', 'consumptive coagulopathy'],
    {
      preop: [
        'Screen patients with high-risk obstetric disasters (abruption, AFE, fetal demise), severe sepsis, major trauma, massive transfusion, or acute hemolytic reactions.',
        'Check baseline platelets, fibrinogen, PT/INR, aPTT, and D-dimer while ensuring blood bank activation readiness.',
      ],
      intraop: [
        'Recognize simultaneous diffuse microvascular bleeding from IV sites/mucosa and microvascular organ thrombosis.',
        'Definitively treat the underlying cause FIRST (evacuate uterus, control sepsis, stop incompatible transfusion) while replacing consumed factors aggressively (cryoprecipitate/fibrinogen, FFP, platelets, RBCs).',
        'Follow serial TEG/ROTEM or standard coagulation panels frequently.',
      ],
      avoid: [
        'Neuraxial anesthesia or deep non-compressible blocks in suspected DIC.',
        'Administering isolated antifibrinolytics alone without treating the underlying trigger or replacing consumed clotting factors.',
      ],
      postop: [
        'Admit to ICU for serial coagulation labs, organ perfusion monitoring (renal/hepatic), and microvascular thrombosis surveillance.',
      ],
    },
  ),
  subspecialtyEntry(
    'hit-thrombocytopenia',
    'Heparin-induced thrombocytopenia (HIT)',
    'Hematology',
    ['hit', 'heparin induced thrombocytopenia', 'pf4 antibodies'],
    {
      preop: [
        'Recognize Type II immune HIT: > 50% platelet drop typically 5–14 days after heparin exposure (earlier if recent prior exposure) accompanied by paradoxical arterial or venous thrombosis ("white clot syndrome").',
        'Verify non-heparin alternative anticoagulant strategy (argatroban, bivalirudin, fondaparinux) with hematology prior to surgery.',
      ],
      intraop: [
        'Strictly eliminate ALL sources of heparin from the OR environment: flush arterial/central lines with normal saline only, remove heparin-coated Swan-Ganz/dialysis catheters, and confirm cell-salvage/CPB anticoagulation alternatives (bivalirudin).',
        'Monitor anticoagulation with appropriate assays (ACT/ECT or dilute thrombin time for direct thrombin inhibitors).',
      ],
      avoid: [
        'Unfractionated heparin, low-molecular-weight heparin, and heparinized saline line flushes in all forms.',
        'Prophylactic platelet transfusions in HIT unless life-threatening bleeding is present ("adds fuel to thrombotic fire").',
      ],
      postop: [
        'Maintain non-heparin systemic anticoagulation carefully in ICU and document heparin allergy prominently across the chart and band.',
      ],
    },
  ),
];
