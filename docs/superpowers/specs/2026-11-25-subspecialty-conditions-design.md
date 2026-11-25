# Design Specification: Subspecialty Disease Categories (Diseases Tab Expansion)

**Date:** 2026-11-25  
**Status:** Draft (Pending User Review)  
**Feature Branch:** `feat/subspecialty-conditions`  
**Primary Source:** `Anesthesia Considerations for Oral Board Exam` (NotebookLM — *Anesthesia Clinical Guide*)  

---

## 1. Executive Summary & Goals

Expand the offline **Diseases** tab (`src/views/ConditionsView.tsx` + `src/data/conditions/`) to cover the **51 missing high-yield subspecialty disease cards** across the 16 uncovered categories from *"Anesthesia Considerations for Oral Board Exam"* (2 of the 18 categories—**Neuromuscular Disorders** and **Rare Co-existing Diseases**—are already 100% covered in the original 110 Stoelting cards). This increases the Diseases catalog from **134 cards** (`110` Stoelting + `24` Acute Intraoperative Emergencies) to **185 total cards**.

### Architectural & Clinical Constraints
1. **Zero-Duplication Across Existing Cards & Checklists:** None of the 51 added IDs or names duplicate the 110 Stoelting 8e cards or the 24 Acute Intraoperative Emergencies. Where a condition has strong overlap with existing Stoelting entries (e.g., *Perioperative MI* in emergencies, *Anterior Mediastinal Mass* under `svc-syndrome`, *Neuroleptic Malignant Syndrome* under `nms`, *Methemoglobinemia* under `methemoglobinemia`), those remain in place while only missing subspecialty entities are added.
2. **No `mg/kg` Prose Strings:** All 51 cards must obey the `conditions.test.ts` invariant (`not.toMatch(/mg\/kg/)`), keep every bullet > 10 characters, and keep lowercase, deduplicated aliases.
3. **Offline-First & Zero-PHI:** All 51 cards live in bundled TypeScript data modules inside `src/data/conditions/`, searchable offline without network calls or storage.
4. **Source Provenance & Honest Tagging:** All 51 cards cite `'anesthesia-considerations'` in `src/data/sources.ts` (`tier: 3`, `verification: 'secondary'`, `url: PROJECT_NOTEBOOK_URL`), synthesized from standard board-review management principles aligned with the *"Anesthesia Considerations for Oral Board Exam"* category structure and flagged in `accessNote` for clinician sign-off.
5. **Data Versioning:** Bump `DATA_VERSION` in `src/data/sources.ts` from `'2026.11.25-draft26'` to `'2026.11.25-draft27'`.

---

## 2. Gap Analysis (18 Subspecialty Categories vs. Existing 134 Cards)

