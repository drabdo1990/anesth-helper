# Subspecialty Disease Categories (Diseases Tab) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 51 missing subspecialty perioperative disease management cards across 16 uncovered subspecialty categories from *"Anesthesia Considerations for Oral Board Exam"* into the offline **Diseases** tab, expanding the catalog from **134** to **185 total cards**.

**Architecture:** Add a `subspecialtyEntry(...)` helper in `src/data/conditions/types.ts`, update `DATA_VERSION` (`'2026.11.25-draft27'`) and `anesthesia-considerations` scope in `src/data/sources.ts`, partition the 51 cards across three focused data modules (`subspecialtyCardioThoracic.ts`, `subspecialtyNeuroEndo.ts`, `subspecialtyPopulations.ts`) wired into `src/data/conditions/index.ts` and `plannedIds.ts`, and update `ConditionsView.tsx` banner copy.

**Tech Stack:** React 19, TypeScript 5.7, Tailwind CSS 3.4, Vitest 4.

**Spec:** [docs/superpowers/specs/2026-11-25-subspecialty-conditions-design.md](file:///e:/coding-agents-files/antigravity/anesth-helper/docs/superpowers/specs/2026-11-25-subspecialty-conditions-design.md)

## Global Constraints

- Update `DATA_VERSION` in `src/data/sources.ts` from `'2026.11.25-draft26'` to `'2026.11.25-draft27'`.
- Every card must cite `'anesthesia-considerations'`, carry a non-empty `category`, have unique `id` and case-insensitive unique `name`, and use lowercase deduplicated `aliases`.
- Every plan section (`preop`, `intraop`, `avoid`, `postop`) must contain at least 1 item, every bullet must exceed `10` trimmed characters, and **zero** strings in any plan may contain `mg/kg` (`conditions.test.ts` fails on `/mg\/kg/`).
- Do not modify or remove any of the existing 110 Stoelting 8e cards or 24 Acute Intraoperative Emergencies.
- Preserve theme class guard compliance in `ConditionsView.tsx` (`classGuard.test.ts` forbids `text-slate-950`, raw hex `#090d16` / `#131b2e`, `text-<accent>-400`, and `hover:text-white`).

## Review Focus

1. **Zero `mg/kg` prose violations:** None of the 51 subspecialty plans (e.g., burn fluid formulas, TURP saline, local anesthetics, or pediatric opioids) may include the substring `mg/kg`.
2. **Duplicate ID or name collisions:** Verify none of the 51 new names match existing Stoelting names case-insensitively (e.g., use `'Bronchial asthma'`, `'COPD & bullous emphysema'`, `'Pulmonary hypertension & right heart failure'`, `'Aortic stenosis (severe)'` cleanly).
3. **Banner distinction in `ConditionsView.tsx`:** Cards with `chapter === undefined` and `category === 'Acute Intraoperative Emergencies'` keep `'Board emergency summary'`, while the 51 subspecialty cards show `'Board subspecialty summary'`.
4. **`PLANNED_CONDITION_IDS` sync:** Every card in all 3 new modules must also be appended to `src/data/conditions/plannedIds.ts` so `conditions.test.ts` passes (`CONDITIONS.filter((c) => c.plan)` equals `PLANNED_CONDITION_IDS`).
5. **Derived source indexing (`src/data/derived.ts`):** All 51 cards must aggregate cleanly under `'anesthesia-considerations'` with category labels (`Condition plan: <Name> (<Category>)`).

---

### Task 1: Schema Helper, Source Update, and Cardiac/Vascular/Pulmonary HTN Cards (11 Cards -> 145 Total)

**Files:**
- Modify: `src/data/sources.ts:6,1330-1334`
- Modify: `src/data/conditions/types.ts:77-99`
- Create: `src/data/conditions/subspecialtyCardioThoracic.ts` (Part 1: 11 cards)
- Modify: `src/data/conditions/plannedIds.ts:144-146`
- Modify: `src/data/conditions/index.ts:1-29`
- Test: `src/data/__tests__/conditions.test.ts:11-58`

**Interfaces:**
- Consumes: `ConditionPlan`, `ConditionRecord`, `CrisisChecklistId` from `src/data/conditions/types.ts`.
- Produces: `subspecialtyEntry(...)` helper; `SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS` (11 cards) exported from `src/data/conditions/index.ts`; `DATA_VERSION = '2026.11.25-draft27'`.

- [ ] **Step 1: Write the failing tests in `src/data/__tests__/conditions.test.ts`**

Update lines 1–18 and the `emergencyEntry` block (around lines 39–57) in `src/data/__tests__/conditions.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { CONDITIONS, PLANNED_CONDITION_IDS, STOELTING_CHAPTERS, emergencyEntry, subspecialtyEntry } from '../conditions';
import { DATA_VERSION, SOURCE_BY_ID } from '../sources';
```
Replace lines 11–18 with:
```ts
  it('holds 110 Stoelting, 24 emergency, and 11 cardiac/vascular subspecialty conditions (145 total)', () => {
    expect(CONDITIONS.length).toBe(145);
  });

  it('uses updated data version 2026.11.25-draft27 and registers anesthesia-considerations', () => {
    expect(DATA_VERSION).toBe('2026.11.25-draft27');
    expect(SOURCE_BY_ID['anesthesia-considerations']).toBeDefined();
  });
```
And right after the `emergencyEntry` test, add:
```ts
  it('subspecialtyEntry assigns custom subspecialty category cleanly', () => {
    const sample = subspecialtyEntry(
      'sample-sub',
      'Sample subspecialty',
      'Cardiac',
      ['sample card'],
      {
        preop: ['Preop line > 10 chars'],
        intraop: ['Intraop line > 10 chars'],
        avoid: ['Avoid line > 10 chars'],
        postop: ['Postop line > 10 chars'],
      },
    );
    expect(sample.category).toBe('Cardiac');
    expect(sample.chapter).toBeUndefined();
    expect(sample.sourceIds).toEqual(['anesthesia-considerations']);
  });
```
Inside `describe('condition plans', ...)`, append:
```ts
  it('keeps cardiac, vascular, and pulmonary hypertension safety lines', () => {
    expect(text(plan('aortic-stenosis').avoid)).toMatch(/tachycardia/i);
    expect(text(plan('hocm').avoid)).toMatch(/inotropes|epinephrine/i);
    expect(text(plan('cardiac-tamponade').intraop)).toMatch(/spontaneous ventilation/i);
    expect(text(plan('aortic-dissection').intraop)).toMatch(/beta-blocker/i);
    expect(text(plan('pulmonary-hypertension').avoid)).toMatch(/hypoxia/i);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/conditions.test.ts`  
Expected: FAIL (`subspecialtyEntry is not exported` / `expected 134 to be 145`).

- [ ] **Step 3: Update `src/data/sources.ts` and `src/data/conditions/types.ts`**

1. In `src/data/sources.ts`:
   - Change line 6 to: `export const DATA_VERSION = '2026.11.25-draft27';`
   - Update lines 1330–1333 on `anesthesia-considerations`:
     ```ts
     scope: ['24 acute intraoperative emergencies and 51 subspecialty perioperative disease management plans (Pre-op, Intra-op, Avoid, Post-op)'],
     verification: 'secondary',
     accessNote:
       'Eighteen emergency summaries were extracted via NotebookLM on 2026-11-25; six emergency syntheses and 51 subspecialty board cards were structured from standard board-review management principles aligned with the source 18-category curriculum pending clinician review.',
     ```
2. At the bottom of `src/data/conditions/types.ts` (after line 99), append:
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

- [ ] **Step 4: Create `src/data/conditions/subspecialtyCardioThoracic.ts` (First 11 Cards) and wire exports**

Create `src/data/conditions/subspecialtyCardioThoracic.ts`:
```ts
import { subspecialtyEntry, type ConditionRecord } from './types';

export const SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS: ConditionRecord[] = [
  subspecialtyEntry(
    'aortic-stenosis',
    'Severe aortic stenosis (AS)',
    'Cardiac',
    ['aortic stenosis', 'calcific aortic stenosis', 'critical as'],
    {
      preop: [
        'Assess symptoms (angina, syncope, dyspnea) and review echocardiographic aortic valve area and mean gradient.',
        'Maintain hydration without precipitating overload; fixed left ventricular outflow obstruction cannot raise stroke volume.',
      ],
      intraop: [
        'Hemodynamic goals: preserve sinus rhythm (atrial kick provides up to 40% of LV filling), maintain normal-to-low heart rate (60–80 bpm), and maintain normal-to-high SVR.',
        'Treat hypotension immediately with phenylephrine to protect coronary perfusion pressure across the hypertrophied myocardium.',
        'Place external defibrillation pads and invasive arterial monitoring before induction in critical stenosis.',
      ],
      avoid: [
        'Tachycardia, which shortens diastolic filling time and precipitates subendocardial myocardial ischemia.',
        'Abrupt SVR drops (single-shot spinal anesthesia or heavy propofol boluses), which cause refractory hypotension.',
        'Loss of sinus rhythm or uncorrected hypovolemia.',
      ],
      postop: [
        'Monitor in an ICU or telemetry step-down unit with multimodal, opioid-sparing pain control to prevent postoperative tachycardia.',
        'Avoid rapid fluid boluses once sympathetic tone recovers.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-regurgitation',
    'Aortic regurgitation (AR)',
    'Cardiac',
    ['aortic insufficiency', 'aortic regurgitation', 'ai'],
    {
      preop: [
        'Differentiate acute AR (endocarditis, aortic dissection — surgical emergency) from chronic compensated AR on echocardiography.',
        'Continue vasodilator and heart failure therapy while assessing LV dilation and systolic reserve.',
      ],
      intraop: [
        'Hemodynamic goals ("faster, fuller, forward"): keep heart rate normal-to-mildly elevated (80–90 bpm) to shorten diastole and limit regurgitant fraction.',
        'Maintain modest preload and mild afterload reduction (low-normal SVR) to favor forward aortic flow.',
        'Use arterial line and transesophageal echocardiography in moderate-to-severe ventricular dysfunction.',
      ],
      avoid: [
        'Bradycardia, which prolongs diastole and increases regurgitant volume overload.',
        'Acute SVR surges (light anesthesia, pain, pure vasoconstrictors) that drive backward regurgitation into the left ventricle.',
      ],
      postop: [
        'Monitor for pulmonary edema during emergence and prevent emergence hypertension with smooth analgesia.',
        'Manage acute decompensated AR post-repair with inodilators if LV ejection fraction drops.',
      ],
    },
  ),
  subspecialtyEntry(
    'mitral-stenosis',
    'Mitral stenosis (MS)',
    'Cardiac',
    ['mitral stenosis', 'rheumatic mitral stenosis'],
    {
      preop: [
        'Assess mitral valve area, transmitral gradient, pulmonary artery pressures, atrial fibrillation, and anticoagulation bridging status.',
        'Continue rate-controlling medications (beta-blockers, digoxin) up to the morning of surgery.',
      ],
      intraop: [
        'Hemodynamic goals: keep heart rate slow-to-normal (60–75 bpm) to preserve diastolic filling across the stenotic mitral orifice, and preserve sinus rhythm when present.',
        'Maintain preload carefully without over-distending the left atrium and avoid factors elevating PVR (maintain normocarbia, normothermia, and high oxygenation).',
        'Treat hypotension primarily with phenylephrine rather than ephedrine (which provokes tachycardia).',
      ],
      avoid: [
        'Tachycardia or fast atrial fibrillation, which slashes LV filling and precipitates flash pulmonary edema.',
        'Hypoxia, hypercarbia, acidosis, and nitrous oxide, which spike pulmonary vascular resistance and strain the right ventricle.',
      ],
      postop: [
        'Monitor closely in telemetry/ICU for acute atrial fibrillation, pulmonary edema, and right ventricular decompensation.',
        'Provide smooth analgesia avoiding pain-induced tachycardia and hypoventilation.',
      ],
    },
  ),
  subspecialtyEntry(
    'mitral-regurgitation',
    'Mitral regurgitation (MR)',
    'Cardiac',
    ['mitral regurgitation', 'mitral insufficiency'],
    {
      preop: [
        'Identify etiology (ischemic papillary dysfunction vs myxomatous prolapse), LV ejection fraction, and pulmonary hypertension severity.',
        'Optimize baseline vasodilator therapy and note that LVEF can overestimate true systolic function due to low-impedance backward ejection into the left atrium.',
      ],
      intraop: [
        'Hemodynamic goals ("faster, fuller, forward"): maintain high-normal heart rate (80–90 bpm), slightly lowered SVR to promote forward systemic output, and adequate preload.',
        'Preserve myocardial contractility and avoid PVR spikes (normocarbia, adequate oxygenation, normothermia).',
      ],
      avoid: [
        'Bradycardia, which increases LV end-diastolic volume, dilates the mitral annulus, and worsens regurgitant fraction.',
        'Sudden SVR elevation (sympathetic surge, high-dose phenylephrine) or hypercarbia.',
      ],
      postop: [
        'Control emergence pain and blood pressure tightly to prevent acute increases in afterload and pulmonary venous congestion.',
        'Monitor respiratory status and consider telemetry in severe MR.',
      ],
    },
  ),
  subspecialtyEntry(
    'hocm',
    'Hypertrophic obstructive cardiomyopathy (HOCM)',
    'Cardiac',
    ['hypertrophic obstructive cardiomyopathy', 'hocm', 'ihss', 'ash'],
    {
      preop: [
        'Evaluate dynamic left ventricular outflow tract (LVOT) gradient, systolic anterior motion (SAM) of the mitral valve, syncope history, and ICD presence.',
        'Continue baseline beta-blockers or verapamil through the morning of surgery and avoid prolonged dehydrating fasts.',
      ],
      intraop: [
        'Hemodynamic goals: maintain expanded intravascular preload, keep heart rate slow, preserve/augment SVR, and allow mild anesthetic myocardial depression to minimize dynamic LVOT obstruction.',
        'Treat hypotension aggressively with IV crystalloid boluses and pure alpha-1 agonist (phenylephrine) rather than beta-agonists.',
        'Maintain sinus rhythm to preserve stiff LV filling.',
      ],
      avoid: [
        'Beta-adrenergic inotropes and chronotropes (epinephrine, norepinephrine, dopamine, dobutamine, isoproterenol, ephedrine) that worsen dynamic outflow obstruction.',
        'Hypovolemia, vasodilators, and spinal sympathectomy causing decreased preload and afterload.',
        'Tachycardia and loss of atrial kick.',
      ],
      postop: [
        'Maintain telemetry monitoring and reactivate ICD if disabled for electrocautery.',
        'Prevent postoperative pain, hypovolemia, and emergence tachycardia.',
      ],
    },
  ),
  subspecialtyEntry(
    'cardiac-tamponade',
    'Cardiac tamponade & pericardial effusion',
    'Cardiac',
    ['cardiac tamponade', 'pericardial tamponade', 'pericardial effusion'],
    {
      preop: [
        'Recognize Beck triad (hypotension, jugular venous distension, muffled heart sounds), pulsus paradoxus, electrical alternans, and echocardiographic RV/RA diastolic collapse.',
        'Consider awake percutaneous pericardiocentesis under local anesthesia prior to general anesthesia when hemodynamics are unstable.',
      ],
      intraop: [
        'Hemodynamic goals ("full, fast, tight"): maintain high preload, elevated heart rate (do not slow compensatory tachycardia), contractility, and SVR.',
        'Prep and drape the patient awake before induction; induce cautiously (e.g., ketamine/etomidate) maintaining spontaneous ventilation until surgical pericardial decompression.',
        'Have resuscitation drugs, wide-bore IV access, and invasive arterial monitoring ready before induction.',
      ],
      avoid: [
        'High positive-pressure ventilation and PEEP before pericardial drainage, which abolish venous return and trigger cardiac arrest.',
        'Myocardial depressants, vasodilators, and beta-blockers that eliminate compensatory sympathetic tone.',
      ],
      postop: [
        'Watch carefully for acute post-decompression hypertensive rebound or paradoxical pulmonary edema.',
        'Monitor chest/pericardial drain output and ECG telemetry in ICU.',
      ],
    },
  ),
  subspecialtyEntry(
    'cied-pacemaker-icd',
    'Pacemakers & implantable defibrillators (CIED)',
    'Cardiac',
    ['pacemaker', 'icd', 'defibrillator', 'cied', 'biventricular pacemaker'],
    {
      preop: [
        'Identify device type, manufacturer, indication, pacemaker dependency, magnet behavior, and last interrogation (within 6 months for ICDs, 12 months for pacemakers).',
        'Reprogram pacing mode to asynchronous (VOO/DOO) in pacemaker-dependent patients or deactivate ICD antitachycardia therapies before monopolar electrosurgery above the umbilicus.',
      ],
      intraop: [
        'Place transcutaneous pacing/defibrillation pads (anteroposterior) away from the pulse generator whenever ICD therapy is disabled.',
        'Use bipolar electrocautery where possible; if monopolar is required, place the return pad so current path never crosses the CIED generator or leads, using short bursts.',
        'Monitor mechanical pulse continuously via arterial line or SpO2 plethysmography in case electromagnetic interference alters ECG display.',
      ],
      avoid: [
        'Succinylcholine fasciculations causing myopotential oversensing and inappropriate pacing inhibition in un-reprogrammed unipolar pacemakers.',
        'Monopolar electrosurgery directly over the generator or blind magnet application without verifying device-specific magnet programming.',
      ],
      postop: [
        'Keep external defibrillation pads applied and telemetry continuous until the CIED is formally re-interrogated and restored to baseline settings.',
        'Obtain formal device interrogation if emergency shocks or high-energy cautery near the generator occurred.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-aneurysm',
    'Abdominal & thoracic aortic aneurysm (AAA / TAA)',
    'Vascular',
    ['aaa', 'taa', 'abdominal aortic aneurysm', 'thoracic aortic aneurysm'],
    {
      preop: [
        'Evaluate coronary disease, renal baseline, and aneurysm anatomy (infrarenal vs suprarenal vs thoracoabdominal; open vs EVAR/TEVAR).',
        'Ensure massive transfusion access, invasive arterial line (right radial if left subclavian clamped), central venous access, and lumbar CSF drain plan for high-risk TAA repair.',
      ],
      intraop: [
        'Anticipate severe afterload rise at aortic cross-clamp (prepare titrated vasodilator/volatile) followed by severe declamping hypotension upon clamp release.',
        'Prior to unclamping: optimize preload, reduce vasodilators, verify acid-base balance, and communicate closely for slow staged clamp release.',
        'For TAA repair: maintain MAP and low lumbar CSF pressure (typically <= 10 mmHg) to preserve spinal cord perfusion pressure.',
      ],
      avoid: [
        'Sudden hypovolemic unclamping ("declamping shock") or inadequate preload at reperfusion.',
        'Hyperthermia and spinal cord hypotension (causes ischemic paraplegia).',
      ],
      postop: [
        'Admit to ICU for close monitoring of hourly urine output, renal function, lower-extremity neurologic motor exams, and bowel perfusion.',
        'Maintain strict postoperative blood pressure control to protect aortic suture lines.',
      ],
    },
  ),
  subspecialtyEntry(
    'aortic-dissection',
    'Acute aortic dissection',
    'Vascular',
    ['aortic dissection', 'type a dissection', 'type b dissection'],
    {
      preop: [
        'Determine Stanford Type A (ascending — emergent cardiac surgery) vs Type B; check unequal limb blood pressures, aortic regurgitation, tamponade, and coronary/carotid malperfusion.',
        'Establish arterial line monitoring in the extremity with the highest reliable blood pressure.',
      ],
      intraop: [
        'Initiate strict anti-impulse therapy immediately: administer an IV beta-blocker (esmolol or labetalol) FIRST to reduce heart rate (< 60 bpm) and ventricular ejection velocity (dP/dt).',
        'Add an IV arterial vasodilator (nicardipine or clevidipine) AFTER beta-blockade if systolic pressure remains above target (100–120 mmHg).',
        'Maintain smooth deep induction preventing laryngoscopy shear spikes and verify coronary/valve integrity via TEE.',
      ],
      avoid: [
        'Administering vasodilators (nitroprusside, nicardipine, hydralazine) BEFORE beta-blockade, which triggers reflex tachycardia and propagates false-lumen tearing.',
        'Hypertensive surges during intubation or surgical stimulation.',
      ],
      postop: [
        'Maintain continuous ICU arterial monitoring and uninterrupted IV anti-impulse heart rate and blood pressure control.',
        'Monitor serially for acute kidney injury, stroke, paraplegia, and mesenteric ischemia.',
      ],
    },
  ),
  subspecialtyEntry(
    'carotid-endarterectomy',
    'Carotid artery stenosis & endarterectomy (CEA)',
    'Vascular',
    ['cea', 'carotid endarterectomy', 'carotid stenosis'],
    {
      preop: [
        'Document baseline focal neurologic deficits, TIA/stroke history, contralateral carotid patency, and severe coronary comorbidities.',
        'Continue aspirin, statins, and baseline beta-blockers through the morning of surgery.',
      ],
      intraop: [
        'Establish invasive arterial monitoring before induction under either cervical plexus block (awake neuro assessment) or general anesthesia with EEG/NIRS/stump pressure monitoring.',
        'Maintain arterial pressure at or up to 20% above baseline during carotid cross-clamping to preserve collateral cerebral perfusion.',
        'Maintain strict normocarbia (ETCO2 35–40 mmHg): avoid both hypercapnia (intracerebral steal) and hypocapnia (cerebral vasoconstriction).',
      ],
      avoid: [
        'Intraoperative hypotension during carotid cross-clamping.',
        'Routine aggressive hyperventilation or unrecognized carotid sinus baroreceptor reflex bradycardia during dissection.',
      ],
      postop: [
        'Perform immediate neurologic exam upon emergence and inspect neck dressing closely for expanding hematoma or stridor.',
        'Control severe postoperative hypertension promptly to prevent cerebral hyperperfusion syndrome, seizures, and hemorrhagic stroke.',
      ],
    },
  ),
  subspecialtyEntry(
    'pulmonary-hypertension',
    'Pulmonary hypertension & right heart failure',
    'Respiratory & Thoracics',
    ['pulmonary hypertension', 'pah', 'phtn', 'right heart failure'],
    {
      preop: [
        'Assess WHO group, right ventricular function, PA pressures on echocardiogram/RHC, and functional class; high perioperative morbidity warrants multidisciplinary planning.',
        'Strictly continue home pulmonary vasodilators (PDE5 inhibitors, endothelin receptor antagonists, prostacyclin infusions) without interruption.',
      ],
      intraop: [
        'Prevent acute PVR elevation: maintain high inspired oxygen, mild hypocarbia/normocarbia, normothermia, normal pH, and low mean airway pressures.',
        'Preserve right coronary perfusion pressure by maintaining systemic arterial pressure above pulmonary artery pressure (vasopressin raises SVR without raising PVR; norepinephrine/milrinone support RV output).',
        'Have inhaled pulmonary vasodilators (inhaled nitric oxide or epoprostenol) available for acute RV crisis.',
      ],
      avoid: [
        'Hypoxia, hypercarbia, metabolic/respiratory acidosis, hypothermia, and light anesthesia pain surges.',
        'Nitrous oxide and excessive PEEP, which increase pulmonary vascular resistance and precipitate acute cor pulmonale.',
      ],
      postop: [
        'Admit to ICU with continuous invasive monitoring, supplemental oxygen, and multimodal opioid-sparing analgesia preventing hypoventilation.',
        'Avoid abrupt withdrawal of inhaled pulmonary vasodilators (rebound pulmonary hypertension).',
      ],
    },
  ),
];
```

Update `src/data/conditions/index.ts` to import, spread, and export `SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS`, and append the 11 IDs to `src/data/conditions/plannedIds.ts`:
```ts
  // Batch 8: Subspecialty Part 1 (Cardiac, Vascular & Pulmonary HTN)
  'aortic-stenosis',
  'aortic-regurgitation',
  'mitral-stenosis',
  'mitral-regurgitation',
  'hocm',
  'cardiac-tamponade',
  'cied-pacemaker-icd',
  'aortic-aneurysm',
  'aortic-dissection',
  'carotid-endarterectomy',
  'pulmonary-hypertension',
```

- [ ] **Step 5: Verify and Commit Task 1**

Run:
```bash
npx vitest run src/data/__tests__/conditions.test.ts src/data/__tests__/integrity.test.ts src/lib/__tests__/conditionSearch.test.ts
npx tsc -b
```
Expected: PASS (`145` conditions, zero `mg/kg`, `DATA_VERSION === '2026.11.25-draft27'`).

Commit:
```bash
git add src/data/sources.ts src/data/conditions/types.ts src/data/conditions/subspecialtyCardioThoracic.ts src/data/conditions/index.ts src/data/conditions/plannedIds.ts src/data/__tests__/conditions.test.ts
git commit -m "feat(data): add subspecialtyEntry helper and 11 cardiac/vascular cards"
```

---

### Task 2: Airway, Respiratory/Thoracics & Critical Care Cards (8 Cards -> 153 Total)

**Files:**
- Modify: `src/data/conditions/subspecialtyCardioThoracic.ts` (append 8 cards -> 19 total)
- Modify: `src/data/conditions/plannedIds.ts` (append 8 IDs)
- Test: `src/data/__tests__/conditions.test.ts`

**Interfaces:**
- Consumes: `subspecialtyEntry` from `./types`.
- Produces: 19 cards in `SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS` (`CONDITIONS.length === 153`).

- [ ] **Step 1: Write failing count and safety assertions in `src/data/__tests__/conditions.test.ts`**

Update the count assertion to `153` and add:
```ts
  it('keeps airway, thoracic OLV, and critical care safety lines', () => {
    expect(text(plan('ludwig-angina').avoid)).toMatch(/spontaneous|NMBDs|neuromuscular/i);
    expect(text(plan('post-thyroidectomy-hematoma').intraop)).toMatch(/sutures|staples|decompress/i);
    expect(text(plan('copd-bullous-emphysema').avoid)).toMatch(/nitrous oxide|N2O/i);
    expect(text(plan('thoracic-olv').intraop)).toMatch(/CPAP|PEEP/i);
    expect(text(plan('brain-death-donor').intraop)).toMatch(/Rule of 100s|vasopressin/i);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/conditions.test.ts`  
Expected: FAIL (`expected 145 to be 153`).

- [ ] **Step 3: Append the 8 Airway, Respiratory/Thoracics & Critical Care cards to `src/data/conditions/subspecialtyCardioThoracic.ts` and `plannedIds.ts`**

Append inside `SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS`:
```ts
  subspecialtyEntry(
    'ludwig-angina',
    'Ludwig angina & deep neck infection',
    'Airway',
    ['ludwig angina', 'submandibular abscess', 'deep neck infection'],
    {
      preop: [
        'Rapidly progressive bilateral submandibular/sublingual cellulitis pushing the tongue posteriorly and superiorly; inspect for trismus, drooling, stridor, and tripod posture.',
        'Notify ENT surgery immediately and prepare a double setup with flexible fiberoptic intubation and surgical cricothyrotomy/tracheostomy.',
      ],
      intraop: [
        'Secure the airway awake (awake fiberoptic nasal or oral intubation under topical anesthesia) while preserving spontaneous ventilation.',
        'Maintain upright or ramped positioning during airway topicalization and instrumentation.',
      ],
      avoid: [
        'IV induction or neuromuscular blockers (succinylcholine/rocuronium) prior to definitive airway control, which causes complete loss of pharyngeal tone and cannot-intubate/cannot-ventilate catastrophe.',
        'Heavy preoperative sedatives, supine positioning, or repeated traumatic direct laryngoscopy.',
      ],
      postop: [
        'Leave the patient intubated in ICU until surgical drainage reduces floor-of-mouth edema and a cuff-leak test confirms patency.',
        'Continue broad-spectrum IV antibiotics and head elevation.',
      ],
    },
  ),
  subspecialtyEntry(
    'epiglottitis',
    'Acute epiglottitis / supraglottitis',
    'Airway',
    ['epiglottitis', 'supraglottitis'],
    {
      preop: [
        'Recognize classic dysphagia, drooling, muffled voice, stridor, high fever, and tripod posture (most often Hib/bacterial or viral in adults/unvaccinated children).',
        'Keep the patient calm in a comfortable upright position with parent presence in pediatrics and ENT surgeon scrubbed at bedside.',
      ],
      intraop: [
        'Pediatric patients: proceed directly to OR for calm inhalational sevoflurane induction in oxygen keeping spontaneous breathing, no IV until asleep.',
        'Adults: consider awake fiberoptic intubation vs inhalational induction; use an ETT 0.5–1.0 mm smaller than usual with rigid bronchoscopy and surgical airway ready.',
      ],
      avoid: [
        'Agitating the child (phlebotomy, tongue blade oral exam, or supine forcing) which can trigger immediate complete laryngospasm and arrest.',
        'Neuromuscular blocking agents prior to visualizing and securing the edematous supraglottic inlet.',
      ],
      postop: [
        'Keep intubated in ICU on humidified oxygen, IV antibiotics, and sedation until direct inspection or cuff leak confirms resolution of edema (24–48 h).',
      ],
    },
  ),
  subspecialtyEntry(
    'post-thyroidectomy-hematoma',
    'Post-thyroidectomy neck hematoma',
    'Airway',
    ['neck hematoma', 'post-thyroidectomy hematoma', 'thyroid hematoma'],
    {
      preop: [
        'Monitor every post-thyroid/parathyroid patient closely in PACU for neck tightness, fullness, voice change, agitation, and late stridor.',
        'Maintain suture/staple removal kit and difficult airway cart immediately at the bedside.',
      ],
      intraop: [
        'If acute airway compromise or stridor develops, IMMEDIATELY open all skin and platysmal sutures/staples at the bedside to evacuate the clot and decompress the trachea BEFORE attempting induction.',
        'Deliver 100% oxygen, call surgical team immediately, and secure airway via awake fiberoptic or video laryngoscopy with surgical airway backup once decompressed.',
      ],
      avoid: [
        'Delaying wound decompression while transferring to the operating room or waiting for imaging.',
        'Inducing general anesthesia and paralysis prior to releasing compressed neck hematoma (venous/lymphatic laryngeal edema makes intubation nearly impossible).',
      ],
      postop: [
        'Return to OR for surgical hemostasis and consider keeping intubated in ICU if significant supraglottic edema remains.',
        'Monitor serum ionized calcium and vocal cord mobility post-reexploration.',
      ],
    },
  ),
  subspecialtyEntry(
    'copd-bullous-emphysema',
    'COPD & bullous emphysema',
    'Respiratory & Thoracics',
    ['copd', 'emphysema', 'chronic bronchitis', 'bullae'],
    {
      preop: [
        'Assess baseline exercise tolerance, FEV1, baseline PaCO2 (CO2 retainers), cor pulmonale, smoking cessation, and active infection.',
        'Continue inhaled bronchodilators and steroids through the morning of surgery.',
      ],
      intraop: [
        'Use neuraxial or regional techniques when suitable to avoid instrumentation, though keep high sensory block below intercostal fatigue levels.',
        'Ventilate with moderate tidal volumes and prolonged expiratory time (low respiratory rate, longer I:E ratio) to prevent air trapping, auto-PEEP, and hypotension.',
        'Closely watch for barotrauma or sudden hemodynamic collapse from ruptured emphysematous bullae.',
      ],
      avoid: [
        'Nitrous oxide (N2O) in bullous emphysema, as rapid diffusion into closed bullae causes expansion and tension pneumothorax.',
        'Rapid respiratory rates causing incomplete exhalation (breath stacking) and severe intrinsic PEEP.',
      ],
      postop: [
        'Target baseline oxygen saturation rather than excessive hyperoxia to avoid worsening V/Q mismatch and hypercapnia.',
        'Provide early non-invasive ventilation (BiPAP/CPAP if not contraindicated), aggressive chest physiotherapy, and opioid-sparing analgesia.',
      ],
    },
  ),
  subspecialtyEntry(
    'bronchial-asthma',
    'Bronchial asthma',
    'Respiratory & Thoracics',
    ['asthma', 'reactive airway disease'],
    {
      preop: [
        'Evaluate attack frequency, oral steroid dependence, prior ICU intubations, and recent triggers; defer elective surgery during active exacerbation or URI.',
        'Administer inhaled short-acting beta-2 agonist shortly before induction and continue maintenance inhaled corticosteroids.',
      ],
      intraop: [
        'Induce smoothly with propofol or ketamine (bronchodilator) and achieve deep anesthetic plane with sevoflurane/isoflurane before laryngoscopy or ETT placement.',
        'Use LMA or regional anesthesia when appropriate to minimize tracheal stimulation; treat acute bronchospasm with 100% O2, deeper anesthesia, and inhaled/IV bronchodilators.',
      ],
      avoid: [
        'Rapidly stepping up pungent desflurane, which provokes airway irritation and severe bronchospasm.',
        'Histamine-releasing drugs (atracurium, mivacurium, morphine) and non-selective beta-blockers (propranolol).',
        'Light anesthesia during intubation or extubation (consider deep extubation or IV lidocaine when safe).',
      ],
      postop: [
        'Continue scheduled inhaled beta-agonists and monitor oxygenation and expiratory effort in PACU.',
        'Avoid NSAIDs/aspirin in patients with aspirin-exacerbated respiratory disease (Samter triad).',
      ],
    },
  ),
  subspecialtyEntry(
    'thoracic-olv',
    'One-lung ventilation (OLV) & thoracic surgery',
    'Respiratory & Thoracics',
    ['one lung ventilation', 'olv', 'double lumen tube', 'thoracotomy'],
    {
      preop: [
        'Evaluate predicted postoperative FEV1, DLCO, VO2 max, cardiac risk, and review chest CT to plan left- vs right-sided DLT or bronchial blocker.',
        'Place thoracic epidural or paravertebral catheter pre-induction for thoracotomy analgesia.',
      ],
      intraop: [
        'Confirm DLT or bronchial blocker placement via flexible fiberoptic bronchoscopy immediately after intubation AND again after lateral decubitus positioning.',
        'Ventilate dependent lung protectively (low PBW tidal volume, PEEP, low plateau pressures) and restrict excessive crystalloid administration.',
        'Treat OLV hypoxemia systematically: verify FiO2 1.0, check DLT position with bronchoscope, recruit dependent lung + adjust PEEP, and apply CPAP (or intermittent two-lung ventilation) to the non-dependent lung.',
      ],
      avoid: [
        'Excessive positive fluid balance in pneumonectomy/lobectomy patients (triggers post-pneumonectomy pulmonary edema).',
        'High plateau pressures or assuming DLT position remained intact after turning the patient lateral.',
      ],
      postop: [
        'Extubate early in the OR to eliminate positive-pressure stress on bronchial stumps and maintain thoracic regional analgesia.',
        'Obtain post-op chest radiograph in PACU and monitor chest tube air leaks and arrhythmias (post-thoracotomy AF).',
      ],
    },
  ),
  subspecialtyEntry(
    'septic-shock',
    'Sepsis & septic shock',
    'Critical Care',
    ['sepsis', 'septic shock', 'bacteremia'],
    {
      preop: [
        'Do not delay urgent surgical source control (abscess, necrotizing soft tissue, ischemic bowel); verify blood cultures, broad-spectrum antibiotics, lactate, and fluid status.',
        'Establish large-bore IV access, invasive arterial line, and central venous access with vasopressor infusion ready prior to induction.',
      ],
      intraop: [
        'Titrate hemodynamically stable induction agents cautiously (ketamine, low-dose etomidate/opioid); anticipate loss of endogenous catecholamines upon induction.',
        'Start norepinephrine first-line to maintain MAP >= 65 mmHg, add vasopressin or stress-dose hydrocortisone for refractory shock, and guide fluids dynamically rather than blindly.',
        'Apply ARDS-protective ventilation (low PBW tidal volumes, PEEP, plateau < 30 cmH2O) and actively warm the patient.',
      ],
      avoid: [
        'Full-dose propofol induction boluses in vasodilated hypotensive patients.',
        'Massive blind crystalloid overloading without dynamic preload responsiveness (worsens pulmonary and bowel edema).',
      ],
      postop: [
        'Transfer intubated to ICU for ongoing source-control resuscitation, serial lactate clearance, and organ support.',
        'Monitor closely for acute kidney injury, DIC, and ICU delirium.',
      ],
    },
  ),
  subspecialtyEntry(
    'brain-death-donor',
    'Brain death & organ donor management',
    'Critical Care',
    ['organ donor', 'brain death', 'rule of 100s'],
    {
      preop: [
        'Confirm formal brain death declaration, family/organ procurement consent, blood type crossmatch, and ongoing vasopressor/endocrine drips.',
        'Anticipate severe autonomic storm during herniation followed by loss of sympathetic tone, neurogenic diabetes insipidus, and hypothermia.',
      ],
      intraop: [
        'Apply the "Rule of 100s" physiological targets: systolic BP around 100 mmHg, urine output >= 100 mL/h, PaO2 >= 100 mmHg, hemoglobin ~100 g/L (10 g/dL), and normoglycemia.',
        'Treat spinal-reflex somatic movements and autonomic hypertension/tachycardia during surgical incision using neuromuscular blockers plus volatile anesthetics or opioids.',
        'Treat diabetes insipidus (hypernatremia + polyuria) with vasopressin infusion or desmopressin plus electrolyte replacement, and maintain active warming.',
      ],
      avoid: [
        'Uncorrected hypothermia, severe hypernatremia (> 150–155 mEq/L harms liver grafts), or severe hypovolemia risking graft ischemia.',
        'Assuming brain death prevents painful spinal autonomic hypertensive surges during surgical procurement.',
      ],
      postop: [
        'Coordinate cross-clamp timing and heparin administration directly with surgical procurement teams.',
        'Document exact hemodynamic, fluid, and preservation drug timings cleanly for recipient transplant records.',
      ],
    },
  ),
```

Append those 8 IDs to `src/data/conditions/plannedIds.ts`:
```ts
  // Batch 9: Subspecialty Part 2 (Airway, Respiratory/Thoracics & Critical Care)
  'ludwig-angina',
  'epiglottitis',
  'post-thyroidectomy-hematoma',
  'copd-bullous-emphysema',
  'bronchial-asthma',
  'thoracic-olv',
  'septic-shock',
  'brain-death-donor',
```

- [ ] **Step 4: Verify and Commit Task 2**

Run:
```bash
npx vitest run src/data/__tests__/conditions.test.ts src/data/__tests__/integrity.test.ts src/lib/__tests__/conditionSearch.test.ts
npx tsc -b
```
Expected: PASS (`153` conditions).

Commit:
```bash
git add src/data/conditions/subspecialtyCardioThoracic.ts src/data/conditions/plannedIds.ts src/data/__tests__/conditions.test.ts
git commit -m "feat(data): add 8 airway, thoracic, and critical care subspecialty cards"
```

---

### Task 3: Neuroanesthesia, Psychiatric & Toxicities Cards (10 Cards -> 163 Total)

**Files:**
- Create: `src/data/conditions/subspecialtyNeuroEndo.ts` (Part 1: 10 cards)
- Modify: `src/data/conditions/index.ts` (import & re-export `SUBSPECIALTY_NEURO_ENDO_CONDITIONS`)
- Modify: `src/data/conditions/plannedIds.ts` (append 10 IDs)
- Test: `src/data/__tests__/conditions.test.ts`

**Interfaces:**
- Consumes: `subspecialtyEntry` from `./types`.
- Produces: `SUBSPECIALTY_NEURO_ENDO_CONDITIONS` (10 cards) wired into `CONDITIONS` (`163` total).

- [ ] **Step 1: Write failing tests in `src/data/__tests__/conditions.test.ts`**

Update the count assertion to `163` and add:
```ts
  it('keeps neuroanesthesia, psychiatric, and toxicity safety lines', () => {
    expect(text(plan('traumatic-brain-injury').avoid)).toMatch(/hypotonic|nitrous/i);
    expect(text(plan('acute-spinal-cord-injury').avoid)).toMatch(/Succinylcholine/i);
    expect(text(plan('maoi-ssri-serotonin-syndrome').avoid)).toMatch(/meperidine/i);
    expect(text(plan('central-anticholinergic-syndrome').intraop)).toMatch(/physostigmine/i);
    expect(text(plan('co-cyanide-toxicity').intraop)).toMatch(/hydroxocobalamin/i);
    expect(text(plan('organophosphate-pseudocholinesterase').avoid)).toMatch(/succinylcholine|mivacurium/i);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/conditions.test.ts`  
Expected: FAIL (`expected 153 to be 163`).

- [ ] **Step 3: Create `src/data/conditions/subspecialtyNeuroEndo.ts` (Part 1: 10 Cards) and wire exports**

Create `src/data/conditions/subspecialtyNeuroEndo.ts`:
```ts
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
```

Update `src/data/conditions/index.ts` to import, spread, and export `SUBSPECIALTY_NEURO_ENDO_CONDITIONS`, and append the 10 IDs to `src/data/conditions/plannedIds.ts`:
```ts
  // Batch 10: Subspecialty Part 3 (Neuroanesthesia, Psychiatric & Toxicities)
  'traumatic-brain-injury',
  'intracranial-aneurysm-sah',
  'awake-craniotomy-mass',
  'acute-spinal-cord-injury',
  'maoi-ssri-serotonin-syndrome',
  'lithium-ect',
  'substance-use-withdrawal',
  'central-anticholinergic-syndrome',
  'co-cyanide-toxicity',
  'organophosphate-pseudocholinesterase',
```

- [ ] **Step 4: Verify and Commit Task 3**

Run:
```bash
npx vitest run src/data/__tests__/conditions.test.ts src/data/__tests__/integrity.test.ts src/lib/__tests__/conditionSearch.test.ts
npx tsc -b
```
Expected: PASS (`163` conditions).

Commit:
```bash
git add src/data/conditions/subspecialtyNeuroEndo.ts src/data/conditions/index.ts src/data/conditions/plannedIds.ts src/data/__tests__/conditions.test.ts
git commit -m "feat(data): add 10 neuroanesthesia, psychiatric, and toxicity subspecialty cards"
```

---

### Task 4: Endocrinology, Hepatic, Renal & Hematology Cards (10 Cards -> 173 Total)

**Files:**
- Modify: `src/data/conditions/subspecialtyNeuroEndo.ts` (append 10 cards -> 20 total)
- Modify: `src/data/conditions/plannedIds.ts` (append 10 IDs)
- Test: `src/data/__tests__/conditions.test.ts`

**Interfaces:**
- Consumes: `subspecialtyEntry` from `./types`.
- Produces: 20 cards in `SUBSPECIALTY_NEURO_ENDO_CONDITIONS` (`CONDITIONS.length === 173`).

- [ ] **Step 1: Write failing tests in `src/data/__tests__/conditions.test.ts`**

Update the count assertion to `173` and add:
```ts
  it('keeps endocrine, hepatic, renal, and hematologic safety lines', () => {
    expect(text(plan('hyperthyroidism-thyroid-storm').intraop)).toMatch(/iodine|propranolol|esmolol/i);
    expect(text(plan('adrenal-insufficiency').avoid)).toMatch(/etomidate/i);
    expect(text(plan('cirrhosis-esld').intraop)).toMatch(/cisatracurium/i);
    expect(text(plan('esrd-renal-transplant').avoid)).toMatch(/succinylcholine|NSAIDs/i);
    expect(text(plan('turp-syndrome').intraop)).toMatch(/hyponatremia|hypertonic/i);
    expect(text(plan('hit-thrombocytopenia').avoid)).toMatch(/heparin|platelet/i);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/conditions.test.ts`  
Expected: FAIL (`expected 163 to be 173`).

- [ ] **Step 3: Append the 10 Endocrine, Hepatic, Renal & Hematology cards to `src/data/conditions/subspecialtyNeuroEndo.ts` and `plannedIds.ts`**

Append inside `SUBSPECIALTY_NEURO_ENDO_CONDITIONS`:
```ts
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
```

Append those 10 IDs to `src/data/conditions/plannedIds.ts`:
```ts
  // Batch 11: Subspecialty Part 4 (Endocrinology, Hepatic, Renal & Hematology)
  'diabetes-dka-hhs',
  'hyperthyroidism-thyroid-storm',
  'hypothyroidism-myxedema',
  'adrenal-insufficiency',
  'cirrhosis-esld',
  'acute-liver-failure',
  'esrd-renal-transplant',
  'turp-syndrome',
  'dic',
  'hit-thrombocytopenia',
```

- [ ] **Step 4: Verify and Commit Task 4**

Run:
```bash
npx vitest run src/data/__tests__/conditions.test.ts src/data/__tests__/integrity.test.ts src/lib/__tests__/conditionSearch.test.ts
npx tsc -b
```
Expected: PASS (`173` conditions).

Commit:
```bash
git add src/data/conditions/subspecialtyNeuroEndo.ts src/data/conditions/plannedIds.ts src/data/__tests__/conditions.test.ts
git commit -m "feat(data): add 10 endocrine, hepatic, renal, and hematologic subspecialty cards"
```

---

### Task 5: Obstetrics, Pediatrics, Skin & MSK, Miscellaneous Cards (12 Cards -> 185 Total) & UI Polish

**Files:**
- Create: `src/data/conditions/subspecialtyPopulations.ts` (12 cards)
- Modify: `src/data/conditions/index.ts` (import & re-export `SUBSPECIALTY_POPULATIONS_CONDITIONS`)
- Modify: `src/data/conditions/plannedIds.ts` (append 12 IDs)
- Modify: `src/views/ConditionsView.tsx:52,108`
- Test: `src/data/__tests__/conditions.test.ts`

**Interfaces:**
- Consumes: `subspecialtyEntry` from `./types`.
- Produces: `SUBSPECIALTY_POPULATIONS_CONDITIONS` (12 cards) merged into `CONDITIONS` (`185` total); refined subspecialty banner in `ConditionsView.tsx`.

- [ ] **Step 1: Write failing tests in `src/data/__tests__/conditions.test.ts`**

Update the count assertion to `185` and add:
```ts
  it('keeps obstetrics, pediatrics, burn, and obesity subspecialty safety lines', () => {
    expect(text(plan('preeclampsia-hellp').intraop)).toMatch(/magnesium/i);
    expect(text(plan('placenta-accreta-pph').avoid)).toMatch(/carboprost|asthma|methylergonovine/i);
    expect(text(plan('amniotic-fluid-embolism').intraop)).toMatch(/perimortem|DIC/i);
    expect(text(plan('pyloric-stenosis').preop)).toMatch(/medical.*not.*surgical|alkalosis/i);
    expect(text(plan('major-burn-injury').avoid)).toMatch(/Succinylcholine/i);
    expect(text(plan('morbid-obesity-bariatric').intraop)).toMatch(/ramped|PBW/i);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/conditions.test.ts`  
Expected: FAIL (`expected 173 to be 185`).

- [ ] **Step 3: Create `src/data/conditions/subspecialtyPopulations.ts` (12 Cards) and wire exports**

Create `src/data/conditions/subspecialtyPopulations.ts`:
```ts
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
```

2. Update `src/data/conditions/index.ts` to import, spread, and export `SUBSPECIALTY_POPULATIONS_CONDITIONS`:
```ts
import { CARDIOVASCULAR_CONDITIONS } from './cardiovascular';
import { RESPIRATORY_CONDITIONS } from './respiratory';
import { NEUROLOGIC_CONDITIONS } from './neurologic';
import { ENDOCRINE_CONDITIONS } from './endocrine';
import { HEMATOLOGIC_CONDITIONS } from './hematologic';
import { MULTISYSTEM_CONDITIONS } from './multisystem';
import { EMERGENCY_CONDITIONS } from './emergencies';
import { SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS } from './subspecialtyCardioThoracic';
import { SUBSPECIALTY_NEURO_ENDO_CONDITIONS } from './subspecialtyNeuroEndo';
import { SUBSPECIALTY_POPULATIONS_CONDITIONS } from './subspecialtyPopulations';
import type { ConditionRecord } from './types';

export const CONDITIONS: ConditionRecord[] = [
  ...RESPIRATORY_CONDITIONS,
  ...CARDIOVASCULAR_CONDITIONS,
  ...NEUROLOGIC_CONDITIONS,
  ...ENDOCRINE_CONDITIONS,
  ...HEMATOLOGIC_CONDITIONS,
  ...MULTISYSTEM_CONDITIONS,
  ...EMERGENCY_CONDITIONS,
  ...SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS,
  ...SUBSPECIALTY_NEURO_ENDO_CONDITIONS,
  ...SUBSPECIALTY_POPULATIONS_CONDITIONS,
];

export { CARDIOVASCULAR_CONDITIONS } from './cardiovascular';
export { RESPIRATORY_CONDITIONS } from './respiratory';
export { NEUROLOGIC_CONDITIONS } from './neurologic';
export { ENDOCRINE_CONDITIONS } from './endocrine';
export { HEMATOLOGIC_CONDITIONS } from './hematologic';
export { MULTISYSTEM_CONDITIONS } from './multisystem';
export { EMERGENCY_CONDITIONS } from './emergencies';
export { SUBSPECIALTY_CARDIO_THORACIC_CONDITIONS } from './subspecialtyCardioThoracic';
export { SUBSPECIALTY_NEURO_ENDO_CONDITIONS } from './subspecialtyNeuroEndo';
export { SUBSPECIALTY_POPULATIONS_CONDITIONS } from './subspecialtyPopulations';

export { PLANNED_CONDITION_IDS } from './plannedIds';
export * from './types';
```

3. Append those 12 IDs to `src/data/conditions/plannedIds.ts`:
```ts
  // Batch 12: Subspecialty Part 5 (Obstetrics, Pediatrics, Skin & MSK, Miscellaneous)
  'preeclampsia-hellp',
  'placenta-accreta-pph',
  'amniotic-fluid-embolism',
  'pyloric-stenosis',
  'omphalocele-gastroschisis',
  'nec-prematurity',
  'foreign-body-aspiration',
  'rheumatoid-arthritis',
  'major-burn-injury',
  'morbid-obesity-bariatric',
  'geriatric-pocd',
  'perioperative-hypothermia',
```

- [ ] **Step 4: Update `src/views/ConditionsView.tsx`**

In `src/views/ConditionsView.tsx`:
1. Update `<WarningBanner>` title (line 52):
```tsx
            <WarningBanner
              level="info"
              title={
                c.chapter !== undefined
                  ? 'Textbook summary'
                  : c.category === 'Acute Intraoperative Emergencies'
                    ? 'Board emergency summary'
                    : 'Board subspecialty summary'
              }
            >
```
2. Update the intro paragraph (line 108):
```tsx
      <p className="text-xs text-slate-400">
        Rare diseases from Stoelting&apos;s Anesthesia and Co-Existing Disease (8th edition) plus Acute Intraoperative Emergencies and Subspecialty Conditions from Anesthesia Considerations. Each has a perioperative plan (Pre-op, Intra-op, Avoid, Post-op). Searching works offline and nothing you type is stored.
      </p>
```

- [ ] **Step 5: Run Full Verification & Commit Task 5**

Run:
```bash
npm test
npm run build
```
Expected: All tests pass (`CONDITIONS.length === 185`, `classGuard.test.ts` passes, `integrity.test.ts` passes, `conditionSearch.test.ts` passes) and `tsc -b && vite build` succeeds cleanly.

Commit:
```bash
git add src/data/conditions/subspecialtyPopulations.ts src/data/conditions/index.ts src/data/conditions/plannedIds.ts src/views/ConditionsView.tsx src/data/__tests__/conditions.test.ts
git commit -m "feat(data): add final 12 OB/peds/MSK/misc subspecialty cards (185 total)"
```
