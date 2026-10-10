import React, { useState } from 'react';
import { useAnesthesiaStore } from '../store/useAnesthesiaStore';
import { KeypadModal } from './KeypadModal';
import { Scale, Ruler, User, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export const BiometricHeader: React.FC = () => {
  const {
    patient,
    weights,
    setPatientMetrics,
    adjustWeight,
    adjustHeight,
    applyPreset,
  } = useAnesthesiaStore();

  const [keypadTarget, setKeypadTarget] = useState<'weight' | 'height' | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  // BMI status badge
  const getBmiBadge = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
    if (bmi < 25) return { label: 'Normal', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (bmi < 30) return { label: 'Overweight', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { label: 'Obese', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const bmiBadge = getBmiBadge(weights.bmi);

  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800 shadow-lg px-2.5 sm:px-4 py-2 sm:py-2.5 w-full overflow-hidden">
      {/* Top Primary Input Row */}
      <div className="grid grid-cols-12 gap-1.5 sm:gap-2 items-center max-w-4xl mx-auto w-full">
        {/* Weight Control (Full width on mobile, 5 cols on sm+) */}
        <div className="col-span-12 sm:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Weight (TBW)
            </span>
            <button
              onClick={() => setKeypadTarget('weight')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono underline uppercase touch-manipulation"
              title="Open Keypad"
            >
              Keypad
            </button>
          </div>

          <div className="flex items-center justify-between gap-1">
            {/* Quick -5 / -1 buttons */}
            <button
              onClick={() => adjustWeight(-5)}
              className="flex-1 sm:w-8 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="-5 kg"
            >
              -5
            </button>
            <button
              onClick={() => adjustWeight(-1)}
              className="flex-1 sm:w-8 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-sm font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="-1 kg"
            >
              -1
            </button>

            {/* Display / Direct Keypad Click */}
            <button
              onClick={() => setKeypadTarget('weight')}
              className="flex-[2.5] sm:flex-1 h-10 bg-slate-950/80 hover:border-cyan-500/50 active:bg-slate-900 border border-slate-700/60 rounded-lg flex items-baseline justify-center gap-0.5 px-1 shadow-inner touch-manipulation transition-colors"
              title="Click to edit weight"
            >
              <span className="text-xl font-mono font-extrabold text-cyan-300">
                {patient.tbwKg.toFixed(1)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">kg</span>
            </button>

            {/* Quick +1 / +5 buttons */}
            <button
              onClick={() => adjustWeight(1)}
              className="flex-1 sm:w-8 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-sm font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="+1 kg"
            >
              +1
            </button>
            <button
              onClick={() => adjustWeight(5)}
              className="flex-1 sm:w-8 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="+5 kg"
            >
              +5
            </button>
          </div>
        </div>

        {/* Height Control (7 cols on mobile, 4 cols on sm+) */}
        <div className="col-span-7 sm:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Ruler className="w-3.5 h-3.5 text-cyan-400" />
              Height
            </span>
            <button
              onClick={() => setKeypadTarget('height')}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono underline uppercase touch-manipulation"
              title="Open Keypad"
            >
              Keypad
            </button>
          </div>

          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => adjustHeight(-1)}
              className="flex-1 sm:w-7 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="-1 cm"
            >
              -1
            </button>

            <button
              onClick={() => setKeypadTarget('height')}
              className="flex-[2] sm:flex-1 h-10 bg-slate-950/80 hover:border-cyan-500/50 active:bg-slate-900 border border-slate-700/60 rounded-lg flex items-baseline justify-center gap-0.5 px-1 shadow-inner touch-manipulation transition-colors"
              title="Click to edit height"
            >
              <span className="text-xl font-mono font-extrabold text-cyan-300">
                {patient.heightCm}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">cm</span>
            </button>

            <button
              onClick={() => adjustHeight(1)}
              className="flex-1 sm:w-7 sm:flex-none h-10 bg-slate-800 active:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg border border-slate-700/50 flex items-center justify-center select-none touch-manipulation"
              title="+1 cm"
            >
              +1
            </button>
          </div>
        </div>

        {/* Sex Toggle (5 cols on mobile, 3 cols on sm+) */}
        <div className="col-span-5 sm:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-col justify-between shadow-inner">
          <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-1 mb-1">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            Sex
          </span>

          <div className="grid grid-cols-2 gap-1 h-10">
            <button
              onClick={() => setPatientMetrics({ sex: 'male' })}
              className={`rounded-lg font-bold text-xs transition-colors flex items-center justify-center select-none touch-manipulation ${
                patient.sex === 'male'
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              M
            </button>
            <button
              onClick={() => setPatientMetrics({ sex: 'female' })}
              className={`rounded-lg font-bold text-xs transition-colors flex items-center justify-center select-none touch-manipulation ${
                patient.sex === 'female'
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              F
            </button>
          </div>
        </div>
      </div>

      {/* Reactive Biometrics Pill Strip */}
      <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar w-full min-w-0">
        {/* BMI */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg px-2 py-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">BMI</span>
          <span className="text-xs font-mono font-bold text-slate-100">{weights.bmi}</span>
          <span className={`text-[9px] font-semibold px-1 py-0.2 rounded border ${bmiBadge.color}`}>
            {bmiBadge.label}
          </span>
        </div>

        {/* Devine IBW */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">IBW (Devine)</span>
          <span className="text-xs font-mono font-bold text-amber-300">{weights.ibw} kg</span>
        </div>

        {/* Janmahasatian LBW */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">LBW (Janma)</span>
          <span className="text-xs font-mono font-bold text-cyan-300">{weights.lbw} kg</span>
        </div>

        {/* ABW40 */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg px-2.5 py-1 shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase">ABW40</span>
          <span className="text-xs font-mono font-bold text-emerald-300">{weights.abw40} kg</span>
        </div>

        {/* Presets Toggle Trigger */}
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2 py-1 rounded-lg shrink-0 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Presets</span>
          {showPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Quick Biometric Presets */}
      {showPresets && (
        <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full min-w-0 animate-fade-in">
          <span className="text-[10px] text-slate-500 uppercase font-semibold shrink-0">Quick Profiles:</span>
          <button
            onClick={() => {
              applyPreset('standard_male');
              setShowPresets(false);
            }}
            className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 shrink-0 select-none active:bg-cyan-600 active:text-white"
          >
            70 kg M (175 cm)
          </button>
          <button
            onClick={() => {
              applyPreset('standard_female');
              setShowPresets(false);
            }}
            className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 shrink-0 select-none active:bg-cyan-600 active:text-white"
          >
            60 kg F (162 cm)
          </button>
          <button
            onClick={() => {
              applyPreset('obese_male');
              setShowPresets(false);
            }}
            className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg border border-slate-700 shrink-0 select-none active:bg-cyan-600 active:text-white"
          >
            120 kg Obese M (BMI 39.2)
          </button>
          <button
            onClick={() => {
              applyPreset('frail_female');
              setShowPresets(false);
            }}
            className="text-[11px] font-mono px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 shrink-0 select-none active:bg-cyan-600 active:text-white"
          >
            45 kg Frail F (152 cm)
          </button>
        </div>
      )}

      {/* Keypad Modals */}
      <KeypadModal
        title="Enter Actual Weight (TBW)"
        initialValue={patient.tbwKg}
        unit="kg"
        min={1}
        max={350}
        allowDecimal={true}
        isOpen={keypadTarget === 'weight'}
        onClose={() => setKeypadTarget(null)}
        onConfirm={(val) => setPatientMetrics({ tbwKg: val })}
      />

      <KeypadModal
        title="Enter Patient Height"
        initialValue={patient.heightCm}
        unit="cm"
        min={40}
        max={250}
        allowDecimal={false}
        isOpen={keypadTarget === 'height'}
        onClose={() => setKeypadTarget(null)}
        onConfirm={(val) => setPatientMetrics({ heightCm: Math.round(val) })}
      />
    </header>
  );
};
