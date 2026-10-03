import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { soundService } from '../../services/soundService';
import { 
  Camera, 
  Cpu, 
  TrendingUp, 
  Wrench, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      num: '01',
      title: 'REPORT',
      tagline: 'Citizen Submits Image & Location',
      icon: <Camera className="w-5 h-5" />,
      color: '#00FF88',
      desc: 'Residents take a quick smartphone photo while commuting. GPS coordinates and device timestamp are securely captured with zero forms to fill.',
      badge: 'Zero Bureaucracy',
      details: ['Centimeter precision GPS', 'Sub-second upload', 'Anonymous or authenticated profile'],
    },
    {
      num: '02',
      title: 'ANALYZE',
      tagline: 'AI Detects Damage & Classifies Severity',
      icon: <Cpu className="w-5 h-5" />,
      color: '#00E5FF',
      desc: 'Computer vision neural networks segment asphalt fissures, gauge volumetric depth, and flag immediate safety risks to motorists and cyclists.',
      badge: 'Neural Vision V8',
      details: ['Pothole & crack categorization', 'Volumetric cavity estimation', 'Overlapping photo deduplication'],
    },
    {
      num: '03',
      title: 'PRIORITIZE',
      tagline: 'System Calculates Urgency & Safety Score',
      icon: <TrendingUp className="w-5 h-5" />,
      color: '#F59E0B',
      desc: 'The multi-factor risk engine triages incidents into 0–100 scores based on traffic volume, speed limits, nearby school zones, and community report frequency.',
      badge: 'Multi-Factor Triage',
      details: ['Arterial exposure weighting', 'Vulnerable road user safety', 'Automated priority escalation'],
    },
    {
      num: '04',
      title: 'RESOLVE',
      tagline: 'Authority Assigns and Tracks Verified Repair',
      icon: <Wrench className="w-5 h-5" />,
      color: '#00A3FF',
      desc: 'Municipal dispatch assigns field crews (Alpha, Bravo, Charlie). Upon physical asphalt compaction, nearby citizens vote to confirm the permanent fix.',
      badge: 'Closed-Loop SLA',
      details: ['Squad dispatch (Team Alpha/Bravo)', 'Before & after audit evidence', 'Community consensus signoff'],
    },
  ];

  const handleStageClick = (idx: number) => {
    setActiveStage(idx);
    soundService.playClick();
  };

  const curr = stages[activeStage];

  return (
    <section id="section-how" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#091321] overflow-hidden">
      {/* Background subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00A3FF]/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header (Section 19 Prompt Spec) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>End-to-End Civic Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F9FF] tracking-tight leading-tight">
            How It Works
          </h2>

          <p className="mt-4 text-[#8EA4BC] text-base sm:text-lg">
            A continuous loop from citizen observation to municipal repair, audited by community consensus.
          </p>
        </div>

        {/* 4-Stage Horizontal Pipeline Header with Animated Progress Line */}
        <div className="relative mb-12">
          {/* Progress connecting line */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-white/10 -translate-y-1/2 z-0">
            <div
              className="h-full bg-gradient-to-r from-[#00FF88] via-[#00E5FF] to-[#00A3FF] transition-all duration-500"
              style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {stages.map((st, idx) => {
              const isActive = activeStage === idx;
              const isPast = activeStage > idx;

              return (
                <button
                  key={st.num}
                  onClick={() => handleStageClick(idx)}
                  className={`p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#0D1928] border-cyan-400/50 shadow-glow-cyan scale-[1.02]'
                      : 'bg-[#0D1928]/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs"
                      style={{
                        backgroundColor: isActive ? st.color : 'rgba(255, 255, 255, 0.05)',
                        color: isActive ? '#050B14' : '#8EA4BC',
                      }}
                    >
                      {st.num}
                    </span>
                    <span style={{ color: st.color }}>
                      {st.icon}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-black font-mono text-white block">
                      {st.title}
                    </span>
                    <span className="text-[11px] text-[#8EA4BC] truncate block mt-0.5">
                      {st.tagline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Visual Showcase Panel */}
        <GlassCard intensity="high" className="p-8 sm:p-10 border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00E5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                <span>STAGE {curr.num} OF 04 &bull; {curr.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white">
                {curr.title}: {curr.tagline}
              </h3>

              <p className="text-sm sm:text-base text-[#8EA4BC] leading-relaxed">
                {curr.desc}
              </p>

              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Key Capabilities:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {curr.details.map((d, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 flex items-center gap-2 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Callout Box */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-6 rounded-2xl bg-[#050B14] border border-white/10 shadow-glass">
                <div className="text-xs font-mono text-[#8EA4BC] uppercase tracking-wider mb-2">
                  Municipal Impact Summary
                </div>
                <div className="text-xl font-bold text-white mb-2">
                  Continuous Road Resilience
                </div>
                <p className="text-xs text-[#8EA4BC] leading-relaxed">
                  Every step is logged on an auditable spatial timeline, preventing lost paperwork and cutting citizen response time by over 31%.
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => handleStageClick((activeStage + 1) % stages.length)}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#00E5FF] hover:text-white transition-colors"
                  >
                    <span>Next Stage: {stages[(activeStage + 1) % stages.length].title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
