import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { CheckCircle2, AlertTriangle, Info, Cpu, X } from 'lucide-react';

export const ToastSystem: React.FC = () => {
  const { toasts, removeToast } = useIncidents();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          ai: <Cpu className="w-5 h-5 text-cyan-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
        }[toast.type];

        const borderColor = {
          success: 'border-emerald-500/30',
          warning: 'border-amber-500/30',
          ai: 'border-cyan-500/40 shadow-glow-cyan',
          info: 'border-blue-500/30',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl backdrop-blur-xl bg-[#0F1926]/95 border ${borderColor} shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-right-8`}
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold tracking-wide text-white uppercase">{toast.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
