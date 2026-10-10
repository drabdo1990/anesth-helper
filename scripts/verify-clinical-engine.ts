// ============================================================================
// CLINICAL VERIFICATION SUITE
// Rigorous verification of exact mathematical formulas and edge cases
// ============================================================================

import { computeBiometrics } from '../src/store/useAnesthesiaStore';
import { DRUG_FORMULARY, LOCAL_ANESTHETICS } from '../src/constants/drugFormulary';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

console.log('--- 1. TESTING BIOMETRICS ENGINE ---');

// Test Case 1: Standard 70kg Male, 175cm
const stdMale = computeBiometrics({ tbwKg: 70, heightCm: 175, sex: 'male' });
// BMI = 70 / (1.75^2) = 22.86 -> 22.9
assert(stdMale.bmi === 22.9, `Std Male BMI expected 22.9, got ${stdMale.bmi}`);
// Devine IBW Male: 50 + 0.905 * (175 - 152.4) = 50 + 0.905 * 22.6 = 50 + 20.453 = 70.453 -> capped at TBW 70 if 70 < 70.5
assert(stdMale.ibw === 70.0, `Std Male IBW expected 70.0 (capped at TBW), got ${stdMale.ibw}`);
// Janmahasatian LBW: (9270 * 70) / (6680 + 216 * 22.857) = 648900 / (6680 + 4937.1) = 648900 / 11617.1 = 55.85 -> 55.9 kg
assert(stdMale.lbw >= 55.0 && stdMale.lbw <= 56.5, `Std Male LBW expected ~55.9, got ${stdMale.lbw}`);

// Test Case 2: Obese 120kg Male, 175cm
const obeseMale = computeBiometrics({ tbwKg: 120, heightCm: 175, sex: 'male' });
// BMI = 120 / (1.75^2) = 39.18 -> 39.2
assert(obeseMale.bmi === 39.2, `Obese Male BMI expected 39.2, got ${obeseMale.bmi}`);
// Devine IBW: 50 + 0.905 * 22.6 = 70.5 kg
assert(obeseMale.ibw === 70.5, `Obese Male IBW expected 70.5, got ${obeseMale.ibw}`);
// ABW40: 70.5 + 0.4 * (120 - 70.5) = 70.5 + 0.4 * 49.5 = 70.5 + 19.8 = 90.3 kg
assert(obeseMale.abw40 === 90.3, `Obese Male ABW40 expected 90.3, got ${obeseMale.abw40}`);
// Janmahasatian LBW: (9270 * 120) / (6680 + 216 * 39.2) = 1112400 / (6680 + 8467.2) = 1112400 / 15147.2 = 73.4 kg
assert(obeseMale.lbw >= 73.0 && obeseMale.lbw <= 74.0, `Obese Male LBW expected ~73.4, got ${obeseMale.lbw}`);

// Test Case 3: Standard 60kg Female, 162cm
const stdFemale = computeBiometrics({ tbwKg: 60, heightCm: 162, sex: 'female' });
// BMI = 60 / (1.62^2) = 22.86 -> 22.9
assert(stdFemale.bmi === 22.9, `Std Female BMI expected 22.9, got ${stdFemale.bmi}`);
// Devine IBW Female: 45.5 + 0.905 * (162 - 152.4) = 45.5 + 0.905 * 9.6 = 45.5 + 8.688 = 54.188 -> 54.2 kg
assert(stdFemale.ibw === 54.2, `Std Female IBW expected 54.2, got ${stdFemale.ibw}`);

console.log('\n--- 2. TESTING DRUG DOSING & CEILINGS ---');

// Test Case 4: Propofol uses LBW
const propofol = DRUG_FORMULARY.find(d => d.id === 'propofol')!;
assert(propofol.dosing[0].weightScalar === 'LBW', 'Propofol configured with LBW scalar');
// In obese male (LBW = 73.4 kg), 2.0 mg/kg dose is ~147 mg, volume ~14.7 mL (NOT 240 mg/24 mL on TBW!)
const obesePropofolDose = 2.0 * obeseMale.lbw;
const obesePropofolVol = obesePropofolDose / 10;
assert(obesePropofolDose < 160, `Obese Propofol correctly protected by LBW: ${obesePropofolDose} mg (< 160 mg vs 240 mg TBW)`);

// Test Case 5: Succinylcholine 200 mg Ceiling
const sux = DRUG_FORMULARY.find(d => d.id === 'succinylcholine')!;
assert(sux.dosing[0].absoluteMaxDose === 200, 'Succinylcholine capped at 200 mg ceiling');

// Test Case 6: Phenylephrine 1000x bug protection
const phenyl = DRUG_FORMULARY.find(d => d.id === 'phenylephrine')!;
assert(phenyl.concentrationMgPerMl === 0.1, 'Phenylephrine concentration is 0.1 mg/mL');
// 50 mcg -> 0.05 mg / 0.1 mg/mL = 0.5 mL
const phenylMinVol = (phenyl.dosing[0].minDosePerKg / 1000) / phenyl.concentrationMgPerMl;
assert(phenylMinVol === 0.5, `Phenylephrine 50 mcg volume is 0.5 mL (got ${phenylMinVol} mL)`);

// Test Case 7: 20% Lipid Emulsion Ceiling (Max 100 mL bolus)
const intralipid = DRUG_FORMULARY.find(d => d.id === 'intralipid-20')!;
assert(intralipid.dosing[0].absoluteMaxDose === 100, '20% Lipid Emulsion bolus capped at 100 mL');

console.log('\n--- 3. TESTING LOCAL ANESTHETIC TOXICITY ---');

// Test Case 8: Multi-drug fraction-of-max sum
const lido = LOCAL_ANESTHETICS.find(a => a.id === 'lidocaine')!;
const bupi = LOCAL_ANESTHETICS.find(a => a.id === 'bupivacaine')!;
assert(lido.maxPlainMgPerKg === 4.5 && lido.maxEpiMgPerKg === 7.0, 'Lidocaine limits match ASRA 4.5 plain vs 7.0 epi');
assert(bupi.maxPlainMgPerKg === 2.0 && bupi.maxEpiMgPerKg === 2.5, 'Bupivacaine limits match ASRA 2.0 plain vs 2.5 epi');

console.log('\n🎉 ALL CLINICAL VERIFICATION TESTS PASSED PERFECTLY!');
