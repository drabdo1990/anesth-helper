import React from 'react';
import { useAnesthesiaStore } from './store/useAnesthesiaStore';
import { BiometricHeader } from './components/BiometricHeader';
import { Navigation } from './components/Navigation';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { CalculatorView } from './views/CalculatorView';
import { CrisisView } from './views/CrisisView';
import { LocalMaxView } from './views/LocalMaxView';
import { RoutineChecklistsView } from './views/RoutineChecklistsView';
import { Activity, Zap, WifiOff } from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, activeCrisisId } = useAnesthesiaStore();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Application Bar */}
      <div className="bg-[#090d16] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-slate-950 font-black shadow-glow-cyan">
            <Activity className="w-4 h-4 stroke-[2.8]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-wider uppercase text-slate-100 flex items-center gap-1.5 leading-none">
              <span>AnesthAssist</span>
              <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                PWA
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 leading-tight">OR Decision Support</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zero latency client-side badge */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
            <Zap className="w-3 h-3" />
            <span>Zero-Latency Engine</span>
          </div>

          {!isOnline && (
            <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full font-mono">
              <WifiOff className="w-3 h-3" />
              <span>Offline Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Biometric Control Bar */}
      <BiometricHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-4">
        {activeTab === 'calculator' && <CalculatorView />}
        {activeTab === 'crisis' && <CrisisView />}
        {activeTab === 'local_max' && <LocalMaxView />}
        {activeTab === 'pacu' && <RoutineChecklistsView />}
      </main>

      {/* Permanent Medical Disclaimer Banner */}
      <div className="pb-16">
        <DisclaimerBanner />
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <Navigation />
    </div>
  );
};

export default App;
