import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  X
} from 'lucide-react';

export const DemoControlBar: React.FC = () => {
  const {
    isDemoRunning,
    isDemoPaused,
    demoStepIndex,
    demoProgress,
    pauseDemo,
    resumeDemo,
    skipDemoStep,
    restartDemo,
    stopDemo,
  } = useIncidents();

  // If not running, do not show any floating demo button (clean real website)
  if (!isDemoRunning) {
    return null;
  }

  const stepLabels = [
    '01 / OVERVIEW',
    '02 / CITIZEN REPORTING',
    '03 / REAL VS FAKE AI CHECK',
    '04 / INCIDENT FUSION',
    '05 / ACCIDENT RISK TRIAGE',
    '06 / DISPATCH CONSOLE',
    '07 / ASPHALT REPAIR',
    '08 / VERIFICATION',
    '09 / IMPACT',
  ];

  const currentLabel = stepLabels[demoStepIndex] || '01 / SYSTEM OVERVIEW';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4 animate-in slide-in-from-bottom-6">
      <div className="p-3.5 rounded-2xl bg-[#070C14]/95 backdrop-blur-2xl border border-emerald-500/40 shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-2">
          {/* Active Step Indicator Pill */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono font-extrabold text-emerald-300 tracking-wider">
              {currentLabel}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {isDemoPaused ? (
              <button
                onClick={resumeDemo}
                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer"
                title="Resume [P]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={pauseDemo}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                title="Pause [P]"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={skipDemoStep}
              className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Skip Step [S]"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={restartDemo}
              className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Restart Tour [R]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={stopDemo}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close [Esc]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Linear Progress Bar for Current Step */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${demoProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