| # | Subspecialty Category | Covered in Stoelting (110) or Emergencies (24) | Missing Cards Added (51 Total) |
|---|---|---|---|
| 1 | **Airway** | Pierre Robin, Treacher Collins, Goldenhar, Apert, Crouzon, Laryngeal papillomatosis, Tracheomegaly, Klippel-Feil | `ludwig-angina`, `epiglottitis`, `post-thyroidectomy-hematoma` (3) |
| 2 | **Cardiac** | TOF, Eisenmenger, TGA, HLHS, Long QT, Brugada, WPW, Takotsubo, Peripartum cardiomyopathy, Perioperative MI | `aortic-stenosis`, `aortic-regurgitation`, `mitral-stenosis`, `mitral-regurgitation`, `hocm`, `cardiac-tamponade`, `cied-pacemaker-icd` (7) |
| 3 | **Critical Care** | ARDS (Vent tab), Acute intraoperative hypotension | `septic-shock`, `brain-death-donor` (2) |
| 4 | **Endocrinology** | Pheochromocytoma, Carcinoid, Insulinoma, Cushing, Conn, Acromegaly, Perioperative hypoglycemia | `diabetes-dka-hhs`, `hyperthyroidism-thyroid-storm`, `hypothyroidism-myxedema`, `adrenal-insufficiency` (4) |
| 5 | **Hematology** | Thalassemia, Hereditary spherocytosis, G6PD, Sickle cell, Methemoglobinemia, Polycythemia vera, Hemophilia A/B, vWD, Antiphospholipid, Transfusion reaction | `dic`, `hit-thrombocytopenia` (2) |
| 6 | **Hepatic** | Gilbert, Crigler-Najjar, Wilson disease, Hemochromatosis | `cirrhosis-esld`, `acute-liver-failure` (2) |
| 7 | **Miscellaneous** | Achondroplasia, Prader-Willi, Russell-Silver | `morbid-obesity-bariatric`, `geriatric-pocd`, `perioperative-hypothermia` (3) |
| 8 | **Neuroanesthesia** | Moyamoya, Chiari, Tuberous sclerosis, NF1, Huntington, MS, Kearns-Sayre, Autonomic hyperreflexia, ALS, Friedreich ataxia, Increased ICP, Seizure | `traumatic-brain-injury`, `intracranial-aneurysm-sah`, `awake-craniotomy-mass`, `acute-spinal-cord-injury` (4) |
| 9 | **Neuromuscular Disorders** | Myasthenia gravis, Lambert-Eaton, Myotonic dystrophy, Duchenne, Becker, Limb-girdle, FSHD, Oculopharyngeal, Emery-Dreifuss, Nemaline, Myotonia/Paramyotonia, Periodic paralysis, Central core, Centronuclear, Mitochondrial | **0** (100% covered in `neurologic.ts`) |
| 10 | **Obstetrics** | Peripartum cardiomyopathy | `preeclampsia-hellp`, `placenta-accreta-pph`, `amniotic-fluid-embolism` (3) |
| 11 | **Pediatrics** | CDH, EA/TEF, Spina bifida, SMA, Down syndrome | `pyloric-stenosis`, `omphalocele-gastroschisis`, `nec-prematurity`, `foreign-body-aspiration` (4) |
| 12 | **Psychiatric** | Neuroleptic malignant syndrome (`nms`) | `maoi-ssri-serotonin-syndrome`, `lithium-ect`, `substance-use-withdrawal` (3) |
| 13 | **Rare Co-existing Diseases** | Acute porphyria, Lesch-Nyhan, MPS, GSD, Gaucher, Fabry, etc. | **0** (100% covered in `endocrine.ts` & `multisystem.ts`) |
| 14 | **Renal** | Goodpasture, Polycystic kidney, Bartter/Gitelman, Fanconi | `esrd-renal-transplant`, `turp-syndrome` (2) |
| 15 | **Respiratory & Thoracics** | Cystic fibrosis, Primary ciliary dyskinesia, Sarcoidosis, LAM, Anterior mediastinal mass (`svc-syndrome`), Bronchospasm | `copd-bullous-emphysema`, `bronchial-asthma`, `pulmonary-hypertension`, `thoracic-olv` (4) |
| 16 | **Skin & Musculoskeletal** | Epidermolysis bullosa, Pemphigus, Mastocytosis, Scleroderma, Pseudoxanthoma elasticum, Ehlers-Danlos, Marfan, Kyphoscoliosis, Ankylosing spondylitis, Paget, OI, FOP | `rheumatoid-arthritis`, `major-burn-injury` (2) |
| 17 | **Toxicities** | Methemoglobinemia (`methemoglobinemia`), LAST (`last-toxicity`) | `central-anticholinergic-syndrome`, `co-cyanide-toxicity`, `organophosphate-pseudocholinesterase` (3) |
| 18 | **Vascular** | Polyarteritis nodosa, Takayasu, Kawasaki, Wegener/GPA, Behçet | `aortic-aneurysm`, `aortic-dissection`, `carotid-endarterectomy` (3) |

---

## 3. Data Model, Source Registry, File Modularity & UI

### 3.1 Source Registry (`src/data/sources.ts`)
- Bump `DATA_VERSION` to `'2026.11.25-draft27'`.
- Update the existing `anesthesia-considerations` source entry:
  - `scope`: `['24 acute intraoperative emergencies and 51 subspecialty perioperative disease management plans (Pre-op, Intra-op, Avoid, Post-op)']`
  - `accessNote`: Explicitly document that the 18 extracted emergencies + 6 emergency syntheses + 51 subspecialty board cards were aligned with the *"Anesthesia Considerations for Oral Board Exam"* 18-category curriculum pending full clinician sign-off.

### 3.2 Condition Schema Helper (`src/data/conditions/types.ts`)
Add `subspecialtyEntry(...)` beside `entry(...)` and `emergencyEntry(...)`:
```ts
export function subspecialtyEntry(
  id: string,
  name: string,
  category: string,
  aliases: string[],
  plan: ConditionPlan,
  options?: { crisis?: 'mh' | 'last'; checklistId?: CrisisChecklistId },
): ConditionRecord {
  const rec: ConditionRecord = {
    id,
    name,
    aliases,
    category,
    plan,
    sourceIds: ['anesthesia-considerations'],
  };
  if (options?.crisis !== undefined) {
    rec.crisis = options.crisis;
  }
  if (options?.checklistId !== undefined) {
    rec.checklistId = options.checklistId;
  }
  return rec;
}
```

### 3.3 Modular File Organization (`src/data/conditions/`)
To keep every data file focused, readable, and maintainable (avoiding single >1,500-line files), partition the 51 cards across **3 modules** exported and combined in `src/data/conditions/index.ts` and registered in `src/data/conditions/plannedIds.ts`:

