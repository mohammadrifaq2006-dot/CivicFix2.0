import React, { useState, useEffect } from 'react';
import { authorityAPI } from '../services/api';
import { 
  Activity, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  UserCheck, 
  Wrench, 
  ChevronRight, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AuthorityDashboardPage({ setActivePage, setSelectedIssueId, onOpenRepairModal }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await authorityAPI.getDashboard();
      setDashboard(res.data);
    } catch (e) {
      // error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading municipal operations dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Municipal Dispatch & Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Road Infrastructure Maintenance Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time explainable priority queue, crew assignments, and SLA breach management
          </p>
        </div>
        <button
          onClick={() => setActivePage('map')}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
        >
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Open Geospatial Ops Map</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Cases</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{dashboard?.totalIssues || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-rose-200 shadow-sm bg-rose-50/30">
          <span className="text-[11px] font-bold text-rose-600 uppercase flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            Critical Hazards
          </span>
          <p className="text-2xl font-black text-rose-600 mt-1">{dashboard?.criticalIssues || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Pending Review</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{dashboard?.pendingVerification || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">In Maintenance</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{dashboard?.inProgress || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-rose-300 shadow-sm bg-rose-100/40">
          <span className="text-[11px] font-bold text-rose-700 uppercase flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            SLA Breaches
          </span>
          <p className="text-2xl font-black text-rose-700 mt-1">{dashboard?.overdueSla || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Resolved MTD</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{dashboard?.resolvedThisMonth || 0}</p>
        </div>
      </div>

      {/* Main Priority Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              Automated Priority Queue (0–100 Explainable Scoring)
            </h2>
            <p className="text-xs text-slate-500">
              Ranked dynamically by damage severity, traffic exposure, duplicate reports, and hospital/school proximity
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
            Active Queue: {dashboard?.priorityQueue?.length || 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Ref Code</th>
                <th className="py-3 px-4">Damage Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Duplicates</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {dashboard?.priorityQueue?.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                      issue.priorityScore >= 76 ? 'bg-red-500 text-white' :
                      issue.priorityScore >= 51 ? 'bg-orange-500 text-white' :
                      issue.priorityScore >= 26 ? 'bg-amber-400 text-slate-900' :
                      'bg-emerald-500 text-white'
                    }`}>
                      {issue.priorityScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{issue.referenceCode}</td>
                  <td className="py-3 px-4 text-slate-800">{issue.damageType?.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{issue.address || issue.roadName}</td>
                  <td className="py-3 px-4">
                    {issue.duplicateCount > 0 ? (
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {issue.duplicateCount} Duplicates
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      issue.isEscalated ? 'bg-rose-100 text-rose-800 animate-pulse' :
                      issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      issue.status === 'ASSIGNED' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.isEscalated ? '⚠ ESCALATED' : issue.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedIssueId(issue.id);
                        setActivePage('issue-detail');
                      }}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                    >
                      Process Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Officer Workloads & Jurisdiction Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Officer Workloads */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <UserCheck className="w-4 h-4 text-blue-600 mr-1.5" />
              Officer Field Workload & Case Distribution
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Live Roster</span>
          </div>

          <div className="divide-y divide-slate-100">
            {dashboard?.officerWorkloads?.map((off) => (
              <div key={off.officerId} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{off.officerName}</h4>
                  <p className="text-[11px] text-slate-400">{off.departmentName}</p>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Assigned</span>
                    <span className="font-bold text-blue-600">{off.assignedCases} cases</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">In Progress</span>
                    <span className="font-bold text-amber-600">{off.inProgressCases}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WOW 1: Jurisdiction Road Health Indices */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">AI Road Health Index by Zone</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              CivicRoad Indicator
            </span>
          </div>

          <div className="space-y-3">
            {dashboard?.areaSummaries?.map((area) => (
              <div key={area.areaId} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{area.areaName}</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                    area.roadHealthIndex >= 80 ? 'bg-emerald-100 text-emerald-800' :
                    area.roadHealthIndex >= 65 ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    Health: {area.roadHealthIndex} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      area.roadHealthIndex >= 80 ? 'bg-emerald-500' :
                      area.roadHealthIndex >= 65 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}
                    style={{ width: `${area.roadHealthIndex}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>City: {area.city}</span>
                  <span>{area.activeIssues} active issues</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
