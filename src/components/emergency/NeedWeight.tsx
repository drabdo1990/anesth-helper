import React from 'react';

/** Shown in place of weight-based dose blocks until a weight is entered; first-response steps stay visible. */
export const NeedWeight: React.FC = () => (
  <p className="rounded-2xl border-2 border-dashed border-red-500 p-4 text-center text-lg font-bold text-red-200">
    Enter actual body weight above to calculate doses.
  </p>
);