1. `src/data/conditions/subspecialtyCardioThoracic.ts` (**19 cards**):
   - **Task 1 (11 cards — Cardiac, Vascular & Pulmonary Circulation):** `aortic-stenosis`, `aortic-regurgitation`, `mitral-stenosis`, `mitral-regurgitation`, `hocm`, `cardiac-tamponade`, `cied-pacemaker-icd` (7 Cardiac); `aortic-aneurysm`, `aortic-dissection`, `carotid-endarterectomy` (3 Vascular); `pulmonary-hypertension` (1 Respiratory & Thoracics).
   - **Task 2 (8 cards — Airway, Thoracics & Critical Care):** `ludwig-angina`, `epiglottitis`, `post-thyroidectomy-hematoma` (3 Airway); `copd-bullous-emphysema`, `bronchial-asthma`, `thoracic-olv` (3 Respiratory & Thoracics); `septic-shock`, `brain-death-donor` (2 Critical Care).
2. `src/data/conditions/subspecialtyNeuroEndo.ts` (**20 cards**):
   - **Task 3 (10 cards — Neuroanesthesia, Psychiatric & Toxicities):** `traumatic-brain-injury`, `intracranial-aneurysm-sah`, `awake-craniotomy-mass`, `acute-spinal-cord-injury` (4 Neuroanesthesia); `maoi-ssri-serotonin-syndrome`, `lithium-ect`, `substance-use-withdrawal` (3 Psychiatric); `central-anticholinergic-syndrome`, `co-cyanide-toxicity`, `organophosphate-pseudocholinesterase` (3 Toxicities).
   - **Task 4 (10 cards — Endocrinology, Hepatic, Renal & Hematology):** `diabetes-dka-hhs`, `hyperthyroidism-thyroid-storm`, `hypothyroidism-myxedema`, `adrenal-insufficiency` (4 Endocrinology); `cirrhosis-esld`, `acute-liver-failure` (2 Hepatic); `esrd-renal-transplant`, `turp-syndrome` (2 Renal); `dic`, `hit-thrombocytopenia` (2 Hematology).
3. `src/data/conditions/subspecialtyPopulations.ts` (**12 cards**):
   - **Task 5 (12 cards — Obstetrics, Pediatrics, Skin & Musculoskeletal, Miscellaneous):** `preeclampsia-hellp`, `placenta-accreta-pph`, `amniotic-fluid-embolism` (3 Obstetrics); `pyloric-stenosis`, `omphalocele-gastroschisis`, `nec-prematurity`, `foreign-body-aspiration` (4 Pediatrics); `rheumatoid-arthritis`, `major-burn-injury` (2 Skin & Musculoskeletal); `morbid-obesity-bariatric`, `geriatric-pocd`, `perioperative-hypothermia` (3 Miscellaneous).

Total added: `11 + 8 + 10 + 10 + 12 = 51` subspecialty cards (`134 + 51 = 185` total cards).

### 3.4 UI Updates (`src/views/ConditionsView.tsx`)
1. **Detail Banner Title:** Update line 52 of `src/views/ConditionsView.tsx`:
   - `c.chapter !== undefined` → `'Textbook summary'`
   - `c.category === 'Acute Intraoperative Emergencies'` → `'Board emergency summary'`
   - Otherwise → `'Board subspecialty summary'`
2. **Intro Caption:** Update line 108 to describe Stoelting 8e rare diseases alongside Acute Intraoperative Emergencies and Subspecialty Perioperative Conditions.
3. **List Badge:** Keep `'Emergency'` (`border-amber-500/60 text-amber-300`) for `c.category === 'Acute Intraoperative Emergencies'`, `'Plan'` (`border-cyan-500/60 text-cyan-300`) for all planned Stoelting & subspecialty cards, and `Ch. ${c.chapter}` for unplanned entries.

---

## 4. Complete 51-Card Catalog & Safety-Critical Invariants

