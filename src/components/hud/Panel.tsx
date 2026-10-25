import React from 'react';
import { SourceBadge } from '../ui/SourceBadge';

type PanelTone = 'cyan' | 'ok' | 'amber' | 'red';

interface PanelProps {
  title: string;
  basis?: string;
  sourceIds?: string[];
  tone?: PanelTone;
  children: React.ReactNode;
}

const TONE: Record<PanelTone, string> = {
  cyan: 'border-clinical-cyan shadow-glow-cyan',
  ok: 'border-clinical-emerald shadow-glow-emerald',
  amber: 'border-clinical-amber shadow-glow-amber',
  red: 'border-clinical-red shadow-glow-red',
};

export const Panel: React.FC<PanelProps> = ({ title, basis, sourceIds, tone, children }) => (
  <section className={`flex flex-col gap-2 rounded-2xl border bg-clinical-card p-3 ${tone ? TONE[tone] : 'border-clinical-border'}`}>
    <div className="flex items-start justify-between gap-2">
      <h3 className="text-base font-bold text-slate-100">{title}</h3>
      {basis && <span className="rounded-md border border-clinical-border-light px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">Basis: {basis}</span>}
    </div>
    {children}
    {sourceIds && <SourceBadge sourceIds={sourceIds} />}
  </section>
);
