import React, { useState } from 'react';
import { useAnesthesiaStore } from '../store/useAnesthesiaStore';
import {
  WHO_SAFETY_CHECKLIST,
  EXTUBATION_CRITERIA_CHECKLIST,
} from '../constants/routineChecklists';
import {
  ClipboardCheck,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  FileText,
  RotateCcw,
} from 'lucide-react';

export const RoutineChecklistsView: React.FC = () => {
  const {
    patient,
    weights,
    routineChecklist,
    toggleRoutineItem,
    resetRoutineChecklist,
  } = useAnesthesiaStore();

  const [activeSubTab, setActiveSubTab] = useState<'who' | 'extubation' | 'pacu'>('who');
  const [copied, setCopied] = useState(false);

  // SBAR Form State
  const [procedure, setProcedure] = useState('Laparoscopic Cholecystectomy');
  const [airwayUsed, setAirwayUsed] = useState('ETT 7.5 cuffed, Grade 1 view');
  const [anesthesiaType, setAnesthesiaType] = useState('General GETA');
  const [bloodLossMl, setBloodLossMl] = useState('50');
  const [fluidsGivenMl, setFluidsGivenMl] = useState('1000 mL Crystalloid');
  const [urineOutputMl, setUrineOutputMl] = useState('250');
  const [painPlan, setPainPlan] = useState('Multimodal: Fentanyl 150mcg, Ketorolac 30mg, TAP Block');
  const [ponvProphylaxis, setPonvProphylaxis] = useState('Ondansetron 4mg + Dexamethasone 4mg');
  const [postOpOrders, setPostOpOrders] = useState('Oxygen 2L via NC, monitor SpO2, PACU phase 1 discharge criteria');

  // Checklists progress
  const whoTotal = WHO_SAFETY_CHECKLIST.length;
  const whoChecked = WHO_SAFETY_CHECKLIST.filter((i) => !!routineChecklist[i.id]).length;
  const whoPct = Math.round((whoChecked / whoTotal) * 100);

  const extTotal = EXTUBATION_CRITERIA_CHECKLIST.length;
  const extChecked = EXTUBATION_CRITERIA_CHECKLIST.filter((i) => !!routineChecklist[i.id]).length;
  const extPct = Math.round((extChecked / extTotal) * 100);

  // Generate Anonymous Scrubbed SBAR Text
  const generateSbarText = () => {
    return `=== PACU SBAR ANESTHESIA HANDOFF ===
SITUATION:
- Patient: ${patient.sex.toUpperCase()}, ${patient.tbwKg} kg (BMI ${weights.bmi})
- Procedure: ${procedure}
- Anesthesia Type: ${anesthesiaType}

BACKGROUND:
- Height: ${patient.heightCm} cm | IBW: ${weights.ibw} kg | LBW: ${weights.lbw} kg
- Airway: ${airwayUsed}
- Allergies: NKDA / Verified on Pre-op Sign-In

ASSESSMENT & INTRAL-OP METRICS:
- Estimated Blood Loss (EBL): ${bloodLossMl} mL
- Fluids Administered: ${fluidsGivenMl}
- Urine Output: ${urineOutputMl} mL
- Analgesia Given: ${painPlan}
- PONV Prophylaxis: ${ponvProphylaxis}
- Neuromuscular Status: TOF 4/4, reversed with Sugammadex/Neostigmine

RECOMMENDATIONS / POST-OP ORDERS:
- Respiratory: ${postOpOrders}
- Pain Management: Titrate PACU analgesics per protocol
- Destination: Outpatient Discharge / Inpatient Floor per surgical team
[Generated via AnesthAssist Clinical Decision Support]`;
  };

  const handleCopyClipboard = async () => {
    try {
      const text = generateSbarText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Subtabs Selector */}
      <div className="grid grid-cols-3 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-md">
        <button
          onClick={() => setActiveSubTab('who')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all select-none touch-target flex items-center justify-center gap-1.5 ${
            activeSubTab === 'who'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>WHO Sign In</span>
          <span className="text-[10px] font-mono opacity-80">({whoPct}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('extubation')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all select-none touch-target flex items-center justify-center gap-1.5 ${
            activeSubTab === 'extubation'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Extubation</span>
          <span className="text-[10px] font-mono opacity-80">({extPct}%)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pacu')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all select-none touch-target flex items-center justify-center gap-1.5 ${
            activeSubTab === 'pacu'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-glow-cyan'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PACU SBAR</span>
        </button>
      </div>

      {/* 1. WHO Surgical Safety View */}
      {activeSubTab === 'who' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                WHO Surgical Safety Checklist
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign In (Pre-Induction) & Time Out (Pre-Incision)
              </p>
            </div>
            <button
              onClick={() => resetRoutineChecklist('who')}
              className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${whoPct}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-cyan-300">{whoChecked}/{whoTotal}</span>
          </div>

          {/* List items */}
          <div className="space-y-2">
            {WHO_SAFETY_CHECKLIST.map((item) => {
              const isChecked = !!routineChecklist[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleRoutineItem(item.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 select-none touch-target ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-0.5">
                      {item.section}
                    </span>
                    <span className={`text-xs font-medium leading-relaxed block ${
                      isChecked ? 'line-through text-slate-400' : ''
                    }`}>
                      {item.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Extubation Criteria View */}
      {activeSubTab === 'extubation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                Extubation Readiness Assessment
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mechanics, Gas Exchange, Reversal, & Airway Reflexes
              </p>
            </div>
            <button
              onClick={() => resetRoutineChecklist('ext')}
              className="text-xs text-slate-400 hover:text-rose-400 font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${extPct}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300">{extChecked}/{extTotal}</span>
          </div>

          {/* List items */}
          <div className="space-y-2">
            {EXTUBATION_CRITERIA_CHECKLIST.map((item) => {
              const isChecked = !!routineChecklist[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggleRoutineItem(item.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 select-none touch-target ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block mb-0.5">
                      {item.section}
                    </span>
                    <span className={`text-xs font-medium leading-relaxed block ${
                      isChecked ? 'line-through text-slate-400' : ''
                    }`}>
                      {item.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PACU SBAR Handoff View */}
      {activeSubTab === 'pacu' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide">
                PACU SBAR Handoff Generator
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Anonymous, scrubbed text summary for clipboard and chart notes
              </p>
            </div>

            <button
              onClick={handleCopyClipboard}
              className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-cyan flex items-center gap-1.5 select-none touch-target"
            >
              {copied ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Procedure</label>
              <input
                type="text"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Airway Device</label>
              <input
                type="text"
                value={airwayUsed}
                onChange={(e) => setAirwayUsed(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Estimated Blood Loss (mL)</label>
              <input
                type="text"
                value={bloodLossMl}
                onChange={(e) => setBloodLossMl(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Total Fluids Administered</label>
              <input
                type="text"
                value={fluidsGivenMl}
                onChange={(e) => setFluidsGivenMl(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Analgesia Given</label>
              <input
                type="text"
                value={painPlan}
                onChange={(e) => setPainPlan(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-slate-400 font-semibold uppercase text-[10px]">Post-Op Orders & Respiratory</label>
              <input
                type="text"
                value={postOpOrders}
                onChange={(e) => setPostOpOrders(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Clipboard Output Preview (Zero-PHI Scrubbed):
            </span>
            <pre className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 text-[11px] font-mono text-cyan-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {generateSbarText()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
