# Perioperative Guide: Design Spec

- **Date:** 2026-11-17
- **Status:** approved in brainstorming, awaiting review of this written spec
- **Replaces:** `pre_anesthesia_assessment_clinic_pwa_blueprint.md` (an untracked draft). Its useful parts are folded in here and its unsafe parts are dropped (see §9).

## 1. Intent

**Audience:** anesthesia doctors and trainees anywhere in the world.

**Goal:** grow AnesthAssist from an intraoperative cognitive aid into a full perioperative assessment and management guide covering pre-op, intra-op, post-op and rapid plan cards for common case types.

**Success criteria:**
- A clinician can go from pre-op assessment to post-op plan in one app, offline.
- Every value is traceable to a named source.
- `npm test` fails on any clinical record without a resolving source.

**Constraints carried over unchanged from the current app:**
- Offline-first PWA. No clinical network calls. No accounts or analytics.
- Patient inputs live in memory only and are cleared by **New case**. Nothing about the patient goes to localStorage.
- No value without a source. A missing value shows `NO_SOURCE_VALUE`.
- Educational and cognitive aid only. Clinical judgment comes first.

## 2. Information architecture

The bottom bar changes from `Dosing · Airway · Vent · Lists` to **`Pre-op · Intra-op · Post-op · Plans`**, with the red **SOS** button unchanged.

| Place | Contents | Origin |
|---|---|---|
| **Pre-op** tab | Assess · Meds · Comorbidities · Fasting · Pre-op note | New. Fasting is the existing NPO checklist. |
| **Intra-op** tab | Sub-views: Dosing · Airway · Vent · Lists | Existing views moved in unchanged |
| **Post-op** tab | PONV (Apfel) · Analgesia plan · PACU discharge (Aldrete, PADSS) · Delirium (4AT) · Emergence list · Handoff | New, plus the existing emergence checklist and handoff |
| **Plans** tab | Rapid plan cards (§5) | New |
| **Library** (header book icon, which already opens References) | Comorbidity reference · Drug reference · Sources and verification · Guideline comparisons | Existing ReferencesView and ReferenceDrugsPanel, plus comorbidity browsing |
| **SOS** | LAST, MH, CICO, plus the QRH crises (anaphylaxis, massive bleeding, bronchospasm, laryngospasm) | Crisis lists move out of the Lists view |

**Where each checklist group goes.** `ChecklistsView` gets a `groups` prop, and each phase renders only its own groups:
- `Pre-op` → Pre-op tab (Fasting step)
- `Machine`, `Airway`, `Ventilation`, `Regional` → Intra-op › Lists
- `Intra/post-op` → shown on both Intra-op › Lists and Post-op
- `Crises` → SOS
- Handoff → Post-op

The biometric header (age, sex, weight, height) stays on every phase tab and is the single input for every score and dose.

**Settings additions:**
- **Units** (`SI` | `conventional`) for creatinine, glucose and Hb. This is persisted as a preference and is not patient data.

## 3. Data model (`src/data/`)

All records follow the existing rules. `sourceIds` must resolve in `sources.ts`, and `integrity.test.ts` enforces it. Two optional fields are added to the new record types:

```ts
why?: string;                                  // one-sentence rationale for trainees, shown on tap
variants?: { sourceId: string; text: string }[]; // conflicting guideline positions, shown side by side
```

There is no global guideline switch. Wherever AHA/ACC, ESC or other guidelines conflict, `variants` shows them side by side, following the existing GLP-1 comparison pattern.

| File | Type | Key fields |
|---|---|---|
| `riskScores.ts` | `RiskScore` | `id, name, items: {id, label, points, derive?}[], bands: {min, label, implication}[], why?, sourceIds` |
| `periopMeds.ts` | `PeriopMedRule` | `id, drugClass, examples[], action: 'continue'\|'hold'\|'modify'\|'individualise', holdBefore?, resume?, conditions?: {neuraxial?, crclBand?, bleedingRisk?}[], why?, variants?, sourceIds` |
| `comorbidities.ts` | `Comorbidity` | `id, name, aliases[], system, workup[], delayTriggers[], goals[], technique[], avoid[], postop[], medRuleIds[], why?, variants?, sourceIds` |
| `postop.ts` | Analgesia and PONV prophylaxis plans | Uses `ChecklistItemRecord` |
| `planCards.ts` | `PlanCard` | See §5 |

