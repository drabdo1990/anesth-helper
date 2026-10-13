import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ChecklistItemProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  note?: string;
  critical?: boolean;
  /** Larger text for emergency screens. */
  large?: boolean;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ checked, onToggle, label, note, critical, large }) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={onToggle}
    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left select-none touch-manipulation min-h-[48px] transition-colors ${
      checked
        ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-100'
        : critical
          ? 'border-slate-700 bg-slate-950/80 text-slate-100'
          : 'border-slate-800 bg-slate-950/50 text-slate-200'
    }`}
  >
    {checked ? (
      <CheckCircle2 className={`mt-0.5 shrink-0 text-emerald-400 ${large ? 'h-7 w-7' : 'h-5 w-5'}`} />
    ) : (
      <Circle className={`mt-0.5 shrink-0 ${critical ? 'text-red-400' : 'text-slate-500'} ${large ? 'h-7 w-7' : 'h-5 w-5'}`} />
    )}
    <span className="min-w-0 flex-1">
      <span className={`block font-semibold leading-snug ${large ? 'text-lg' : 'text-sm'} ${checked ? 'line-through opacity-70' : ''}`}>{label}</span>
      {note && !checked && <span className={`mt-1 block text-slate-400 ${large ? 'text-sm' : 'text-xs'}`}>{note}</span>}
    </span>
  </button>
);
