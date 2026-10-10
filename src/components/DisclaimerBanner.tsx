import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <aside aria-label="Clinical Disclaimer" className="w-full bg-slate-900/90 border-t border-slate-800/80 px-3 py-2 text-center">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium leading-tight">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong className="text-slate-300">Cognitive & Educational Aid:</strong> Clinical judgment supercedes all calculated suggestions. Always verify vial concentrations before injection.
        </span>
      </div>
    </aside>
  );
};