### 4.1 Task 1 (`11` Cards — Cardiac, Vascular & Pulmonary Hypertension)
1. `aortic-stenosis` (`Cardiac`, aliases: `['as', 'calcific aortic stenosis']`) — Preserve preload, sinus rhythm, normal-to-low HR, high/normal SVR; avoid tachycardia, sudden afterload drop (single-shot spinal), and hypotension causing myocardial ischemia.
2. `aortic-regurgitation` (`Cardiac`, aliases: `['ar', 'aortic insufficiency', 'ai']`) — Faster, fuller, forward ("normal-to-mildly elevated HR, mild afterload reduction, maintain preload"); avoid bradycardia (increases regurgitant time) and steep SVR spikes.
3. `mitral-stenosis` (`Cardiac`, aliases: `['ms', 'rheumatic mitral stenosis']`) — Slow HR to allow diastolic LV filling, preserve sinus rhythm and preload, avoid increases in PVR (hypoxia/hypercarbia/acidosis) and sudden tachycardia; watch LA thrombus/AF.
4. `mitral-regurgitation` (`Cardiac`, aliases: `['mr', 'mitral insufficiency']`) — Faster, fuller, forward (maintain mild-elevated HR, lower SVR to favor forward output, preserve preload/contractility); avoid bradycardia and acute hypertension/hypercarbia.
5. `hocm` (`Cardiac`, aliases: `['hypertrophic obstructive cardiomyopathy', 'ihss', 'ash']`) — Maintain preload, slow HR, preserve/increase SVR, mild myocardial depression beneficial; treat hypotension with volume + phenylephrine; avoid inotropes (epinephrine/dobutamine/isoproterenol), tachycardia, hypovolemia, vasodilators.
6. `cardiac-tamponade` (`Cardiac`, aliases: `['pericardial tamponade', 'pericardial effusion']`) — Full, fast, tight ("preserve preload, HR, and contractility/SVR"); awake/ketamine induction maintaining spontaneous ventilation until pericardium drained; avoid positive-pressure high PEEP and myocardial depressants before drainage.
7. `cied-pacemaker-icd` (`Cardiac`, aliases: `['pacemaker', 'icd', 'defibrillator', 'cied']`) — Determine pacemaker dependency and magnet response; disable ICD antitachycardia therapy before monopolar electrocautery; use bipolar cautery or place return pad far from generator; avoid succinylcholine fasciculations causing oversensing and blind magnet reliance without interrogation.
8. `aortic-aneurysm` (`Vascular`, aliases: `['aaa', 'taa', 'abdominal aortic aneurysm', 'thoracic aortic aneurysm']`) — Strict beta-blockade/BP control pre-cross-clamp; prepare vasodilators before aortic cross-clamp and volume + slow clamp release before unclamping (prevent declamping shock); protect spinal cord (lumbar CSF drain for TAA) and renal perfusion.
9. `aortic-dissection` (`Vascular`, aliases: `['type a dissection', 'type b dissection', 'dissecting aneurysm']`) — Immediate anti-impulse therapy lowering dP/dt (IV beta-blocker first — esmolol/labetalol — BEFORE vasodilator such as nicardipine/nitroprusside); arterial line in unaffected extremity; avoid unopposed vasodilator causing reflex tachycardia.
10. `carotid-endarterectomy` (`Vascular`, aliases: `['cea', 'carotid stenosis']`) — Baseline neuro exam; strict normocarbia (avoid hyperventilation causing steal/vasoconstriction); maintain cerebral perfusion pressure at/above baseline during cross-clamp; immediate awake neuro check + watch post-op neck hematoma & hyperperfusion syndrome.
11. `pulmonary-hypertension` (`Respiratory & Thoracics`, aliases: `['pah', 'phtn', 'right heart failure']`) — Continue pulmonary vasodilators (PDE5i, ERAs, prostacyclins); strictly avoid hypoxia, hypercarbia, acidosis, hypothermia, and high PEEP (avoid N2O); support RV perfusion pressure with vasopressin/norepinephrine and inhaled NO/epoprostenol.

### 4.2 Task 2 (`8` Cards — Airway, Thoracics & Critical Care)
12. `ludwig-angina` (`Airway`, aliases: `['deep neck space infection', 'submandibular cellulitis']`) — Rapid airway distortion with floor-of-mouth elevation; prioritize awake fiberoptic intubation (or surgical airway readiness) maintaining spontaneous breathing; avoid supine position, heavy sedation, or NMBDs before securing airway.
13. `epiglottitis` (`Airway`, aliases: `['supraglottitis']`) — Drooling, stridor, tripod posture; summon ENT and prepare awake/inhalational induction keeping spontaneous ventilation with pediatric/adult rigid bronchoscopy & surgical airway ready; avoid agitating child, IV placement before gentle induction in severe obstruction, or paralytics before intubation.
14. `post-thyroidectomy-hematoma` (`Airway`, aliases: `['neck hematoma', 'post-op neck swelling']`) — Stridor, neck tightness, hypoxia after thyroid/parathyroid surgery; immediately open skin sutures/staples at bedside to decompress trachea BEFORE attempting induction; avoid delaying decompression or inducing apnea before relieving hematoma pressure.
15. `copd-bullous-emphysema` (`Respiratory & Thoracics`, aliases: `['copd', 'emphysema', 'chronic bronchitis', 'bullae']`) — Optimize bronchodilators; long expiratory time (low I:E, lower RR) to prevent air-trapping/auto-PEEP; avoid N2O in bullous emphysema (bullae rupture/pneumothorax) and high FiO2 blunting hypoxic drive post-op without monitoring.
16. `bronchial-asthma` (`Respiratory & Thoracics`, aliases: `['asthma', 'reactive airway disease']`) — Pre-op inhaled beta-agonists/steroids; propofol/ketamine/sevoflurane smooth deep induction; treat intra-op wheezing (deepen plane, inhaled bronchodilator); avoid desflurane rapid escalation, histamine-releasing NMBDs/morphine, and non-selective beta-blockers.
17. `thoracic-olv` (`Respiratory & Thoracics`, aliases: `['one-lung ventilation', 'olv', 'dlts', 'thoracotomy']`) — Confirm DLT/bronchial blocker position via fiberoptic bronchoscopy after lateral positioning; treat OLV hypoxemia (100% O2, verify tube position, recruitment + PEEP to dependent lung, CPAP to non-dependent lung); avoid excessive plateau pressures or fluid overload causing post-pneumonectomy edema.
18. `septic-shock` (`Critical Care`, aliases: `['sepsis', 'bacteremia', 'severe sepsis']`) — Early source control, blood cultures, broad antibiotics, dynamic fluid responsiveness; norepinephrine first-line vasopressor (add vasopressin/stress steroids if refractory); ketamine/etomidate titration (or cautious induction) avoiding massive induction drops and fluid overload.
19. `brain-death-donor` (`Critical Care`, aliases: `['organ donor', 'brain death', 'rule of 100s']`) — Hemodynamic/endocrine preservation ("Rule of 100s": SBP, PaO2, UOP targets, normothermia, electrolyte correction); treat spinal cord autonomic/motor reflexes with NMBDs/opioids/volatile; hormone replacement (thyroxine, vasopressin for diabetes insipidus, methylprednisolone); avoid assuming lack of spinal reflex movement means analgesia isn't helpful for surges.

