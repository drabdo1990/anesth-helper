# Design Specification: Acute Intraoperative Emergencies (Diseases Tab Expansion)

**Date:** 2026-11-25  
**Status:** Draft (Pending User Review)  
**Feature Branch:** `feat/acute-intraop-emergencies`  
**Primary Source:** `Anesthesia Considerations for Oral Board Exam` (NotebookLM — *Anesthesia Clinical Guide*)  

---

## 1. Executive Summary & Goals

Expand the offline **Diseases** tab (`src/views/ConditionsView.tsx` + `src/data/conditions/`) by adding **24 Acute Intraoperative Emergency** cards from the user's NotebookLM source *"Anesthesia Considerations for Oral Board Exam"*, increasing the Diseases catalog from **110** Stoelting 8e rare-disease cards to **134 total cards** (`110` Stoelting + `24` Acute Intraoperative Emergencies; *Malignant Hyperthermia* is already covered by `mh-susceptibility`).

### Architectural & Clinical Constraints
1. **Offline-First & Zero-PHI:** All 24 emergency cards live in bundled TypeScript data (`src/data/conditions/emergencies.ts`), searchable offline with no storage of queries or clinical entries.
2. **No Duplicated Drug Math:** Crisis prose cards must **never** include raw `mg/kg` calculations (`conditions.test.ts` enforces `not.toMatch(/mg\/kg/)`). Where the app already calculates crisis drug doses (**SOS › LAST**) or provides step-by-step QRH crisis checklists (**Intra-op › Lists › Crises** for Anaphylaxis, Bronchospasm, Laryngospasm), the card links directly to those tools via an interactive button.
3. **Explicit Attribution & Honest Provenance:** Every new card cites `'anesthesia-considerations'` in `src/data/sources.ts` (`tier: 3`, `verification: 'secondary'`, `url: PROJECT_NOTEBOOK_URL`). Eighteen entries were extracted directly from NotebookLM on 2026-11-25; six entries where NotebookLM timed out (`dental-injury`, `extravasation-injury`, `fat-embolism`, `intraop-hypertension`, `intraop-hypoglycemia`, `intraop-hypotension`) are drafted from standard oral-board clinical management principles and flagged in `accessNote` for clinician review before clinical use.
4. **Data Versioning:** Bump `DATA_VERSION` in `src/data/sources.ts` from `'2026.11.17-draft25'` to `'2026.11.25-draft26'`.

---

## 2. Source Registry & Data Model Changes

### 2.1 Source Registration (`src/data/sources.ts`)
- Bump `DATA_VERSION` to `'2026.11.25-draft26'`.
- Register a new Tier 3 entry in `SOURCES`:
  ```ts
  {
    id: 'anesthesia-considerations',
    tag: 'Anesthesia Considerations',
    name: 'Anesthesia Considerations for Oral Board Exam',
    publisher: 'Project NotebookLM (Anesthesia Clinical Guide)',
    year: 'current at build',
    url: 'https://notebooklm.google.com/notebook/1ce36864-79d5-4dbc-b3fa-51b63c6a401f',
    tier: 3,
    scope: ['24 acute intraoperative emergency management plans (Pre-op, Intra-op, Avoid, Post-op)'],
    verification: 'secondary',
    accessNote:
      'Eighteen emergency summaries were extracted via NotebookLM on 2026-11-25; six entries (dental injury, extravasation injury, fat embolism, intraoperative hypertension, hypoglycemia, hypotension) timed out during extraction and were synthesized from standard perioperative board-review principles pending clinician review.',
  }
  ```
- Because `url` is populated, the existing `noUrl` pin in `src/data/__tests__/integrity.test.ts` requires no modification.

