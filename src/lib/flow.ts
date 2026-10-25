export interface FlowStep { id: string; label: string; done: boolean; hint?: string }

/** Index of the first undone step; steps.length when everything is done. */
export const currentStepIndex = (steps: FlowStep[]): number => {
  const i = steps.findIndex((st) => !st.done);
  return i === -1 ? steps.length : i;
};
