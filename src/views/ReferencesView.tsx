import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, ExternalLink, X } from 'lucide-react';
import { derivedValuesBySource } from '../data/derived';
import { DATA_STATUS, DATA_VERSION, SOURCES } from '../data/sources';
import type { ClinicalSource } from '../data/types';
import { useAppStore } from '../store/useAppStore';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { WarningBanner } from '../components/ui/WarningBanner';

const TIER_TITLES: Record<number, string> = {
  1: 'Tier 1: Society and guideline sources',
  2: 'Tier 2: Drug references (product labels)',
  3: 'Tier 3: Evidence syntheses and secondary references',
  4: 'Tier 4: Local protocol and app-generated',
};

const VERIFICATION: Record<ClinicalSource['verification'], { text: string; cls: string }> = {
  primary: { text: 'Primary text read', cls: 'border-emerald-500/50 text-emerald-300' },
  label: { text: 'Label dosing section read', cls: 'border-emerald-500/50 text-emerald-300' },
  secondary: { text: 'Not fully verified', cls: 'border-amber-500/60 text-amber-300' },
};

const SourceRow: React.FC<{ source: ClinicalSource; values: string[] }> = ({ source, values }) => {
  const [open, setOpen] = useState(false);
  const v = VERIFICATION[source.verification];
  return (
    <li className="rounded-xl border border-slate-800 bg-slate-900">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-[48px] w-full items-start justify-between gap-2 p-3 text-left">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-100">
            {source.tag} <span className="font-normal text-slate-400">· {source.year}{source.version ? ` · ${source.version}` : ''}</span>
          </span>
          <span className="block text-xs text-slate-300">{source.name}</span>
          <span className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase ${v.cls}`}>{v.text}</span>
          <span className="ml-1 text-[10px] text-slate-500">{values.length} derived value{values.length === 1 ? '' : 's'}</span>
        </span>
        {open ? <ChevronUp className="mt-1 h-4 w-4 shrink-0" /> : <ChevronDown className="mt-1 h-4 w-4 shrink-0" />}
      </button>
      {open && (
        <div className="flex flex-col gap-2 border-t border-slate-800 p-3 text-xs text-slate-300">
          <p>{source.publisher}</p>
          {source.url && (
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[48px] items-center gap-1 break-all text-cyan-300 underline">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" /> {source.url}
            </a>
          )}
          {source.accessNote && <p className="rounded-lg bg-slate-950 p-2 text-slate-300">{source.accessNote}</p>}
          <p className="font-semibold text-slate-200">Values derived from this source</p>
          {values.length === 0 ? (
            <p className="text-slate-500">None in this build.</p>
          ) : (
            <ul className="list-disc pl-5">
              {values.slice(0, 60).map((x, i) => (
                <li key={`${i}-${x}`}>{x}</li>
              ))}
              {values.length > 60 && <li>... and {values.length - 60} more</li>}
            </ul>
          )}
        </div>
      )}
    </li>
  );
};

export const ReferencesView: React.FC = () => {
  const open = useAppStore((s) => s.referencesOpen);
  const setOpen = useAppStore((s) => s.setReferencesOpen);
  const derived = useMemo(() => derivedValuesBySource(), []);

  if (!open) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="References" className="fixed inset-0 z-[58] flex flex-col bg-[#090d16]">
      <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2">
        <h2 className="flex-1 text-lg font-black uppercase text-slate-100">References</h2>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close references" className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-200">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <WarningBanner level="amber" title={`Clinical data version ${DATA_VERSION}`}>
            {DATA_STATUS} Amber dots on source badges mark sources whose primary text was not fully verified.
          </WarningBanner>
          {[1, 2, 3, 4].map((tier) => (
            <section key={tier} className="flex flex-col gap-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-cyan-300">{TIER_TITLES[tier]}</h3>
              <ul className="flex flex-col gap-2">
                {SOURCES.filter((s) => s.tier === tier).map((s) => (
                  <SourceRow key={s.id} source={s} values={derived[s.id] ?? []} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <DisclaimerBanner />
    </div>,
    document.body,
  );
};