### 2.2 Condition Type Extensions (`src/data/conditions/types.ts`)
- Make `chapter?: number` optional on `ConditionRecord` (all 110 Stoelting records still supply `chapter: number`).
- Add `category?: string` on `ConditionRecord` (set to `'Acute Intraoperative Emergencies'` for the 24 new cards).
- Extend `crisis?: 'mh' | 'last'` to support opening the SOS overlay directly to the **LAST** panel (`openEmergency('last')`) from `last-toxicity`.
- Add `checklistId?: 'crisis-anaphylaxis' | 'crisis-bronchospasm' | 'crisis-laryngospasm'` to link directly to the matching QRH crisis checklist under `Intra-op › Lists › Crises`.
- Add helper `emergencyEntry(id, name, aliases, plan, options?: { crisis?: 'mh' | 'last'; checklistId?: 'crisis-anaphylaxis' | 'crisis-bronchospasm' | 'crisis-laryngospasm' }): ConditionRecord` setting `category: 'Acute Intraoperative Emergencies'` and `sourceIds: ['anesthesia-considerations']`.

### 2.3 Derived Index (`src/data/derived.ts`)
- Update the `CONDITIONS` loop in `derivedValuesBySource()`:
  ```ts
  for (const c of CONDITIONS) {
    const loc = c.chapter !== undefined ? `ch. ${c.chapter}` : c.category ?? 'reference';
    add(c.sourceIds, c.plan ? `Condition plan: ${c.name} (${loc})` : `Condition list entry, no plan yet: ${c.name} (${loc})`);
  }
  ```

---

## 3. Navigation & UI Changes

### 3.1 Store Cross-Link (`src/store/useAppStore.ts` & `src/views/ChecklistsView.tsx`)
- Add non-persisted (volatile) navigation state in `useAppStore`:
  - `requestedChecklistId: string | null` (initial `null`, never added to `partialize`).
  - `openChecklist: (checklistId: string) => void` → sets `{ activeTab: 'intraop', intraopView: 'lists', requestedChecklistId: checklistId }`.
  - `clearRequestedChecklist: () => void` → sets `{ requestedChecklistId: null }`.
- In `ChecklistsView.tsx`, add a `useEffect` watching `requestedChecklistId`: when `phaseLists` contains that ID, switch `group` to `match.group` (`'Crises'`), set `sub` to `match.id`, and call `clearRequestedChecklist()`.

### 3.2 Conditions UI (`src/views/ConditionsView.tsx`)
- Update `chapterLine(c)`:
  - If `c.chapter !== undefined`: `Stoelting's Anesthesia and Co-Existing Disease, 8th edition (2022), chapter ${c.chapter}: ${STOELTING_CHAPTERS[c.chapter]}.`
  - Otherwise: `Anesthesia Considerations for Oral Board Exam — ${c.category ?? 'Clinical Reference'}.`
- In list rows (`ConditionsView` list view):
  - Show `'Emergency'` pill for entries where `c.category === 'Acute Intraoperative Emergencies'` (using existing slate/amber/cyan theme-safe badge tokens — never `-400` text accents, `text-slate-950`, or raw hex colors so `classGuard.test.ts` stays green).
  - Keep `'Plan'` (or `Ch. ${c.chapter}`) for Stoelting entries.
- In `<Detail />`:
  - Render the SOS crisis button when `c.crisis === 'mh'` (`Open MH crisis steps`) or `c.crisis === 'last'` (`Open LAST crisis steps`).
  - Render a cyan action button (`Open Crisis Checklist in Lists`) when `c.checklistId` is defined, calling `openChecklist(c.checklistId)`.

---

## 4. Complete Specification of the 24 Emergency Cards (`src/data/conditions/emergencies.ts`)

