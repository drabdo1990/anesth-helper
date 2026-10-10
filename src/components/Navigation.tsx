import React from 'react';
import { useAnesthesiaStore, AppTab } from '../store/useAnesthesiaStore';
import { Calculator, ShieldAlert, Syringe, ClipboardCheck } from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    cprTimerRunning,
    activeCrisisId,
    getFractionalToxicity,
  } = useAnesthesiaStore();

  const toxicity = getFractionalToxicity();
  const isLocalRisky = toxicity.status === 'caution' || toxicity.status === 'toxic';

  const navItems: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: React.ReactNode }[] = [
    {
      id: 'calculator',
      label: 'Calculator',
      icon: Calculator,
    },
    {
      id: 'crisis',
      label: 'Crisis Cards',
      icon: ShieldAlert,
      badge: (cprTimerRunning || activeCrisisId) ? (
        <span className="absolute top-1.5 right-4 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
      ) : null,
    },
    {
      id: 'local_max',
      label: 'Local Max',
      icon: Syringe,
      badge: isLocalRisky ? (
        <span className={`absolute top-1.5 right-4 px-1 rounded-full text-[9px] font-bold ${
          toxicity.status === 'toxic' ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-500 text-slate-950'
        }`}>
          {toxicity.percentageUsed}%
        </span>
      ) : null,
    },
    {
      id: 'pacu',
      label: 'Routine & PACU',
      icon: ClipboardCheck,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-md border-t border-slate-800 pb-safe">
      <div className="grid grid-cols-4 max-w-4xl mx-auto h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 select-none transition-colors touch-target ${
                isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-cyan-500/10' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] tracking-tight">{item.label}</span>
              {item.badge}
              {isActive && (
                <span className="absolute bottom-1 w-8 h-0.5 bg-cyan-400 rounded-full shadow-glow-cyan" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