### 4.3 Task 3 (`10` Cards — Neuroanesthesia, Psychiatric & Toxicities)
20. `traumatic-brain-injury` (`Neuroanesthesia`, aliases: `['tbi', 'head trauma', 'subdural hematoma', 'epidural hematoma']`) — Prevent secondary brain injury: avoid hypoxia and even brief hypotension; maintain CPP (MAP - ICP), head up 30 degrees, midline neck, normothermia, normoglycemia, and cervical spine inline stabilization; avoid hypotonic fluids (D5W/LR) and nitrous oxide.
21. `intracranial-aneurysm-sah` (`Neuroanesthesia`, aliases: `['sah', 'subarachnoid hemorrhage', 'cerebral aneurysm', 'vasospasm']`) — Smooth induction preventing transmural pressure spikes (re-rupture) while avoiding severe hypotension; treat vasospasm with euvolemic induced hypertension and continue nimodipine; avoid hyperthermia, hyperglycemia, and excessive PEEP.
22. `awake-craniotomy-mass` (`Neuroanesthesia`, aliases: `['awake craniotomy', 'brain tumor', 'eloquent cortex']`) — Scalp nerve blocks + asleep-awake-asleep or dexmedetomidine/remifentanil sedation; plan airway rescue (LMA/intubation) in Mayfield pins; treat seizures with iced saline irrigation + benzodiazepine/propofol; avoid hypercapnia causing brain bulge and oversedation causing obstruction.
23. `acute-spinal-cord-injury` (`Neuroanesthesia`, aliases: `['acute sci', 'neurogenic shock', 'spinal shock']`) — Manual inline stabilization / video laryngoscopy; treat neurogenic shock (hypotension + bradycardia from loss of cardiac accelerators T1-T4) with fluids + norepinephrine/phenylephrine/atropine and maintain high MAP for cord perfusion; avoid succinylcholine after 24–48 h post-injury (severe hyperkalemia) and unguarded neck extension.
24. `maoi-ssri-serotonin-syndrome` (`Psychiatric`, aliases: `['maoi', 'ssri', 'serotonin syndrome', 'phenelzine', 'tranylcypromine']`) — Screen all MAOI/SSRI/SNRI/linezolid meds; avoid meperidine, tramadol, dextromethorphan, methylene blue, and indirect sympathomimetics (ephedrine -> hypertensive crisis; use direct-acting phenylephrine); distinguish serotonin syndrome (hyperreflexia/clonus) from NMS and treat with cyproheptadine + benzodiazepines + cooling.
25. `lithium-ect` (`Psychiatric`, aliases: `['lithium toxicity', 'electroconvulsive therapy', 'ect']`) — Lithium prolongs both depolarizing and nondepolarizing NMBDs and causes nephrogenic DI; monitor ECT parasympathetic surge (bradycardia/asystole) then sympathetic surge (HTN/tachycardia), protect teeth with bite block, hyperventilate for seizure duration; avoid NSAIDs/thiazides raising lithium levels and excessive methohexital/propofol blunting ECT seizure.
26. `substance-use-withdrawal` (`Psychiatric`, aliases: `['alcohol withdrawal', 'opioid use disorder', 'buprenorphine', 'cocaine']`) — Acute intoxication decreases MAC while chronic alcohol/stimulant use increases MAC; continue methadone/buprenorphine or transition multimodal analgesia; treat alcohol withdrawal with benzodiazepines + thiamine before glucose; avoid unopposed beta-blockade in acute cocaine toxicity and naloxone-precipitated acute withdrawal in chronic opioid therapy.
27. `central-anticholinergic-syndrome` (`Toxicities`, aliases: `['anticholinergic toxicity', 'anticholinergic syndrome', 'physostigmine']`) — "Hot as a hare, blind as a bat, dry as a bone, red as a beet, mad as a hatter" after atropine, scopolamine, antihistamines, TCAs, or promethazine; treat refractory central delirium/agitation with IV physostigmine (crosses BBB); avoid neostigmine/glycopyrrolate (do not cross BBB) and physostigmine in TCA widened-QRS toxicity.
28. `co-cyanide-toxicity` (`Toxicities`, aliases: `['carbon monoxide poisoning', 'cyanide toxicity', 'smoke inhalation', 'nitroprusside toxicity']`) — SpO2 reads falsely normal in CO poisoning (use co-oximetry carboxyhemoglobin); treat CO with 100% normobaric/hyperbaric O2; suspect cyanide in closed-space smoke inhalation or prolonged high-dose sodium nitroprusside causing unexplained lactic acidosis & bright-red venous blood; treat cyanide immediately with hydroxocobalamin (preferred) or thiosulfate/nitrites.
29. `organophosphate-pseudocholinesterase` (`Toxicities`, aliases: `['organophosphate poisoning', 'pseudocholinesterase deficiency', 'dibucaine number', 'cholinergic crisis']`) — Organophosphate SLUDGE/DUMBBBELS treated with early atropine (until secretions dry) + pralidoxime (2-PAM); prolonged paralysis after succinylcholine or mivacurium indicates butyrylcholinesterase deficiency (dibucaine number); avoid succinylcholine and mivacurium in known deficiency and keep patient sedated/ventilated until TOF recovery.

