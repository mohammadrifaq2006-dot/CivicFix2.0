import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { FUSED_MATCHING_REPORTS, MATCHING_POTHOLE_PRIMARY } from '../../data/assets';
import { soundService } from '../../services/soundService';
import { 
  CheckCircle2, 
  MapPin, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  Wrench,
  AlertTriangle,
  FileCheck2,
  Clock,
  Sparkles
} from 'lucide-react';

export const IncidentFusion: React.FC = () => {
  const [isFused, setIsFused] = useState(false);
  const [isFusing, setIsFusing] = useState(false);

  const triggerFusion = () => {
    setIsFusing(true);
    setIsFused(false);
    soundService.playScan();

    setTimeout(() => {
      setIsFusing(false);
      setIsFused(true);
      soundService.playFusion();
    }, 1200);
  };

  const resetFusion = () => {
    setIsFused(false);
    setIsFusing(false);
    soundService.playClick();
  };

  return (
    <section id="section-fusion" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Multi-Perspective Pothole Convergence</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            AI Incident Fusion &bull; Verified Evidence
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            6 citizens reported the exact same hazardous pothole from different angles on Hyderabad's Outer Ring Road. 
            Our AI clusters identical coordinates, optical textures, and property damage into one verified incident.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 px-5 py-2 rounded-xl bg-[#111827] border border-emerald-500/30 text-xs font-mono">
            <span className="text-slate-400 line-through">6 fragmented citizen reports</span>
            <span className="text-emerald-400 font-bold">&rarr;</span>
            <span className="text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1 Unified Verified Incident Ticket (#CR-2048)
            </span>
          </div>
        </div>

        {/* Fusion Interactive Stage */}
        <div className="relative rounded-3xl bg-[#111827] border border-white/[0.08] p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center">
          {/* Central AI Processor Emblem */}
          <div className="relative z-20 flex flex-col items-center mb-6">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                isFusing
                  ? 'bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/30'
                  : isFused
                  ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-md'
                  : 'bg-[#162032] border border-emerald-500/30'
              }`}
            >
              <Layers className={`w-8 h-8 ${isFusing ? 'text-slate-950 animate-spin' : isFused ? 'text-white' : 'text-emerald-400'}`} />
            </div>

            <span className="mt-2.5 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
              {isFusing ? 'CONVERGING 6 MATCHING ANGLES...' : isFused ? 'INCIDENT #CR-2048 VERIFIED' : 'AI INCIDENT FUSION'}
            </span>
          </div>

          {/* State 1: 6 Matching Angle Photo Cards */}
          <div
            className={`w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500 ${
              isFused
                ? 'opacity-0 scale-90 pointer-events-none absolute'
                : isFusing
                ? 'scale-95 opacity-50 blur-[0.5px]'
                : 'opacity-100 scale-100'
            }`}
          >
            {FUSED_MATCHING_REPORTS.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#162032] border border-white/[0.08] hover:border-emerald-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-white font-bold">{item.label.split('—')[0]}</span>
                    <span className="text-emerald-400 font-semibold">{item.time}</span>
                  </div>

                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/5 mb-2.5 bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[9px] font-mono text-emerald-300 border border-emerald-500/30">
                      {item.angle}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-300 font-medium mb-1">
                    "{item.notes}"
                  </div>

                  <div className="p-2 rounded-lg bg-red-950/20 border border-red-500/20 text-[10px] text-red-300 font-mono mb-2">
                    Property Damage: {item.propertyDamageWitnessed}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-white/5">
                  <span className="flex items-center gap-1 text-slate-300 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Pillar 142 &bull; Gachibowli</span>
                  </span>
                  <span className="text-emerald-400 font-bold">{item.matchConfidence}% Match</span>
                </div>
              </div>
            ))}
          </div>

          {/* State 2: Fused Unified Incident Card (#CR-2048) */}
          <div
            className={`w-full max-w-2xl transition-all duration-500 transform ${
              isFused
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-6 pointer-events-none absolute'
            }`}
          >
            <div className="p-6 sm:p-7 rounded-2xl bg-[#162032] border-2 border-emerald-500/40 shadow-2xl space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        INCIDENT #CR-2048
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40">
                        SEVERITY: HIGH
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                      Severe Pothole Cavity &bull; Wheel Impact Hazard
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">AI Match Confidence</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">99.4% REAL</span>
                </div>
              </div>

              {/* Verified Pothole Image */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/8] border border-white/10">
                <img src={MATCHING_POTHOLE_PRIMARY} alt="Verified Pothole" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/85 text-[10px] font-mono text-white">
                  6 Independent Citizen Perspectives Converged &bull; ORR Pillar 142
                </div>
              </div>

              {/* Pothole Dimensions & Property Damage Recorded */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#111827] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Cavity Depth</span>
                  <span className="text-sm font-bold text-red-400 mt-0.5 block">8.5 cm</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111827] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Affected Area</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">2.8 m²</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111827] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Property Damage</span>
                  <span className="text-sm font-bold text-amber-300 mt-0.5 block">3 Rims Cracked</span>
                </div>
                <div className="p-3 rounded-xl bg-[#111827] border border-white/5">
                  <span className="text-[10px] text-slate-400 block">Municipal SLA</span>
                  <span className="text-sm font-bold text-emerald-400 mt-0.5 block">24h Jetpatcher</span>
                </div>
              </div>

              {/* Deduplication Guarantee */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 Duplicate Municipal Tickets Eliminated &bull; Clean Single Work Order</span>
                </div>
                <span className="font-mono text-emerald-400 font-bold">100% Coordinated</span>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="mt-8 z-20 flex items-center gap-3">
            {!isFused ? (
              <button
                onClick={triggerFusion}
                disabled={isFusing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>{isFusing ? 'PROCESSING CONVERGENCE...' : 'FUSE 6 REAL REPORTS INTO 1 INCIDENT'}</span>
              </button>
            ) : (
              <button
                onClick={resetFusion}
                className="px-5 py-2.5 rounded-xl bg-[#162032] border border-white/10 hover:border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>REPLAY FUSION ANIMATION</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
