import { expect, test, type Page } from '@playwright/test';

/**
 * End-to-end audit of the real running app. Expected values are computed by hand from the README
 * formulas and the dose data, never copied from what the app prints.
 * Reference adult: 70 kg, 175 cm, male, 40 y.
 *   PBW = 50 + 0.905 * (175 - 152.4) = 70.45 ; BMI = 70 / 1.75^2 = 22.86
 *   LBW (male) = 9270 * 70 / (6680 + 216 * 22.86) = 55.85 ; VT = 6 * 70.45 = 423 mL
 */

const keypad = async (page: Page, open: string | RegExp, digits: string) => {
  await page.getByRole('button', { name: open }).first().click();
  const dlg = page.getByRole('dialog');
  await dlg.getByRole('button', { name: 'Clear', exact: true }).click();
  for (const d of digits) await dlg.getByRole('button', { name: d, exact: true }).click();
  await dlg.getByRole('button', { name: 'Set', exact: true }).click();
  await expect(dlg).toBeHidden();
};

const setPatient = async (page: Page, p: { kg: string; cm: string; sex: 'Male' | 'Female'; age?: string }) => {
  await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Intra-op' }).click();
  await page.getByRole('radio', { name: 'Dosing' }).click();
  await keypad(page, /^Enter Actual weight/, p.kg);
  await keypad(page, /^Enter Height/, p.cm);
  await page.getByRole('radio', { name: p.sex, exact: true }).click();
  if (p.age) await keypad(page, /^Age/, p.age);
};

const tab = (page: Page, name: string) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
const mainText = async (page: Page) => (await page.locator('main').innerText()).replace(/\s+/g, ' ');

let consoleErrors: string[] = [];
test.beforeEach(async ({ page }) => {
  consoleErrors = [];
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.goto('/');
});
test.afterEach(() => {
  expect(consoleErrors, 'browser console errors').toEqual([]);
});

test('F1 biometrics match the Devine / Janmahasatian formulas', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male' });
  const header = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(header).toMatch(/BMI 22\.9/);
  expect(header).toMatch(/PBW 70\.5/);
  expect(header).toMatch(/IBW 70\.0/);
  expect(header).toMatch(/LBW 55\.9/);
});

test('F2 dosing is withheld until age is entered', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male' });
  await expect(page.getByText('Age required', { exact: false }).first()).toBeVisible();
  await expect(page.getByText(/midazolam/i)).toHaveCount(0);
});

test('F3 adult dose cards: mg and mL are correct', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  const t = await mainText(page);
  // midazolam 0.07 mg/kg x 70 = 4.9 mg = 4.9 mL at 1 mg/mL
  expect(t).toMatch(/MIDAZOLAM \(ANXIOLYSIS.*?TOTAL 4\.9 mg VOLUME AT 1 MG\/ML 4\.9 mL/i);
  // glycopyrrolate 0.004 mg/kg x 70 = 0.28 mg = 1.4 mL at 0.2 mg/mL
  expect(t).toMatch(/GLYCOPYRROLATE.*?TOTAL 0\.28 mg VOLUME AT 0\.2 MG\/ML 1\.4 mL/i);
  // propofol 2 mg/kg x LBW 55.85 = 111.7 mg = 11.2 mL at 10 mg/mL
  expect(t).toMatch(/PROPOFOL.*?TOTAL 111\.7 mg VOLUME AT 10 MG\/ML \(1%\) 11\.2 mL/i);
});

test('F4 pediatric patient: pediatric dosing mode, adult mode is flagged', async ({ page }) => {
  await setPatient(page, { kg: '20', cm: '110', sex: 'Male', age: '5' });
  await expect(page.getByRole('radio', { name: 'Pediatric', exact: true })).toBeChecked();
  // midazolam IV paediatric 0.05 mg/kg x 20 kg = 1.0 mg (label cap 2 mg not reached)
  expect(await mainText(page)).toMatch(/Preoperative sedation IV \(pediatric/i);
  // showing adult doses for a child must be flagged loudly
  await page.getByRole('radio', { name: 'Adult', exact: true }).click();
  await expect(page.getByText('Adult reference mode')).toBeVisible();
});

test('F5 airway tab renders sizing summary', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  await page.getByRole('radio', { name: 'Airway' }).click();
  const t = await mainText(page);
  expect(t).toMatch(/ETT/);
  expect(t).toMatch(/LMA/);
  expect(t).toMatch(/DLT/);
});

