import React, { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import {
  AIRWAY_PRINCIPLES,
  AIRWAY_UNSOURCED,
  LMA_MAX_CUFF_PRESSURE_CMH2O,
  PEDS_ETT_AGE_RANGE_YEARS,
  PEDS_ETT_FORMULAS,
} from '../data/airwayDevices';
import { useAppStore } from '../store/useAppStore';
import { lmaSizeForWeight, pedsBladeForAge, pedsEtt } from '../lib/calc/airway';
import { NumericStepper } from '../components/ui/NumericStepper';
import { NoSourceValue } from '../components/ui/NoSourceValue';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { SourceBadge } from '../components/ui/SourceBadge';
import { UnitValue } from '../components/ui/UnitValue';
import { WarningBanner } from '../components/ui/WarningBanner';

type Population = 'adult' | 'pediatric';

const Card: React.FC<{ title: string; basis: string; sourceIds: string[]; children: React.ReactNode }> = ({ title, basis, sourceIds, children }) => (
  <section className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-[#131b2e] p-3">
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-base font-bold text-slate-100">{title}</h3>
      <span className="rounded-md border border-slate-700 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">Basis: {basis}</span>
    </div>
    {children}
    <SourceBadge sourceIds={sourceIds} />
  </section>
);

export const AirwayView: React.FC = () => {
  const patient = useAppStore((s) => s.patient);
  const setPatient = useAppStore((s) => s.setPatient);
  const openEmergency = useAppStore((s) => s.openEmergency);
  const [population, setPopulation] = useState<Population>(
    patient.ageYears !== null && patient.ageYears < 18 ? 'pediatric' : 'adult',
  );
  const [ageUnit, setAgeUnit] = useState<'years' | 'months'>('years');

  const ageYears = patient.ageYears;
  const ageMonths = ageYears === null ? null : ageYears * 12;
  const lma = patient.tbwKg !== null ? lmaSizeForWeight(patient.tbwKg) : null;

  const ageDisplay = ageYears === null ? null : ageUnit === 'years' ? Math.round(ageYears * 100) / 100 : Math.round(ageYears * 12);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <SegmentedControl<Population>
        ariaLabel="Population"
        value={population}
        options={[
          { value: 'adult', label: 'Adult' },
          { value: 'pediatric', label: 'Pediatric' },
        ]}
        onChange={setPopulation}
      />

      <button
        type="button"
        onClick={() => openEmergency('cico')}
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-red-500 bg-red-500/15 px-3 text-sm font-black uppercase text-red-200"
      >
        <AlertOctagon className="h-5 w-5" /> CICO / failed airway pathway
      </button>

      <WarningBanner level="info" title="ASA difficult airway principles">
        <ul className="list-disc pl-4">
          {AIRWAY_PRINCIPLES.map((p) => (
            <li key={p.text}>{p.text}</li>
          ))}
        </ul>
      </WarningBanner>

      {population === 'pediatric' && (
        <>
          <section className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-3">
            <SegmentedControl<'years' | 'months'>
              ariaLabel="Age unit"
              value={ageUnit}
              options={[
                { value: 'years', label: 'Years' },
                { value: 'months', label: 'Months' },
              ]}
              onChange={setAgeUnit}
            />
            <NumericStepper
              label={`Age (${ageUnit})`}
              value={ageDisplay}
              unit={ageUnit === 'years' ? 'y' : 'mo'}
              step={1}
              min={0}
              max={ageUnit === 'years' ? 18 : 216}
              decimals={ageUnit === 'years' && ageYears !== null && !Number.isInteger(ageYears) ? 2 : 0}
              onChange={(v) => setPatient({ ageYears: ageUnit === 'years' ? v : v / 12 })}
              keypadTitle="Enter age"
            />
          </section>

          {ageYears === null ? (
            <WarningBanner level="info">Enter the child&apos;s age to size tubes and blades.</WarningBanner>
          ) : (
            <>
              <Card title="Endotracheal tube (pediatric)" basis="age" sourceIds={['msd-peds-ett', 'iowa-peds-ett', 'asa-airway-2022']}>
                {(['cuffed-msd', 'uncuffed-msd'] as const).map((fid) => {
                  const r = pedsEtt(ageYears, fid);
                  const formula = PEDS_ETT_FORMULAS.find((f) => f.id === fid);
                  if (!r.ok) {
                    return (
                      <div key={fid}>
                        <NoSourceValue topic={`ETT ${formula?.cuffed ? 'cuffed' : 'uncuffed'}`} />
                        <p className="mt-1 text-xs text-slate-400">{r.reason}</p>
                      </div>
                    );
                  }
                  return (
                    <div key={fid} className="rounded-xl bg-slate-950 p-2">
                      <p className="text-xs font-semibold uppercase text-slate-400">{formula?.label}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <UnitValue label={formula?.cuffed ? 'ETT cuffed' : 'ETT uncuffed'} value={r.idRoundedMm.toFixed(1)} unit="mm ID" size="lg" tone="cyan" />
                        <UnitValue label="Oral depth (3 x ID)" value={r.depthCm.toFixed(1)} unit="cm" size="lg" align="end" />
                      </div>
                      <p className="font-mono text-xs text-slate-400">Unrounded ID {r.idMm.toFixed(2)} mm</p>
                    </div>
                  );
                })}
                {(() => {
                  const alt = pedsEtt(ageYears, 'cuffed-iowa');
                  return alt.ok ? (
                    <WarningBanner level="amber" title="Sources differ (cuffed)">
                      The alternate cuffed formula (age/4 + 3) gives {alt.idRoundedMm.toFixed(1)} mm. Have the adjacent sizes ready.
                    </WarningBanner>
                  ) : null;
                })()}
                <p className="text-xs text-slate-400">
                  Source formulas cover ages {PEDS_ETT_AGE_RANGE_YEARS.min} to {PEDS_ETT_AGE_RANGE_YEARS.max} years. Confirm tube position with capnography and auscultation and check cuff pressure.
                </p>
              </Card>

              <Card title="Laryngoscope blade (pediatric)" basis="age" sourceIds={['wikem-peds-airway']}>
                {ageMonths !== null && pedsBladeForAge(ageMonths) ? (
                  <UnitValue label={pedsBladeForAge(ageMonths)?.label ?? ''} value={pedsBladeForAge(ageMonths)?.blade ?? ''} unit="" size="lg" tone="cyan" />
                ) : (
                  <NoSourceValue topic="Blade for this age" />
                )}
              </Card>
            </>
          )}
        </>
      )}

      <Card title="Laryngeal mask airway (LMA Classic)" basis="weight" sourceIds={['teleflex-lma', 'esafe-lma-cuff']}>
        {patient.tbwKg === null ? (
          <WarningBanner level="info">Enter actual weight to size an LMA.</WarningBanner>
        ) : lma && lma.ok ? (
          <>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-2">
              <UnitValue label={`Weight ${patient.tbwKg.toFixed(1)} kg`} value={`LMA ${lma.band.size}`} unit="" size="xl" tone="cyan" />
              <UnitValue label="Max cuff volume (ceiling)" value={String(lma.band.maxCuffVolumeMl)} unit="mL" size="lg" align="end" />
            </div>
            {lma.borderlineNext && (
              <WarningBanner level="amber" title="On a size boundary">
                Weight sits exactly between size {lma.band.size} and size {lma.borderlineNext.size}. Choose by clinical judgment.
              </WarningBanner>
            )}
            <p className="text-xs text-slate-300">
              Maximum cuff pressure {LMA_MAX_CUFF_PRESSURE_CMH2O} cmH2O. The cuff volume is a ceiling, not a target: inflate to a seal, and measure cuff pressure. Weight-based sizing is approximate.
            </p>
          </>
        ) : (
          <NoSourceValue topic="LMA size" />
        )}
      </Card>

      <Card title="Oropharyngeal and nasopharyngeal airway" basis="clinical" sourceIds={['rch-airway', 'wikem-peds-airway']}>
        <ul className="list-disc pl-5 text-sm text-slate-200">
          <li>Oropharyngeal: centre of the incisors to the angle of the mandible, measured with the airway on the face.</li>
          <li>Nasopharyngeal: tip of the nose to the tragus.</li>
        </ul>
        <NoSourceValue topic="OPA / NPA size by age or sex" compact />
      </Card>

      <section className="flex flex-col gap-2" aria-label="Items without a sourced value">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">No sourced value in this build</h3>
        {AIRWAY_UNSOURCED.map((t) => (
          <NoSourceValue key={t} topic={t} compact />
        ))}
      </section>
    </div>
  );
};
