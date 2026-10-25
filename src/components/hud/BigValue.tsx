import React from 'react';

type BigValueTone = 'ok' | 'amber' | 'red';

interface BigValueProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: BigValueTone;
}

const TONE: Record<BigValueTone, string> = {
  ok: 'text-clinical-emerald shadow-glow-emerald',
  amber: 'text-clinical-amber shadow-glow-amber',
  red: 'text-clinical-red shadow-glow-red',
};

export const BigValue: React.FC<BigValueProps> = ({ label, value, unit, tone }) => (
  <div className="flex flex-col">
    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
    <span className="flex items-baseline gap-1">
      <span className={`text-3xl font-mono font-bold tabular-nums ${tone ? TONE[tone] : 'text-clinical-cyan shadow-glow-cyan'}`}>{value}</span>
      {unit && <span className="font-mono text-xs text-slate-400">{unit}</span>}
    </span>
  </div>
);
