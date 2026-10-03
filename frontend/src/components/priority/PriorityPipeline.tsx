import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useIncidents } from '../../context/IncidentContext';
import { soundService } from '../../services/soundService';
import { 
  TrendingUp, 
  AlertTriangle, 
  RotateCcw, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Play,
  Sparkles
} from 'lucide-react';

export const PriorityPipeline: React.FC = () => {
  const { demoStep } = useIncidents();
  const [animatedScore, setAnimatedScore] = useState(87);
  const [activeFactorIndex, setActiveFactorIndex] = useState(5); // all 5 factors active by default
  const [isBuilding, setIsBuilding] = useState(false);

  // Exact prompt Section 12 breakdown:
  // Damage severity +30
  // Major road +20
  // Community reports +15
  // Safety-sensitive area +15
  // Unresolved duration +7
  // Total = 87 / 100
  const factors = [
    {
      id: 'f1',
      title: 'Damage Severity',
      points: 30,
      cumulative: 30,
      color: '#EF4444',
      desc: 'Deep 8.2cm cavity with structural void formation beneath asphalt',
      category: 'Physical Structural Impact'
    },
    {
      id: 'f2',
      title: 'Major Road',
      points: 20,
      cumulative: 50,
      color: '#00A3FF',
      desc: 'Central Demo Road arterial corridor with ~18,400 daily vehicle transits',
      category: 'Traffic Exposure Volume'
    },
    {
      id: 'f3',
      title: 'Community Reports',
      points: 15,
      cumulative: 65,
      color: '#00FF88',
      desc: '6 distinct verified citizen reports logged within 4 hours',
      category: 'Decentralized Civic Consensus'
    },
    {
      id: 'f4',
      title: 'Safety-Sensitive Area',
      points: 15,
      cumulative: 80,
      color: '#F59E0B',
      desc: 'Transit bus hub proximity, bicycle path & two-wheeler rollover hazard',
      category: 'Public Safety Exposure'
    },
    {
      id: 'f5',
      title: 'Unresolved Duration',
      points: 7,
      cumulative: 87,
      color: '#8EA4BC',
      desc: 'Open ticket decaying past initial municipal triage window',
      category: 'Temporal Risk Decay'
    }
  ];

  useEffect(() => {
    if (demoStep === 'PRIORITY') {
      runScoreBuildAnimation();
    }
  }, [demoStep]);

  const runScoreBuildAnimation = () => {
    setIsBuilding(true);
    setAnimatedScore(0);
    setActiveFactorIndex(0);
    soundService.playScan();

    factors.forEach((f, idx) => {
      setTimeout(() => {
        setActiveFactorIndex(idx + 1);
        setAnimatedScore(f.cumulative);
        soundService.playClick();
        if (idx === factors.length - 1) {
          setIsBuilding(false);
          soundService.playSuccess();
        }
      }, (idx + 1) * 600);
    });
  };

  const resetBuild = () => {
    setActiveFactorIndex(5);
    setAnimatedScore(87);
    setIsBuilding(false);
  };

  return (
    <section id="section-priority" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050B14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-[#F59E0B]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header (Section 12 Prompt Spec) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#F59E0B] text-xs font-mono uppercase tracking-wider mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Autonomous Risk Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F9FF] tracking-tight leading-tight">
            Priority Engine
          </h2>

          <p className="mt-4 text-[#8EA4BC] text-base sm:text-lg">
            Not all potholes are created equal. The engine autonomously scores and escalates incidents through live threat factors into a transparent 0–100 index.
          </p>
        </div>

        {/* Live Score Build Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Score Gauge (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <GlassCard intensity="high" className="p-8 border-[#F59E0B]/30 shadow-glow-amber text-center w-full max-w-md">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8EA4BC] block">
                Calculated Priority Score
              </span>

              {/* Huge animated score display */}
              <div className="my-6 relative flex items-center justify-center">
                {/* Outer radial progress ring */}
                <svg className="w-56 h-56 transform -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="90"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="565.48"
                    strokeDashoffset={565.48 - (565.48 * animatedScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight">
                    {animatedScore}
                  </span>
                  <span className="text-sm font-mono font-bold text-[#F59E0B] mt-1">
                    / 100
                  </span>
                </div>
              </div>

              {/* Incident badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>CR-2026-00452 &bull; Central Demo Road</span>
              </div>

              {/* Action trigger button */}
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={runScoreBuildAnimation}
                  disabled={isBuilding}
                  icon={isBuilding ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                >
                  {isBuilding ? 'CALCULATING SCORE...' : 'REBUILD SCORE ANIMATION'}
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Breakdown Factor Stack (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between pb-2 text-xs font-mono text-[#8EA4BC] border-b border-white/10">
              <span>WEIGHTED MULTI-FACTOR AUDIT</span>
              <span className="text-[#00FF88]">5 ACTIVE INFLUENCERS</span>
            </div>

            {factors.map((factor, idx) => {
              const isIncluded = activeFactorIndex > idx;
              return (
                <div
                  key={factor.id}
                  className={`p-4 rounded-2xl transition-all duration-500 border ${
                    isIncluded
                      ? 'bg-[#0D1928] border-white/10 shadow-lg translate-x-0 opacity-100'
                      : 'bg-[#0D1928]/30 border-white/5 translate-x-3 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm text-slate-950 shrink-0"
                        style={{ backgroundColor: factor.color }}
                      >
                        +{factor.points}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{factor.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                            {factor.category}
                          </span>
                        </div>
                        <p className="text-xs text-[#8EA4BC] mt-0.5 leading-relaxed">
                          {factor.desc}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="text-xs font-mono font-bold text-white block">
                        +{factor.points} pts
                      </span>
                      {isIncluded && (
                        <span className="text-[10px] font-mono text-[#00E5FF]">
                          Subtotal: {factor.cumulative}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
