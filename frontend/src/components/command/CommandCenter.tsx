import React, { useState } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { RoadIncident } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  HardHat, 
  Search, 
  ChevronRight,
  MapPin,
  Wrench,
  AlertOctagon,
  Plus,
  ShieldAlert
} from 'lucide-react';

export const CommandCenter: React.FC = () => {
  const { incidents, setSelectedIncident, setIncidentDrawerOpen, addToast } = useIncidents();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  
  // Specific property damage registry by pothole ticket
  const [propertyDamageLogs, setPropertyDamageLogs] = useState<Record<string, { rims: number; tyres: number; spills: number }>>({
    'CR-2048': { rims: 3, tyres: 2, spills: 1 },
    'CR-2037': { rims: 4, tyres: 3, spills: 2 },
    'CR-2029': { rims: 1, tyres: 1, spills: 0 },
    'CR-1994': { rims: 2, tyres: 1, spills: 1 },
    'CR-2015': { rims: 1, tyres: 0, spills: 0 },
    'CR-1981': { rims: 0, tyres: 0, spills: 0 },
  });

  const filtered = incidents.filter(inc => {
    const matchesSearch = inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.damageType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = filterSeverity === 'ALL' || inc.severity === filterSeverity;
    return matchesSearch && matchesSev;
  });

  const handleSelectRow = (inc: RoadIncident) => {
    setSelectedIncident(inc);
    setIncidentDrawerOpen(true);
  };

  const handleAddPropertyDamage = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPropertyDamageLogs(prev => {
      const current = prev[id] || { rims: 0, tyres: 0, spills: 0 };
      return {
        ...prev,
        [id]: { ...current, rims: current.rims + 1 }
      };
    });
    addToast('Property Damage Added', `Logged additional wheel rim fracture for pothole ${id}. Priority elevated.`, 'warning');
  };

  return (
    <section id="section-command" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0F17] border-t border-white/[0.08]">
      <div id="section-accidents" className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono uppercase tracking-wider mb-3">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Municipal Operations Console &bull; Telangana R&amp;B Dept</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Pothole &amp; Property Damage Command
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Real-time monitoring of road cavities, asphalt fissures, and recorded vehicular property damage (wheel rim fractures, tyre blowouts, and scooter spills) across Telangana corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>GHMC JETPATCHER UNITS ACTIVE IN FIELD</span>
          </div>
        </div>

        {/* 5 Targeted Operational Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-10">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-white/[0.08] shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ACTIVE POTHOLES</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white font-mono mt-2">
              48
            </div>
            <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Monitored across 5 zones</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-red-500/30 shadow-lg">
            <div className="flex items-center justify-between text-red-300 text-xs font-mono">
              <span>CRITICAL DEPTH (&gt;8CM)</span>
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-red-400 font-mono mt-2">
              11
            </div>
            <span className="text-[10px] text-red-300 font-mono mt-1 block">Immediate rim damage risk</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-amber-500/20 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>REPAIRS IN PROGRESS</span>
              <HardHat className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-300 font-mono mt-2">
              17
            </div>
            <span className="text-[10px] text-amber-400 font-mono mt-1 block">Jetpatchers on site</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-emerald-500/20 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>RECTIFIED &bull; 30D</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono mt-2">
              872
            </div>
            <span className="text-[10px] text-emerald-300 font-mono mt-1 block">Bitumen patch inspected</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-blue-500/20 shadow-lg col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>AVG REPAIR TIME</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-blue-300 font-mono mt-2">
              4h 18m
            </div>
            <span className="text-[10px] text-blue-400 font-mono mt-1 block">Fast emergency response</span>
          </div>
        </div>

        {/* Pothole & Property Damage Registry Table */}
        <div className="rounded-3xl bg-[#111827] border border-white/[0.08] overflow-hidden shadow-2xl">
          {/* Controls Bar */}
          <div className="p-5 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141C2B]">
            <div className="flex items-center gap-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Active Potholes &amp; Property Damage Log</span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {filtered.length} Sites
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search road, ID, damage..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-[#0B0F17] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 w-48 sm:w-64 font-mono"
                />
              </div>

              {/* Severity Tiers */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B0F17] border border-white/10">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      filterSeverity === sev
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0F17] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/5">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Pothole / Road Damage &amp; Location</th>
                  <th className="py-3.5 px-4">Cavity Dimensions</th>
                  <th className="py-3.5 px-4">Property Damage Recorded</th>
                  <th className="py-3.5 px-4">Priority Score</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filtered.map((inc) => {
                  const prop = propertyDamageLogs[inc.id] || { rims: 0, tyres: 0, spills: 0 };

                  const sevColor = {
                    CRITICAL: 'text-red-400 bg-red-500/10 border-red-500/30',
                    HIGH: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
                    MEDIUM: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
                    LOW: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                  }[inc.severity];

                  const statusColor = {
                    REPORTED: 'text-slate-300 bg-slate-800',
                    AI_ANALYZED: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40',
                    PRIORITIZED: 'text-purple-300 bg-purple-950/60 border-purple-500/40',
                    ASSIGNED: 'text-blue-300 bg-blue-950/60 border-blue-500/40',
                    IN_PROGRESS: 'text-amber-300 bg-amber-950/60 border-amber-500/40 animate-pulse',
                    RESOLVED: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/40',
                    VERIFIED: 'text-cyan-300 bg-cyan-950/80 border-cyan-400/50',
                  }[inc.status];

                  return (
                    <tr
                      key={inc.id}
                      onClick={() => handleSelectRow(inc)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* Ref ID */}
                      <td className="py-4 px-4 font-mono font-bold text-white">
                        <span>{inc.id}</span>
                      </td>

                      {/* Location & Damage */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{inc.damageType}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{inc.location}</span>
                        </div>
                      </td>

                      {/* Cavity Dimensions */}
                      <td className="py-4 px-4 font-mono">
                        <span className="text-white font-bold">{inc.severity === 'CRITICAL' ? '12.0 cm' : '8.5 cm'} depth</span>
                        <span className="text-slate-400 block text-[10px]">{inc.areaEstimateM2} m² area</span>
                      </td>

                      {/* Property Damage */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-mono text-xs font-bold ${prop.rims > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
                            {prop.rims > 0 ? `${prop.rims} Rim Dent(s) &bull; ${prop.tyres} Tyre Cut(s)` : 'Zero Damage Logged'}
                          </span>
                          {prop.spills > 0 && (
                            <span className="text-[10px] text-red-400 font-mono">
                              {prop.spills} Two-Wheeler Skid Recorded
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Priority Score */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">{inc.priorityScore}</span>
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500"
                              style={{ width: `${inc.priorityScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${statusColor}`}>
                          {inc.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleAddPropertyDamage(e, inc.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Log Property Damage for this pothole"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Log Rim Damage</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectRow(inc);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 text-slate-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