### 4.4 Task 4 (`10` Cards — Endocrinology, Hepatic, Renal & Hematology)
30. `diabetes-dka-hhs` (`Endocrinology`, aliases: `['dka', 'hhs', 'diabetic ketoacidosis', 'diabetes mellitus']`) — Assess cardiac/autonomic neuropathy (gastroparesis -> RSI consideration, orthostasis, silent ischemia) and stiff-joint syndrome (prayer sign -> difficult airway); defer elective surgery in DKA/HHS until acidosis, volume, and potassium corrected; avoid hypoglycemia and prolonged NPO without glucose/insulin monitoring.
31. `hyperthyroidism-thyroid-storm` (`Endocrinology`, aliases: `['thyroid storm', 'graves disease', 'thyrotoxicosis']`) — Achieve euthyroid state before elective surgery; treat thyroid storm urgently with beta-blocker (esmolol/propranolol), PTU/methimazole, iodine (1 h AFTER thionamide), hydrocortisone, and active cooling (no aspirin — displaces T4); avoid ketamine, ephedrine, pancuronium, and atropine; check tracheal deviation/compression and post-op recurrent laryngeal nerve/hypocalcemia.
32. `hypothyroidism-myxedema` (`Endocrinology`, aliases: `['myxedema coma', 'hypothyroid']`) — Severe hypothermia, hyponatremia, bradycardia, pericardial effusion, and blunted hypoxic/hypercapnic drive; defer elective surgery in overt myxedema; give IV levothyroxine + stress hydrocortisone in myxedema coma; avoid heavy premedication, aggressive vasodilators, and rapid warming without fluid support.
33. `adrenal-insufficiency` (`Endocrinology`, aliases: `['addison disease', 'adrenal crisis', 'steroid suppression']`) — Identify chronic systemic steroids or primary adrenal failure; administer perioperative stress-dose hydrocortisone for moderate/major surgery; treat refractory hypotension + hypoglycemia + hyponatremia + hyperkalemia with IV hydrocortisone and saline/dextrose; avoid etomidate (11-beta-hydroxylase inhibition) in septic/at-risk patients.
34. `cirrhosis-esld` (`Hepatic`, aliases: `['cirrhosis', 'portal hypertension', 'esld', 'child pugh', 'meld']`) — Assess MELD/Child-Pugh, ascites (full-stomach/FRC loss -> RSI), hepatopulmonary/portopulmonary syndromes, coagulopathy, and hepatic encephalopathy; preserve hepatic blood flow (avoid halothane, hypotension, severe hyperventilation); use cisatracurium/remifentanil (organ-independent metabolism) and avoid sedative premedication or large acetaminophen/NSAID loads.
35. `acute-liver-failure` (`Hepatic`, aliases: `['fulminant hepatic failure', 'alf']`) — Cerebral edema/high ICP, severe hypoglycemia, coagulopathy, distributive shock, and multi-organ failure; support CPP, infuse dextrose, target normothermia, and check ROTEM/TEG before neuraxial/procedures; avoid hepatotoxic drugs, hypotonic fluids, and aggressive prophylactic FFP without active bleeding when monitoring ICP.
36. `esrd-renal-transplant` (`Renal`, aliases: `['esrd', 'ckd', 'dialysis', 'renal transplant']`) — Check dialysis timing, serum K+ (defer elective surgery if hyperkalemic with ECG changes), anemia, uremic platelet dysfunction, and protect AV fistula arm (no BP cuff, no IVs, pad carefully); avoid succinylcholine if K+ elevated, avoid NSAIDs/meperidine/enflurane, and prefer cisatracurium/atracurium and remifentanil/sevoflurane (adequate FGF).
37. `turp-syndrome` (`Renal`, aliases: `['turp syndrome', 'hyponatremia', 'glycine toxicity']`) — Absorption of hypotonic glycine/sorbitol irrigation causes acute hyponatremia, fluid overload/pulmonary edema, confusion, transient blindness (glycine), and seizures; spinal anesthesia allows early mental status detection; stop surgery, give furosemide, and titrate 3% hypertonic saline slowly only for severe CNS symptoms/seizures (avoid rapid overcorrection risking ODS).
38. `dic` (`Hematology`, aliases: `['disseminated intravascular coagulation', 'consumptive coagulopathy']`) — Diffuse microvascular bleeding + thrombosis (elevated D-dimer/PT/aPTT, low fibrinogen, thrombocytopenia); identify and treat underlying trigger (sepsis, abruption/PPH, AFE, trauma, transfusion reaction); support with fibrinogen/cryoprecipitate, FFP, platelets, RBCs; avoid neuraxial anesthesia and routine antifibrinolytics alone without treating trigger.
39. `hit-thrombocytopenia` (`Hematology`, aliases: `['hit', 'heparin induced thrombocytopenia']`) — Immune-mediated platelet drop (>50% or 5–14 days post-heparin) with paradoxical arterial/venous thrombosis (avoid platelet transfusions unless life-threatening bleeding); immediately stop ALL heparin (including line flushes and coated catheters) and switch to non-heparin anticoagulants (argatroban, bivalirudin, fondaparinux).

