import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { REAL_ROAD_WORKERS, REAL_TELANGANA_HIGHWAY, REAL_REPAIRED_ROAD } from '../../data/assets';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Video, 
  Wrench, 
  ShieldCheck, 
  Flame, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TelanganaRoadGuide: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      step: '01',
      title: 'High-Velocity Compressed Air Cleaning',
      desc: 'The Jetpatcher cleans debris, gravel, and water from the pothole using high-pressure air at 100 PSI, preparing a sterile road base.',
      duration: '0:00 - 0:15',
      tech: 'High-Velocity Blower • GHMC Unit',
      image: REAL_ROAD_WORKERS
    },
    {
      step: '02',
      title: 'Hot Bitumen Emulsion Tack Coating',
      desc: 'Liquid bitumen emulsion is sprayed at 140°C across the crater walls and floor to establish a chemical molecular bond with old asphalt.',
      duration: '0:15 - 0:35',
      tech: 'Polymer Modified Bitumen (PMB)',
      image: REAL_ROAD_WORKERS
    },
    {
      step: '03',
      title: 'Pneumatic Aggregate & Bitumen Injection',
      desc: 'Coated graded stone aggregates are propelled into the cavity at 100 km/h, filling every fissure and void with zero air gaps.',
      duration: '0:35 - 1:10',
      tech: 'Mechanized Injection Jetpatcher',
      image: REAL_TELANGANA_HIGHWAY
    },
    {
      step: '04',
      title: 'Steel Vibratory Roller Compaction',
      desc: 'Vibratory road roller completes 4 compaction passes, bringing the fresh patch perfectly flush with the existing carriageway level.',
      duration: '1:10 - 1:45',
      tech: '8-Ton Tandem Vibratory Roller',
      image: REAL_REPAIRED_ROAD
    },
    {
      step: '05',
      title: 'Immediate Traffic Re-Opening (15 Mins)',
      desc: 'Dry aggregate capping dust applied. The lane is immediately reopened to Hyderabad city traffic in under 15 minutes with zero traffic jams.',
      duration: '1:45 - 2:00',
      tech: 'Zero Curing Lag Rapid Reopen',
      image: REAL_TELANGANA_HIGHWAY
    }
  ];

  const currentStage = stages[activeStage];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="section-video-guide" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#05080D] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Video className="w-3.5 h-3.5" />
            <span>State Engineering Standard &bull; Telangana R&amp;B Dept</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Telangana Roads Are Fixed
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            From mechanized Jetpatcher pothole repairs to automated hot-mix bitumen compaction, see the standard operating procedure deployed across Hyderabad and Telangana highways.
          </p>
        </div>

        {/* Video Player & Stage Navigation Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Video Player Display (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard intensity="high" className="p-3 sm:p-5 border-white/10 shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10 group">
                <img
                  src={currentStage.image}
                  alt={currentStage.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                {/* Top Badge: Telangana State R&B Seal */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-400">
                    TELANGANA MUNICIPAL REPAIR SOP &bull; STAGE {currentStage.step}
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-current" />
                    ) : (
                      <Play className="w-7 h-7 fill-current ml-1" />
                    )}
                  </button>
                </div>

                {/* Bottom Video Controls Info */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="flex items-center justify-between text-xs text-white font-mono mb-2">
                    <span className="font-bold">{currentStage.title}</span>
                    <span className="text-emerald-400">{currentStage.duration}</span>
                  </div>

                  {/* Scrub bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stage Quick Scrub Buttons */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {stages.map((s, idx) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveStage(idx)}
                    className={`py-2 px-1 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeStage === idx
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    Stage {s.step}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Stage Engineering Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0A111B]/90 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Phase {currentStage.step} of 05
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {currentStage.tech}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white">
                {currentStage.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStage.desc}
              </p>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Carriageway:</span>
                  <span className="text-white font-semibold">Hyderabad Metropolitan Roads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quality Standard:</span>
                  <span className="text-emerald-400 font-bold">IRC:SP:98-2020 Compliance</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lifespan Guarantee:</span>
                  <span className="text-white">Minimum 24 Months Seal</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                  className="text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  &larr; Previous Stage
                </button>
                <button
                  onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Next Stage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Telangana State Pothole Rectification Drive &bull; Average Fix Time 18 Mins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
