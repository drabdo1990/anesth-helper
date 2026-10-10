import React, { useState } from 'react';
import { FormularyDrug } from '../types/anesthesia';
import { useAnesthesiaStore } from '../store/useAnesthesiaStore';
import { AlertTriangle, Info, Clock, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface DrugCardProps {
  drug: FormularyDrug;
}

export const DrugCard: React.FC<DrugCardProps> = ({ drug }) => {
  const { computeDose, selectedTiers, setSelectedTier } = useAnesthesiaStore();
  const [showDetails, setShowDetails] = useState(false);

  // Compute dose for active tier
  const activeTierId = selectedTiers[drug.id] || drug.dosing[0].id;
  const computed = computeDose(drug, activeTierId);

  // Category badge colors
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'Induction':
        return { border: 'border-cyan-500/30', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'NMBA':
        return { border: 'border-amber-500/30', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'Reversal':
        return { border: 'border-emerald-500/30', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'Vasopressor':
        return { border: 'border-purple-500/30', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'Emergency':
        return { border: 'border-rose-500/40', badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      default:
        return { border: 'border-slate-800', badge: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const theme = getCategoryTheme(drug.category);

  // Scalar badge styling
  const getScalarBadge = (scalar: string, weightKg: number) => {
    switch (scalar) {
      case 'LBW':
        return { label: `LBW: ${weightKg} kg`, cls: 'bg-cyan-950 text-cyan-300 border-cyan-700/50' };
      case 'IBW':
        return { label: `IBW: ${weightKg} kg`, cls: 'bg-amber-950 text-amber-300 border-amber-700/50' };
      case 'ABW40':
        return { label: `ABW40: ${weightKg} kg`, cls: 'bg-emerald-950 text-emerald-300 border-emerald-700/50' };
      case 'TBW':
        return { label: `TBW: ${weightKg} kg`, cls: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 'FIXED':
      default:
        return { label: 'Fixed Dose', cls: 'bg-purple-950 text-purple-300 border-purple-700/50' };
    }
  };

  const scalarBadge = getScalarBadge(computed.appliedScalar, computed.scalarWeightUsedKg);

  return (
    <div className={`bg-[#131b2e] border ${theme.border} rounded-2xl p-4 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between gap-3`}>
      {/* Top Header: Name, Category, Vial Conc */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-100 tracking-tight leading-none">
                {drug.name}
              </h2>
              {drug.genericName && drug.genericName !== drug.name && (
                <span className="text-xs text-slate-400 italic">({drug.genericName})</span>
              )}
            </div>
            {drug.subcategory && (
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                {drug.subcategory}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badge}`}>
              {drug.category}
            </span>
          </div>
        </div>

        {/* Standard Vial Concentration Tag */}
        <div className="mt-1 flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Standard Conc:</span>
          <span className="font-mono font-semibold text-slate-200 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            {drug.concentrationDisplay}
          </span>
        </div>
      </div>

      {/* Multiple Tiers Selector Buttons (Touch Targets >= 44px) */}
      {drug.dosing.length > 1 && (
        <div className="bg-slate-950/70 p-1 rounded-xl border border-slate-800 flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-400 px-1 uppercase tracking-wider">
            Clinical Dosing Tier:
          </span>
          <div className="grid grid-cols-1 gap-1">
            {drug.dosing.map((tier) => {
              const isSelected = tier.id === activeTierId;
              return (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTier(drug.id, tier.id)}
                  className={`text-left text-xs font-semibold px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between touch-target select-none ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span className="truncate">{tier.label}</span>
                  <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-1">
                    {tier.weightScalar}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Core Calculated Dose Box (Mass & Exact Volume in mL) */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 shadow-inner flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculated Dose</span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${scalarBadge.cls}`}>
            [{scalarBadge.label}]
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
          {/* Mass Display */}
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Mass</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-slate-100 tracking-tight">
              {computed.massRangeDisplay}
            </span>
          </div>

          {/* Volume Display */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-cyan-400 uppercase font-semibold">Volume to Push</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-cyan-400 tracking-tight">
              {computed.volumeRangeDisplayMl}
            </span>
          </div>
        </div>

        {/* Absolute Dose Ceiling Warning */}
        {computed.isCapped && (
          <div className="mt-1 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 flex items-center gap-2 text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Safe Ceiling Reached:</strong> Dose capped at maximum allowed adult ceiling ({computed.absoluteMaxDose} mg).
            </span>
          </div>
        )}

        {/* Companion Drug (e.g. Neostigmine + Glycopyrrolate) */}
        {computed.companionDrug && (
          <div className="mt-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wide text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Paired Antimuscarinic Dose
            </div>
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-semibold">{computed.companionDrug.name}:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-300">{computed.companionDrug.doseDisplay}</span>
                <span className="font-mono font-bold text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {computed.companionDrug.volumeDisplay}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clinical Notes & Pearl Toggle */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-cyan-300 py-1 transition-colors select-none"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            Clinical Notes & Pharmacokinetics
          </span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-2 text-xs text-slate-300 animate-fade-in">
            {computed.notes && (
              <p className="text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <strong className="text-slate-300">Dosing rule:</strong> {computed.notes}
              </p>
            )}

            <p className="leading-relaxed">
              <strong className="text-cyan-400">Clinical Pearl:</strong> {drug.clinicalPearl}
            </p>

            {(drug.onset || drug.duration) && (
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Onset: <strong className="text-slate-200">{drug.onset}</strong></span>
                </div>
                <div>
                  <span>Duration: <strong className="text-slate-200">{drug.duration}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
