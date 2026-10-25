import React from 'react';
import { Check } from 'lucide-react';
import { currentStepIndex, type FlowStep } from '../../lib/flow';

interface StepFlowProps {
  steps: FlowStep[];
}

/** Derived, read-only checklist: the first undone step is "Now". State is text + icon, never colour alone. */
export const StepFlow: React.FC<StepFlowProps> = ({ steps }) => {
  const current = currentStepIndex(steps);

  return (
    <ol className="flex flex-col gap-2" aria-label="Flow steps">
      {steps.map((step, index) => {
        const isCurrent = index === current;
        const tone = step.done
          ? 'border-clinical-emerald/60 bg-clinical-emerald/10 text-clinical-emerald'
          : isCurrent
            ? 'border-clinical-cyan bg-clinical-cyan/10 text-clinical-cyan shadow-glow-cyan'
            : 'border-clinical-border text-slate-400';
        const state = step.done ? 'Done' : isCurrent ? 'Now' : 'Next';
        return (
          <li
            key={step.id}
            aria-current={isCurrent ? 'step' : undefined}
            className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-3 py-2 ${tone}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current font-mono text-xs">
              {step.done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{step.label}</p>
              {isCurrent && step.hint && <p className="mt-0.5 text-xs text-clinical-cyan">{step.hint}</p>}
            </div>
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-widest">{state}</span>
          </li>
        );
      })}
    </ol>
  );
};
