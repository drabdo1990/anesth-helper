import { subspecialtyEntry, type ConditionRecord } from './types';

export const SUBSPECIALTY_POPULATIONS_CONDITIONS: ConditionRecord[] = [
  subspecialtyEntry(
    'preeclampsia-hellp',
    'Preeclampsia, eclampsia & HELLP syndrome',
    'Obstetrics',
    ['preeclampsia', 'eclampsia', 'hellp syndrome', 'gestational hypertension'],
    {
      preop: [
        'Assess blood pressure severity, CNS symptoms (headache, visual changes, hyperreflexia), pulmonary edema, and HELLP labs (platelets, AST/ALT, LDH); check coagulation if platelets are dropping.',
        'Evaluate airway for pharyngolaryngeal edema and continue IV magnesium sulfate seizure prophylaxis.',
      ],
      intraop: [
        'Prefer neuraxial anesthesia (epidural or spinal) when platelets are reassuring to blunt laryngoscopy hypertensive surges and avoid difficult airway instrumentation.',
        'For general anesthesia: have smaller ETTs (6.0–6.5 mm) ready, maintain left uterine displacement, blunt intubation BP spikes (remifentanil/esmolol/labetalol), and titrate NMBDs carefully because magnesium potentiates blockade.',
        'Treat severe hypertension promptly with IV labetalol, IV hydralazine, or oral immediate-release nifedipine.',
      ],
      avoid: [
        'Ergot alkaloids (methylergonovine / Methergine) for uterine atony in hypertensive patients (precipitates severe hypertensive crisis and stroke).',
        'Excessive crystalloid loading in preeclamptic patients (high risk of flash pulmonary edema) and high-dose epinephrine-containing epidural test boluses when labile.',
      ],
      postop: [
        'Continue magnesium sulfate for 24 hours postpartum while monitoring patellar reflexes, respiratory rate, and urine output (magnesium toxicity risk in oliguria).',
      ],
    },
  ),
  subspecialtyEntry(
    'placenta-accreta-pph',
    'Placenta previa, accreta spectrum & PPH',
    'Obstetrics',
    ['postpartum hemorrhage', 'pph', 'placenta accreta', 'placenta previa', 'uterine atony'],
    {
      preop: [
        'Obtain crossmatched RBCs, establish two large-bore IVs, activate massive transfusion protocol readiness, and arrange cell salvage (leukocyte-depletion filter) for suspected placenta accreta spectrum.',
        'Plan combined spinal-epidural vs general anesthesia depending on surgical hemorrhage and hysterectomy likelihood.',
      ],
      intraop: [
        'Keep left uterine displacement until delivery, administer early IV tranexamic acid cleanly within 3 hours of bleeding onset, and infuse dilute oxytocin cautiously (avoid rapid large IV boluses causing severe hypotension).',
        'Escalate uterotonics systematically: oxytocin -> methylergonovine (avoid in HTN) -> carboprost (15-methyl PGF2alpha — avoid in asthma) -> misoprostol -> surgical tamponade/hysterectomy.',
        'Use rapid fluid warming, balanced 1:1:1 blood product ratios, ionized calcium repletion, and active warming during massive hemorrhage.',
      ],
      avoid: [
        'Carboprost (Hemabate) in asthmatic patients (causes severe bronchospasm) and methylergonovine in preeclampsia/hypertension.',
        'Single-shot spinal anesthesia in active hemorrhage or anticipated cesarean hysterectomy with unstable blood loss.',
      ],
      postop: [
        'Admit to ICU for persistent oozing/DIC surveillance, hemoglobin/fibrinogen checks, and airway edema assessment prior to extubation.',
      ],
    },
  ),
  subspecialtyEntry(
    'amniotic-fluid-embolism',
    'Amniotic fluid embolism (AFE)',
    'Obstetrics',
    ['afe', 'amniotic fluid embolism', 'anaphylactoid syndrome of pregnancy'],
    {
      preop: [
        'Recognize sudden catastrophic peripartum onset during labor, cesarean delivery, or immediately postpartum (remains a clinical diagnosis of exclusion).',
        'Verify obstetric emergency cart and massive transfusion protocol access on all labor and delivery units.',
      ],
      intraop: [
        'Detect abrupt hypoxia, tachypnea, cyanosis, sudden cardiovascular collapse (acute pulmonary hypertension & RV failure transitioning to LV failure), and severe fulminant DIC.',
        'Deliver 100% oxygen, intubate immediately, initiate high-quality CPR with manual left uterine displacement, and perform perimortem cesarean delivery within 4–5 minutes if cardiac arrest persists.',
        'Support right and left ventricles aggressively (norepinephrine, dobutamine/milrinone, inhaled nitric oxide/epoprostenol) and transfuse 1:1:1 + cryoprecipitate/TXA for DIC.',
      ],
      avoid: [
        'Aggressive crystalloid fluid boluses in an acutely pressure-overloaded failing right ventricle.',
        'Delaying perimortem cesarean delivery or waiting for laboratory confirmation before activating massive transfusion for DIC.',
      ],
      postop: [
        'Transfer directly to ICU for ongoing inotropic/ECMO consideration, DIC correction, and hypoxic-ischemic neuroprotection.',
      ],
    },
  ),
  subspecialtyEntry(
    'pyloric-stenosis',
    'Hypertrophic pyloric stenosis',
    'Pediatrics',
    ['pyloric stenosis', 'ihps', 'hypertrophic pyloric stenosis'],
    {
      preop: [
        'Recognize this is a MEDICAL, NOT surgical emergency: repeated projectile non-bilious vomiting causes hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria.',
        'Defer surgery completely until volume resuscitation and serum electrolytes normalize with NS + KCl (target Cl- > 100, HCO3- < 26–28, K+ normal, good urine output).',
      ],
      intraop: [
        'Prior to induction, evacuate gastric contents thoroughly with a large-bore orogastric/nasogastric suction tube in supine, left, and right lateral positions.',
        'Perform rapid sequence or modified gentle RSI with cuffed/appropriately sized ETT; keep anesthesia light-to-balanced (volatile + acetaminophen/local wound infiltration).',
      ],
      avoid: [
        'Proceeding to the operating room with uncorrected severe metabolic alkalosis or hypokalemia (CSF alkalosis + residual anesthetics drive severe postoperative apnea).',
        'Routine long-acting systemic opioids in ex-premature or young infants post-pyloromyotomy.',
      ],
      postop: [
        'Extubate strictly awake once vigorous muscle tone and regular respiratory pattern are restored; monitor continuously for postoperative apnea in PACU/ward.',
      ],
    },
  ),
  subspecialtyEntry(
    'omphalocele-gastroschisis',
    'Omphalocele & gastroschisis',
    'Pediatrics',
    ['omphalocele', 'gastroschisis', 'abdominal wall defect'],
    {
      preop: [
        'Distinguish omphalocele (midline sac-covered defect, strongly associated with congenital heart disease, trisomies, and Beckwith-Wiedemann syndrome/hypoglycemia) from gastroschisis (paraumbilical uncovered bowel with massive evaporative heat/fluid loss).',
        'Wrap exposed bowel in warm sterile saline bowel bag, place OG decompression, pre-warm OR, and check echo/glucose.',
      ],
      intraop: [
        'Replace substantial third-space fluid losses aggressively in gastroschisis while avoiding edema overload; warm all fluids and inspired gases.',
        'During abdominal reduction/closure, closely monitor peak inspiratory pressures, ETCO2, and lower-extremity pulse oximetry/perfusion; coordinate staged silo closure if peak airway pressure exceeds safe limits or venous return drops.',
      ],
      avoid: [
        'Nitrous oxide (distends herniated bowel loops and impedes safe abdominal wall closure).',
        'Forced primary abdominal closure when intra-abdominal pressure causes IVC compression, oliguria, or unacceptably high airway pressures.',
      ],
      postop: [
        'Transport intubated to NICU for ongoing mechanical ventilation, glucose checks, and monitoring for abdominal compartment syndrome.',
      ],
    },
  ),
  subspecialtyEntry(
    'nec-prematurity',
    'Necrotizing enterocolitis (NEC) & prematurity',
    'Pediatrics',
    ['nec', 'necrotizing enterocolitis', 'prematurity', 'premature neonate'],
    {
      preop: [
        'Assess sepsis, severe intravascular hypovolemia, metabolic acidosis, thrombocytopenia/DIC, patent ductus arteriosus, and intraventricular hemorrhage risk.',
        'Pre-warm operating room, check blood availability, and continue umbilical/central access and vasoactive infusions.',
      ],
      intraop: [
        'Use balanced opioid-based anesthesia (fentanyl + low-dose volatile/NMBD) because fragile septic neonates poorly tolerate deep volatile myocardial depression.',
        'Titrate inspired oxygen with air blender to target SpO2 90%–95% in premature neonates (reducing retinopathy of prematurity and bronchopulmonary dysplasia).',
        'Aggressively transfuse RBCs, platelets, and isotonic resuscitation as guided by blood gases and hemodynamics.',
      ],
      avoid: [
        'Nitrous oxide in all circumstances (expands intramural pneumatosis intestinalis and free intraperitoneal gas).',
        'Prolonged 100% FiO2 hyperoxia (risks retinopathy of prematurity) and high-volume hypotonic fluids.',
      ],
      postop: [
        'Keep intubated and return directly to NICU on mechanical ventilation, warmth, vasopressors, and broad antibiotics.',
      ],
    },
  ),
  subspecialtyEntry(
    'foreign-body-aspiration',
    'Pediatric foreign body aspiration',
    'Pediatrics',
    ['fba', 'foreign body aspiration', 'airway foreign body'],
    {
      preop: [
        'Assess onset (cough, wheezing, asymmetric breath sounds, hyperlucency on expiratory CXR from ball-valve effect) and fasting timing.',
        'Coordinate directly with ENT/pediatric surgery before induction to prepare rigid ventilating bronchoscopes and grasping forceps.',
      ],
      intraop: [
        'Perform calm inhalational induction (sevoflurane in 100% O2) or careful titrated TIVA (propofol/remifentanil) maintaining SPONTANEOUS ventilation while ENT passes the rigid ventilating bronchoscope.',
        'Topicalize vocal cords with lidocaine to blunt laryngospasm, and deliver high fresh gas flows via the side-port of the rigid bronchoscope.',
        'Maintain tight vigilance during retrieval in case the object drops in the subglottic larynx and converts partial obstruction into total occlusion.',
      ],
      avoid: [
        'Aggressive positive-pressure ventilation or neuromuscular blockade before bronchoscopic inspection when ball-valve air-trapping or proximal obstruction exists (forces foreign body distally).',
        'Premature extubation before airway suctioning and confirming resolution of bronchospasm.',
      ],
      postop: [
        'Administer dexamethasone for airway instrumentation edema, use humidified oxygen, and observe in PACU for post-bronchoscopy stridor/croup (racemic epinephrine if indicated).',
      ],
    },
  ),
  subspecialtyEntry(
    'rheumatoid-arthritis',
    'Rheumatoid arthritis (C-spine & airway)',
    'Skin & Musculoskeletal',
    ['rheumatoid arthritis', 'ra', 'atlantoaxial subluxation', 'cricoarytenoid arthritis'],
    {
      preop: [
        'Evaluate neck pain, paresthesias, Lhermitte sign, and flexion-extension lateral C-spine radiographs for atlantoaxial subluxation (ADI > 3 mm) risking spinal cord compression.',
        'Examine temporomandibular joint opening, look for hoarseness/stridor from cricoarytenoid arthritis, and evaluate systemic pulmonary/cardiac/steroid involvement.',
      ],
      intraop: [
        'Use awake fiberoptic intubation or gentle video laryngoscopy with strict neutral cervical stabilization when C-spine instability or severe TMJ restriction exists.',
        'Select a smaller endotracheal tube when cricoarytenoid narrowing is suspected and pad all pressure points carefully to protect fragile steroid-thinned skin and deformed joints.',
      ],
      avoid: [
        'Forceful cervical extension or direct laryngoscopy in unstable atlantoaxial subluxation.',
        'Aggressive adhesive tape removal or shear friction on corticosteroid-fragile skin.',
      ],
      postop: [
        'Verify intact extremity motor/sensory function immediately upon emergence and watch closely for post-extubation stridor in patients with cricoarytenoid disease.',
      ],
    },
  ),
  subspecialtyEntry(
    'major-burn-injury',
    'Major thermal burn injury',
    'Skin & Musculoskeletal',
    ['burn injury', 'thermal burn', 'inhalation injury', 'parkland'],
    {
      preop: [
        'Screen urgently for inhalational airway injury (facial burns, singed nasal hairs, carbonaceous sputum, hoarseness, stridor), carboxyhemoglobin/cyanide toxicity, and Parkland crystalloid resuscitation balance.',
        'Prepare heated OR, warmed blood/fluid warmers, and difficult IV/ECG skin-attachment adaptations (stapled/protected leads).',
      ],
      intraop: [
        'Intubate early with an uncut cuffed ETT before massive facial/airway edema obscures anatomy.',
        'Recognize hypermetabolic physiologic shifts: massive early fluid and temperature losses, increased nondepolarizing NMBD resistance (higher dose/frequency needed), and altered opioid/drug binding.',
        'Have blood products and vasopressors ready during painful debridement and tangential excision.',
      ],
      avoid: [
        'Succinylcholine strictly from 24–48 hours post-burn through 1 to 2 years (or until wound healing completes): proliferation of extrajunctional acetylcholine receptors causes massive potassium efflux and cardiac arrest.',
        'Cold ambient OR temperatures or inadequate analgesia.',
      ],
      postop: [
        'Maintain intubation in burn ICU when airway edema or large-volume resuscitation persists, checking cuff leak carefully before extubation.',
      ],
    },
  ),
  subspecialtyEntry(
    'morbid-obesity-bariatric',
    'Morbid obesity, OSA & bariatric surgery',
    'Miscellaneous',
    ['obesity', 'morbid obesity', 'bmi', 'osa', 'bariatric surgery'],
    {
      preop: [
        'Screen with STOP-Bang for OSA, assess obesity hypoventilation syndrome/pulmonary hypertension, difficult mask ventilation predictors, and verify bariatric OR table capacity.',
        'Bring patient home CPAP machine for immediate postoperative recovery use.',
      ],
      intraop: [
        'Position in ramped ("HELP" — ear-to-sternal-notch horizontal) alignment and preoxygenate upright/ramped with PEEP/CPAP to delay rapid oxygen desaturation caused by severely reduced FRC.',
        'Calculate mechanical ventilation tidal volumes strictly on Predicted Body Weight (PBW, never TBW) with PEEP and recruitment maneuvers.',
        'Scale drug dosing thoughtfully by pharmacologic weight scalar (TBW for succinylcholine/sugammadex; LBW/IBW for induction and opioids) using the in-app Dosing calculators.',
      ],
      avoid: [
        'Flat supine induction without ramping, which collapses FRC and accelerates catastrophic hypoxemia.',
        'Calculating tidal volumes from total body weight (causes severe barotrauma) or heavy long-acting opioids post-op.',
      ],
      postop: [
        'Extubate strictly awake in semi-upright position once TOF >= 0.9, apply CPAP early, and favor multimodal opioid-sparing analgesia.',
      ],
    },
  ),
  subspecialtyEntry(
    'geriatric-pocd',
    'Geriatric physiology & postoperative delirium / POCD',
    'Miscellaneous',
    ['geriatric', 'elderly', 'postoperative delirium', 'pocd', 'frailty'],
    {
      preop: [
        'Screen for frailty (Clinical Frailty Scale), baseline cognitive status, polypharmacy, reduced renal/hepatic reserve, and visual/hearing impairments.',
        'Preserve patient glasses and hearing aids until induction and return them promptly upon arrival in PACU.',
      ],
      intraop: [
        'Anticipate reduced anesthetic MAC (~6% per decade after age 40), blunted baroreceptor reflexes, stiffer vasculature, and prolonged elimination half-lives; titrate induction agents slowly.',
        'Maintain tight MAP control, active normothermia, and processed EEG guidance to avoid unnecessarily deep burst suppression.',
      ],
      avoid: [
        'Beers criteria delirium-inducing agents: anticholinergics (scopolamine, diphenhydramine, promethazine), routine benzodiazepines, and meperidine.',
        'Sudden induction overdosing or prolonged deep hypotension.',
      ],
      postop: [
        'Screen proactively using the 4AT tool in PACU/ward, promote early reorientation and mobilization, and prioritize multimodal regional analgesia.',
      ],
    },
  ),
  subspecialtyEntry(
    'perioperative-hypothermia',
    'Accidental perioperative hypothermia',
    'Miscellaneous',
    ['hypothermia', 'core temperature', 'postoperative shivering'],
    {
      preop: [
        'Identify high-risk patients (neonates, elderly, burns, trauma, major open cavity surgery, combined general + neuraxial blocks disrupting hypothalamic/vasoconstriction defenses).',
        'Pre-warm patients with forced-air warming blankets before induction whenever feasible to narrow the core-to-peripheral temperature gradient.',
      ],
      intraop: [
        'Monitor core temperature continuously for all cases exceeding 30 minutes (esophageal, nasopharyngeal, bladder, or tympanic).',
        'Recognize the triphasic drop: rapid initial internal core-to-periphery heat redistribution (first hour), linear heat loss, then plateau.',
        'Deploy active forced-air warming blankets, heated fluid/blood warmers, and warm ambient OR temperatures aggressively.',
      ],
      avoid: [
        'Leaving skin prep pooled underneath drapes, infusing cold fluids/blood during rapid resuscitation, or ignoring core temperature drops (< 36.0 °C).',
      ],
      postop: [
        'Continue forced-air warming in PACU and treat debilitating shivering promptly (warmth, targeted pharmacotherapy) because shivering dramatically surges myocardial oxygen demand, increases wound infection, impairs platelet function, and delays drug metabolism.',
      ],
    },
  ),
];
