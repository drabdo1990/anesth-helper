import { expect, test, type Page } from '@playwright/test';

/**
 * Pediatric dose audit. Each row is [indication, default dose per kg, absolute single-dose cap, unit of the
 * total] taken from the source data's pediatric entries. The expected total is computed here as
 *   min(default x weight, cap)
 * and compared with the TOTAL the real UI shows after selecting that dose. Nothing is read from the app's
 * own calculation, so a wrong formula, scalar, rounding or cap in the app shows up as a mismatch.
 */
type Row = { name: string; indication: string; perKg: number; cap: number | null; unit: 'mg' | 'mcg' };
const ROWS: Row[] = [
  { name: 'midazolam IV', indication: 'Preoperative sedation IV (pediatric 6 mo – 12 yr)', perKg: 0.05, cap: 2, unit: 'mg' },
  { name: 'midazolam PO', indication: 'Preoperative sedation Oral (pediatric)', perKg: 0.5, cap: 15, unit: 'mg' },
  { name: 'atropine', indication: 'Pediatric vagolysis / bradycardia premedication IV', perKg: 15, cap: 500, unit: 'mcg' },
  { name: 'propofol infant', indication: 'Pediatric induction IV, infant (< 2 yr)', perKg: 3.0, cap: 200, unit: 'mg' },
  { name: 'propofol child', indication: 'Pediatric induction IV, child (2–12 yr)', perKg: 2.5, cap: 200, unit: 'mg' },
  { name: 'propofol adolescent', indication: 'Pediatric induction IV, adolescent (12–18 yr)', perKg: 2.0, cap: 200, unit: 'mg' },
  { name: 'etomidate', indication: 'Pediatric induction IV (≥ 2 yr)', perKg: 0.2, cap: 20, unit: 'mg' },
  { name: 'ketamine IV', indication: 'Pediatric induction IV', perKg: 1.5, cap: 100, unit: 'mg' },
  { name: 'ketamine IM', indication: 'Pediatric induction / sedation IM', perKg: 5.0, cap: null, unit: 'mg' },
  { name: 'fentanyl', indication: 'Pediatric analgesia / induction bolus IV', perKg: 1.0, cap: 100, unit: 'mcg' },
  { name: 'morphine', indication: 'Pediatric analgesia IV', perKg: 0.05, cap: 4, unit: 'mg' },
  { name: 'acetaminophen', indication: 'Pediatric analgesia / antipyresis IV', perKg: 15, cap: 1000, unit: 'mg' },
  { name: 'ketorolac', indication: 'Pediatric analgesia IV (≥ 2 yr)', perKg: 0.5, cap: 15, unit: 'mg' },
  { name: 'rocuronium routine', indication: 'Pediatric routine intubation IV', perKg: 0.6, cap: 50, unit: 'mg' },
  { name: 'rocuronium RSI', indication: 'Pediatric rapid sequence intubation (RSI) IV', perKg: 1.2, cap: 100, unit: 'mg' },
  { name: 'succinylcholine infant', indication: 'Infant intubation IV (< 1 yr)', perKg: 2.0, cap: 150, unit: 'mg' },
  { name: 'succinylcholine child', indication: 'Child intubation IV (1–12 yr)', perKg: 1.0, cap: 150, unit: 'mg' },
  { name: 'succinylcholine IM', indication: 'Emergency IM intubation (no IV / CICO)', perKg: 3.0, cap: 150, unit: 'mg' },
  { name: 'sugammadex moderate', indication: 'Pediatric moderate block reversal (reappearance of T2, ≥ 2 yr)', perKg: 2, cap: null, unit: 'mg' },
  { name: 'sugammadex deep', indication: 'Pediatric deep block reversal (1–2 post-tetanic counts, ≥ 2 yr)', perKg: 4, cap: null, unit: 'mg' },
  { name: 'neostigmine', indication: 'Pediatric reversal of neuromuscular blockade IV', perKg: 0.05, cap: 5, unit: 'mg' },
  { name: 'glycopyrrolate reversal', indication: 'Pediatric reversal companion IV (with neostigmine)', perKg: 5, cap: 200, unit: 'mcg' },
  { name: 'phenylephrine', indication: 'Pediatric hypotension bolus IV', perKg: 2, cap: 100, unit: 'mcg' },
  { name: 'epinephrine arrest', indication: 'PALS IV/IO (cardiac arrest / symptomatic bradycardia)', perKg: 10, cap: 1000, unit: 'mcg' },
  { name: 'epinephrine anaphylaxis IM', indication: 'Pediatric anaphylaxis IM (anterolateral thigh)', perKg: 10, cap: 500, unit: 'mcg' },
  { name: 'ondansetron', indication: 'Pediatric PONV prophylaxis IV (over 2–5 min)', perKg: 0.1, cap: 4, unit: 'mg' },
  { name: 'dexamethasone', indication: 'Pediatric PONV prophylaxis IV (after induction)', perKg: 0.15, cap: 8, unit: 'mg' },
];