test('F6 ventilation: tidal volume uses PBW (423 mL at 6 mL/kg)', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  await page.getByRole('radio', { name: 'Vent' }).click();
  expect(await mainText(page)).toMatch(/TIDAL VOLUME 423 mL/i);
});

test('F7 checklist tick updates the completion count', async ({ page }) => {
  await tab(page, 'Intra-op').click();
  await page.getByRole('radio', { name: 'Lists' }).click();
  // Several checklist views stay mounted but hidden (Pre-op, Post-op); only count the visible one.
  const count = page.locator('p:visible', { hasText: /\d+ \/ \d+ complete/ }).first();
  await expect(count).toHaveText(/^0 \/ \d+ complete/);
  const first = page.locator('main [role=checkbox]:visible').first();
  await first.click();
  await expect(first).toHaveAttribute('aria-checked', 'true');
  await expect(count).toHaveText(/^1 \/ \d+ complete/);
});

test('F8 plans, pre-op and post-op tabs render', async ({ page }) => {
  await tab(page, 'Plans').click();
  expect(await mainText(page)).toMatch(/Pediatric/);
  await tab(page, 'Pre-op').click();
  expect(await mainText(page)).toMatch(/CREATININE CLEARANCE/i);
  await tab(page, 'Post-op').click();
  expect(await mainText(page)).toMatch(/APFEL/i);
});

test('F9 diseases: full catalog count and search behaviour', async ({ page }) => {
  await tab(page, 'Diseases').click();
  // 110 Stoelting + 24 emergencies + 51 subspecialty cards (docs/superpowers design spec)
  await expect(page.getByText('185 of 185 conditions')).toBeVisible();
  const search = page.getByRole('searchbox', { name: 'Search conditions' });
  await search.fill('pheo');
  await expect(page.getByText('1 of 185 conditions')).toBeVisible();
  await search.fill('xyzzy');
  await expect(page.getByText('0 of 185 conditions')).toBeVisible();
  await expect(page.getByText('Not in the app yet')).toBeVisible();
});

test('F10 a Stoelting plan shows all four sections', async ({ page }) => {
  await tab(page, 'Diseases').click();
  await page.getByRole('searchbox', { name: 'Search conditions' }).fill('marfan');
  await page.locator('main li button').first().click();
  for (const h of ['Pre-op', 'Intra-op', 'Avoid', 'Post-op']) {
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
  }
  await expect(page.getByText('Textbook summary')).toBeVisible();
});

test('F11 subspecialty card (aortic stenosis) is a board subspecialty summary with four sections', async ({ page }) => {
  await tab(page, 'Diseases').click();
  await page.getByRole('searchbox', { name: 'Search conditions' }).fill('aortic stenosis');
  await page.locator('main li button').first().click();
  await expect(page.getByText('Board subspecialty summary')).toBeVisible();
  for (const h of ['Pre-op', 'Intra-op', 'Avoid', 'Post-op']) {
    await expect(page.getByRole('heading', { name: h, exact: true })).toBeVisible();
  }
});

test('F12 emergency card (anaphylaxis) links to its crisis checklist in Lists', async ({ page }) => {
  await tab(page, 'Diseases').click();
  await page.getByRole('searchbox', { name: 'Search conditions' }).fill('anaphylaxis');
  await page.locator('main li button').first().click();
  await expect(page.getByText('Board emergency summary')).toBeVisible();
  await page.getByRole('button', { name: /Open crisis checklist in Lists/ }).click();
  await expect(page.getByRole('radio', { name: 'Lists' })).toBeChecked();
  expect(await mainText(page)).toMatch(/anaphylaxis/i);
});

test('F13 emergency card (LAST) opens the SOS overlay on LAST', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  await tab(page, 'Diseases').click();
  await page.getByRole('searchbox', { name: 'Search conditions' }).fill('local anesthetic systemic');
  await page.locator('main li button').first().click();
  await page.getByRole('button', { name: /Open LAST crisis steps/ }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toBeVisible();
  await expect(dlg).toContainText(/LOCAL ANESTHETIC SYSTEMIC TOXICITY/i);
});

