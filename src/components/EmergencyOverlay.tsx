import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useAppStore, type EmergencyKind } from '../store/useAppStore';
import { MAX_WEIGHT_KG } from '../lib/calc/biometrics';
import { DisclaimerBanner } from './DisclaimerBanner';
import { CicoPanel } from './emergency/CicoPanel';
import { LastPanel } from './emergency/LastPanel';
import { MhPanel } from './emergency/MhPanel';
import { NumericStepper } from './ui/NumericStepper';
import { SegmentedControl } from './ui/SegmentedControl';

const OPTIONS: { value: EmergencyKind; label: string }[] = [
  { value: 'last', label: 'LAST' },
  { value: 'mh', label: 'MH' },
  { value: 'cico', label: 'CICO' },
];

export const EmergencyOverlay: React.FC = () => {
  const open = useAppStore((s) => s.emergencyOpen);
  const kind = useAppStore((s) => s.emergencyKind);
  const setKind = useAppStore((s) => s.setEmergencyKind);
  const close = useAppStore((s) => s.closeEmergency);
  const weight = useAppStore((s) => s.patient.tbwKg);
  const setPatient = useAppStore((s) => s.setPatient);

  if (!open) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Emergency support" className="fixed inset-0 z-[60] flex flex-col bg-[#090d16]">
      <div className="flex items-center gap-2 border-b-4 border-red-500 bg-red-950 px-3 py-2">
        <h2 className="flex-1 text-xl font-black uppercase tracking-wide text-red-100">Emergency</h2>
        <button type="button" onClick={close} aria-label="Close emergency support" className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-red-400 bg-red-900 text-red-100">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="border-b border-slate-800 px-3 py-2">
        <SegmentedControl<EmergencyKind> ariaLabel="Emergency type" tone="red" value={kind} options={OPTIONS} onChange={setKind} />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {kind !== 'cico' && (
            <NumericStepper
              label="Actual body weight (used for this protocol)"
              value={weight}
              unit="kg"
              step={1}
              coarseStep={5}
              decimals={1}
              min={1}
              max={MAX_WEIGHT_KG}
              emptyText="Tap to enter actual weight"
              onChange={(v) => setPatient({ tbwKg: v })}
              keypadTitle="Enter actual weight"
            />
          )}
          {kind === 'last' && (weight !== null ? <LastPanel weightKg={weight} /> : <NeedWeight />)}
          {kind === 'mh' && (weight !== null ? <MhPanel weightKg={weight} /> : <NeedWeight />)}
          {kind === 'cico' && <CicoPanel />}
        </div>
      </div>
      <DisclaimerBanner />
    </div>,
    document.body,
  );
};

const NeedWeight: React.FC = () => (
  <p className="rounded-2xl border-2 border-dashed border-red-500 p-4 text-center text-lg font-bold text-red-200">
    Enter actual body weight above to calculate doses.
  </p>
);