**Content of the first scores and rules:**
- **Scores:** RCRI, DASI (or ≥4 METs yes/no), STOP-Bang, ARISCAT, Clinical Frailty Scale, Apfel, Aldrete, PADSS, 4AT.
- **Med rules:** DOACs, warfarin, heparins, antiplatelets (P2Y12, aspirin), GLP-1 RAs, SGLT2 inhibitors (drugs listed separately, because ertugliflozin's hold period differs), ACEi/ARB, insulin and oral hypoglycaemics, corticosteroids (graded by surgical stress), MAOIs, lithium, antiepileptics, antiparkinsonian drugs.

`Comorbidity.medRuleIds` replaces the blueprint's free-text `medsContinue` and `medsHold`. Picking a comorbidity highlights the matching rules in the Meds step.

## 4. Logic (`src/lib/`)

- **`calc/scores.ts`:** a pure `scoreResult(score, answers, biometrics)` returning `{ points, band } | { incomplete: string[] }`.
  - Items with `derive` (age > 50, male, BMI > 35, age ≥ 65 for CFS) take their value from the biometric header and render locked.
  - Missing input gives *incomplete*. Nothing is ever defaulted.
- **`calc/crcl.ts`:** Cockcroft-Gault from the existing weight, age and sex plus one creatinine input.
  - Which weight it uses is documented and sourced.
  - It outputs a band, which feeds `PeriopMedRule.conditions.crclBand`.
- **`calc/units.ts`:** the single conversion point. Creatinine is converted at µmol/L = mg/dL × 88.4, glucose at mmol/L = mg/dL ÷ 18, and Hb at g/L = g/dL × 10. All calculations use SI.
- **`preopNote.ts`:** a pure `buildPreopNote(input)`, shaped like `buildHandoffSummary()`.
  - It includes **age, sex, weight, height, BMI and creatinine** (approved), the ASA class (with E as a separate flag), every score's result and band, the med instructions, the comorbidity plans and the fasting status.
  - Each line ends with its source tag.
  - It has **no free-text fields**.
  - The note is never stored. It reaches the clipboard only on a user tap.
- **`copyText.ts`:** the existing `copyText` moves out of `ChecklistsView.tsx` so the handoff and the pre-op note can share it. It awaits the clipboard and falls back if that fails.
- The intra-op **handoff keeps its current no-biometrics rule**, unchanged.

## 5. Rapid plan cards (`planCards.ts`)

```ts
interface PlanCard {
  id: string; title: string; population: string; why?: string;
  phases: Record<'preop' | 'induction' | 'maintenance' | 'emergence' | 'redFlags', ChecklistItemRecord[]>;
  links: { drugIds?: string[]; ventScenarioId?: string; checklistIds?: string[];
           comorbidityIds?: string[]; airway?: 'adult' | 'pediatric' };
}
```

- **Links, not copies:** cards link to existing content and never retype doses. Tapping a link opens the matching Intra-op view (Dosing filtered to `drugIds`, Vent on `ventScenarioId`, and so on).
- **Empty phases:** a phase with no sourced item shows `NO_SOURCE_VALUE`.
- **First batch:**
  1. Paediatric
  2. Obstetric: CS under neuraxial
  3. Obstetric: GA for CS and failed obstetric intubation
  4. Elderly/frail
  5. Obesity (BMI ≥ 40)
  6. RSI/full stomach
- **Later batches:** day-case, trauma, neuro, thoracic, cardiac, ENT shared airway.
- **Paediatric constraint:** calculated dosing stays withheld under 18. The paediatric card shows the printed paediatric lines from `referenceDrugs.ts` (reference only, never calculated) and the existing paediatric ETT and LMA sizing.

## 6. UI

- **Pre-op tab:** a vertical flow of collapsible steps. Each step header shows its current result (for example "RCRI 2 · elevated"), so the user can jump straight to any step.
  - **Assess:** ASA picker with an E toggle, surgical risk grade, RCRI, functional capacity, STOP-Bang, CFS (shown when age ≥ 65), ARISCAT.
  - **Meds:** class toggles. Each shows its action, timing, resumption and conditions, with `variants` side by side where guidelines conflict.
  - **Comorbidities:** a simple filter over name and aliases, with no search library. Picking one adds its plan and highlights its `medRuleIds`.
  - **Fasting:** the existing NPO checklist.
  - **Note:** a preview plus a Copy button.
- **Post-op tab:** Apfel with its prophylaxis plan, the analgesia plan, Aldrete or PADSS with the discharge threshold, 4AT, the emergence checklist and the handoff.
- **Reuse:** the HUD `Panel`, `ChecklistItem`, `SegmentedControl`, `SourceBadge`, `NoSourceValue` and `useDialogFocus` components, plus the existing touch-target and contrast conventions (48 px minimum, `aria-pressed` on toggles).

## 7. Content pipeline

1. **Draft:** NotebookLM ("Anesthesia nootbooks") drafts records in the TypeScript shape from §3 or §5, using **source IDs from `sources.ts`**, never free-text citations. A missing source is added to `sources.ts` first, with honest `verification` and `accessNote` values.
2. **Review:** drafts land on a branch as a PR. A clinician's review in the PR is the sign-off, and merging is the approval. No draft flag ships, so unreviewed content never reaches users.
3. **Test:** `npm test` rejects any record with an unresolved or missing source, or a dangling `medRuleId` or link id.
4. **Version:** every content PR bumps `DATA_VERSION`.

**Facts to re-check in review.** These blueprint claims were flagged in the audit:
- **MG and sugammadex:** the blueprint's "10–20% standard dose" looks wrong. Reduced dosing usually applies to rocuronium, not sugammadex.
- **GLP-1 weekly agents:** the blueprint's "hold 1 week" predates the 2024 multisociety guidance.
- **SGLT2 hold durations:** AHA/ACC 2024 says to stop 3–4 days before surgery, while the FDA labels give 3 days, or 4 for ertugliflozin. Encode both as `variants`.
- **ACEi/ARB:** the exact wording of the 2024 AHA/ACC recommendation.
- **Steroid stress dosing:** this is graded by surgical stress, not a single dose.

## 8. Testing

- **Scores:** each score is tested at every band edge (RCRI 0/1/2/≥3, STOP-Bang 2/3/5, Apfel 0–4, ARISCAT 26/45, CFS ≥5, Aldrete ≥9, and so on), plus locking of derived items and *incomplete* on missing input.
- **CrCl and units:** Cockcroft-Gault is checked against published worked examples, and unit conversions round-trip.
- **Integrity:** `integrity.test.ts` is extended to the new files.
  - Every `sourceId` resolves and every `medRuleIds` or `links` id exists.
  - Band thresholds are ascending.
  - Every plan card has all five phases.
- **Pre-op note:** `buildPreopNote` is tested on a fixed input against the expected lines, and the input type has no free-text string field.
- **Migration:** the persisted `activeTab` maps old values to new ones in `migratePersisted` (`dosing`/`airway`/`ventilation` → `intraop` plus that sub-view, `checklists` → `intraop` › Lists), with a test case added to `migrate.test.ts`.
- **Every PR:** `npm run verify` must pass.

## 9. Dropped from the blueprint

| Dropped | Why |
|---|---|
| Separate `preop-pwa` app | It duplicates the PWA, store, sources and tests that already exist |
| Gemini `/api/disease-lookup` and localStorage disease cache | It makes a clinical network call, sends query text off the device, and caches unsourced AI output as if it were vetted |
| MiniSearch | A plain filter is enough for about 100 records |
| Tailwind v4 | The app uses Tailwind 3, and one stack is enough |
| Default patient values (age 55, BMI 28, ASA II) | Unedited defaults would print into the note. Fields start blank and missing input reads *incomplete*. |
| Free-text `sources` and med strings | Replaced by `sourceIds` and `medRuleIds` |
| Hand-ticked STOP-Bang items for age, sex and BMI | These are derived from the biometric header |
| `ASA 'E'` as a class | E is a modifier flag |

**Out of scope:** calculated paediatric dosing (its own sub-project), UI translation, accounts and sync, and any runtime AI or network content.

## 10. Rollout

Each step is one PR and ships on its own.

**Already done (2026-11-17):**
- The 12 core sources are registered in `sources.ts`: RCRI, DASI, STOP, ARISCAT, CFS, Apfel, Aldrete, PADSS, 4AT, AHA/ACC 2024, ESC 2022 and ASRA 2025.
- Each was confirmed by web search, with `verification: 'secondary'` and the working thresholds written in `scope` and `accessNote`.
- They are on `SOURCES_WITHOUT_DERIVED_VALUES` until records cite them. Each PR that encodes a record removes its id from that list.
- Not yet registered: the SGLT2 FDA labels, OAA/DAS obstetric, and the CFS 2.0 and STOP-Bang cut-off papers. Each content PR adds these before its records.

1. **Navigation redesign:** the new tabs, existing views moved, Library in the header, crises in SOS, `copyText` moved to `lib/`, the tab migration and the units setting. No new clinical content.
2. **Assess:** scores and CrCl.
3. **Peri-op meds.**
4. **Plan cards**, first batch.
5. **Post-op tools.**
6. **Pre-op note**, plus the README privacy section updated for the note's biometrics.
7. **Comorbidities**, in batches of about ten through the §7 pipeline.