test('F14 SOS: weight-based lipid dose, Esc closes', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  await page.getByRole('button', { name: 'SOS' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toBeVisible();
  await expect(dlg).toContainText('70.0 kg');
  // lipid bolus for >= 70 kg is a flat 100 mL (ASRA LAST 2020), shown on the "+ Bolus" log button
  await expect(dlg).toContainText(/100\.0 mL|Bolus 100/i);
  await dlg.getByRole('radio', { name: 'MH', exact: true }).click();
  await expect(dlg).toContainText(/dantrolene/i);
  await dlg.getByRole('radio', { name: 'CICO', exact: true }).click();
  // CICO opens on Plan A (tracheal intubation); front-of-neck access is under Plan D.
  await expect(dlg).toContainText(/Plan A: Tracheal intubation/i);
  await dlg.getByText('Plan D', { exact: true }).click();
  await expect(dlg).toContainText(/scalpel|cricothyr|front.of.neck/i);
  await page.keyboard.press('Escape');
  await expect(dlg).toBeHidden();
});

// Regression guard (defect found in audit 2026-11-25, fixed): before a weight is entered the LAST and MH panels
// used to be replaced entirely by "Enter actual body weight above", hiding the non-dose first steps.
// Now the banner and steps show, and only the dose blocks wait for a weight.
test('F19 SOS LAST shows first-response steps even before a weight is entered', async ({ page }) => {
  await page.getByRole('button', { name: 'SOS' }).click();
  const dlg = page.getByRole('dialog');
  await expect(dlg).toContainText(/Stop injecting/i);
  await expect(dlg.getByRole('region', { name: 'LAST steps' })).toBeVisible();
  await expect(dlg).toContainText('Enter actual body weight above to calculate doses.');
  await expect(dlg.getByRole('region', { name: 'Lipid emulsion dosing' })).toHaveCount(0);
});

test('F20 SOS MH shows first-response steps even before a weight is entered', async ({ page }) => {
  await page.getByRole('button', { name: 'SOS' }).click();
  const dlg = page.getByRole('dialog');
  await dlg.getByRole('radio', { name: 'MH', exact: true }).click();
  await expect(dlg).toContainText(/Stop volatile anesthetics/i);
  await expect(dlg.getByRole('region', { name: 'MH steps' })).toBeVisible();
  await expect(dlg).toContainText('Enter actual body weight above to calculate doses.');
  await expect(dlg.getByRole('region', { name: 'Dantrolene dosing' })).toHaveCount(0);
});

test('F21 every one of the 185 disease cards opens with four non-empty sections and no mg/kg prose', async ({ page }) => {
  test.setTimeout(180_000);
  await tab(page, 'Diseases').click();
  const rows = page.locator('main li button');
  const n = await rows.count();
  expect(n).toBe(185);
  const problems: string[] = [];
  for (let i = 0; i < n; i++) {
    const name = ((await rows.nth(i).locator('span').first().innerText()) || `#${i}`).trim();
    await rows.nth(i).click();
    const sections = await page.evaluate(() => {
      const out: Record<string, number> = {};
      document.querySelectorAll('main h4').forEach((h) => {
        out[h.textContent!.trim()] = h.parentElement!.querySelectorAll('li').length;
      });
      return { out, text: document.querySelector('main')!.innerText };
    });
    for (const s of ['Pre-op', 'Intra-op', 'Avoid', 'Post-op']) {
      if (!(sections.out[s] > 0)) problems.push(`${name}: section "${s}" empty or missing`);
    }
    if (/mg\/kg/i.test(sections.text)) problems.push(`${name}: contains mg/kg dose prose`);
    await page.getByRole('button', { name: 'All conditions' }).click();
  }
  expect(problems, problems.join('\n')).toEqual([]);
});

test('F15 references and settings sheets open and close', async ({ page }) => {
  await page.getByRole('button', { name: 'References' }).click();
  await expect(page.getByRole('dialog')).toContainText(/DRAFT/i);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('dialog')).toContainText(/APPEARANCE/i);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('F16 New case clears the patient', async ({ page }) => {
  await setPatient(page, { kg: '70', cm: '175', sex: 'Male', age: '40' });
  await page.getByRole('button', { name: /new case/i }).click();
  const header = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
  expect(header).toMatch(/-- kg/);
  expect(header).not.toMatch(/PBW 70\.5/);
});

test('F17 mobile 320 px: no horizontal scroll and nav + SOS reachable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  for (const n of ['Pre-op', 'Plans', 'Intra-op', 'Post-op', 'Diseases']) await expect(tab(page, n)).toBeVisible();
  await expect(page.getByRole('button', { name: 'SOS' })).toBeVisible();
});

test('F18 disease search text is not stored (empty after reload)', async ({ page }) => {
  await tab(page, 'Diseases').click();
  await page.getByRole('searchbox', { name: 'Search conditions' }).fill('marfan');
  await page.reload();
  await tab(page, 'Diseases').click();
  await expect(page.getByRole('searchbox', { name: 'Search conditions' })).toHaveValue('');
});
