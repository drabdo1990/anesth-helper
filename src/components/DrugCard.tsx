import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FlaskConical, ShieldCheck } from 'lucide-react';
import type { Medication, MedicationDose, WeightScalar } from '../data/types';
import { resolveWithOverrides } from '../data/resolve';
import { useAppStore } from '../store/useAppStore';
import type { Biometrics } from '../lib/calc/biometrics';
import { formatMcg, formatMg, formatMl } from '../lib/calc/format';
import {
  computeMedicationDose,
  doseAppliesToWeight,
  isWeightBased,
  resolveConcentrationIndex,
  scalarWeightKg,
  type DoseComputation,
} from '../lib/calc/medication';
import { ConcentrationSelector } from './ui/ConcentrationSelector';
import { NumericStepper } from './ui/NumericStepper';
import { SegmentedControl } from './ui/SegmentedControl';
import { SourceBadge } from './ui/SourceBadge';
import { UnitValue } from './ui/UnitValue';
import { WarningBanner } from './ui/WarningBanner';
import { WeightScalarBadge } from './ui/WeightScalarBadge';

const NICE_STEPS = [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100];

const stepFor = (min: number, max: number): number => {
  const ideal = (max - min) / 20;
  return NICE_STEPS.find((s) => s >= ideal) ?? 100;
};

const decimalsFor = (step: number): number => (step.toString().split('.')[1] ?? '').length;

/** mL: one decimal place, but two below 1 mL so small syringe volumes are not shown as 0.0. */
const fmtVolume = (ml: number): string => (ml < 1 ? ml.toFixed(2) : formatMl(ml));

const fmtMass = (mass: number, unit: 'mg' | 'mcg'): string => (unit === 'mg' ? formatMg(mass) : formatMcg(mass));

const STUB_BIOMETRICS: Biometrics = { tbw: 0, bmi: 0, pbw: 0, ibw: 0, abw40: 0, lbw: 0 };

const SCALARS: { value: WeightScalar; label: string }[] = [
  { value: 'TBW', label: 'TBW' },
  { value: 'IBW', label: 'IBW' },
  { value: 'LBW', label: 'LBW' },
  { value: 'ABW40', label: 'ABW40' },
];

interface DrugCardProps {
  medication: Medication;
  biometrics: Biometrics | null;
}

