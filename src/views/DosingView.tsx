import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORY_LABELS, CATEGORY_ORDER, CATEGORY_PLACEHOLDERS, MEDICATIONS } from '../data/medications';
import { useAppStore } from '../store/useAppStore';
import { useBiometricResult } from '../store/useBiometrics';
import { DrugCard } from '../components/DrugCard';
import { LocalAnestheticPanel } from '../components/LocalAnestheticPanel';
import { NeuraxialReference } from '../components/NeuraxialReference';
import { ReferenceDrugsPanel } from '../components/ReferenceDrugsPanel';
import { OTHER_REFERENCE_FILTER, OTHER_REFERENCE_LABEL, type DosingFilter } from '../data/referenceGroups';
import { NoSourceValue } from '../components/ui/NoSourceValue';

type Filter = DosingFilter;

export const DosingView: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const recents = useAppStore((s) => s.recents);
  const result = useBiometricResult();
  const biometrics = result.ok ? result.value : null;

  const q = query.trim().toLowerCase();
  const visibleCategories = useMemo(
    () => CATEGORY_ORDER.filter((c) => filter === 'all' || filter === c),
    [filter],
  );

  const matches = (name: string, cls: string): boolean => q === '' || name.toLowerCase().includes(q) || cls.toLowerCase().includes(q);
  const recentMeds = recents.map((id) => MEDICATIONS.find((m) => m.id === id)).filter((m) => m !== undefined);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search drug or class"
          className="min-h-[48px] w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          aria-label="Search drugs"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Drug categories">
        {([
          { id: 'all', label: 'All' },
          ...CATEGORY_ORDER.map((c) => ({ id: c, label: CATEGORY_LABELS[c] })),
          { id: OTHER_REFERENCE_FILTER, label: OTHER_REFERENCE_LABEL },
        ] as { id: Filter; label: string }[]).map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={filter === c.id}
            onClick={() => setFilter(c.id)}
            className={`min-h-[48px] shrink-0 rounded-xl border px-3 text-xs font-bold ${filter === c.id ? 'border-cyan-400 bg-cyan-500 text-slate-950' : 'border-slate-800 bg-slate-900 text-slate-300'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {filter === 'all' && q === '' && recentMeds.length > 0 && (
        <p className="text-xs text-slate-400">
          Recently used: {recentMeds.map((m) => m?.name).join(', ')}
        </p>
      )}

      {visibleCategories.map((cat) => {
        const meds = MEDICATIONS.filter((m) => m.category === cat && matches(m.name, m.class));
        const placeholders = CATEGORY_PLACEHOLDERS.filter((p) => p.category === cat && (q === '' || p.topic.toLowerCase().includes(q)));
        if (cat === 'local' && q !== '' && !'local anesthetic lidocaine bupivacaine ropivacaine mepivacaine chloroprocaine'.includes(q)) return null;
        if (meds.length === 0 && placeholders.length === 0 && cat !== 'local') return null;
        return (
          <section key={cat} className="flex flex-col gap-3" aria-label={CATEGORY_LABELS[cat]}>
            <h2 className="text-sm font-black uppercase tracking-wider text-cyan-300">{CATEGORY_LABELS[cat]}</h2>
            {cat === 'local' ? (
              <>
                <LocalAnestheticPanel biometrics={biometrics} />
                <NeuraxialReference />
              </>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {meds.map((m) => (
                  <DrugCard key={m.id} medication={m} biometrics={biometrics} />
                ))}
                {placeholders.map((p) => (
                  <NoSourceValue key={p.topic} topic={p.topic} />
                ))}
              </div>
            )}
          </section>
        );
      })}

      <ReferenceDrugsPanel query={q} filter={filter} />
    </div>
  );
};
