import React, { useEffect, useState } from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const pSteps = [
      { val: 12, delay: 200 },
      { val: 36, delay: 600 },
      { val: 67, delay: 1100 },
      { val: 100, delay: 1650 },
    ];

    const timeouts = pSteps.map(step => {
      return setTimeout(() => {
        setProgress(step.val);
        if (step.val === 100) {
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(onComplete, 500);
          }, 350);
        }
      }, step.delay);
    });

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#05080D] transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Glowing Logo Icon */}
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/30 to-emerald-500/20 border border-cyan-400/40 flex items-center justify-center shadow-glow-cyan">
            <ShieldAlert className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -inset-2 rounded-2xl border border-cyan-500/20 animate-ping opacity-25" />
        </div>

        {/* Brand */}
        <div className="text-xl sm:text-2xl font-black tracking-wider text-white mb-2 flex items-center gap-2">
          <span>CIVICROAD</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI</span>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 mb-6">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>INITIALIZING CITY INTELLIGENCE...</span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5 mb-3">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 ease-out shadow-glow-cyan"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage */}
        <span className="text-xs font-mono text-slate-500">{progress}%</span>
      </div>
    </div>
  );
};
