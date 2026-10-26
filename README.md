# AnesthAssist

An offline, mobile-first cognitive aid for anesthesia providers in the operating room: dosing, airway sizing, ventilation settings, checklists and emergency pathways (LAST, malignant hyperthermia, CICO).

> **Educational and cognitive aid. Clinical judgment supercedes all calculated suggestions.**
>
> It is not an electronic health record, a patient monitor, a prescribing system or a remote decision-making tool.

## Clinical data status: draft, needs clinician sign-off

The reference layer in `src/data/` was transcribed from product labels (DailyMed) and published references. Several primary texts could not be read in the build session (ASRA, MHAUS, EMHG, ASA 2022 full texts). Each source carries a `verification` field (`primary`, `label` or `secondary`) and an `accessNote`, and the in-app **References** view lists every source with the values derived from it.

**A qualified clinician must review the data before any clinical use.** Where no high-quality source value was available, the app shows **"No high-quality source value specified."** instead of a number. That includes face-mask sizing by contour, video-laryngoscope geometry, aspiration prophylaxis, metaraminol, epinephrine bolus, PONV doses and most scenario-specific ventilation settings.

## Run locally

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # unit tests (clinical calculations and data integrity)
npm run verify     # tests + type-check + production build
```

Requires Node 20+.

## Build and deploy for offline use

```bash
npm run build      # type-check (strict), build, generate the service worker
npm run preview    # serve dist/ locally to test offline behaviour
```

`vite-plugin-pwa` precaches the app shell, bundle, icons and manifest. The app data makes no network requests after the first load; the service worker checks every 15 minutes for an update and **waits** for the clinician to tap “Update ready”. It never reloads a live case automatically. To check offline use: open `npm run preview`, load once, then switch the browser to Offline and reload.

Deploy the `dist/` folder to any static host. `vercel.json` already sets cache headers (service worker and manifest are never cached; hashed assets are immutable).

PWA icons are generated from the favicon artwork by `python scripts/generate-icons.py` (needs `pip install pillow`). Re-run only if you change the logo.

## App structure

| Tab / control | What it does |
|---|---|
| **Dosing** | Adult drug cards in eight categories. Each card shows dose range, selected dose, weight scalar and kg, mass, exact mL at the dose-specific concentration, single/cumulative maximum warnings and source badges. Cumulative ceilings for ephedrine and labetalol have a local dose log. Dosing is withheld for a known patient under 18 because this build has no pediatric dose set. |
| **Airway** | Adult and pediatric ETT/blade summaries, age-gated DLT sizing, LMA size by weight, OPA/NPA landmarks, ASA difficult-airway principles. |
| **Vent** | Scenario selector, tidal volume from **PBW** (adult age required; never actual weight), minute ventilation, I:E timing, plateau and driving-pressure warnings, mode/alarm/troubleshooting prompts. |
| **Lists** | Pre-induction, a sourced Fasting / NPO checklist (routine, pediatric, obstetric, GLP-1 and urgent/unscheduled scenarios), machine check (generic structure), intraoperative prompts, emergence/extubation, and an anonymous handoff summary built only from fixed choices and numeric fields. |
| **SOS** (red, bottom bar) | Full-screen LAST, MH and CICO support from any tab. |
| **References** (book icon) | Source registry, verification status and the values derived from each source, plus a side-by-side comparison of the published conflicting GLP-1 perioperative protocols. The old prose guide is archived in `docs/reference-archive-2026-10-14.md` and is not a dosing source. |

### Biometric formulas (exact)

- Devine IBW/PBW: male `50 + 0.905 x max(0, height - 152.4)`, female `45.5 + ...`. **PBW** is the uncapped value used for ventilation; **IBW** is capped at TBW for IBW-based dosing.
- ABW40: `IBW + 0.4 x (TBW - IBW)` if TBW > IBW, else TBW.
- Janmahasatian LBW: male `9270 x TBW / (6680 + 216 x BMI)`, female `9270 x TBW / (8780 + 244 x BMI)`, capped at TBW.
- Invalid inputs (zero/negative weight or height, height outside 30-250 cm) are **rejected**, outputs go blank and an error is shown. Nothing is silently corrected.
- Rounding happens only for display. Maximum-dose checks use unrounded values.

## Update the clinical reference layer

All clinical content is in `src/data/`:

| File | Content |
|---|---|
| `sources.ts` | Source registry (id, tag, year/version, URL, tier, verification) and `DATA_VERSION` |
| `medications.ts` | Drugs, doses, concentrations, scalars, ceilings; local anesthetic limits; documented gaps |
| `airwayDevices.ts` | Airway tables and formulas; list of unsourced airway topics |
| `ventilation.ts` | Scenarios and reference prompts |
| `checklists.ts` | Checklists and handoff option lists |
| `emergencies.ts` | LAST, MH and CICO steps |
| `localOverrides.ts` | **Local protocol overrides (ships empty)** |

To change a value:

1. Edit the data file. Every dose, concentration, rule and step needs `sourceIds` that exist in `sources.ts`; add the source first if it is new.
2. Bump `DATA_VERSION` in `sources.ts`.
3. Run `npm test`. The integrity tests fail if any `sourceId` does not resolve, a record has no source, a default lies outside its range, or a weight-based dose has no scalar and basis.
4. Update the source's `verification` and `accessNote` honestly (for example promote `secondary` to `primary` after you read the full text).
5. `npm run build` and redeploy. The service worker updates installed apps automatically.

Do not add a value you cannot tie to a named source. Leave it out so the UI shows the "No high-quality source value specified" placeholder.

## International guidelines vs local protocol

Settings (gear icon) has an **Active reference set** switch.

- Local values go in `src/data/localOverrides.ts`, keyed as documented in that file. **No local notebook was supplied, so this build contains none.**
- Rules applied by `src/data/resolve.ts`:
  - same as the guideline: used and labelled guideline-consistent;
  - **more restrictive** than the guideline: the local value is used and tagged **Local protocol**;
  - **less restrictive** (a conflict): both values are shown, the guideline value is used, and the local value applies only if the user selects **Use local protocol**.
- A guideline safety limit is never silently overridden.

## What is and is not stored

**Stored on the device (localStorage, key `anesthassist-storage`):** reference set choice, preferred weight scalar, chosen concentration for each dose, last ventilation scenario, recently used drugs, the MH hotline/contact you type in Settings, timer-sound setting, and anonymous checklist tick marks.

**Never stored:** patient weight, height, sex, age, dose selections, cumulative dose logs, local anesthetic entries, emergency logs, timers and handoff text. They live in memory and disappear when the app closes. **New case** clears them (and checklist ticks) on demand. Older saved data (including the previous version's patient values) is discarded on upgrade.

**Never done:** authentication, analytics or telemetry, clinical network calls, logging of clinical entries. The only background request is the service-worker update check. The handoff generator only uses fixed choices and numeric fields, has no free-text fields, and adds no weight, height or biometrics.

## Tests

`npm test` runs 200+ tests covering IBW/PBW, LBW, ABW40 and BMI; dose and volume math (including mcg/mg conversion); single and cumulative maximum-dose flags; infusion rates; ETT/LMA/DLT sizing; pediatric age guards; tidal volume and minute ventilation; the local anesthetic combined fraction; LAST lipid bolus, infusion and the 12 mL/kg ceiling; dantrolene dose, vial counts and the cumulative warning; guideline-vs-local resolution; the fasting/NPO checklist and its source coverage; anonymous handoff construction; and source traceability of every clinical record. CI and Vercel run `npm run verify`.