| # | ID | Display Name | Aliases | Cross-Link | Key Critical Lines (No `mg/kg` in Prose) |
|---|---|---|---|---|---|
| 1 | `airway-fire` | Airway fire | `['or fire', 'endotracheal fire', 'laser airway fire']` | — | Remove ETT, turn off O2/N2O immediately, flood field with saline, extinguish debris in water, bronchoscopy post-op |
| 2 | `anaphylaxis` | Perioperative anaphylaxis | `['anaphylactic shock', 'allergic reaction']` | `checklistId: 'crisis-anaphylaxis'` | Discontinue suspected trigger, 100% O2, rapid crystalloids, early IV epinephrine titration; serial tryptase at 0, 1–2 h, 24 h |
| 3 | `aspiration-event` | Pulmonary aspiration of gastric contents | `['aspiration', 'mendelson syndrome', 'gastric aspiration']` | — | Trendelenburg, oropharyngeal suction, 100% O2 + PEEP; avoid large-volume bronchial lavage or routine prophylactic antibiotics |
| 4 | `bronchospasm` | Acute intraoperative bronchospasm | `['bronchospasm', 'status asthmaticus']` | `checklistId: 'crisis-bronchospasm'` | 100% O2, deepen anesthesia, inhaled/IV bronchodilators; avoid rapid desflurane spikes and auto-PEEP |
| 5 | `compartment-syndrome` | Extremity & abdominal compartment syndrome | `['compartment syndrome', 'well leg syndrome']` | — | Remove constrictive casts/dressings, keep limb at heart level (do not elevate above heart), urgent fasciotomy; pulses persist late |
| 6 | `delayed-emergence` | Delayed emergence from general anesthesia | `['delayed awakening', 'prolonged emergence']` | — | Verify ventilation/PaCO2, TOF neuromuscular status, glucose, temperature before blind reversal; head CT if stroke suspected |
| 7 | `dental-injury` | Perioperative dental injury | `['tooth avulsion', 'broken tooth', 'dental trauma']` | — | Document pre-op loose dentition; retrieve avulsed fragments, store permanent tooth in saline/milk, avoid blind suctioning, urgent dental consult |
| 8 | `extravasation-injury` | IV extravasation injury | `['extravasation', 'vasopressor extravasation', 'infiltration']` | — | Stop infusion immediately, leave cannula briefly to aspirate, remove catheter, elevate limb, targeted antidote (e.g., phentolamine for catecholamines) |
| 9 | `fat-embolism` | Fat embolism syndrome | `['fes', 'fat embolism']` | — | Early long-bone fracture stabilization; recognize triad (hypoxemia, neurologic change, petechiae), supportive 100% O2 + hemodynamics; avoid routine steroids |
| 10 | `intraop-hypertension` | Acute intraoperative hypertension | `['intraoperative hypertension', 'hypertensive crisis']` | — | Rule out light anesthesia, pain, hypercapnia, hypoxemia, bladder distension, or pheochromocytoma before escalating vasodilators; titrate IV antihypertensives |
| 11 | `intraop-hypoglycemia` | Perioperative hypoglycemia | `['hypoglycemia', 'low blood glucose']` | — | Check POC glucose regularly in insulin-treated or neonatal patients; recognize masked neuroglycopenia under GA, give IV dextrose bolus + frequent rechecks |
| 12 | `intraop-hypotension` | Acute intraoperative hypotension | `['intraoperative hypotension', 'shock']` | — | Verify cuff/transducer & rhythm, lighten volatile, 100% O2, fluid challenge & vasopressor; treat etiology (bleeding, tamponade, anaphylaxis, sepsis, tension PTX) |
| 13 | `intraop-hypoxemia` | Acute intraoperative hypoxemia | `['hypoxemia', 'desaturation']` | — | Verify SpO2 waveform, switch to 100% O2, hand-ventilate to gauge compliance, auscultate bilaterally to exclude mainstem intubation or disconnect |
| 14 | `increased-airway-pressure` | Elevated airway pressure | `['high peak pressure', 'increased airway pressure', 'high plateau pressure']` | — | Hand-bag to separate circuit/ETT obstruction from patient compliance; check kinks, secretions, bronchospasm, pneumothorax; do not bag against uninvestigated resistance |
| 15 | `increased-icp` | Acute intracranial hypertension (increased ICP) | `['increased icp', 'intracranial hypertension', 'cerebral edema']` | — | Recognize Cushing triad or tight brain; 100% O2, mild hypocapnia, 30-degree head-up, osmotic diuresis; avoid hypoxia, hypercapnia, high PEEP, tight ETT ties |
| 16 | `laryngospasm` | Laryngospasm | `['laryngeal spasm', 'stridor']` | `checklistId: 'crisis-laryngospasm'` | Clear secretions, 100% O2 + CPAP, Larson maneuver (jaw thrust + styloid notch pressure), low-dose IV propofol/succinylcholine if refractory; watch for NPPE |
| 17 | `last-toxicity` | Local anesthetic systemic toxicity (LAST) | `['last', 'local anesthetic toxicity']` | `crisis: 'last'` | Stop injection, call for LAST kit, 100% O2, 20% lipid emulsion via SOS calculator; avoid propofol as lipid substitute, avoid vasopressin and CCBs |
| 18 | `perioperative-mi` | Perioperative myocardial infarction | `['pmi', 'myocardial infarction', 'acute coronary syndrome', 'stemi']` | — | Continue baseline beta-blocker/statin pre-op; treat ST changes/ischemia with 100% O2, rate & MAP control, nitroglycerin; obtain 12-lead ECG & serial troponins |
| 19 | `povl` | Postoperative visual loss (POVL) | `['povl', 'ischemic optic neuropathy', 'blindness']` | — | Prone spine & cardiac risk; keep globes completely free of external pressure, avoid horseshoe headrests and prolonged deliberate hypotension; urgent ophthalmology |
| 20 | `perioperative-seizure` | Perioperative seizure | `['seizure', 'status epilepticus', 'convulsions']` | — | Continue baseline antiepileptics; 100% O2, airway protection, IV benzodiazepine/propofol; do not mask seizures with NMBDs alone; check glucose/electrolytes/EEG |
| 21 | `tension-pneumothorax` | Tension pneumothorax | `['pneumothorax', 'tension ptx']` | — | Unilateral absent breath sounds, high PIP, hypotension, tracheal shift; emergent needle decompression then chest tube; avoid N2O and delaying for CXR |
| 22 | `total-spinal` | Total spinal / high neuraxial block | `['total spinal', 'high spinal']` | — | Test dose & incremental dosing; rapid ascending block, apnea, severe bradycardia/hypotension; intubate, 100% O2, fluids/epinephrine; avoid steep reverse Trendelenburg |
| 23 | `transfusion-reaction` | Acute transfusion reaction | `['transfusion reaction', 'ahtr', 'trali', 'taco']` | — | Two-person check; stop transfusion immediately on hypotension, fever, oozing, or hemoglobinuria; hydrate, send bag/tubing & blood/urine to blood bank |
| 24 | `venous-air-embolism` | Venous air embolism (VAE) | `['vae', 'air embolism']` | — | Precordial Doppler/TEE for sitting/craniotomy cases; abrupt ETCO2 drop + millwheel murmur; flood field with saline, off N2O, 100% O2, Durant (LLD Trendelenburg) & CVC aspiration |

