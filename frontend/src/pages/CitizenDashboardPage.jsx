import React, { useState, useEffect } from 'react';
import { citizenAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  CheckCircle, 
  Clock, 
  MapPin, 
  PlusCircle, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function CitizenDashboardPage({ setActivePage, setSelectedIssueId }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, repRes] = await Promise.all([
        citizenAPI.getDashboard(),
        citizenAPI.getMyReports()
      ]);
      setDashboard(dashRes.data);
      setReports(repRes.data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading citizen impact dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome & Gamification Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Civic Contributor Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome back, {user?.fullName || 'Citizen'}!</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {dashboard?.communityImpactStatement || 'Thank you for actively contributing to safer community roads.'}
          </p>
        </div>

        {/* Gamification Points Badge */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-center min-w-[180px]">
          <span className="text-[10px] text-slate-300 uppercase tracking-widest font-mono">Civic Points</span>
          <div className="text-3xl font-black text-emerald-400 mt-0.5">{dashboard?.civicPoints || 10}</div>
          <span className="inline-block mt-1 text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
            🎖 {dashboard?.badgeLevel || 'Novice Reporter'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Submissions</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{dashboard?.totalReports || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Under Review</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{dashboard?.pendingReports || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">In Maintenance</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{dashboard?.inProgressReports || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Verified Fixed</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{dashboard?.resolvedReports || 0}</p>
        </div>
      </div>

      {/* My Reports Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Road Damage Reports</h2>
            <p className="text-xs text-slate-500">Track real-time maintenance status and verify completed repairs</p>
          </div>
          <button
            onClick={() => setActivePage('report')}
            className="flex items-center space-x-1.5 bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Report</span>
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <p>You haven't submitted any road damage reports yet.</p>
            <button
              onClick={() => setActivePage('report')}
              className="text-brand-600 font-semibold hover:underline"
            >
              Submit your first report now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Damage</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{rep.referenceCode}</td>
                    <td className="py-3 px-4 text-slate-800">{rep.damageType?.replace('_', ' ')}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{rep.address || rep.roadName}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-700">{rep.priorityScore}/100</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        rep.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                        rep.status === 'AWAITING_CITIZEN_CONFIRMATION' ? 'bg-purple-100 text-purple-800 animate-pulse' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedIssueId(rep.id);
                          setActivePage('issue-detail');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Track
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
