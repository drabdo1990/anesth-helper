import React from 'react';
import { AlertCircle } from 'lucide-react';

/** Permanent, non-dismissable disclaimer. Rendered once in the app shell so it shows on every screen. */
export const DisclaimerBanner: React.FC = () => (
  <aside aria-label="Clinical disclaimer" className="w-full border-t border-slate-800/80 bg-slate-900/90 px-3 py-2 text-center">
    <p className="mx-auto flex max-w-4xl items-center justify-center gap-1.5 text-[11px] font-medium leading-tight text-slate-300">
      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-400" />
      <span>Educational and cognitive aid. Clinical judgment supercedes all calculated suggestions.</span>
    </p>
  </aside>
);