*(All 24 cards follow Stoelting-style 4-section layout: `preop`, `intraop`, `avoid`, `postop`, each with 2–4 concise lines > 10 characters and zero `mg/kg` strings.)*

---

## 5. Testing & Verification Plan
1. Update `src/data/__tests__/conditions.test.ts`:
   - Pin total `CONDITIONS.length` to `134`.
   - Allow records to cite either `stoelting-8e` (with valid `STOELTING_CHAPTERS[c.chapter]`) OR `anesthesia-considerations` (with non-empty `c.category`).
   - Add safety-critical assertion block covering new emergency invariants (`airway-fire` halting O2/N2O and removing ETT; `tension-pneumothorax` avoiding N2O and needle decompression; `venous-air-embolism` Durant/saline flood/no N2O; `transfusion-reaction` stopping transfusion & keeping bag; `total-spinal` avoiding steep reverse Trendelenburg; `last-toxicity` cross-linking `crisis: 'last'`; `anaphylaxis`/`bronchospasm`/`laryngospasm` cross-linking their `checklistId`).
2. Update `src/store/` tests (or add a unit test) verifying `openChecklist()` switches to `intraop` / `lists` and sets `requestedChecklistId` without persisting to `localStorage` (Zero-PHI/clean state check).
3. Run full `npm test`, `npm run build` (`tsc -b && vite build`), and `classGuard.test.ts` — expecting 100% pass with zero errors.
