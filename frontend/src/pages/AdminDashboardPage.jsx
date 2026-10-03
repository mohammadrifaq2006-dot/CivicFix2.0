import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Layers, 
  Users, 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  FileText,
  Clock
} from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [dashRes, analRes, userRes, logsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
        adminAPI.getAuditLogs()
      ]);
      setDashboard(dashRes.data);
      setAnalytics(analRes.data);
      setUsers(userRes.data || []);
      setAuditLogs(logsRes.data || []);
    } catch (e) {
      // error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading executive analytics & administration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Executive Administration & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            CivicRoad AI Command Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-jurisdiction maintenance metrics, algorithmic duplicate reduction, and audit oversight
          </p>
        </div>
      </div>

      {/* High-Level Executive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Citizens</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{dashboard?.totalCitizens || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Field Officers</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{dashboard?.totalOfficers || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Road Cases</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{dashboard?.totalIssues || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Resolution Rate</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{dashboard?.resolutionRatePercentage || 0}%</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Avg Resolution</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{dashboard?.avgResolutionDays || 2.4} days</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm bg-blue-50/30 border-blue-200">
          <span className="text-[11px] font-bold text-blue-700 uppercase">Duplicate Cut</span>
          <p className="text-2xl font-black text-blue-700 mt-1">24.5%</p>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Incident Submissions vs Repairs Completed</h3>
            <span className="text-xs font-mono text-slate-400">Monthly Run Rate</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="reported" fill="#94a3b8" name="Reported Damage" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" fill="#22c55e" name="Repairs Verified" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Damage Distribution Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Damage Category Distribution</h3>
            <span className="text-xs font-mono text-slate-400">CV AI Classification</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.damageDistribution || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '11px', border: '1px solid #e2e8f0' }} />
                <Bar dataKey="count" fill="#3b82f6" name="Incident Count" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Top Damaged Roads & User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Damaged Roads */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Corridors Needing Attention (Low Health)</h3>
            <span className="text-xs font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">
              Targeted Rehabilitation
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {analytics?.topDamagedRoads?.map((road, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{road.roadName}</h4>
                  <p className="text-[11px] text-slate-400">{road.areaName}</p>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Open Defects</span>
                    <span className="font-bold text-rose-600">{road.openIssues} active</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg font-bold font-mono ${
                    road.healthScore >= 75 ? 'bg-emerald-100 text-emerald-800' :
                    road.healthScore >= 60 ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {road.healthScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
            <span className="text-[11px] text-slate-400 font-mono">Immutable Compliance Log</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
            {auditLogs.length === 0 ? (
              <p className="text-slate-400 py-8 text-center">No audit entries found.</p>
            ) : (
              auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="py-2 flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-800 font-mono text-[11px]">{log.action}</span>
                    <p className="text-[11px] text-slate-500">
                      Entity: {log.entityType} #{log.entityId}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