### 4.5 Task 5 (`12` Cards — Obstetrics, Pediatrics, Skin & MSK, Miscellaneous)
40. `preeclampsia-hellp` (`Obstetrics`, aliases: `['preeclampsia', 'eclampsia', 'hellp syndrome']`) — Airway edema, labile hypertension, thrombocytopenia, and magnesium infusion; continue magnesium sulfate for seizure prophylaxis (potentiates NMBDs, reduces MAC, blunts uterine tone); use smaller ETT, check platelets before neuraxial (avoid high-dose epinephrine/fluid overload), treat severe HTN (labetalol/hydralazine/nifedipine) and avoid ergot alkaloids (Methergine) in hypertension.
41. `placenta-accreta-pph` (`Obstetrics`, aliases: `['postpartum hemorrhage', 'pph', 'placenta accreta', 'placenta previa', 'uterine atony']`) — Large-bore IV access, type & crossmatch, massive transfusion readiness, and cell salvage; uterotonics (oxytocin, carboprost — avoid in asthma, methylergonovine — avoid in HTN, misoprostol) + early tranexamic acid; avoid single-shot spinal in placenta accreta/active shock and maintain normothermia/calcium during MTP.
42. `amniotic-fluid-embolism` (`Obstetrics`, aliases: `['afe', 'anaphylactoid syndrome of pregnancy']`) — Sudden peripartum hypoxia, cardiovascular collapse (acute RV failure -> LV failure), and severe DIC; 100% O2, immediate intubation, aggressive vasopressors/inotropes + MTP for DIC, immediate perimortem cesarean delivery within minutes if arrest persists; avoid fluid overloading an acutely failing right ventricle.
43. `pyloric-stenosis` (`Pediatrics`, aliases: `['hypertrophic pyloric stenosis', 'ihps']`) — Medical, NOT surgical emergency: hypochloremic, hypokalemic metabolic alkalosis with paradoxical aciduria; normalize volume, chloride, bicarbonate, and potassium with NS + KCl before OR; decompress stomach with OG/NG suction in multiple positions before RSI/modified RSI; avoid surgery before electrolyte resuscitation and avoid opioid respiratory depression post-op (post-op apnea risk).
44. `omphalocele-gastroschisis` (`Pediatrics`, aliases: `['omphalocele', 'gastroschisis', 'abdominal wall defect']`) — Distinguish omphalocele (sac-covered, associated cardiac/Beckwith-Wiedemann anomalies/hypoglycemia) vs gastroschisis (uncovered bowel, severe evaporative fluid & heat loss); warm OR, protect bowel/prevent kinking, place OG decompression; monitor peak airway pressure, abdominal compartment/IVC compression during silo or primary closure, and avoid N2O (bowel distension).
45. `nec-prematurity` (`Pediatrics`, aliases: `['necrotizing enterocolitis', 'nec', 'neonatal prematurity']`) — Severely hypovolemic/septic premature neonate: check PDA, retinopathy of prematurity (target SpO2 90%–95%, avoid hyperoxia), apnea of prematurity, thrombocytopenia/DIC; fluid/blood resuscitation, warmed OR, fentanyl/opioid-based balanced technique; avoid N2O (pneumatosis intestinalis/bowel distension) and excessive FiO2.
46. `foreign-body-aspiration` (`Pediatrics`, aliases: `['fba', 'airway foreign body']`) — Differential obstruction (ball-valve hyperinflation vs complete collapse); coordinate closely with rigid bronchoscopy team, preserve spontaneous ventilation during inhalational/TIVA induction until rigid bronchoscope controls airway; avoid PPV/NMBDs when partial obstruction could convert to complete distal impaction and watch post-op subglottic edema (racemic epinephrine/dexamethasone).
47. `rheumatoid-arthritis` (`Skin & Musculoskeletal`, aliases: `['ra', 'atlantoaxial subluxation', 'cricoarytenoid arthritis']`) — Assess neck pain/neuro signs + flexion/extension C-spine views (atlantoaxial subluxation -> avoid neck extension; awake/video fiberoptic intubation), TMJ limitation, and cricoarytenoid arthritis (hoarseness, smaller ETT, post-op stridor); pad fragile steroid-thinned skin and avoid blind nasal/forceful laryngoscopy.
48. `major-burn-injury` (`Skin & Musculoskeletal`, aliases: `['burn injury', 'thermal burn', 'inhalation injury']`) — Airway edema & smoke/CO/cyanide inhalation: early intubation for stridor, carbonaceous sputum, or facial burns; Parkland fluid resuscitation & aggressive active warming; strictly avoid succinylcholine from 24–48 h post-burn up to 1–2 years (extrashort/proliferative extrajunctional AChRs -> fatal hyperkalemia) and recognize higher nondepolarizing NMBD requirements.
49. `morbid-obesity-bariatric` (`Miscellaneous`, aliases: `['obesity', 'bmi', 'osa', 'bariatric surgery']`) — Ramped ear-to-sternal-notch positioning, CPAP/HFNC preoxygenation (rapid desaturation from low FRC), STOP-Bang/OSA screening; dose induction/opioids/LA thoughtfully by weight scalar and calculate tidal volume strictly on PBW (never TBW); use multimodal opioid-sparing analgesia and avoid supine positioning without ramp or sedatives after extubation.
50. `geriatric-pocd` (`Miscellaneous`, aliases: `['geriatric', 'elderly', 'postoperative delirium', 'pocd']`) — Reduced MAC, decreased renal/hepatic clearance, blunted baroreceptor reserve, frailty (CFS); titrate anesthetics gently, avoid Beers criteria anticholinergics/benzodiazepines/meperidine, maintain normothermia and MAP, screen with 4AT post-op, and optimize hearing/vision aids early.
51. `perioperative-hypothermia` (`Miscellaneous`, aliases: `['hypothermia', 'core temperature', 'shivering']`) — Redistribution drop in first hour after induction causes coagulopathy, surgical site infection, arrhythmias, delayed emergence, and higher post-op O2 consumption from shivering; pre-warm patient, use forced-air warming + fluid warmers + ambient OR warming; avoid cold prep pooling or ignoring core temperature monitoring in cases >30 min.