const keypad = async (page: Page, open: RegExp, digits: string) => {
  await page.getByRole('button', { name: open }).first().click();
  const dlg = page.getByRole('dialog');
  await dlg.getByRole('button', { name: 'Clear', exact: true }).click();
  for (const d of digits) await dlg.getByRole('button', { name: d, exact: true }).click();
  await dlg.getByRole('button', { name: 'Set', exact: true }).click();
  await expect(dlg).toBeHidden();
};

const openPediatricDosing = async (page: Page, kg: string, cm: string, age: string) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Intra-op' }).click();
  await page.getByRole('radio', { name: 'Dosing' }).click();
  await keypad(page, /^Enter Actual weight/, kg);
  await keypad(page, /^Enter Height/, cm);
  await page.getByRole('radio', { name: 'Male', exact: true }).click();
  await keypad(page, /^Age/, age);
  await expect(page.getByRole('radio', { name: 'Pediatric', exact: true })).toBeChecked();
};

/** Select the dose option whose label starts with `indication`, then read the TOTAL of the card it belongs to. */
const selectAndReadTotal = (page: Page, indication: string) =>
  page.evaluate(async (ind) => {
    // A multi-dose card shows each indication as a radio; a single-dose card shows it as plain text.
    // The label is "<indication>" optionally followed by "(<age bracket label>)" and an "Age match" tag.
    const matches = (el: HTMLElement) => {
      const t = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
      return t === ind || (t.startsWith(ind) && /^\(.*\)(Age match)?$/.test(t.slice(ind.length)));
    };
    const all = [...document.querySelectorAll<HTMLElement>('main *')].filter(matches);
    // deepest match = the element that carries the label itself, not a wrapper around the whole card
    const r = all.find((el) => !all.some((o) => o !== el && el.contains(o)));
    if (!r) return { found: false as const };
    r.click();
    await new Promise((res) => setTimeout(res, 80)); // let React re-render before reading the card
    let card: HTMLElement | null = r;
    while (card && !/TOTAL/i.test(card.innerText)) card = card.parentElement;
    const m = card?.innerText.replace(/\s+/g, ' ').match(/TOTAL\s*([\d.,]+)\s*(mg|mcg)/i);
    const warn = /exceed|maximum|cap|ceiling/i.test(card?.innerText ?? '');
    return { found: true as const, total: m ? parseFloat(m[1].replace(/,/g, '')) : null, unit: m ? m[2].toLowerCase() : null, warn };
  }, indication);

const expectedTotal = (row: Row, kg: number) => {
  const raw = row.perKg * kg;
  return row.cap !== null ? Math.min(raw, row.cap) : raw;
};