export const DrugCard: React.FC<DrugCardProps> = ({ medication, biometrics }) => {
  const selectedDoseIds = useAppStore((s) => s.selectedDose);
  const setSelectedDose = useAppStore((s) => s.setSelectedDose);
  const doseValues = useAppStore((s) => s.doseValues);
  const setDoseValue = useAppStore((s) => s.setDoseValue);
  const scalarOverrides = useAppStore((s) => s.scalarOverrides);
  const setScalarOverride = useAppStore((s) => s.setScalarOverride);
  const concentrationChoice = useAppStore((s) => s.concentrationChoice);
  const setConcentrationChoice = useAppStore((s) => s.setConcentrationChoice);
  const preferredScalar = useAppStore((s) => s.preferredScalar);
  const guidelineSet = useAppStore((s) => s.guidelineSet);
  const touchRecent = useAppStore((s) => s.touchRecent);
  const [showDetails, setShowDetails] = useState(false);

  const tbw = biometrics?.tbw ?? null;
  const applicable = medication.doses.filter((d) => (tbw === null ? !d.weightBandKg : doseAppliesToWeight(d, tbw)));
  const dose: MedicationDose | undefined =
    applicable.find((d) => d.id === selectedDoseIds[medication.id]) ?? applicable[0];

  // The saved choice is a strength (mg/mL), matched against the current data. If the data changed and
  // that strength no longer exists, fall back to the first listed concentration.
  const concIndex = resolveConcentrationIndex(medication.concentrations, concentrationChoice[medication.id]);
  const conc = medication.concentrations[concIndex];

  if (!dose) {
    return (
      <article className="rounded-2xl border border-slate-800 bg-[#131b2e] p-4">
        <h3 className="text-lg font-bold text-slate-100">{medication.name}</h3>
        <WarningBanner level="info">Enter actual weight to select the applicable dose band.</WarningBanner>
        <div className="mt-2">
          <SourceBadge sourceIds={medication.sourceIds} />
        </div>
      </article>
    );
  }

  const weightBased = isWeightBased(dose);
  const needsWeight = weightBased && biometrics === null;
  const lo = dose.min ?? dose.default ?? 0;
  const hi = dose.max ?? dose.default ?? lo;
  const value = doseValues[dose.id] ?? dose.default ?? lo;
  const adjustable = hi > lo;

  const prefApplies = weightBased && preferredScalar !== 'auto' && dose.scalarBasis !== 'label';
  const scalar: WeightScalar | undefined = weightBased
    ? (scalarOverrides[dose.id] ?? (prefApplies ? (preferredScalar as WeightScalar) : dose.scalar) ?? 'TBW')
    : undefined;

  const resolvedMax = dose.absoluteMax
    ? resolveWithOverrides(`dose-max:${dose.id}`, dose.absoluteMax.value, guidelineSet)
    : null;

  const computed: DoseComputation | null = needsWeight
    ? null
    : computeMedicationDose(dose, value, conc.mgPerMl, biometrics ?? STUB_BIOMETRICS, {
        scalarOverride: scalar,
        absoluteMax: dose.absoluteMax && resolvedMax ? { ...dose.absoluteMax, value: resolvedMax.value } : undefined,
        companion: medication.companion
          ? {
              name: medication.companion.name,
              ratioMgPerMg: medication.companion.ratioMgPerMg,
              concentrationMgPerMl: medication.companion.concentrationMgPerMl,
            }
          : undefined,
      });

  const step = adjustable ? stepFor(lo, hi) : 0;
  const maxLabel = dose.absoluteMax
    ? `${resolvedMax?.value ?? dose.absoluteMax.value} ${dose.absoluteMax.unit}${dose.absoluteMax.scope ? ` (${dose.absoluteMax.scope})` : ''}`
    : '';

  const maxTone =
    computed?.max === 'exceeds' || computed?.max === 'at-limit'
      ? 'red'
      : computed?.percentOfMax !== undefined && computed.percentOfMax >= 90
        ? 'amber'
        : null;

  const sourceIds = [...new Set([...dose.sourceIds, conc.sourceId, ...(resolvedMax?.tag === 'Local protocol' ? ['local-protocol'] : [])])];

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-[#131b2e] p-3 shadow-lg sm:p-4">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-tight text-slate-100">{medication.name}</h3>
          <p className="text-xs text-slate-400">{medication.class}</p>
        </div>
        <SourceBadge sourceIds={sourceIds} />
      </header>

      {applicable.length > 1 && (
        <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Dose / indication">
          {applicable.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={d.id === dose.id}
              onClick={() => {
                setSelectedDose(medication.id, d.id);
                touchRecent(medication.id);
              }}
              className={`min-h-[48px] rounded-xl border px-3 py-2 text-left text-xs font-semibold touch-manipulation ${
                d.id === dose.id ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100' : 'border-slate-700 bg-slate-900 text-slate-300'
              }`}
            >
              {d.indication}
            </button>
          ))}
        </div>
      )}
      {applicable.length === 1 && <p className="text-sm font-semibold text-slate-200">{dose.indication}</p>}

      {/* Absolute-maximum warning goes ABOVE the result so it cannot be missed. */}
      {computed && maxTone && (
        <WarningBanner level={maxTone} title={computed.max === 'exceeds' ? 'Exceeds absolute maximum' : computed.max === 'at-limit' ? 'Reaches absolute maximum' : 'Approaching absolute maximum'}>
          Calculated dose is {computed.percentOfMax !== undefined ? `${Math.round(computed.percentOfMax)}% of` : 'at'} the ceiling of {maxLabel}. Do not
          exceed the ceiling. {resolvedMax?.tag === 'Local protocol' && 'Ceiling set by Local protocol.'}
        </WarningBanner>
      )}
      {resolvedMax?.conflict && (
        <WarningBanner level="amber" title="Guideline vs local protocol">
          Guideline ceiling {resolvedMax.guidelineValue}, local protocol {resolvedMax.localValue}. {resolvedMax.origin === 'local-selected' ? 'Using local protocol.' : 'Using the guideline value; select "Use local protocol" in Settings to use the local value.'}
        </WarningBanner>
      )}
      {conc.requiresDilution && (
        <WarningBanner level="amber" title="Dilute before IV use">
          The {conc.label} presentation must be diluted per the preparation notes before intravenous use.
        </WarningBanner>
      )}

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-slate-400">
            Source range: {dose.min ?? dose.default}
            {dose.max !== undefined && dose.max !== dose.min ? `-${dose.max}` : ''} {dose.unit}
          </span>
          {scalar && scalarWeightKgOrNull(biometrics, scalar) !== null && (
            <WeightScalarBadge scalar={scalar} kg={scalarWeightKgOrNull(biometrics, scalar) ?? 0} basis={dose.scalarBasis} />
          )}
        </div>

        {adjustable ? (
          <NumericStepper
            label="Selected dose"
            value={value}
            unit={dose.unit}
            step={step}
            min={lo}
            max={hi}
            decimals={decimalsFor(step)}
            onChange={(v) => {
              setDoseValue(dose.id, v);
              touchRecent(medication.id);
            }}
            allowKeypad
            keypadTitle={`Selected dose (${dose.unit})`}
          />
        ) : (
          <UnitValue label="Selected dose" value={String(value)} unit={dose.unit} tone="neutral" size="md" />
        )}

        {weightBased && (
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Weight scalar</span>
            <SegmentedControl
              ariaLabel="Weight scalar"
              value={scalar ?? 'TBW'}
              options={SCALARS}
              onChange={(s) => setScalarOverride(dose.id, s)}
            />
          </div>
        )}

        {needsWeight && <WarningBanner level="info">Enter actual weight and height to calculate this weight-based dose.</WarningBanner>}

        {computed?.kind === 'bolus' && computed.bolus && (
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2">
            <UnitValue label="Total" value={fmtMass(computed.bolus.mass, computed.bolus.massUnit)} unit={computed.bolus.massUnit} size="lg" tone={computed.max === 'ok' ? 'neutral' : 'red'} />
            <UnitValue label={`Volume at ${conc.label}`} value={fmtVolume(computed.bolus.volumeMl)} unit="mL" size="lg" tone="cyan" align="end" />
          </div>
        )}
        {computed?.kind === 'infusion' && computed.infusion && (
          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2">
            <UnitValue label="Rate" value={computed.infusion.mcgPerMin.toFixed(1)} unit="mcg/min" size="lg" tone={computed.max === 'ok' ? 'neutral' : 'red'} />
            <UnitValue label={`Pump at ${conc.label}`} value={computed.infusion.mlPerHr.toFixed(1)} unit="mL/hr" size="lg" tone="cyan" align="end" />
          </div>
        )}

        {computed?.companion && (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs">
            <span className="flex items-center gap-1 font-bold uppercase text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> {computed.companion.name}
            </span>
            <span className="font-mono font-bold tabular-nums text-emerald-200">
              {formatMg(computed.companion.massMg)} mg = {fmtVolume(computed.companion.volumeMl)} mL
            </span>
          </div>
        )}
      </div>

      <ConcentrationSelector
        options={medication.concentrations}
        selectedIndex={concIndex}
        onChange={(i) => setConcentrationChoice(medication.id, medication.concentrations[i].mgPerMl)}
      />

      <div>
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex min-h-[48px] w-full items-center justify-between text-xs font-semibold text-slate-400 hover:text-cyan-300"
          aria-expanded={showDetails}
        >
          <span className="flex items-center gap-1">
            <FlaskConical className="h-4 w-4" /> Preparation, cautions and notes
          </span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showDetails && (
          <ul className="mt-1 flex list-disc flex-col gap-1 pl-5 text-xs text-slate-300">
            {[...(dose.notes ?? []), ...(medication.preparation ?? []), ...(medication.cautions ?? [])].map((n) => (
              <li key={n}>{n}</li>
            ))}
            {[...(dose.notes ?? []), ...(medication.preparation ?? []), ...(medication.cautions ?? [])].length === 0 && (
              <li className="list-none text-slate-500">No additional notes in the selected sources.</li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
};

const scalarWeightKgOrNull = (b: Biometrics | null, s: WeightScalar): number | null =>
  b === null ? null : scalarWeightKg(b, s);
