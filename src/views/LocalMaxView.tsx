import React from 'react';
import { useAnesthesiaStore } from '../store/useAnesthesiaStore';
import { LOCAL_ANESTHETICS } from '../constants/drugFormulary';
import { LocalAnestheticEntry } from '../types/anesthesia';
import {
  Syringe,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  AlertOctagon,
  Info,
} from 'lucide-react';

export const LocalMaxView: React.FC = () => {
  const {
    patient,
    weights,
    localAdmins,
    setLocalAdmin,
    addLocalAdminSlot,
    removeLocalAdminSlot,
    clearLocalAdmins,
    getFractionalToxicity,
    setActiveTab,
    setActiveCrisisId,
  } = useAnesthesiaStore();

  const toxicity = getFractionalToxicity();

  // Status meter styling
  const getStatusDisplay = () => {
    switch (toxicity.status) {
      case 'toxic':
        return {
          label: 'TOXIC OVERDOSE RISK',
          subtext: 'Cumulative maximum safe local anesthetic dose exceeded (> 1.0 fraction)! Prepare 20% Lipid Emulsion.',
          barColor: 'bg-rose-500 shadow-glow-red',
          textColor: 'text-rose-400',
          borderColor: 'border-rose-500/60',
          bgBanner: 'bg-rose-950/40 border-rose-500/50',
          icon: AlertOctagon,
        };
      case 'caution':
        return {
          label: 'APPROACHING CEILING',
          subtext: 'Cumulative dose has reached 70-99% of safe maximum. Exercise extreme caution with supplemental infiltration.',
          barColor: 'bg-amber-500',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/40',
          bgBanner: 'bg-amber-950/30 border-amber-500/40',
          icon: AlertTriangle,
        };
      case 'safe':
      default:
        return {
          label: 'WITHIN SAFE LIMITS',
          subtext: 'Combined additive fraction is well below safe toxicity threshold (< 70%).',
          barColor: 'bg-emerald-500 shadow-glow-emerald',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgBanner: 'bg-emerald-950/20 border-emerald-500/30',
          icon: ShieldCheck,
        };
    }
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <div className="space-y-4 pb-24">
      {/* Overview Banner & ASRA Guidance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
              Regional Anesthesia Multi-Drug Safety
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
            {weights.tbw} kg TBW
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Local anesthetic cardiotoxicity and neurotoxicity are <strong className="text-slate-200">strictly additive</strong>. Combining agents requires fraction-of-maximum sum checking:
          <span className="font-mono text-cyan-300 block mt-1 bg-slate-950/80 p-1.5 rounded border border-slate-800 text-center">
            (Dose A / Max A) + (Dose B / Max B) &lt; 1.0 (100%)
          </span>
        </p>
      </div>

      {/* Cumulative Toxicity Gauge Card */}
      <div className={`border ${status.borderColor} ${status.bgBanner} rounded-2xl p-4 shadow-xl flex flex-col gap-3 transition-colors`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-6 h-6 ${status.textColor} shrink-0`} />
            <div>
              <span className={`text-sm font-black tracking-wider uppercase ${status.textColor}`}>
                {status.label}
              </span>
              <p className="text-[11px] text-slate-300 font-medium">
                {status.subtext}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-3xl font-mono font-black ${status.textColor}`}>
              {toxicity.percentageUsed}%
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Fraction: {toxicity.totalFraction} / 1.0
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 overflow-hidden relative shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 ease-out ${status.barColor}`}
            style={{ width: `${Math.min(100, toxicity.percentageUsed)}%` }}
          />
        </div>

        {/* Toxic Overdose Alert CTA to LAST Protocol */}
        {toxicity.status === 'toxic' && (
          <button
            onClick={() => {
              setActiveTab('crisis');
              setActiveCrisisId('last');
            }}
            className="w-full py-2.5 bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-red select-none touch-target flex items-center justify-center gap-2 animate-pulse"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Open 20% Lipid Emulsion Rescue Protocol</span>
          </button>
        )}
      </div>

      {/* Administered Blocks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Administered Nerve Blocks / Infiltrations ({localAdmins.length})
          </h3>
          <div className="flex items-center gap-2">
            {localAdmins.length > 0 && (
              <button
                onClick={clearLocalAdmins}
                className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 bg-slate-900 rounded border border-slate-800"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => addLocalAdminSlot('bupivacaine')}
              className="text-xs text-slate-950 font-bold px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 rounded-xl shadow-glow-cyan flex items-center gap-1 select-none touch-target"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Block</span>
            </button>
          </div>
        </div>

        {localAdmins.length > 0 ? (
          <div className="space-y-2.5">
            {localAdmins.map((item, index) => {
              const agentConfig = LOCAL_ANESTHETICS.find((la) => la.id === item.drugId) || LOCAL_ANESTHETICS[0];
              const breakdown = toxicity.blocks.find((b) => b.id === item.id);
              const isOverIndividual = breakdown ? breakdown.isOverCeiling : false;

              // Safe individual ceiling
              const maxPerKg = item.withEpi ? agentConfig.maxEpiMgPerKg : agentConfig.maxPlainMgPerKg;
              const absCeiling = item.withEpi ? agentConfig.absoluteMaxEpiMg : agentConfig.absoluteMaxPlainMg;
              const allowedSafeMg = Math.min(maxPerKg * weights.tbw, absCeiling);

              // Dose in mg
              const administeredMg = Number((item.volumeGivenMl * (item.concentrationPercent * 10)).toFixed(1));

              return (
                <div
                  key={item.id}
                  className={`bg-slate-900 border ${
                    isOverIndividual ? 'border-rose-500/60 bg-rose-950/20' : 'border-slate-800'
                  } rounded-2xl p-3.5 shadow-md flex flex-col gap-3`}
                >
                  {/* Top Bar: Drug Selector & Delete */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-bold text-slate-500">#{index + 1}</span>
                      <select
                        value={item.drugId}
                        onChange={(e) => {
                          const newDrugId = e.target.value as LocalAnestheticEntry['id'];
                          const targetConfig = LOCAL_ANESTHETICS.find((la) => la.id === newDrugId);
                          const defaultPerc = targetConfig ? targetConfig.standardConcentrations[0].percent : 1.0;
                          setLocalAdmin(item.id, {
                            drugId: newDrugId,
                            concentrationPercent: defaultPerc,
                          });
                        }}
                        className="bg-slate-950 border border-slate-700 text-slate-100 font-bold text-sm rounded-xl px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
                      >
                        {LOCAL_ANESTHETICS.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => removeLocalAdminSlot(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-lg active:bg-slate-800 touch-target flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Volume (mL), Concentration %, Epinephrine Toggle */}
                  <div className="grid grid-cols-12 gap-2 items-center bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    {/* Volume (mL) Stepper */}
                    <div className="col-span-6 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Volume Injected</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const next = Math.max(0, item.volumeGivenMl - 5);
                            setLocalAdmin(item.id, { volumeGivenMl: next });
                          }}
                          className="w-8 h-9 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center select-none"
                        >
                          -5
                        </button>
                        <div className="flex-1 h-9 bg-slate-900 border border-slate-700/80 rounded-lg flex items-center justify-center gap-0.5">
                          <input
                            type="number"
                            min="0"
                            max="200"
                            value={item.volumeGivenMl}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              setLocalAdmin(item.id, { volumeGivenMl: val });
                            }}
                            className="w-12 text-center bg-transparent font-mono font-bold text-base text-cyan-300 focus:outline-none"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold">mL</span>
                        </div>
                        <button
                          onClick={() => {
                            const next = Math.min(200, item.volumeGivenMl + 5);
                            setLocalAdmin(item.id, { volumeGivenMl: next });
                          }}
                          className="w-8 h-9 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center select-none"
                        >
                          +5
                        </button>
                      </div>
                    </div>

                    {/* Concentration Selector */}
                    <div className="col-span-3 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Conc</span>
                      <select
                        value={item.concentrationPercent}
                        onChange={(e) => {
                          setLocalAdmin(item.id, { concentrationPercent: parseFloat(e.target.value) });
                        }}
                        className="h-9 bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg px-1 focus:border-cyan-500 focus:outline-none"
                      >
                        {agentConfig.standardConcentrations.map((c) => (
                          <option key={c.percent} value={c.percent}>
                            {c.percent}%
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Epi Toggle */}
                    <div className="col-span-3 flex flex-col gap-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Epi</span>
                      <button
                        onClick={() => setLocalAdmin(item.id, { withEpi: !item.withEpi })}
                        className={`h-9 rounded-lg text-xs font-bold transition-colors select-none flex items-center justify-center border ${
                          item.withEpi
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.withEpi ? '+ Epi' : 'Plain'}
                      </button>
                    </div>
                  </div>

                  {/* Calculated Output Row */}
                  <div className="flex items-center justify-between text-xs px-1">
                    <div>
                      <span className="text-slate-400">Dose Given: </span>
                      <strong className="font-mono text-slate-100">{administeredMg} mg</strong>
                      <span className="text-slate-500 text-[11px] ml-1">
                        (Max Safe: {allowedSafeMg.toFixed(0)} mg)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-slate-400">Fraction:</span>
                      <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                        isOverIndividual
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-slate-800 text-cyan-300'
                      }`}>
                        {breakdown ? (breakdown.fraction * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>

                  {/* Individual Limit Exceeded Warning */}
                  {isOverIndividual && (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>
                        <strong>Exceeds Single Drug Maximum:</strong> Administered {administeredMg} mg exceeds safe ceiling of {allowedSafeMg.toFixed(0)} mg.
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
            <Syringe className="w-8 h-8 text-slate-600" />
            <p className="text-slate-300 font-semibold text-sm">No Local Anesthetics Added</p>
            <p className="text-slate-500 text-xs">Tap "Add Block" to calculate safe volume and multi-drug toxicity fractions.</p>
            <button
              onClick={() => addLocalAdminSlot('bupivacaine')}
              className="mt-2 px-3 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
            >
              Add Sample Bupivacaine Block
            </button>
          </div>
        )}
      </div>

      {/* Reference Ceilings Quick Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>ASRA Safe Ceiling Reference Table</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-1">Drug</th>
                <th className="py-1">Plain Max</th>
                <th className="py-1">Plain Cap</th>
                <th className="py-1">With Epi Max</th>
                <th className="py-1">Epi Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-1.5 font-bold text-slate-100">Lidocaine</td>
                <td className="py-1.5">4.5 mg/kg</td>
                <td className="py-1.5">300 mg</td>
                <td className="py-1.5 text-cyan-300">7.0 mg/kg</td>
                <td className="py-1.5 text-cyan-300">500 mg</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-slate-100">Bupivacaine</td>
                <td className="py-1.5">2.0 mg/kg</td>
                <td className="py-1.5">175 mg</td>
                <td className="py-1.5 text-cyan-300">2.5 mg/kg</td>
                <td className="py-1.5 text-cyan-300">225 mg</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-slate-100">Ropivacaine</td>
                <td className="py-1.5">3.0 mg/kg</td>
                <td className="py-1.5">225 mg</td>
                <td className="py-1.5 text-cyan-300">3.5 mg/kg</td>
                <td className="py-1.5 text-cyan-300">250 mg</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-slate-100">Mepivacaine</td>
                <td className="py-1.5">4.5 mg/kg</td>
                <td className="py-1.5">300 mg</td>
                <td className="py-1.5 text-cyan-300">7.0 mg/kg</td>
                <td className="py-1.5 text-cyan-300">400 mg</td>
              </tr>
              <tr>
                <td className="py-1.5 font-bold text-slate-100">Chloroprocaine</td>
                <td className="py-1.5">11.0 mg/kg</td>
                <td className="py-1.5">800 mg</td>
                <td className="py-1.5 text-cyan-300">14.0 mg/kg</td>
                <td className="py-1.5 text-cyan-300">1000 mg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
