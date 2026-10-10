// ============================================================================
// ANESTHASSIST ZUSTAND STATE STORE
// Zero-Latency Biometrics, Dosing Engine & Multi-Drug Toxicity
// ============================================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Sex,
  WeightScalar,
  PatientMetrics,
  DerivedWeights,
  FormularyDrug,
  ComputedDose,
  LocalAdministeredInput,
  MultiDrugToxicityReport,
} from '../types/anesthesia';
import { DRUG_FORMULARY, LOCAL_ANESTHETICS } from '../constants/drugFormulary';

export type AppTab = 'calculator' | 'crisis' | 'local_max' | 'pacu';

interface AnesthesiaState {
  // Biometrics
  patient: PatientMetrics;
  weights: DerivedWeights;
  selectedTiers: Record<string, string>; // drugId -> tierId

  // Regional Anesthesia State
  localAdmins: LocalAdministeredInput[];

  // Crisis & Checklist State
  activeTab: AppTab;
  activeCrisisId: string | null;
  crisisChecklist: Record<string, boolean>;
  routineChecklist: Record<string, boolean>;
  cprTimerRunning: boolean;
  cprTimerSeconds: number;
  cprAudioAlert: boolean;
  cprMetronomeActive: boolean;

  // Disclaimer State
  disclaimerDismissed: boolean;

  // Actions
  setPatientMetrics: (updates: Partial<PatientMetrics>) => void;
  adjustWeight: (deltaKg: number) => void;
  adjustHeight: (deltaCm: number) => void;
  applyPreset: (preset: 'standard_male' | 'standard_female' | 'obese_male' | 'frail_female') => void;

  setSelectedTier: (drugId: string, tierId: string) => void;

  // Local Block Actions
  setLocalAdmin: (id: string, updates: Partial<LocalAdministeredInput>) => void;
  addLocalAdminSlot: (drugId?: LocalAdministeredInput['drugId']) => void;
  removeLocalAdminSlot: (id: string) => void;
  clearLocalAdmins: () => void;

  // Crisis & Checklist Actions
  setActiveTab: (tab: AppTab) => void;
  setActiveCrisisId: (id: string | null) => void;
  toggleCrisisItem: (itemId: string) => void;
  resetCrisisProtocol: (prefix?: string) => void;
  toggleRoutineItem: (itemId: string) => void;
  resetRoutineChecklist: (sectionPrefix?: string) => void;

  // Timer Actions
  startCprTimer: () => void;
  pauseCprTimer: () => void;
  resetCprTimer: () => void;
  tickCprTimer: () => void;
  toggleCprAudio: () => void;
  toggleCprMetronome: () => void;

  dismissDisclaimer: () => void;
  resetAll: () => void;

  // Calculations
  computeDose: (drug: FormularyDrug, tierIdOrIndex?: string | number) => ComputedDose;
  getAllComputedDoses: () => ComputedDose[];
  getFractionalToxicity: () => MultiDrugToxicityReport;
}

const DEFAULT_PATIENT: PatientMetrics = {
  tbwKg: 70,
  heightCm: 175,
  sex: 'male',
};

export function computeBiometrics(p: PatientMetrics): DerivedWeights {
  const safeWeight = Math.max(1, p.tbwKg);
  const safeHeight = Math.max(40, p.heightCm);
  const heightM = safeHeight / 100;
  const bmi = heightM > 0 ? Number((safeWeight / (heightM * heightM)).toFixed(1)) : 0;

  // Devine IBW Formula (1974)
  // Male: 50 + 0.905 * max(0, heightCm - 152.4)
  // Female: 45.5 + 0.905 * max(0, heightCm - 152.4)
  // If TBW < IBW, use TBW
  const heightOverBase = Math.max(0, safeHeight - 152.4);
  const ibwBase = p.sex === 'male' ? 50.0 : 45.5;
  const calculatedIbw = ibwBase + 0.905 * heightOverBase;
  const ibw = Number(Math.min(safeWeight, calculatedIbw).toFixed(1));

  // ABW40 Formula
  // If TBW > IBW: IBW + 0.4 * (TBW - IBW), else TBW
  const abw40 = safeWeight > ibw
    ? Number((ibw + 0.4 * (safeWeight - ibw)).toFixed(1))
    : safeWeight;

  // Janmahasatian LBW Formula (2005)
  // Male: (9270 * TBW) / (6680 + (216 * BMI))
  // Female: (9270 * TBW) / (8780 + (244 * BMI))
  // Capped at TBW: min(LBW, TBW)
  const lbwRaw = p.sex === 'male'
    ? (9270 * safeWeight) / (6680 + 216 * bmi)
    : (9270 * safeWeight) / (8780 + 244 * bmi);
  const lbw = Number(Math.min(safeWeight, lbwRaw).toFixed(1));

  return { tbw: safeWeight, ibw, abw40, lbw, bmi };
}

