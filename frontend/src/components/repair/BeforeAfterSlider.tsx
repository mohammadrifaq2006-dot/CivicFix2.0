import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { REAL_POTHOLE_PRIMARY, REAL_REPAIRED_ROAD } from '../../data/assets';
import { CheckCircle2, Split } from 'lucide-react';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <GlassCard intensity="high" className="p-4 sm:p-6 border-white/10 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Split className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
              Telangana Asphalt Restoration Inspection Slider
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>REPAIR VERIFIED &bull; GHMC</span>
          </div>
        </div>

        {/* Interactive Comparison Canvas */}
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10 select-none cursor-ew-resize group"
        >
          {/* AFTER (Background Layer - Real Fresh Asphalt) */}
          <img
            src={REAL_REPAIRED_ROAD}
            alt="Repaired Asphalt"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* BEFORE (Clipped Top Layer - Real Pothole) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-full h-full" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
              <img
                src={REAL_POTHOLE_PRIMARY}
                alt="Damaged Surface"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Divider Handle Bar */}
          <div
            className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_#10B981] pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Center Thumb Grip */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-emerald-400 shadow-md flex items-center justify-center text-emerald-400 text-[10px] font-bold">
              &harr;
            </div>
          </div>

          {/* Floating Pill Badges */}
          <div className="absolute bottom-4 left-4 pointer-events-none">
            <span className="px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-red-400">
              BEFORE &bull; Damaged Pothole Hazard
            </span>
          </div>

          <div className="absolute bottom-4 right-4 pointer-events-none">
            <span className="px-3 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-emerald-500/40 text-xs font-mono font-bold text-emerald-400">
              AFTER &bull; Jetpatcher Compacted Asphalt
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>&larr; Drag slider to inspect compaction smoothness</span>
          <span className="text-emerald-400">Bituminous Hot-Mix Patch #GHMC-4</span>
        </div>
      </GlassCard>
    </div>
  );
};
