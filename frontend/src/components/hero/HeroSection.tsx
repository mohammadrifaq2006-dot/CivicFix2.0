import React from 'react';
import { Button } from '../ui/Button';
import { useIncidents } from '../../context/IncidentContext';
import { ArrowRight, Wrench, ShieldCheck, AlertTriangle, FileCheck2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setReportModalOpen } = useIncidents();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="section-hero"
      className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-28 pb-16 overflow-hidden bg-[#0B0F17]"
    >
      {/* Background subtle radial gradient */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/25 shadow-sm mb-7 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-mono font-semibold tracking-wider text-emerald-300 uppercase">
            Telangana Road Infrastructure &bull; Pothole &amp; Property Damage Response
          </span>
        </div>

        {/* Big Crisp Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-white">
          <span className="block text-slate-100">Better roads start with</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            better information.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
          Report what you see. Upload personal video and photos. Our AI validates camera authenticity, assesses pothole cavity depth, and coordinates rapid municipal repairs across Hyderabad &amp; Telangana state.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Report Road Damage</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => scrollTo('section-video-guide')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#131D30] text-[#F8FAFC] border border-white/10 hover:border-emerald-500/40 hover:bg-[#18243C] text-sm font-bold tracking-wide transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>How Telangana Roads Are Repaired</span>
          </button>
        </div>

        {/* Active Telemetry Operational Grid */}
        <div className="mt-14 w-full max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-2.5 rounded-2xl bg-[#111827] border border-white/[0.08] shadow-2xl">
            <div className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Municipal Authority</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                GHMC &bull; TELANGANA R&amp;B
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Camera Verification</span>
              <span className="text-xs font-mono font-bold text-cyan-300 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Anti-Fake AI Active
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Property Damage Triage</span>
              <span className="text-xs font-mono font-bold text-amber-300 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Rim &amp; Tyre Protection
              </span>
            </div>

            <div className="flex flex-col p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Target SLA</span>
              <span className="text-xs font-mono font-bold text-white mt-1">
                24 &ndash; 48 Hour Fix
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
