import React from 'react';
import { SourceBadge } from '../ui/SourceBadge';

type BigValueTone = 'info' | 'ok' | 'amber' | 'red';

interface BigValueProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: BigValueTone;
  /** A calculated figure should always carry its sources. */
  sourceIds?: string[];
}

const TONE: Record<BigValueTone, string> = {
  info: 'text-clinical-cyan [text-shadow:0_0_14px_rgba(6,182,212,0.55)]',
  ok: 'text-clinical-emerald [text-shadow:0_0_14px_rgba(16,185,129,0.55)]',
  amber: 'text-clinical-amber [text-shadow:0_0_14px_rgba(245,158,11,0.55)]',
  red: 'text-clinical-red [text-shadow:0_0_14px_rgba(239,68,68,0.6)]',
};

export const BigValue: React.FC<BigValueProps> = ({ label, value, unit, tone = 'info', sourceIds }) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</span>
    <span className="flex items-baseline gap-1">
      <span className={`font-mono text-3xl font-bold tabular-nums leading-none ${TONE[tone]}`}>{value}</span>
      {unit && <span className="font-mono text-xs text-slate-400">{unit}</span>}
    </span>
    {sourceIds && <SourceBadge sourceIds={sourceIds} />}
  </div>
);
