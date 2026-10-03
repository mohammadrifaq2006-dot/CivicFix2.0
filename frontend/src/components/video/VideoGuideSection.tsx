import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { soundService } from '../../services/soundService';
import { DAMAGED_ROAD_IMG, REPAIRED_ROAD_IMG } from '../../data/assets';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  Video, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Cpu, 
  Send, 
  ShieldCheck, 
  ChevronRight,
  Layers,
  Settings,
  HelpCircle,
  Link as LinkIcon
} from 'lucide-react';

interface Chapter {
  id: number;
  timeSec: number;
  title: string;
  shortTitle: string;
  badge: string;
  caption: string;
  detail: string;
  icon: React.ReactNode;
}

export const VideoGuideSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'SIMULATION' | 'CUSTOM_VIDEO'>('SIMULATION');

  const totalDuration = 60; // 60 seconds comprehensive video walkthrough

  const chapters: Chapter[] = [
    {
      id: 1,
      timeSec: 0,
      title: '01. Identify Distress & Property Damage',
      shortTitle: 'Identify Damage',
      badge: 'Safety Inspection',
      caption: 'Spot the road defect safely from the sidewalk or shoulder. Check for deep cavities, surface crumbling, or bent guardrails.',
      detail: 'Identify whether the hazard is a pothole cavity, longitudinal fissure, curb erosion, or compromised municipal property.',
      icon: <HelpCircle className="w-4 h-4 text-[#00E5FF]" />,
    },
    {
      id: 2,
      timeSec: 10,
      title: '02. Framing & Optical Capture',
      shortTitle: 'Optical Capture',
      badge: 'Camera Framing',
      caption: 'Hold smartphone at roughly a 45-degree downward angle, 2–3 meters away, ensuring optimal natural daylight illumination.',
      detail: 'Keep the entire cavity and surrounding asphalt reference lines visible within the camera viewfinder for volumetric depth analysis.',
      icon: <Camera className="w-4 h-4 text-[#00FF88]" />,
    },
    {
      id: 3,
      timeSec: 20,
      title: '03. Geotagging & Centimeter GPS Fix',
      shortTitle: 'Satellite Geotag',
      badge: 'Location Pinning',
      caption: 'CivicRoad automatically acquires high-precision satellite telemetry, locking coordinates and street name in under 1 second.',
      detail: 'Centimeter accuracy ensures municipal dispatch teams locate the exact lane segment without circling the neighborhood.',
      icon: <MapPin className="w-4 h-4 text-[#00A3FF]" />,
    },
    {
      id: 4,
      timeSec: 30,
      title: '04. Neural AI Vision & Depth Analysis',
      shortTitle: 'Neural Analysis',
      badge: 'Computer Vision',
      caption: 'On-device neural network generates bounding boxes, calculates square meterage, and estimates fracture depth.',
      detail: 'Identifies Pothole with 92% confidence and assigns High Severity based on vehicle deflection danger.',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 5,
      timeSec: 42,
      title: '05. One-Tap Municipal Dispatch',
      shortTitle: 'Dispatch Ticket',
      badge: 'Automated Triage',
      caption: 'Tap Submit to trigger deduplication clustering. Ticket #CR-2026-00452 is pushed straight to RoadWorks Alpha roster.',
      detail: 'Eliminates duplicate complaints and immediately slots the repair into municipal priority queue with score 87/100.',
      icon: <Send className="w-4 h-4 text-[#F59E0B]" />,
    },
    {
      id: 6,
      timeSec: 52,
      title: '06. Track Repair & Verify Quality',
      shortTitle: 'Community Signoff',
      badge: 'Decentralized Audit',
      caption: 'Once field crews finish compaction, compare before/after images and tap YES — FIXED to seal civic approval.',
      detail: 'Guarantees municipal accountability with community consensus, releasing contractor SLA bonuses.',
      icon: <ShieldCheck className="w-4 h-4 text-[#00FF88]" />,
    },
  ];

  // Active chapter lookup
  const currentChapter = [...chapters]
    .reverse()
    .find((c) => currentTime >= c.timeSec) || chapters[0];

  // Playback timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return Math.min(prev + 0.25 * playbackSpeed, totalDuration);
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const togglePlay = () => {
    soundService.playClick();
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const jumpToChapter = (timeSec: number) => {
    soundService.playClick();
    setCurrentTime(timeSec);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="section-video-guide" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#050B14] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-gradient-to-r from-[#00E5FF]/5 via-[#00A3FF]/5 to-[#00FF88]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-glow-cyan">
            <Video className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Interactive Video Walkthrough &bull; Complete Guide</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F9FF] tracking-tight leading-tight">
            How to Report Road &amp; Property Damage
          </h2>

          <p className="mt-4 text-[#8EA4BC] text-base sm:text-lg">
            Watch our step-by-step interactive video tutorial demonstrating how to capture evidence, verify AI detection, and trigger emergency municipal road repair.
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 inline-flex items-center p-1 rounded-xl bg-[#0D1928] border border-white/10 text-xs font-mono">
            <button
              onClick={() => setActiveTab('SIMULATION')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'SIMULATION'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interactive Guided Simulation
            </button>
            <button
              onClick={() => setActiveTab('CUSTOM_VIDEO')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'CUSTOM_VIDEO'
                  ? 'bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom MP4 / Video Stream
            </button>
          </div>
        </div>

        {/* Cinema-Grade Video Player Frame */}
        <div className="relative rounded-3xl bg-[#091321] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,163,255,0.15)] overflow-hidden">
          {/* Main Video Viewport (16:9 Aspect Ratio) */}
          <div className="relative aspect-[16/9] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
            {activeTab === 'CUSTOM_VIDEO' && customVideoUrl ? (
              <video
                src={customVideoUrl}
                controls
                className="w-full h-full object-cover"
                autoPlay
              />
            ) : activeTab === 'CUSTOM_VIDEO' && !customVideoUrl ? (
              <div className="p-8 text-center max-w-md">
                <Video className="w-12 h-12 text-[#00E5FF] mx-auto mb-3 animate-pulse" />
                <h4 className="text-lg font-bold text-white mb-2">Embed Custom Walkthrough Video</h4>
                <p className="text-xs text-[#8EA4BC] mb-4">
                  Paste an MP4 video URL or screen recording link to play directly in this cinema player.
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/civic-guide.mp4"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <Button size="sm" variant="primary" onClick={() => {}}>
                    Load
                  </Button>
                </div>
              </div>
            ) : (
              /* SIMULATED HIGH-FIDELITY VIDEO ENGINE */
              <div className="relative w-full h-full">
                {/* Background Road Footage simulation */}
                <img
                  src={currentTime >= 50 ? REPAIRED_ROAD_IMG : DAMAGED_ROAD_IMG}
                  alt="Video Guide Scene"
                  className="w-full h-full object-cover brightness-[0.85] transition-all duration-700"
                />

                {/* Video Scan Grid Reticle Overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

                {/* Top Telemetry HUD */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-white font-bold">REC &bull; 4K 60FPS</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-[#00E5FF]">{currentChapter.badge}</span>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono text-[#00FF88] font-bold">
                    STEP {currentChapter.id} / 06
                  </div>
                </div>

                {/* DYNAMIC SCENE GRAPHICS BY CHAPTER */}
                {/* Chapter 1: Identifying Hazard Box */}
                {currentChapter.id === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in-95 duration-400">
                    <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 text-center max-w-sm shadow-2xl">
                      <HelpCircle className="w-10 h-10 text-[#00E5FF] mx-auto mb-2 animate-bounce" />
                      <h4 className="text-base font-bold text-white">Rule 1: Inspect Safety First</h4>
                      <p className="text-xs text-[#8EA4BC] mt-1">
                        Never stand in the active traffic lane. Capture damage from a safe curbside position.
                      </p>
                    </div>
                  </div>
                )}

                {/* Chapter 2: Optical Capture Framing Viewfinder */}
                {currentChapter.id === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[50%] h-[55%] border-2 border-dashed border-[#00FF88] rounded-2xl flex flex-col justify-between p-3 animate-pulse">
                      <div className="flex justify-between text-[10px] font-mono text-[#00FF88] font-bold">
                        <span>[ ANGLE: 45° ]</span>
                        <span>[ DISTANCE: 2.4m ]</span>
                      </div>
                      <div className="text-center text-xs font-mono bg-black/70 py-1 rounded text-white">
                        ✓ FRAME CAVITY WITH ASPHALT EDGES
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#00FF88] font-bold">
                        <span>[ DEPTH: CALIBRATING ]</span>
                        <span>[ SHUTTER READY ]</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapter 3: Geotagging & Centimeter GPS Fix */}
                {currentChapter.id === 3 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-[#00A3FF]/40 text-center shadow-glow-cyan animate-in fade-in duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#00A3FF]/20 border border-[#00A3FF] flex items-center justify-center mx-auto mb-2 text-[#00A3FF] animate-pulse">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Satellite Lock Active</span>
                      <h4 className="text-sm font-bold text-white mt-1">Central Demo Road &bull; Zone 04</h4>
                      <p className="text-[11px] font-mono text-slate-300 mt-1">12.9716° N, 77.5946° E &bull; Accuracy &plusmn;1.4m</p>
                    </div>
                  </div>
                )}

                {/* Chapter 4: Neural AI Vision & Bounding Box */}
                {currentChapter.id === 4 && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Laser scanning sweep */}
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent shadow-[0_0_20px_#00E5FF] animate-scan-beam" />
                    
                    {/* Bounding box targeting hole */}
                    <div className="absolute top-[35%] left-[33%] w-[34%] h-[38%] border-2 border-red-500 bg-red-500/20 rounded-lg">
                      <div className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-red-600 text-[10px] font-mono font-bold text-white">
                        POTHOLE &bull; 92% CONFIDENCE
                      </div>
                      <div className="absolute -bottom-7 left-0 px-2 py-0.5 rounded bg-[#0D1928] border border-amber-400 text-amber-300 text-[10px] font-mono font-bold">
                        SEVERITY: HIGH &bull; DEPTH 8.2CM
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapter 5: One-Tap Municipal Dispatch */}
                {currentChapter.id === 5 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-5 rounded-2xl bg-[#0D1928]/95 backdrop-blur-2xl border border-[#F59E0B]/50 text-center max-w-sm shadow-glow-amber animate-in zoom-in-95 duration-300">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono mb-2">
                        <Send className="w-3.5 h-3.5" />
                        <span>DISPATCHED TO MUNICIPAL ROSTER</span>
                      </div>
                      <h4 className="text-base font-extrabold text-white">Ticket #CR-2026-00452</h4>
                      <p className="text-xs text-[#8EA4BC] mt-1">
                        Deduplication merged with 5 prior reports. Priority score calculated at <strong>87 / 100</strong>. RoadWorks Alpha on route.
                      </p>
                    </div>
                  </div>
                )}

                {/* Chapter 6: Track Repair & Community Verification */}
                {currentChapter.id === 6 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-5 rounded-2xl bg-emerald-950/90 backdrop-blur-2xl border border-emerald-500/50 text-center max-w-sm shadow-glow-green animate-in zoom-in-95 duration-300">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-2 text-emerald-400 shadow-glow-green">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-extrabold text-white">Community Verification Signoff</h4>
                      <p className="text-xs text-emerald-200 mt-1">
                        Physical bituminous compaction complete. Citizens vote <strong>YES — FIXED</strong> to release contractor SLA bonus.
                      </p>
                    </div>
                  </div>
                )}

                {/* Center Big Play Button if paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.7)] hover:scale-110 active:scale-95 transition-all"
                      aria-label="Play video tutorial"
                    >
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </button>
                  </div>
                )}

                {/* Bottom Synchronized Captions Bar */}
                <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none">
                  <div className="p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-center max-w-2xl mx-auto">
                    <div className="text-xs sm:text-sm font-medium text-white leading-relaxed">
                      {currentChapter.caption}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Sleek Video Controls Bar */}
          <div className="p-4 sm:p-5 bg-[#0D1928] border-t border-white/10 flex flex-col gap-3">
            {/* Timeline Scrubber Bar with Chapter Ticks */}
            <div className="relative flex items-center group">
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#00E5FF] focus:outline-none"
              />

              {/* Chapter Markers Along the Progress Bar */}
              {chapters.map((chap) => {
                const pct = (chap.timeSec / totalDuration) * 100;
                return (
                  <div
                    key={chap.id}
                    onClick={() => jumpToChapter(chap.timeSec)}
                    style={{ left: `${pct}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-white/40 hover:bg-[#00E5FF] hover:h-4 cursor-pointer transition-all rounded-full"
                    title={chap.shortTitle}
                  />
                );
              })}
            </div>

            {/* Playback Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] font-bold hover:scale-105 active:scale-95 transition-all shadow-glow-cyan"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                {/* Restart */}
                <button
                  onClick={() => { setCurrentTime(0); setIsPlaying(true); }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Time Display */}
                <div className="text-xs font-mono text-slate-400">
                  <span className="text-white font-bold">{formatTime(currentTime)}</span>
                  <span> / {formatTime(totalDuration)}</span>
                </div>
              </div>

              {/* Current Chapter Label */}
              <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#00E5FF]">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                <span className="font-bold truncate max-w-xs">{currentChapter.title}</span>
              </div>

              {/* Right Tools (Speed, Mute, Fullscreen) */}
              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <button
                  onClick={() => {
                    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                    setPlaybackSpeed(nextSpeed);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors border border-white/5"
                  title="Playback Speed"
                >
                  {playbackSpeed}x
                </button>

                {/* Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00E5FF]" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Step-by-Step Chapters Interactive Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chap) => {
            const isCurrent = currentChapter.id === chap.id;
            return (
              <div
                key={chap.id}
                onClick={() => jumpToChapter(chap.timeSec)}
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 border text-left ${
                  isCurrent
                    ? 'bg-[#0D1928] border-cyan-400/50 shadow-glow-cyan translate-y-[-2px]'
                    : 'bg-[#0D1928]/60 border-white/5 hover:border-white/20 hover:bg-[#0D1928]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-white/5">{chap.icon}</span>
                    <span className="text-xs font-bold text-white font-mono">{chap.shortTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {formatTime(chap.timeSec)}
                  </span>
                </div>
                <p className="text-xs text-[#8EA4BC] leading-relaxed">
                  {chap.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