export const useAnesthesiaStore = create<AnesthesiaState>()(
  persist(
    (set, get) => ({
      patient: DEFAULT_PATIENT,
      weights: computeBiometrics(DEFAULT_PATIENT),
      selectedTiers: {
        propofol: 'propofol-adult',
        rocuronium: 'roc-standard',
        sugammadex: 'sug-mod',
        ketamine: 'ketamine-induction',
        'intralipid-20': 'intralipid-bolus',
      },

      localAdmins: [
        {
          id: 'starter-block-1',
          drugId: 'bupivacaine',
          concentrationPercent: 0.5,
          volumeGivenMl: 20,
          withEpi: false,
        },
      ],

      activeTab: 'calculator',
      activeCrisisId: null,
      crisisChecklist: {},
      routineChecklist: {},
      cprTimerRunning: false,
      cprTimerSeconds: 0,
      cprAudioAlert: true,
      cprMetronomeActive: false,
      disclaimerDismissed: false,

      // --- Biometrics Actions ---
      setPatientMetrics: (updates) => {
        const next: PatientMetrics = { ...get().patient, ...updates };
        set({
          patient: next,
          weights: computeBiometrics(next),
        });
      },

      adjustWeight: (deltaKg) => {
        const current = get().patient.tbwKg;
        const nextWeight = Math.max(1, Math.min(350, Math.round((current + deltaKg) * 10) / 10));
        get().setPatientMetrics({ tbwKg: nextWeight });
      },

      adjustHeight: (deltaCm) => {
        const current = get().patient.heightCm;
        const nextHeight = Math.max(40, Math.min(250, current + deltaCm));
        get().setPatientMetrics({ heightCm: nextHeight });
      },

      applyPreset: (preset) => {
        switch (preset) {
          case 'standard_male':
            get().setPatientMetrics({ tbwKg: 70, heightCm: 175, sex: 'male' });
            break;
          case 'standard_female':
            get().setPatientMetrics({ tbwKg: 60, heightCm: 162, sex: 'female' });
            break;
          case 'obese_male':
            get().setPatientMetrics({ tbwKg: 120, heightCm: 175, sex: 'male' });
            break;
          case 'frail_female':
            get().setPatientMetrics({ tbwKg: 45, heightCm: 152, sex: 'female' });
            break;
        }
      },

      setSelectedTier: (drugId, tierId) => {
        set((state) => ({
          selectedTiers: { ...state.selectedTiers, [drugId]: tierId },
        }));
      },

      // --- Local Anesthetic Actions ---
      setLocalAdmin: (id, updates) => {
        set((state) => ({
          localAdmins: state.localAdmins.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      addLocalAdminSlot: (drugId = 'lidocaine') => {
        const defaultPercent = drugId === 'bupivacaine' ? 0.5 : drugId === 'ropivacaine' ? 0.5 : 1.0;
        set((state) => ({
          localAdmins: [
            ...state.localAdmins,
            {
              id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              drugId,
              concentrationPercent: defaultPercent,
              volumeGivenMl: 10,
              withEpi: false,
            },
          ],
        }));
      },

      removeLocalAdminSlot: (id) => {
        set((state) => ({
          localAdmins: state.localAdmins.filter((item) => item.id !== id),
        }));
      },

      clearLocalAdmins: () => set({ localAdmins: [] }),

      // --- Navigation & Crisis Actions ---
      setActiveTab: (activeTab) => set({ activeTab }),
      setActiveCrisisId: (activeCrisisId) => set({ activeCrisisId }),

      toggleCrisisItem: (itemId) => {
        set((state) => ({
          crisisChecklist: {
            ...state.crisisChecklist,
            [itemId]: !state.crisisChecklist[itemId],
          },
        }));
      },

      resetCrisisProtocol: (prefix) => {
        set((state) => {
          if (!prefix) return { crisisChecklist: {} };
          const next = { ...state.crisisChecklist };
          Object.keys(next).forEach((key) => {
            if (key.startsWith(prefix)) delete next[key];
          });
          return { crisisChecklist: next };
        });
      },

      toggleRoutineItem: (itemId) => {
        set((state) => ({
          routineChecklist: {
            ...state.routineChecklist,
            [itemId]: !state.routineChecklist[itemId],
          },
        }));
      },

      resetRoutineChecklist: (prefix) => {
        set((state) => {
          if (!prefix) return { routineChecklist: {} };
          const next = { ...state.routineChecklist };
          Object.keys(next).forEach((key) => {
            if (key.startsWith(prefix)) delete next[key];
          });
          return { routineChecklist: next };
        });
      },

      // --- Timer Actions ---
      startCprTimer: () => set({ cprTimerRunning: true }),
      pauseCprTimer: () => set({ cprTimerRunning: false }),
      resetCprTimer: () => set({ cprTimerRunning: false, cprTimerSeconds: 0 }),
      tickCprTimer: () => set((state) => ({ cprTimerSeconds: state.cprTimerSeconds + 1 })),
      toggleCprAudio: () => set((state) => ({ cprAudioAlert: !state.cprAudioAlert })),
      toggleCprMetronome: () => set((state) => ({ cprMetronomeActive: !state.cprMetronomeActive })),

      dismissDisclaimer: () => set({ disclaimerDismissed: true }),

      resetAll: () => {
        set({
          patient: DEFAULT_PATIENT,
          weights: computeBiometrics(DEFAULT_PATIENT),
          selectedTiers: {
            propofol: 'propofol-adult',
            rocuronium: 'roc-standard',
            sugammadex: 'sug-mod',
          },
          localAdmins: [],
          crisisChecklist: {},
          routineChecklist: {},
          cprTimerRunning: false,
          cprTimerSeconds: 0,
        });
      },

      // --- Dosing Calculation Engine ---
      computeDose: (drug, tierIdOrIndex = 0) => {
        const { weights, selectedTiers } = get();

        // Resolve active tier
        let tier = drug.dosing[0];
        if (typeof tierIdOrIndex === 'string') {
          tier = drug.dosing.find((t) => t.id === tierIdOrIndex) || drug.dosing[0];
        } else if (typeof tierIdOrIndex === 'number') {
          tier = drug.dosing[tierIdOrIndex] || drug.dosing[0];
        } else {
          const activeTierId = selectedTiers[drug.id];
          if (activeTierId) {
            tier = drug.dosing.find((t) => t.id === activeTierId) || drug.dosing[0];
          }
        }

        let appliedWeight = weights.tbw;
        switch (tier.weightScalar) {
          case 'TBW': appliedWeight = weights.tbw; break;
          case 'IBW': appliedWeight = weights.ibw; break;
          case 'LBW': appliedWeight = weights.lbw; break;
          case 'ABW40': appliedWeight = weights.abw40; break;
          case 'FIXED': appliedWeight = 1; break;
        }

        let minMass = tier.weightScalar === 'FIXED' ? tier.minDosePerKg : tier.minDosePerKg * appliedWeight;
        let maxMass = tier.weightScalar === 'FIXED' ? tier.maxDosePerKg : tier.maxDosePerKg * appliedWeight;
        let isCapped = false;

        // Apply absolute safety ceiling
        if (tier.absoluteMaxDose) {
          if (maxMass > tier.absoluteMaxDose) {
            isCapped = true;
            maxMass = tier.absoluteMaxDose;
            if (minMass > tier.absoluteMaxDose) minMass = tier.absoluteMaxDose;
          }
        }

        // CLINICAL UNIT NORMALIZATION FOR VOLUME
        // Prevents the 1,000x Phenylephrine overdose bug
        let minVol = 0;
        let maxVol = 0;

        if (tier.unit === 'mcg') {
          // Microgram to milligram conversion: (mcg / 1000) / (mg/mL) = mL
          minVol = (minMass / 1000) / drug.concentrationMgPerMl;
          maxVol = (maxMass / 1000) / drug.concentrationMgPerMl;
        } else if (tier.unit === 'mL/kg') {
          // Direct volume calculation (e.g. 20% Lipid Emulsion)
          minVol = minMass;
          maxVol = maxMass;
        } else {
          // Standard mg / (mg/mL) = mL
          minVol = minMass / drug.concentrationMgPerMl;
          maxVol = maxMass / drug.concentrationMgPerMl;
        }

        minMass = Number(minMass.toFixed(minMass < 10 ? 2 : 1));
        maxMass = Number(maxMass.toFixed(maxMass < 10 ? 2 : 1));
        minVol = Number(minVol.toFixed(2));
        maxVol = Number(maxVol.toFixed(2));

        const unitDisplay = tier.unit.replace('/kg', '');
        const massRangeDisplay = minMass === maxMass
          ? `${minMass} ${unitDisplay}`
          : `${minMass} – ${maxMass} ${unitDisplay}`;

        const volumeRangeDisplayMl = minVol === maxVol
          ? `${minVol} mL`
          : `${minVol} – ${maxVol} mL`;

        // Companion Reversal Pairing (Neostigmine + Glycopyrrolate)
        let companionDrug: ComputedDose['companionDrug'] | undefined;
        if (drug.id === 'neostigmine') {
          const glycoMg = Number(Math.min(1.0, maxMass * 0.2).toFixed(2));
          const glycoMl = Number((glycoMg / 0.2).toFixed(1)); // 0.2 mg/mL vial
          companionDrug = {
            name: 'Glycopyrrolate',
            doseDisplay: `${glycoMg} mg`,
            volumeDisplay: `${glycoMl} mL (0.2 mg/mL)`,
          };
        }

        return {
          drugId: drug.id,
          drugName: drug.name,
          tierId: tier.id,
          tierLabel: tier.label,
          appliedScalar: tier.weightScalar,
          scalarWeightUsedKg: appliedWeight,
          massRangeDisplay,
          volumeRangeDisplayMl,
          minMass,
          maxMass,
          minVolumeMl: minVol,
          maxVolumeMl: maxVol,
          isCapped,
          absoluteMaxDose: tier.absoluteMaxDose,
          notes: tier.notes,
          companionDrug,
        };
      },

      getAllComputedDoses: () => {
        return DRUG_FORMULARY.map((drug) => get().computeDose(drug));
      },

      getFractionalToxicity: (): MultiDrugToxicityReport => {
        const { localAdmins, weights } = get();
        const tbw = weights.tbw;

        if (localAdmins.length === 0) {
          return {
            blocks: [],
            totalFraction: 0,
            percentageUsed: 0,
            status: 'safe',
          };
        }

        let sumFractions = 0;

        const blocks = localAdmins.map((item) => {
          const agent = LOCAL_ANESTHETICS.find((la) => la.id === item.drugId);
          // doseGivenMg = volumeGivenMl * (percent * 10)
          const doseMg = Number((item.volumeGivenMl * (item.concentrationPercent * 10)).toFixed(1));

          if (!agent || doseMg <= 0) {
            return {
              id: item.id,
              name: agent ? agent.name : item.drugId,
              doseMg: 0,
              fraction: 0,
              maxAllowedMg: 0,
              isOverCeiling: false,
            };
          }

          const maxPerKg = item.withEpi ? agent.maxEpiMgPerKg : agent.maxPlainMgPerKg;
          const absCeiling = item.withEpi ? agent.absoluteMaxEpiMg : agent.absoluteMaxPlainMg;
          const maxAllowedMg = Number(Math.min(maxPerKg * tbw, absCeiling).toFixed(1));

          const fraction = maxAllowedMg > 0 ? doseMg / maxAllowedMg : 0;
          sumFractions += fraction;

          return {
            id: item.id,
            name: agent.name,
            doseMg,
            fraction: Number(fraction.toFixed(3)),
            maxAllowedMg,
            isOverCeiling: doseMg > maxAllowedMg,
          };
        });

        const totalFraction = Number(sumFractions.toFixed(3));
        const percentageUsed = Math.round(totalFraction * 100);

        let status: 'safe' | 'caution' | 'toxic' = 'safe';
        if (totalFraction >= 1.0) {
          status = 'toxic';
        } else if (totalFraction >= 0.7) {
          status = 'caution';
        }

        return {
          blocks,
          totalFraction,
          percentageUsed,
          status,
        };
      },
    }),
    {
      name: 'anesthassist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        patient: state.patient,
        selectedTiers: state.selectedTiers,
        localAdmins: state.localAdmins,
        cprAudioAlert: state.cprAudioAlert,
        disclaimerDismissed: state.disclaimerDismissed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.weights = computeBiometrics(state.patient);
        }
      },
    }
  )
);
