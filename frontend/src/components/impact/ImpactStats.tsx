import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ShieldCheck, CheckCircle2, Clock, Users, Sparkles } from 'lucide-react';

export const ImpactStats: React.FC = () => {
  return (
    <section id="section-impact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#05080D] border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERIFIED INFRASTRUCTURE IMPACT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Real Infrastructure Momentum
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Civic engagement combined with AI triage accelerates repair cycles and keeps city transit corridors safe across Telangana.
          </p>
        </div>

        {/* 4 Cards matching user's design screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-[#0A131F]/90 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">
              1,248
            </div>
            <div className="text-sm font-bold text-white mt-1.5">
              Road issues reported
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Crowdsourced community submissions across 5 Telangana municipal zones.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-[#0A131F]/90 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
              872
            </div>
            <div className="text-sm font-bold text-white mt-1.5">
              Issues resolved
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Permanently repaired with asphalt compaction &amp; photo audit.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-[#0A131F]/90 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-blue-300 font-mono">
              31%
            </div>
            <div className="text-sm font-bold text-white mt-1.5">
              Faster response
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Reduction in average municipal dispatch &amp; triage lag.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-[#0A131F]/90 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 shadow-xl group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-300 font-mono">
              3,800+
            </div>
            <div className="text-sm font-bold text-white mt-1.5">
              Community contributors
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Daily active motorists, cyclists, and transit riders across Telangana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
