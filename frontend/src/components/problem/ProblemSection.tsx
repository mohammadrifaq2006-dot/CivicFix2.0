import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { REAL_POTHOLE_PRIMARY } from '../../data/assets';
import { AlertCircle, Camera, Navigation, Smartphone, Split } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="section-problem" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#070B12] overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono uppercase tracking-wider mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>The Municipal Challenge</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Roads tell us when something is wrong.
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Citizens encounter potholes and asphalt fractures every day. However, municipal authorities in Hyderabad and Telangana often receive fragmented reports across multiple unverified channels.
          </p>
        </div>

        {/* Visual Showcase: One Damaged Road with Fragmented Incoming Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Real Physical Road Damage Photo */}
          <div className="lg:col-span-6 relative">
            <GlassCard intensity="medium" className="p-4 sm:p-5 border-white/10 group">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10">
                <img
                  src={REAL_POTHOLE_PRIMARY}
                  alt="Real Damaged Road Surface"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlaid Physical Markers */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-red-500/60 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] font-mono font-bold text-white uppercase">Critical Pothole (8.2cm Depth)</span>
                </div>

                <div className="absolute bottom-4 left-4 p-2 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300">
                  Asphalt Disintegration &bull; 2.8m² Area
                </div>
              </div>

              {/* Road Metadata */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <Navigation className="w-3.5 h-3.5" />
                  Hyderabad Gachibowli &bull; Zone 04
                </span>
                <span className="font-mono">Daily Traffic: ~18,400 vehicles</span>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Disconnected Citizen Signals */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Disconnected Citizen Signals
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Independent drivers, RTC bus transit drivers, and delivery couriers report the exact same road defect across different times with varying descriptions.
              </p>
            </div>

            {/* Individual Signals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1926]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Citizen #1042 &bull; 08:14 AM</div>
                    <div className="text-[11px] text-slate-400">"Pothole near bus stop, two-wheeler skid risk"</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Mobile App
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1926]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Citizen #1047 &bull; 09:02 AM</div>
                    <div className="text-[11px] text-slate-400">"Bumper scrape at Gachibowli Junction"</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Transit Cam
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0F1926]/90 border border-white/[0.08] hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Citizen #1051 &bull; 10:45 AM</div>
                    <div className="text-[11px] text-slate-400">"Water ponding hides pothole depth"</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  Courier
                </span>
              </div>
            </div>

            {/* Bridge */}
            <div className="pt-2 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Split className="w-4 h-4" />
              </div>
              <div className="text-xs font-semibold text-slate-300">
                <span className="text-white font-bold">One damaged road. Multiple disconnected signals.</span>
                <span className="text-emerald-400 ml-1">Our AI fuses them into one actionable incident.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
