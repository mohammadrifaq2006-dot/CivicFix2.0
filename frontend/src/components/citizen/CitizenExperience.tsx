import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { soundService } from '../../services/soundService';
import { DAMAGED_ROAD_IMG } from '../../data/assets';
import { 
  Smartphone, 
  Camera, 
  MapPin, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw,
  Sparkles,
  Zap,
  Play,
  Pause,
  Video
} from 'lucide-react';

export const CitizenExperience: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // 8 prompt steps:
  // 1. User opens CivicRoad
  // 2. Camera opens
  // 3. Road photo captured
  // 4. GPS automatically detected
  // 5. AI analyzes image
  // 6. Severity appears
  // 7. User taps Submit
  // 8. Confirmation appears
  const stepsData = [
    { num: 1, title: 'Open App', desc: 'Citizen opens CivicRoad on their mobile phone.' },
    { num: 2, title: 'Camera Viewfinder', desc: 'Instant camera aperture initializes in 200ms.' },
    { num: 3, title: 'Photo Captured', desc: 'Asphalt cavity captured with optical balance.' },
    { num: 4, title: 'GPS Locked', desc: 'Centimeter-precision coordinates pinned automatically.' },
    { num: 5, title: 'AI Analysis', desc: 'On-device neural inference segments distress pattern.' },
    { num: 6, title: 'Severity Classified', desc: 'Assigned High Severity & Priority 87.' },
    { num: 7, title: 'Submit Report', desc: 'One-tap encrypted dispatch to municipal queue.' },
    { num: 8, title: 'Confirmed & Tracked', desc: 'Ticket generated: #CR-2026-00452.' },
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStep((prev) => (prev >= 8 ? 1 : prev + 1));
      soundService.playClick();
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToStep = (s: number) => {
    setIsPlaying(false);
    setStep(s);
    soundService.playClick();
  };

  return (
    <section id="section-citizen" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050B14] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[#00FF88]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header (Section 14 Prompt Spec) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00FF88] text-xs font-mono uppercase tracking-wider mb-4">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Citizen Experience</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F9FF] tracking-tight leading-tight">
            Reporting should take seconds.
          </h2>

          <p className="mt-4 text-[#8EA4BC] text-base sm:text-lg">
            No 20-field bureaucratic municipal complaint forms. Citizens snap a photo, let computer vision detect the distress, and verify resolution with zero friction.
          </p>

          {/* Stepper controller */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {stepsData.map((s) => (
              <button
                key={s.num}
                onClick={() => goToStep(s.num)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#00FF88] text-[#050B14] shadow-glow-green scale-105'
                    : 'bg-[#0D1928] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                0{s.num}. {s.title}
              </button>
            ))}

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-[#0D1928] text-slate-300 hover:text-[#00FF88] border border-white/10 ml-2"
              title={isPlaying ? 'Pause Auto-Play' : 'Play Auto-Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Central Floating Smartphone Mockup Showcase */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          {/* Left Column: Context Card */}
          <div className="lg:w-1/3 space-y-4">
            <GlassCard intensity="medium" className="p-6 border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-[#00FF88] mb-2">
                <span>STEP 0{step} OF 08</span>
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {stepsData[step - 1].title}
              </h3>
              <p className="text-sm text-[#8EA4BC] leading-relaxed">
                {stepsData[step - 1].desc}
              </p>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Total Interaction:</span>
                <span className="text-[#00E5FF] font-bold">~4.2 seconds</span>
              </div>
            </GlassCard>
          </div>

          {/* Center Column: Floating Glass Smartphone Frame */}
          <div className="relative w-[310px] h-[620px] rounded-[48px] bg-[#0A111B] border-[6px] border-[#1E293B] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,255,136,0.15)] overflow-hidden flex flex-col p-3 transition-transform duration-500 hover:scale-[1.02]">
            {/* Dynamic Island / Speaker Notch */}
            <div className="w-28 h-5 rounded-full bg-black mx-auto mb-2 flex items-center justify-end px-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Inner Phone Screen Content */}
            <div className="flex-1 rounded-[36px] bg-[#050B14] border border-white/5 overflow-hidden flex flex-col relative text-[#F5F9FF]">
              {/* Phone Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono font-black tracking-wider text-white">
                  CIVICROAD <span className="text-[#00FF88]">AI</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  LIVE GPS
                </span>
              </div>

              {/* Dynamic Viewport per Step */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                {/* STEP 1: App Splash Open */}
                {step === 1 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4 animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00FF88]/20 to-[#00A3FF]/20 border border-[#00FF88]/40 flex items-center justify-center mb-4 shadow-glow-green">
                      <Smartphone className="w-8 h-8 text-[#00FF88]" />
                    </div>
                    <h4 className="text-base font-bold text-white">CivicRoad Mobile</h4>
                    <p className="text-xs text-[#8EA4BC] mt-1">Ready to report road distress</p>
                    <div className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00FF88] to-[#10B981] text-[#050B14] font-bold text-xs font-mono">
                      TAP TO CAPTURE
                    </div>
                  </div>
                )}

                {/* STEP 2 & 3: Camera Open & Photo Captured */}
                {(step === 2 || step === 3) && (
                  <div className="flex-1 rounded-2xl overflow-hidden relative border border-white/10 bg-slate-950 flex flex-col justify-between p-3 animate-in fade-in duration-300">
                    <img src={DAMAGED_ROAD_IMG} alt="Road Camera" className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Viewfinder reticle */}
                    <div className="relative z-10 flex justify-between text-[10px] font-mono text-white/80">
                      <span>4K 60FPS</span>
                      <span>HDR AUTO</span>
                    </div>

                    {step === 3 && (
                      <div className="relative z-10 p-2 rounded-lg bg-black/75 backdrop-blur-md text-center text-xs font-mono text-[#00FF88] border border-emerald-500/40">
                        PHOTO CAPTURED &bull; OPTICAL OK
                      </div>
                    )}

                    <div className="relative z-10 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                        <div className={`w-9 h-9 rounded-full ${step === 3 ? 'bg-emerald-400' : 'bg-white'}`} />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: GPS Automatically Detected */}
                {step === 4 && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-4 animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#00A3FF]/20 border border-[#00A3FF]/50 flex items-center justify-center mb-3 text-[#00A3FF] animate-pulse">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Geospatial Fix Acquired</span>
                    <h4 className="text-sm font-bold text-white mt-1">Central Demo Road</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">Lat: 12.9716° N &bull; Lng: 77.5946° E</p>
                    <span className="mt-4 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                      Accuracy: &plusmn;1.4 meters
                    </span>
                  </div>
                )}

                {/* STEP 5 & 6: AI Analyzes Image & Severity Appears */}
                {(step === 5 || step === 6) && (
                  <div className="flex-1 flex flex-col justify-between p-2 animate-in fade-in duration-300">
                    <div className="relative aspect-[16/11] rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                      <img src={DAMAGED_ROAD_IMG} alt="Road Damage" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border-2 border-red-500 bg-red-500/20 m-4 rounded" />
                      <div className="absolute top-6 left-6 px-1.5 py-0.5 rounded bg-red-600 text-[9px] font-mono font-bold text-white">
                        POTHOLE 92%
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0D1928] border border-white/10 space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Classification:</span>
                        <span className="text-white font-bold">Pothole Cavity</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="text-[#00E5FF] font-bold">92.0%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Severity:</span>
                        <span className="text-red-400 font-bold">HIGH SEVERITY</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Priority Score:</span>
                        <span className="text-amber-400 font-bold">87 / 100</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 7: User Taps Submit */}
                {step === 7 && (
                  <div className="flex-1 flex flex-col justify-between p-3 animate-in fade-in duration-300">
                    <div className="p-4 rounded-xl bg-[#0D1928] border border-white/10 space-y-2 text-xs">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase">Ready For Dispatch</span>
                      <h4 className="text-sm font-bold text-white">Pothole &bull; Central Demo Road</h4>
                      <p className="text-[11px] text-slate-400">AI analysis and geolocation package ready to push to municipal response roster.</p>
                    </div>

                    <div className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] font-black text-center text-xs font-mono shadow-glow-cyan animate-pulse">
                      &bull; DISPATCHING REPORT &bull;
                    </div>
                  </div>
                )}

                {/* STEP 8: Confirmation Appears */}
                {step === 8 && (
                  <div className="flex-1 flex flex-col justify-center items-center text-center p-4 animate-in zoom-in-95 duration-300">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3 shadow-glow-green text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <span className="text-[10px] font-mono text-[#00FF88] uppercase tracking-widest">Report Verified</span>
                    <h4 className="text-base font-bold text-white mt-1">Ticket #CR-2026-00452</h4>
                    <p className="text-xs text-[#8EA4BC] mt-2">
                      Merged into municipal dispatch. RoadWorks Alpha assigned with 12m ETA.
                    </p>
                    <span className="mt-4 text-[10px] font-mono text-slate-400">
                      You will receive a notification when repaired!
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Phone Bar */}
              <div className="p-2 border-t border-white/5 flex items-center justify-around text-[10px] font-mono text-slate-500">
                <span className="text-cyan-400">Report</span>
                <span>Map</span>
                <span>Track</span>
              </div>
            </div>
          </div>

          {/* Right Column: Key Takeaway Card */}
          <div className="lg:w-1/3 space-y-4">
            <GlassCard intensity="medium" className="p-6 border-white/10">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00E5FF] mb-3">
                <Zap className="w-4 h-4" />
                <span>Zero Citizen Friction</span>
              </div>
              <h4 className="text-base font-bold text-white">
                Intelligent On-Device Synthesis
              </h4>
              <p className="text-xs text-[#8EA4BC] mt-2 leading-relaxed">
                By automating geolocation extraction, computer vision classification, and duplicate detection right on the glass, civic engagement skyrockets by over 300%.
              </p>

              <div className="pt-4 border-t border-white/5">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    const el = document.getElementById('section-video-guide');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-xs font-mono"
                  icon={<Video className="w-3.5 h-3.5 ml-1" />}
                >
                  WATCH STEP-BY-STEP VIDEO GUIDE
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
