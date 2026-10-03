import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { RoadIncident } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { soundService } from '../../services/soundService';
import { 
  Compass, 
  MapPin, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  ShieldAlert, 
  Radio, 
  ChevronRight,
  Flame,
  Activity,
  Sparkles
} from 'lucide-react';

type CameraLevel = 'CITY' | 'ZONE' | 'ROAD' | 'INCIDENT';

export const SmartCityMap: React.FC = () => {
  const { incidents, selectedIncident, setSelectedIncident, setIncidentDrawerOpen } = useIncidents();
  const [camera, setCamera] = useState<CameraLevel>('CITY');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'HEATMAP'>('ALL');
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Camera transform configurations
  const cameraTransforms: Record<CameraLevel, { scale: number; x: number; y: number }> = {
    CITY: { scale: 1, x: 0, y: 0 },
    ZONE: { scale: 1.6, x: -100, y: -40 },
    ROAD: { scale: 2.3, x: -280, y: -120 },
    INCIDENT: { scale: 3.2, x: -440, y: -210 },
  };

  const handleCameraChange = (lvl: CameraLevel) => {
    setCamera(lvl);
    soundService.playClick();
  };

  const handleMarkerClick = (inc: RoadIncident) => {
    setSelectedIncident(inc);
    setCamera('INCIDENT');
    soundService.playClick();
  };

  const currentTransform = cameraTransforms[camera];

  // Section 13 prompt badges
  const hotZones = [
    { label: 'HIGH RISK ZONE', color: '#EF4444', x: 740, y: 140, zone: 'Zone 02' },
    { label: 'RECURRING DAMAGE', color: '#F97316', x: 180, y: 460, zone: 'Zone 05' },
    { label: 'UNRESOLVED CLUSTER', color: '#F59E0B', x: 800, y: 390, zone: 'Zone 03' },
    { label: 'MAINTENANCE HOTSPOT', color: '#00E5FF', x: 440, y: 250, zone: 'Zone 04 (Central Demo Road)' },
  ];

  return (
    <section id="section-map" className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#091321] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[#00A3FF]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header (Section 13 Prompt Spec) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00A3FF]/10 border border-[#00A3FF]/30 text-cyan-300 text-xs font-mono uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Smart-City Spatial Matrix</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F5F9FF] tracking-tight">
              From one report to city-wide intelligence.
            </h2>
            <p className="text-[#8EA4BC] text-sm sm:text-base mt-2 max-w-xl">
              Spatial vector topology with automated multi-scale camera transitions, incident clustering, and heat density modeling.
            </p>
          </div>

          {/* Camera Level Switcher Buttons (CITY -> ZONE -> ROAD -> INCIDENT) */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0D1928] border border-white/10 shadow-glass">
            {(['CITY', 'ZONE', 'ROAD', 'INCIDENT'] as CameraLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleCameraChange(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${
                  camera === lvl
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#00A3FF] text-[#050B14] shadow-glow-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Hotspots Quick Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {hotZones.map((hz) => (
            <div
              key={hz.label}
              className="p-3 rounded-xl bg-[#0D1928]/80 backdrop-blur-md border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">{hz.zone}</span>
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hz.color }} />
                  {hz.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Viewport Card */}
        <div className="relative rounded-3xl bg-[#050B14] border border-white/10 overflow-hidden shadow-2xl h-[640px] select-none">
          {/* Top Filter Controls Bar */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#0D1928]/95 backdrop-blur-xl border border-white/10">
            <button
              onClick={() => { setActiveFilter('ALL'); setShowHeatmap(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                activeFilter === 'ALL' ? 'bg-[#00A3FF]/20 text-[#00E5FF] border border-[#00A3FF]/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Incidents ({incidents.length})
            </button>
            <button
              onClick={() => { setActiveFilter('CRITICAL'); setShowHeatmap(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                activeFilter === 'CRITICAL' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical Risk
            </button>
            <button
              onClick={() => { setShowHeatmap(!showHeatmap); setActiveFilter('HEATMAP'); }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                showHeatmap ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{showHeatmap ? 'Heatmap: ACTIVE' : 'Toggle Heatmap'}</span>
            </button>
          </div>

          {/* Map Compass & Telemetry Widget */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-3 p-2.5 rounded-xl bg-[#0D1928]/95 backdrop-blur-xl border border-white/10 text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-[#00E5FF]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              CAMERA: {camera}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">METRO LAT 12.9716° N</span>
          </div>

          {/* Interactive SVG Road Graph Container with Camera Pan/Zoom */}
          <div
            className="w-full h-full transition-transform duration-1000 ease-out origin-center cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${currentTransform.scale}) translate(${currentTransform.x}px, ${currentTransform.y}px)`,
            }}
          >
            <svg
              viewBox="0 0 1000 650"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="map-bg-deep" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#091321" />
                  <stop offset="100%" stopColor="#050B14" />
                </radialGradient>
                <linearGradient id="arterial-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00A3FF" stopOpacity="0.8" />
                </linearGradient>
                <filter id="heat-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="18" result="blur" />
                </filter>
              </defs>

              {/* Background */}
              <rect width="1000" height="650" fill="url(#map-bg-deep)" />

              {/* Heatmap Layer (Toggleable) */}
              {showHeatmap && (
                <g opacity="0.65">
                  <circle cx="520" cy="310" r="110" fill="#EF4444" filter="url(#heat-glow)" />
                  <circle cx="740" cy="200" r="95" fill="#F97316" filter="url(#heat-glow)" />
                  <circle cx="320" cy="460" r="80" fill="#F59E0B" filter="url(#heat-glow)" />
                  <circle cx="680" cy="420" r="85" fill="#EF4444" filter="url(#heat-glow)" />
                </g>
              )}

              {/* Faint City Neighborhood Blocks */}
              <g opacity="0.14" fill="#122238">
                <rect x="80" y="80" width="160" height="120" rx="12" />
                <rect x="280" y="70" width="220" height="140" rx="12" />
                <rect x="540" y="90" width="180" height="110" rx="12" />
                <rect x="760" y="80" width="180" height="140" rx="12" />
                <rect x="70" y="240" width="190" height="180" rx="12" />
                <rect x="300" y="250" width="200" height="170" rx="12" />
                <rect x="540" y="240" width="210" height="180" rx="12" />
                <rect x="780" y="260" width="160" height="160" rx="12" />
                <rect x="100" y="460" width="220" height="140" rx="12" />
                <rect x="360" y="460" width="240" height="140" rx="12" />
                <rect x="640" y="460" width="280" height="140" rx="12" />
              </g>

              {/* Secondary Local Street Grid */}
              <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" fill="none">
                <line x1="50" y1="140" x2="950" y2="140" />
                <line x1="50" y1="290" x2="950" y2="290" />
                <line x1="50" y1="440" x2="950" y2="440" />
                <line x1="50" y1="580" x2="950" y2="580" />
                <line x1="160" y1="40" x2="160" y2="610" />
                <line x1="390" y1="40" x2="390" y2="610" />
                <line x1="620" y1="40" x2="620" y2="610" />
                <line x1="840" y1="40" x2="840" y2="610" />
              </g>

              {/* Major Arterial: Central Demo Road Corridor (Thick glowing line) */}
              <path
                d="M 80,310 L 920,310"
                fill="none"
                stroke="url(#arterial-grad)"
                strokeWidth="7"
                opacity="0.9"
              />
              <path
                d="M 520,60 L 520,600"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="5"
                opacity="0.75"
              />

              {/* Section 13 Labels overlayed directly on the SVG */}
              <g font-family="monospace" font-size="10" font-weight="bold">
                <text x="430" y="285" fill="#00FF88">ZONE 04: CENTRAL DEMO ROAD</text>
                <text x="740" y="110" fill="#EF4444">HIGH RISK ZONE &bull; RING 02</text>
                <text x="140" y="470" fill="#F97316">RECURRING DAMAGE &bull; SOUTH</text>
                <text x="780" y="430" fill="#F59E0B">UNRESOLVED CLUSTER &bull; TECH</text>
              </g>

              {/* Incidents Markers */}
              {incidents.map((inc) => {
                const px = (inc.coordinates.x / 100) * 1000;
                const py = (inc.coordinates.y / 100) * 650;
                const isSelected = selectedIncident?.id === inc.id;

                const color = {
                  CRITICAL: '#EF4444',
                  HIGH: '#F97316',
                  MEDIUM: '#F59E0B',
                  LOW: '#00FF88',
                }[inc.severity];

                return (
                  <g
                    key={inc.id}
                    onClick={() => handleMarkerClick(inc)}
                    className="cursor-pointer group"
                    transform={`translate(${px}, ${py})`}
                  >
                    {/* Pulsing Radar Ring */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "24" : "15"}
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      opacity={isSelected ? "0.9" : "0.5"}
                      className="radar-ping"
                    />

                    {/* Outer core circle */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? "11" : "8"}
                      fill={color}
                      stroke="#050B14"
                      strokeWidth="2.5"
                    />

                    {/* Pin Label Tag */}
                    <g transform="translate(14, -8)">
                      <rect
                        width={isSelected ? "125" : "90"}
                        height="24"
                        rx="6"
                        fill="#0D1928"
                        stroke={isSelected ? "#00E5FF" : color}
                        strokeWidth={isSelected ? "1.5" : "1"}
                        opacity="0.95"
                      />
                      <text
                        x="8"
                        y="16"
                        fill="#F5F9FF"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {inc.id} &bull; {inc.priorityScore}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Incident Floating Bottom Preview Card */}
          {selectedIncident && (
            <div className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto">
              <GlassCard intensity="high" className="p-4 sm:p-5 border-[#00E5FF]/40 shadow-glow-cyan flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#00A3FF]/20 border border-[#00A3FF]/40 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#00E5FF]">{selectedIncident.id}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        Priority: {selectedIncident.priorityScore} / 100
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white truncate mt-0.5">
                      {selectedIncident.damageType} &bull; {selectedIncident.location}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIncidentDrawerOpen(true)}
                  icon={<ChevronRight className="w-4 h-4" />}
                >
                  INSPECT DOSSIER
                </Button>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
