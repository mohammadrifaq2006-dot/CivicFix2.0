import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { soundService } from '../../services/soundService';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Users, 
  HardHat, 
  Check, 
  Sparkles,
  ArrowRight,
  Truck,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

export const IncidentDetailDrawer: React.FC = () => {
  const { 
    selectedIncident, 
    incidentDrawerOpen, 
    setIncidentDrawerOpen,
    updateIncidentStatus,
    assignTeam,
    addToast
  } = useIncidents();
  const [activeImageTab, setActiveImageTab] = useState<'BEFORE' | 'AFTER'>('BEFORE');

  if (!incidentDrawerOpen || !selectedIncident) return null;

  const currentStatus = selectedIncident.status;

  const handleAssign = () => {
    soundService.playSuccess();
    assignTeam(selectedIncident.id, {
      id: 'team-alpha',
      name: 'RoadWorks Alpha',
      crewSize: 5,
      etaMinutes: 12
    });
    addToast({
      title: 'Squad Assigned',
      message: 'RoadWorks Alpha dispatched with bituminous hot-mix crew.',
      type: 'success',
    });
  };

  const handleStartRepair = () => {
    soundService.playClick();
    updateIncidentStatus(selectedIncident.id, 'IN_PROGRESS');
    addToast({
      title: 'Repair In Progress',
      message: 'Crew is actively compacting asphalt on site.',
      type: 'info',
    });
  };

  const handleResolve = () => {
    soundService.playSuccess();
    updateIncidentStatus(selectedIncident.id, 'RESOLVED');
    setActiveImageTab('AFTER');
    addToast({
      title: 'Work Completed',
      message: 'Physical compaction finished. Ticket moved to Community Verification.',
      type: 'success',
    });
  };

  // Prompt Section 21 & 22 steps:
  // Reported -> AI analyzed -> Assigned -> In progress -> Resolved -> Verified
  const steps = [
    { key: 'REPORTED', label: 'Reported', done: true },
    { key: 'AI_ANALYZED', label: 'AI Analyzed', done: ['AI_ANALYZED', 'PRIORITIZED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED'].includes(currentStatus) },
    { key: 'ASSIGNED', label: 'Assigned', done: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED'].includes(currentStatus) },
    { key: 'IN_PROGRESS', label: 'In Progress', done: ['IN_PROGRESS', 'RESOLVED', 'VERIFIED'].includes(currentStatus) },
    { key: 'RESOLVED', label: 'Resolved', done: ['RESOLVED', 'VERIFIED'].includes(currentStatus) },
    { key: 'VERIFIED', label: 'Verified', done: ['VERIFIED'].includes(currentStatus) },
  ];

  return (
    <div className="fixed inset-0 z-[9990] flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-xl h-full bg-[#091321] border-l border-white/10 shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#091321]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[#00E5FF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-white">{selectedIncident.id}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  {selectedIncident.severity}
                </span>
              </div>
              <div className="text-xs text-[#8EA4BC] mt-0.5">{selectedIncident.location}</div>
            </div>
          </div>

          <button
            onClick={() => setIncidentDrawerOpen(false)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Before / After Image Viewport with Toggle (Section 21 Spec) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8EA4BC] uppercase">Physical Evidence ({selectedIncident.evidenceCount} Images)</span>
              <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                <button
                  onClick={() => setActiveImageTab('BEFORE')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    activeImageTab === 'BEFORE' ? 'bg-[#00E5FF] text-black' : 'text-slate-400'
                  }`}
                >
                  BEFORE REPAIR
                </button>
                <button
                  onClick={() => setActiveImageTab('AFTER')}
                  className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    activeImageTab === 'AFTER' ? 'bg-[#00FF88] text-black' : 'text-slate-400'
                  }`}
                >
                  AFTER REPAIR
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 bg-slate-950">
              <img
                src={activeImageTab === 'AFTER' ? selectedIncident.repairedImageUrl : selectedIncident.imageUrl}
                alt="Road Surface"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#00E5FF]">
                {activeImageTab === 'AFTER' ? 'COMPACTED ASPHALT RESTORATION' : 'POTHOLE DISTRESS • YOLO V8 BOUND'}
              </div>
            </div>
          </div>

          {/* Section 22: Live Status Animated Progress Line */}
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase block mb-3">
              Workflow Timeline (Section 22)
            </span>
            <div className="relative p-3 rounded-2xl bg-[#0D1928] border border-white/5">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center relative z-10">
                {steps.map((s, idx) => {
                  const isCurrent = currentStatus === s.key;
                  return (
                    <div key={s.key} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 transition-all ${
                          s.done
                            ? 'bg-[#00FF88] text-[#050B14] shadow-glow-green'
                            : isCurrent
                            ? 'bg-[#00E5FF] text-black animate-pulse shadow-glow-cyan'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {s.done ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] font-mono leading-tight ${s.done ? 'text-white font-bold' : 'text-slate-500'}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry Metrics Grid (Section 21) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] font-mono text-[#8EA4BC] uppercase block">Priority Score</span>
              <span className="text-lg font-mono font-black text-amber-400 mt-1 block">
                {selectedIncident.priorityScore} / 100
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] font-mono text-[#8EA4BC] uppercase block">AI Confidence</span>
              <span className="text-lg font-mono font-black text-[#00E5FF] mt-1 block">
                {selectedIncident.confidence}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] font-mono text-[#8EA4BC] uppercase block">Reports Converged</span>
              <span className="text-lg font-mono font-black text-white mt-1 block">
                {selectedIncident.reportsCount} Citizens
              </span>
            </div>
          </div>

          {/* Assigned Squad Info */}
          {selectedIncident.assignedTeam && (
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[#00A3FF] flex items-center gap-1.5 font-bold">
                  <Truck className="w-4 h-4" />
                  Assigned Maintenance Unit
                </span>
                <span className="font-mono text-[#00FF88] font-bold">ETA: {selectedIncident.assignedTeam.etaMinutes} mins</span>
              </div>
              <div className="text-sm font-bold text-white">{selectedIncident.assignedTeam.name}</div>
              <div className="text-xs text-[#8EA4BC] mt-0.5">Crew: {selectedIncident.assignedTeam.crewSize} civil technicians &bull; Bituminous Rapid Patcher Dispatched</div>
            </div>
          )}

          {/* Fused Reports Dossier */}
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase block mb-3">
              Fused Community Reports ({selectedIncident.reportsCount} Items)
            </span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {(selectedIncident.reports.length > 0 ? selectedIncident.reports : [
                { id: '1', citizenName: 'Aarav Sharma', timestamp: '08:14 AM', description: 'Deep rim fracture near central bus bay', deviceInfo: 'iOS • GPS ±2.1m' },
                { id: '2', citizenName: 'Priya Sundaram', timestamp: '09:02 AM', description: 'Car bumper scrape on road hole', deviceInfo: 'Transit Cam' },
              ]).map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl bg-[#0D1928] border border-white/5 text-xs">
                  <div className="flex justify-between font-semibold text-slate-300 mb-1 font-mono">
                    <span className="text-white">{rep.citizenName}</span>
                    <span className="text-[#00E5FF] text-[10px]">{rep.timestamp}</span>
                  </div>
                  <div className="text-[#8EA4BC]">{rep.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-5 border-t border-white/10 bg-[#091321]/95 sticky bottom-0 z-10 flex flex-wrap items-center gap-3 justify-end">
          {currentStatus === 'REPORTED' || currentStatus === 'AI_ANALYZED' || currentStatus === 'PRIORITIZED' ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleAssign}
              icon={<HardHat className="w-4 h-4" />}
            >
              ASSIGN ROADWORKS ALPHA
            </Button>
          ) : currentStatus === 'ASSIGNED' ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleStartRepair}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              START REPAIR WORK
            </Button>
          ) : currentStatus === 'IN_PROGRESS' ? (
            <Button
              variant="accent"
              size="md"
              onClick={handleResolve}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              MARK AS RESOLVED
            </Button>
          ) : (
            <div className="text-xs font-mono text-[#00FF88] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>REPAIR COMPLETE &bull; READY FOR CITIZEN VOTE</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
