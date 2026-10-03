import React from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Button } from '../ui/Button';
import { ArrowRight, Plus, ShieldCheck, CheckCircle2, Video } from 'lucide-react';

export const CinematicFooter: React.FC = () => {
  const { setReportModalOpen } = useIncidents();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-[#05080D] border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Continuous Loop Banner */}
        <div className="w-full max-w-3xl mb-14 p-6 rounded-3xl bg-[#0A111B]/90 border border-white/10 backdrop-blur-xl shadow-xl">
          <div className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase mb-3 font-bold">
            The Continuous Municipal Loop &bull; Telangana Standards
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300">Citizen Camera Photo</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">AI Authenticity Verified</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300">Incident Fusion</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300">Accident Risk Triage</span>
            <span className="text-slate-600">&rarr;</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Jetpatcher Rectified
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
          Better roads start with better information.
        </h2>

        <p className="mt-4 max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed">
          Report what you see. Let intelligence do the rest. Connecting citizens, AI authenticity verification, and municipal road squads into one continuous public safety network.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Report Road Damage &rarr;</span>
          </button>

          <button
            onClick={() => scrollTo('section-video-guide')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:border-emerald-500/30 text-white text-sm font-semibold transition-all cursor-pointer"
          >
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Watch Video Guide</span>
          </button>
        </div>

        {/* Brand & Legal Info */}
        <div className="mt-16 pt-8 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span>CIVICROAD</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => scrollTo('section-problem')} className="hover:text-white cursor-pointer">Citizen</button>
            <button onClick={() => scrollTo('section-video-guide')} className="hover:text-white cursor-pointer">Video Guide</button>
            <button onClick={() => scrollTo('section-accidents')} className="hover:text-white cursor-pointer">Accident Registry</button>
            <button onClick={() => scrollTo('section-command')} className="hover:text-white cursor-pointer">Dashboard</button>
          </div>

          <div className="text-slate-500">
            &copy; 2026 CivicRoad &bull; All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};
