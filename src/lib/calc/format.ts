// Display-only rounding. Never feed rounded values back into calculations or limit checks.

/** mg: one decimal place unless below 1 mg (then two). */
export const formatMg = (mg: number): string => (Math.abs(mg) < 1 ? mg.toFixed(2) : mg.toFixed(1));

/** mcg: whole number unless below 10 mcg (then one decimal). */
export const formatMcg = (mcg: number): string => (Math.abs(mcg) < 10 ? mcg.toFixed(1) : mcg.toFixed(0));

/** mL: one decimal place. */
export const formatMl = (ml: number): string => ml.toFixed(1);

export const formatKg = (kg: number): string => kg.toFixed(1);