for (const patient of [
  { label: '20 kg, 5 y', kg: 20, cm: '110', age: '5' },
  { label: '50 kg, 10 y (exercises the absolute caps)', kg: 50, cm: '140', age: '10' },
]) {
  test(`P1 all ${ROWS.length} pediatric doses match min(dose x kg, cap): ${patient.label}`, async ({ page }) => {
    test.setTimeout(120_000);
    await openPediatricDosing(page, String(patient.kg), patient.cm, patient.age);
    const problems: string[] = [];
    for (const row of ROWS) {
      const got = await selectAndReadTotal(page, row.indication);
      if (!got.found) {
        problems.push(`${row.name}: dose option not found ("${row.indication}")`);
        continue;
      }
      const want = expectedTotal(row, patient.kg);
      if (got.total === null || got.unit !== row.unit) {
        problems.push(`${row.name}: could not read total (got ${got.total} ${got.unit}, expected unit ${row.unit})`);
      } else if (Math.abs(got.total - want) > Math.max(0.051, want * 0.005)) {
        const rawKg = row.perKg * patient.kg;
        problems.push(
          `${row.name}: expected ${want} ${row.unit}${row.cap !== null && rawKg > row.cap ? ` (raw ${rawKg} capped at ${row.cap})` : ''}, UI shows ${got.total} ${got.unit}${got.warn ? ' with a cap/ceiling warning' : ' with no warning'}`,
        );
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });
}

test('P2 pediatric propofol card auto-matches the age bracket (infant, child, adolescent)', async ({ page }) => {
  // propofol brackets from the data: infant < 2 y, child 2-12 y, adolescent 12-18 y
  for (const [age, kg, label] of [['1', '10', 'Infant (< 2 yr)'], ['6', '20', 'Child (2–12 yr)'], ['15', '55', 'Adolescent (12–18 yr)']] as const) {
    await openPediatricDosing(page, kg, '120', age);
    const selected = await page.evaluate(() => {
      const first = [...document.querySelectorAll<HTMLElement>('main [role=radio]')].find((r) => /Pediatric induction IV, /.test(r.textContent ?? ''));
      let c: HTMLElement | null = first ?? null;
      while (c && !/PROPOFOL/i.test(c.innerText)) c = c.parentElement;
      return c ? [...c.querySelectorAll<HTMLElement>('[role=radio][aria-checked=true]')].map((r) => (r.textContent ?? '').replace(/\s+/g, ' ')) : [];
    });
    expect(selected.join(' | '), `age ${age}`).toContain(label);
  }
});

test('P4 draw-up volumes for a 20 kg child at the pediatric default concentrations', async ({ page }) => {
  await openPediatricDosing(page, '20', '110', '5');
  const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  // volume = dose (mg or mcg) / concentration, concentrations from the data's pediatric defaults
  expect(t).toMatch(/MIDAZOLAM \(ANXIOLYSIS.*?TOTAL 1\.0 mg VOLUME AT 1 MG\/ML 1\.0 mL/i); // 1 mg / 1 mg/mL
  expect(t).toMatch(/ATROPINE.*?TOTAL 300 mcg VOLUME AT 0\.1 MG\/ML.*? 3\.0 mL/i); // 0.3 mg / 0.1 mg/mL
  expect(t).toMatch(/PROPOFOL.*?TOTAL 50\.0 mg VOLUME AT 10 MG\/ML \(1%\) 5\.0 mL/i); // 50 mg / 10 mg/mL
  expect(t).toMatch(/ETOMIDATE.*?TOTAL 4\.0 mg VOLUME AT 2 MG\/ML 2\.0 mL/i); // 4 mg / 2 mg/mL
  expect(t).toMatch(/KETAMINE.*?TOTAL 30\.0 mg VOLUME AT 10 MG\/ML.*? 3\.0 mL/i); // 30 mg / 10 mg/mL
  expect(t).toMatch(/FENTANYL.*?TOTAL 20 mcg VOLUME AT 10 MCG\/ML.*? 2\.0 mL/i); // 20 mcg / 10 mcg/mL
});

test('P3 adult mode on a child shows the warning and adult doses', async ({ page }) => {
  await openPediatricDosing(page, '20', '110', '5');
  await page.getByRole('radio', { name: 'Adult', exact: true }).click();
  await expect(page.getByText('Adult reference mode')).toBeVisible();
  const t = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  expect(t).toMatch(/IM preoperative sedation, adults/i);
});