---

## 5. Testing & Verification Plan
1. **Task-by-Task Count & Integrity Verification (`src/data/__tests__/conditions.test.ts`):**
   - Task 1 updates `CONDITIONS.length` pin to `145` (`134 + 11`), tests `subspecialtyEntry(...)` and `DATA_VERSION === '2026.11.25-draft27'`, and pins Cardiac/Vascular safety lines.
   - Task 2 updates pin to `153` (`145 + 8`); Task 3 updates to `163` (`153 + 10`); Task 4 updates to `173` (`163 + 10`); Task 5 updates final pin to **`185`** (`110` Stoelting + `24` Emergencies + `51` Subspecialty conditions).
   - Verify every new card cites `'anesthesia-considerations'`, has non-empty `c.category`, satisfies `> 10` char bullets, has unique IDs/names/lowercase aliases, and contains zero `/mg\/kg/` strings.
2. **Safety-Critical Assertions:** Add assertions in `conditions.test.ts` pinning critical management rules across Cardiac (`aortic-stenosis`, `hocm`, `cardiac-tamponade`, `aortic-dissection`), Airway/Thoracic (`ludwig-angina`, `post-thyroidectomy-hematoma`, `thoracic-olv`), Neuro/Psych/Tox (`acute-spinal-cord-injury`, `maoi-ssri-serotonin-syndrome`, `co-cyanide-toxicity`), Endo/Renal/Heme (`adrenal-insufficiency`, `hit-thrombocytopenia`, `turp-syndrome`), and OB/Peds/MSK (`preeclampsia-hellp`, `pyloric-stenosis`, `major-burn-injury`, `morbid-obesity-bariatric`).
3. **Full Suite & Build:** At completion of Task 5, run `npm test`, `npm run build` (`tsc -b && vite build`), and verify zero `classGuard.test.ts` or `integrity.test.ts` errors.
