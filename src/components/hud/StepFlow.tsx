import React from 'react';
import { currentStepIndex, type FlowStep } from '../../lib/flow';

interface StepFlowProps {
  steps: FlowStep[];
}

export const StepFlow: React.FC<StepFlowProps> = ({ steps }) => {
  const current = currentStepIndex(steps);

  return (
    <div className="flex flex-col gap-2" aria-label="Flow steps">
      {steps.map((step, index) => {
        const isCurrent = index === current;
        const tone = step.done
          ? 'border-clinical-emerald/60 bg-clinical-emerald/10 text-clinical-emerald'
          : isCurrent
            ? 'border-clinical-cyan bg-clinical-cyan/10 text-clinical-cyan shadow-glow-cyan'
            : 'border-clinical-border text-slate-500 opacity-60';
        return (
          <div
            key={step.id}
            aria-current={isCurrent ? 'step' : undefined}
            className={`flex min-h-[48px] items-center gap-3 rounded-xl border px-3 py-2 ${tone}`}
          >
            <span className="w-5 shrink-0 text-center font-mono text-xs">{step.done ? '✓' : index + 1}</span>
            <div>
              <p className="text-sm font-bold">{step.label}</p>
              {isCurrent && step.hint && <p className="mt-0.5 text-xs text-clinical-cyan">{step.hint}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
