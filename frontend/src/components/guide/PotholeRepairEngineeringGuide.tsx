import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { 
  DAMAGE_PHASE_1,
  DAMAGE_PHASE_2,
  DAMAGE_PHASE_3,
  DAMAGE_PHASE_4
} from '../../data/assets';
import { 
  CheckCircle2, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Flame, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const PotholeRepairEngineeringGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: 'Water-Logged Cavity & Loose Aggregate Vacuum',
      desc: 'Monsoon rainwater accumulates in fractured asphalt cavities, concealing dangerous sub-base depths from two-wheelers and autos. The high-velocity suction nozzle strips out standing water, silt, and fractured aggregate down to bare substrate.',
      specification: 'IRC:SP:98-2020 Standard • 100 PSI Vacuum Clearance',
      time: 'Phase 1: ~3 Mins',
      image: DAMAGE_PHASE_1
    },
    {
      num: '02',
      title: 'Fractured Crater Perimeter Profiling & Bituminous Tack',
      desc: 'Deep roadway craters create extreme tyre rim impact risks for cars and motorcyclists. Crews chisel vertical edges along the fracture perimeter and apply 140°C polymer-modified bitumen emulsion (PMB-40) to bind the repair securely.',
      specification: 'Grade PMB-40 Bitumen • 140°C Tack Binding',
      time: 'Phase 2: ~4 Mins',
      image: DAMAGE_PHASE_2
    },
    {
      num: '03',
      title: 'Sub-Base Culvert Stabilization & Coarse Aggregate Injection',
      desc: 'Heavy runoff damages road culverts, drainage conduits, and subsurface grading. Reinforced precast drainage conduits are aligned, and high-velocity pre-coated basalt aggregates are injected into the sub-base void.',
      specification: 'Pneumatic Sub-Base Jet Injection • Reinforced Culvert',
      time: 'Phase 3: ~6 Mins',
      image: DAMAGE_PHASE_3
    },
    {
      num: '04',
      title: 'Heavy-Traffic Corridor Compaction & Rapid Lane Reopen',
      desc: 'High-density commuter arterials require rapid stabilization. An 8-ton vibratory tandem roller compacts the bituminous hot mix flush with the road grade, immediately reopening lanes to peak-hour urban traffic.',
      specification: '8-Ton Tandem Compactor • Reopened in 15 Minutes',
      time: 'Phase 4: ~5 Mins',
      image: DAMAGE_PHASE_4
    }
  ];

  const current = steps[activeStep];

  return (
    <section id="section-video-guide" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#070B14] border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[#00FF88] text-xs font-mono uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>State Engineering Standard &bull; Mechanized Pothole Rectification</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How Telangana Roads Are Repaired
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            A step-by-step engineering breakdown of mechanized Jetpatcher pothole filling, drainage culvert stabilization, and hot-mix bitumen compaction across Hyderabad corridors.
          </p>
        </div>

        {/* Engineering Walkthrough Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Real Photographic Stage Inspection (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-4 sm:p-5 rounded-3xl bg-[#0B1220]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10 group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300">
                  STAGE {current.num} &bull; {current.time}
                </div>

                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  AUTHENTIC PHOTO PROOF
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-xs">
                  <div className="font-bold text-white mb-0.5">{current.title}</div>
                  <div className="text-[11px] font-mono text-[#00FF88]">{current.specification}</div>
                </div>
              </div>

              {/* Step Navigation Tabs */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {steps.map((st, idx) => (
                  <button
                    key={st.num}
                    onClick={() => setActiveStep(idx)}
                    className={`py-2 px-2 rounded-xl text-center text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeStep === idx
                        ? 'bg-[#00FF88] text-slate-950 shadow-lg shadow-emerald-500/20'
                        : 'bg-[#111B2D] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    Phase {st.num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stage Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#0B1220]/90 backdrop-blur-xl border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-mono text-[#00FF88] font-bold uppercase tracking-wider">
                  Engineering Phase {current.num}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {current.time}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white leading-tight">
                {current.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {current.desc}
              </p>

              <div className="p-3.5 rounded-xl bg-[#111B2D] border border-white/5 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Technical Protocol:</span>
                  <span className="text-emerald-300 font-bold">{current.specification}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Area:</span>
                  <span className="text-white">Hyderabad ORR &bull; State Corridors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Durability Guarantee:</span>
                  <span className="text-white">24 Months Seal</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  &larr; Prev Phase
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="flex items-center gap-1 font-bold text-[#00FF88] hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Next Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#00FF88] shrink-0" />
              <span>GHMC Rapid Response &bull; Mechanized Repair Completed in Under 18 Mins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
