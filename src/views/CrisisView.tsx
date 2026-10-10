import React, { useEffect, useRef } from 'react';
import { useAnesthesiaStore } from '../store/useAnesthesiaStore';
import { CRISIS_PROTOCOLS } from '../constants/crisisProtocols';
import {
  playCprMetronomeClick,
  playCycleAlertGong,
  playEmergencyPulseTone,
} from '../lib/audioAlerts';
import {
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  PhoneCall,
  CheckCircle2,
  Circle,
  AlertOctagon,
  Clock,
  HeartPulse,
} from 'lucide-react';

export const CrisisView: React.FC = () => {
  const {
    patient,
    weights,
    activeCrisisId,
    setActiveCrisisId,
    crisisChecklist,
    toggleCrisisItem,
    resetCrisisProtocol,
    cprTimerRunning,
    cprTimerSeconds,
    cprAudioAlert,
    cprMetronomeActive,
    startCprTimer,
    pauseCprTimer,
    resetCprTimer,
    tickCprTimer,
    toggleCprAudio,
    toggleCprMetronome,
  } = useAnesthesiaStore();

  const metronomeIntervalRef = useRef<number | null>(null);

  // Timer Tick Interval
  useEffect(() => {
    let interval: number | null = null;
    if (cprTimerRunning) {
      interval = window.setInterval(() => {
        tickCprTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cprTimerRunning, tickCprTimer]);

  // 2-minute Cycle Gong Alert
  useEffect(() => {
    if (cprTimerRunning && cprTimerSeconds > 0 && cprTimerSeconds % 120 === 0) {
      if (cprAudioAlert) {
        playCycleAlertGong();
      }
    }
  }, [cprTimerSeconds, cprTimerRunning, cprAudioAlert]);

  // CPR Metronome (110 BPM = 545.45 ms interval)
  useEffect(() => {
    if (cprMetronomeActive && cprAudioAlert) {
      metronomeIntervalRef.current = window.setInterval(() => {
        playCprMetronomeClick();
      }, 545);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    }
    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [cprMetronomeActive, cprAudioAlert]);

  // Format seconds into MM:SS
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const cycleProgress = ((cprTimerSeconds % 120) / 120) * 100;
  const currentCycleNumber = Math.floor(cprTimerSeconds / 120) + 1;

  // Selected Crisis Protocol
  const currentProtocol =
    CRISIS_PROTOCOLS.find((p) => p.id === activeCrisisId) || CRISIS_PROTOCOLS[0];

  // Specific Crisis Calculations
  const weight = weights.tbw;

  // 1. LAST 20% Lipid Emulsion
  const lipidBolusMl = Math.min(100, Number((weight * 1.5).toFixed(1)));
  const lipidInfusionMlPerMin = Number((weight * 0.25).toFixed(1));
  const lipidInfusionMlPerHr = Number((weight * 15).toFixed(0));

  // 2. MH Dantrolene & Ryanodex Calculations
  const mhInitialDoseMg = Number((weight * 2.5).toFixed(0));
  const ryanodexVialsNeeded = Math.ceil(mhInitialDoseMg / 250);
  const dantrolene20mgVialsNeeded = Math.ceil(mhInitialDoseMg / 20);
  const dantroleneWaterNeededMl = dantrolene20mgVialsNeeded * 60;

  return (
    <div className="space-y-4 pb-24">
      {/* High-Visibility Emergency Header / Call for Help Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border border-rose-500/50 rounded-2xl p-4 shadow-glow-red flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 text-slate-950 rounded-xl font-bold animate-emergency">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-rose-300 tracking-wide uppercase">
              Operating Room Crisis Mode
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Immediate cognitive offloading & interactive checklists
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playEmergencyPulseTone();
            if (!cprTimerRunning) startCprTimer();
          }}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-400 active:bg-rose-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-red select-none touch-target flex items-center gap-1.5"
        >
          <PhoneCall className="w-4 h-4 stroke-[2.5]" />
          <span>Call Help</span>
        </button>
      </div>

      {/* CPR / Rhythm & Event Timer Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Resuscitation / 2-Min Cycle Timer
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              Cycle #{currentCycleNumber}
            </span>
            <button
              onClick={toggleCprAudio}
              className={`p-1.5 rounded-lg border transition-colors ${
                cprAudioAlert
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
              title="Toggle Audio Cues"
            >
              {cprAudioAlert ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Big Monospace Display & 2-Min Bar */}
        <div className="flex flex-col items-center justify-center py-2 bg-slate-950 border border-slate-800 rounded-xl shadow-inner relative overflow-hidden">
          {/* 2-minute cycle progress background */}
          <div
            className="absolute left-0 bottom-0 top-0 bg-cyan-500/10 transition-all duration-1000 ease-linear pointer-events-none"
            style={{ width: `${cycleProgress}%` }}
          />

          <span className="text-4xl sm:text-5xl font-mono font-black text-cyan-300 tracking-wider relative z-10">
            {formatTimer(cprTimerSeconds)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 relative z-10">
            {120 - (cprTimerSeconds % 120)}s remaining in current 2-min cycle
          </span>
        </div>

        {/* Timer Control Bar (Glove-Friendly Touch Targets >= 48px) */}
        <div className="grid grid-cols-3 gap-2">
          {!cprTimerRunning ? (
            <button
              onClick={() => {
                startCprTimer();
                if (cprAudioAlert) playCprMetronomeClick();
              }}
              className="h-12 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-glow-emerald flex items-center justify-center gap-1.5 select-none touch-target"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={pauseCprTimer}
              className="h-12 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5 select-none touch-target"
            >
              <Pause className="w-5 h-5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={resetCprTimer}
            className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 flex items-center justify-center gap-1 select-none touch-target"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={toggleCprMetronome}
            className={`h-12 font-bold text-xs uppercase tracking-wider rounded-xl border flex items-center justify-center gap-1 select-none touch-target transition-colors ${
              cprMetronomeActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-glow-red animate-pulse'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>{cprMetronomeActive ? 'CPR: 110 BPM' : 'Metronome'}</span>
          </button>
        </div>
      </div>

      {/* Protocol Tabs (LAST / MH / DAS CICO) */}
      <div className="grid grid-cols-3 gap-2">
        {CRISIS_PROTOCOLS.map((protocol) => {
          const isSelected = (activeCrisisId || 'last') === protocol.id;
          return (
            <button
              key={protocol.id}
              onClick={() => setActiveCrisisId(protocol.id)}
              className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center select-none touch-target flex flex-col items-center justify-center gap-0.5 border ${
                isSelected
                  ? protocol.id === 'mh'
                    ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-glow-red'
                    : protocol.id === 'cico'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                    : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              <span className="text-sm font-black">{protocol.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Active Crisis Protocol Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        {/* Title & Subtitle */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-100">{currentProtocol.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{currentProtocol.subtitle}</p>
          </div>
          <button
            onClick={() => resetCrisisProtocol(currentProtocol.id)}
            className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800 shrink-0"
          >
            Reset Checks
          </button>
        </div>

        {/* Emergency Call Banner if present */}
        {currentProtocol.emergencyCallBanner && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-3 flex items-center justify-between gap-2 text-rose-300 text-xs font-bold">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{currentProtocol.emergencyCallBanner}</span>
            </div>
            {currentProtocol.id === 'mh' && (
              <a
                href="tel:18006449737"
                className="px-2.5 py-1 bg-rose-500 text-slate-950 rounded-lg text-xs font-black uppercase tracking-wider shrink-0"
              >
                Call Now
              </a>
            )}
          </div>
        )}

        {/* Real-Time Protocol Specific Interactive Calculators */}
        {/* 1. LAST 20% Lipid Emulsion Calculator */}
        {currentProtocol.id === 'last' && (
          <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                20% Lipid Emulsion Weight-Based Dosing ({weight} kg TBW)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Initial Bolus (1.5 mL/kg)</span>
                <span className="text-2xl font-mono font-black text-cyan-300">{lipidBolusMl} mL</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Push over 2-3 min (Max 100 mL)</span>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Continuous Infusion</span>
                <span className="text-2xl font-mono font-black text-cyan-300">{lipidInfusionMlPerMin} mL/min</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pump: {lipidInfusionMlPerHr} mL/hr</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              * Repeat bolus 1-2 times for persistent asystole/VF. Maximum cumulative dose: 12 mL/kg.
            </p>
          </div>
        )}

        {/* 2. Malignant Hyperthermia Vial Calculator */}
        {currentProtocol.id === 'mh' && (
          <div className="bg-slate-950 border border-rose-500/30 rounded-xl p-3 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              MH Antagonist Initial Bolus: 2.5 mg/kg ({weight} kg TBW) = {mhInitialDoseMg} mg
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              {/* Ryanodex */}
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-400">RYANODEX (Modern)</span>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-800">
                    250 mg / 5 mL vial
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-black text-slate-100">{ryanodexVialsNeeded}</span>
                  <span className="text-xs font-bold text-slate-300">Vial{ryanodexVialsNeeded > 1 ? 's' : ''} needed</span>
                </div>
                <p className="text-[10px] text-cyan-300/80 mt-1">
                  Dissolves in ONLY {ryanodexVialsNeeded * 5} mL sterile water in under 1 minute.
                </p>
              </div>

              {/* Traditional Dantrolene */}
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">DANTRIUM / REVONTO</span>
                  <span className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                    20 mg / 60 mL vial
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-mono font-black text-amber-300">{dantrolene20mgVialsNeeded}</span>
                  <span className="text-xs font-bold text-slate-300">Vials needed</span>
                </div>
                <p className="text-[10px] text-amber-300/80 mt-1">
                  Requires {dantroleneWaterNeededMl} mL warm sterile water (assign multiple assistants).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. DAS CICO eFONA Summary Pill Box */}
        {currentProtocol.id === 'cico' && (
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-3 flex flex-col gap-1.5 text-xs text-amber-200">
            <span className="font-bold text-amber-400 uppercase tracking-wide">
              Difficult Airway Society (DAS) Escalation Pathway:
            </span>
            <div className="grid grid-cols-4 gap-1 text-center font-bold text-[11px] pt-1">
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">Plan A: Intubate</div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">Plan B: SAD/LMA</div>
              <div className="bg-slate-900 p-1.5 rounded border border-slate-800">Plan C: Mask O2</div>
              <div className="bg-rose-950 text-rose-300 p-1.5 rounded border border-rose-800">Plan D: eFONA</div>
            </div>
          </div>
        )}

        {/* Step-by-Step Checklist Items (Large Touch Targets >= 48px) */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Emergency Action Checklist:
          </span>

          <div className="space-y-1.5">
            {currentProtocol.checklist.map((item, index) => {
              const isChecked = !!crisisChecklist[item.id];

              return (
                <button
                  key={item.id}
                  onClick={() => toggleCrisisItem(item.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 select-none touch-target ${
                    isChecked
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : item.critical
                      ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-100'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <span className={`text-xs font-medium leading-relaxed block ${
                      isChecked ? 'line-through text-slate-400' : ''
                    }`}>
                      <strong className="text-slate-300 mr-1.5">#{index + 1}.</strong>
                      {item.text}
                    </span>

                    {item.notes && !isChecked && (
                      <span className="text-[11px] text-cyan-300/80 block mt-1 font-mono">
                        {item.notes}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
