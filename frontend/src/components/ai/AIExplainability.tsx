import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { useIncidents } from '../../context/IncidentContext';
import { ShieldCheck, Info, BarChart3, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';

export const AIExplainability: React.FC = () => {
  const { selectedIncident } = useIncidents();
  const [activeFactorId, setActiveFactorId] = useState<string>('f1');

  // Fallback to default incident factors if none
  const factors = selectedIncident?.factors && selectedIncident.factors.length > 0
    ? selectedIncident.factors
    : [
        { id: 'f1', name: 'Road Damage Size & Depth', score: 28, maxScore: 30, description: 'Cavity depth exceeds 8.2cm with 2.8m² structural disintegration', category: 'physical' as const },
        { id: 'f2', name: 'Traffic Exposure Index', score: 22, maxScore: 25, description: 'Arterial bus corridor carrying ~18,400 vehicles per hour', category: 'exposure' as const },
        { id: 'f3', name: 'Two-Wheeler Safety Risk', score: 20, maxScore: 25, description: 'Located directly along primary motorcycle lane; elevated rollover risk', category: 'safety' as const },
        { id: 'f4', name: 'Repeated Community Reports', score: 10, maxScore: 10, description: '6 distinct citizens reported within a 4-hour window', category: 'social' as const },
        { id: 'f5', name: 'Location Sensitivity', score: 7, maxScore: 10, description: '250m from Metro Station entrance & emergency ambulance lane', category: 'geospatial' as const },
      ];

  const totalScore = factors.reduce((acc, cur) => acc + cur.score, 0);

  const activeFactor = factors.find(f => f.id === activeFactorId) || factors[0];

  return (
    <div className="mt-12 max-w-5xl mx-auto">
      <GlassCard intensity="high" className="p-6 sm:p-10 border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transparent Decision Science</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why This Incident Matters
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              CivicRoad replaces opaque black-box decisions with auditable weighted risk variables understandable by civil engineers and city directors alike.
            </p>
          </div>

          {/* Big Score Box */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#070C14] border border-cyan-500/30 shadow-glow-cyan shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
                COMPOSITE RISK
              </span>
              <span className="text-xs font-bold text-amber-400">HIGH PRIORITY</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-cyan-300 via-white to-blue-400 font-mono">
              {totalScore}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </div>
          </div>
        </div>

        {/* Explainability Breakdown Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Progress Bars (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {factors.map((f) => {
              const pct = (f.score / f.maxScore) * 100;
              const isSelected = f.id === activeFactorId;

              return (
                <div
                  key={f.id}
                  onClick={() => setActiveFactorId(f.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#142337]/90 border-cyan-400/40 shadow-glow-cyan'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className={`font-semibold ${isSelected ? 'text-cyan-300 font-bold' : 'text-slate-200'}`}>
                      {f.name}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">
                      +{f.score} <span className="text-slate-500 font-normal">/ {f.maxScore}</span>
                    </span>
                  </div>

                  {/* Animated Bar */}
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        f.score >= 25
                          ? 'bg-gradient-to-r from-red-500 to-amber-500'
                          : f.score >= 18
                          ? 'bg-gradient-to-r from-amber-400 to-cyan-400'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Explainer Pane (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-[#0A111B]/90 border border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                <Info className="w-3.5 h-3.5" />
                <span>Factor Deep-Dive</span>
              </div>

              <h4 className="text-base font-bold text-white mb-2">
                {activeFactor.name}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {activeFactor.description}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Impact Weighting</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {Math.round((activeFactor.score / totalScore) * 100)}% of Total Score
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Source Variable</span>
                  <span className="text-white capitalize">{activeFactor.category} Analysis</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Full mathematical trace logged to municipal audit ledger</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
