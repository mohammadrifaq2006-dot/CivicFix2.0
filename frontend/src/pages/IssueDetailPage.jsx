import React, { useState, useEffect } from 'react';
import { issueAPI, authorityAPI, citizenAPI, adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  Wrench, 
  ThumbsUp, 
  RotateCcw, 
  Edit3, 
  DollarSign, 
  FileText,
  Clock
} from 'lucide-react';

export default function IssueDetailPage({ issueId, setActivePage, onOpenRepairModal, onOpenOverrideModal }) {
  const { user, role } = useAuth();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    if (issueId) {
      fetchIssue();
      if (role === 'ROLE_OFFICER' || role === 'ROLE_ADMIN') {
        fetchOfficers();
      }
    }
  }, [issueId]);

  const fetchIssue = async () => {
    setLoading(true);
    try {
      const res = await issueAPI.getById(issueId);
      setIssue(res.data);
    } catch (e) {
      // error
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      const res = await adminAPI.getOfficers();
      setOfficers(res.data || []);
    } catch (e) {}
  };

  const handleAssignOfficer = async () => {
    if (!selectedOfficer) return;
    try {
      await authorityAPI.assignOfficer(issueId, { officerId: parseInt(selectedOfficer), notes: 'Assigned via Operations Console' });
      fetchIssue();
    } catch (e) {
      alert('Failed to assign officer: ' + (e.response?.data?.message || e.message));
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setStatusUpdating(true);
    try {
      await authorityAPI.updateStatus(issueId, { status: newStatus, notes: `Status manually moved to ${newStatus}` });
      fetchIssue();
    } catch (e) {
      alert('Status transition failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleCitizenVerification = async (type) => {
    setFeedbackSubmitting(true);
    try {
      await citizenAPI.submitFeedback(issueId, {
        feedbackType: type,
        rating: type === 'FIXED' ? 5 : 2,
        comments: feedbackNotes || (type === 'FIXED' ? 'Repair confirmed as fixed by citizen.' : 'Citizen observed road defect remains.')
      });
      fetchIssue();
    } catch (e) {
      alert('Failed to submit verification: ' + (e.response?.data?.message || e.message));
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-24 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">Loading comprehensive incident intelligence...</p>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-5xl mx-auto py-24 text-center">
        <p className="text-base font-bold text-slate-800">Issue not found.</p>
        <button onClick={() => setActivePage('map')} className="text-xs text-brand-600 font-semibold mt-2 hover:underline">
          Return to Map
        </button>
      </div>
    );
  }

  // Parse priority breakdown JSON
  let breakdownMap = {};
  try {
    if (issue.priorityBreakdown) {
      breakdownMap = JSON.parse(issue.priorityBreakdown);
    }
  } catch (e) {}

  const isOfficerOrAdmin = role === 'ROLE_OFFICER' || role === 'ROLE_ADMIN';
  const isAwaitingConfirmation = issue.status === 'AWAITING_CITIZEN_CONFIRMATION' || issue.status === 'REPAIR_COMPLETED';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setActivePage('map')}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            issue.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
            issue.status === 'ESCALATED' ? 'bg-rose-100 text-rose-800 animate-pulse' :
            issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
            issue.status === 'AWAITING_CITIZEN_CONFIRMATION' ? 'bg-purple-100 text-purple-800' :
            'bg-amber-100 text-amber-800'
          }`}>
            Status: {issue.status}
          </span>

          {/* Severity Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            issue.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
            issue.severity === 'HIGH' ? 'bg-orange-500 text-white' :
            issue.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
            'bg-emerald-500 text-white'
          }`}>
            {issue.severity}
          </span>
        </div>
      </div>

      {/* Main Title & Reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                {issue.referenceCode}
              </span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Reported {new Date(issue.createdAt).toLocaleDateString()} at {new Date(issue.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              {issue.damageType?.replace('_', ' ')}
            </h1>
            <p className="text-xs font-medium text-slate-600 flex items-center mt-1">
              <MapPin className="w-4 h-4 text-brand-600 mr-1 flex-shrink-0" />
              {issue.address || issue.roadName || 'Road Location'}
              {issue.landmark && <span className="text-slate-400 ml-1">({issue.landmark})</span>}
            </p>
          </div>

          {/* Explainable Priority Badge Display */}
          <div className="text-right bg-slate-900 text-white p-3 rounded-2xl min-w-[140px] shadow-sm">
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Explainable Priority</span>
            <div className="flex items-baseline justify-end space-x-1 mt-0.5">
              <span className="text-3xl font-black text-emerald-400">{issue.priorityScore}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] font-bold text-amber-300 block mt-0.5">
              {issue.priorityScore >= 76 ? 'CRITICAL DISPATCH' : issue.priorityScore >= 51 ? 'HIGH EXPEDITE' : 'STANDARD QUEUE'}
            </span>
          </div>
        </div>

        {issue.description && (
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
            <strong>Citizen Observations:</strong> {issue.description}
          </div>
        )}
      </div>

      {/* Grid: Priority Engine Breakdown + AI Vision Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* WOW 3: Explainable Priority Engine Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center">
              <Sparkles className="w-4 h-4 text-purple-600 mr-1.5" />
              Why is Priority {issue.priorityScore}/100?
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Explainable Scoring</span>
          </div>

          <p className="text-xs text-slate-500">
            CivicRoad AI calculates a transparent mathematical score across 5 civic factors:
          </p>

          <div className="space-y-2 text-xs">
            {Object.keys(breakdownMap).length === 0 ? (
              <div className="space-y-1.5 text-slate-600">
                <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                  <span>Damage Severity ({issue.severity}):</span>
                  <span className="font-bold text-slate-900">+{issue.severity === 'CRITICAL' ? 30 : 22}</span>
                </div>
                <div className="flex justify-between py-1 bg-slate-50 px-2 rounded">
                  <span>Road Classification ({issue.roadCategory || 'Arterial'}):</span>
                  <span className="font-bold text-slate-900">+16</span>
                </div>
              </div>
            ) : (
              Object.entries(breakdownMap).map(([factor, pts]) => (
                <div key={factor} className="flex justify-between items-center py-1.5 px-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-700 font-medium">{factor}</span>
                  <span className="font-extrabold text-emerald-700 font-mono">{pts}</span>
                </div>
              ))
            )}
          </div>

          {issue.isEscalated && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span><strong>⚠ SLA Breach:</strong> This issue exceeded its resolution deadline and was escalated.</span>
            </div>
          )}
        </div>

        {/* AI Computer Vision & Human Override Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-1.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Computer Vision</h3>
            </div>
            {issue.aiAnalysis?.isOverridden ? (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                Human Override Applied
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Confidence: {issue.aiAnalysis?.confidencePercentage || 92}%
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">Predicted Damage</span>
              <p className="font-bold text-slate-800 mt-0.5">{issue.aiAnalysis?.predictedDamageType?.replace('_', ' ') || issue.damageType}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">Assessed Severity</span>
              <p className="font-bold text-amber-700 mt-0.5">{issue.aiAnalysis?.predictedSeverity || issue.severity}</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
            <strong>CV Reasoning:</strong> {issue.aiAnalysis?.explanation || 'Model identified surface asphalt displacement and lane impedance.'}
          </p>

          {/* Override button for Officers */}
          {isOfficerOrAdmin && (
            <button
              onClick={() => onOpenOverrideModal(issue)}
              className="w-full py-2 border border-slate-300 hover:border-slate-400 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 hover:bg-slate-50 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Override AI Classification / Severity</span>
            </button>
          )}
        </div>
      </div>

      {/* Photographic Evidence Gallery */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Photographic & Video Evidence</h3>
        {issue.evidences.length === 0 ? (
          <p className="text-xs text-slate-400">No photographic evidence attached.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {issue.evidences.map((ev) => (
              <div key={ev.id} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-900">
                <img 
                  src={ev.url} 
                  alt="Road damage evidence" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                  ev.isAfterRepair ? 'bg-emerald-600' : 'bg-slate-900/80'
                }`}>
                  {ev.isAfterRepair ? 'After Repair' : 'Original Observation'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WOW 2: Community Evidence Fusion (Duplicates) */}
      {issue.fusedDuplicates && issue.fusedDuplicates.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-950">Community Evidence Fusion</h3>
                <p className="text-xs text-blue-700">
                  {issue.fusedDuplicates.length + 1} citizen reports fused into 1 consolidated maintenance case
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full">
              {issue.fusedDuplicates.length} Linked Duplicates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {issue.fusedDuplicates.map((dup) => (
              <div key={dup.id} className="bg-white rounded-xl p-3 border border-blue-100 shadow-sm text-xs space-y-1">
                <div className="flex justify-between font-mono text-[11px] font-bold text-slate-800">
                  <span>{dup.referenceCode}</span>
                  <span className="text-blue-600">Within 35m</span>
                </div>
                <p className="text-slate-500 line-clamp-1">{dup.address || dup.roadName}</p>
                <span className="text-[10px] text-slate-400 block">Reported by Community Member</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Before & After Repair Verification Section */}
      {issue.repairDetails && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Repair Verification Evidence</h3>
                <p className="text-xs text-slate-500">Visual comparison of original defect versus completed repair</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Repaired by {issue.repairDetails.officerName || 'Municipal Crew'}
            </span>
          </div>

          {/* Side-by-Side Before vs After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Before Repair:</span>
              <div className="rounded-xl overflow-hidden border border-slate-200 h-52 bg-slate-100">
                <img 
                  src={issue.repairDetails.beforeImageUrl || (issue.evidences[0]?.url)} 
                  alt="Before repair" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-700">After Repair:</span>
              <div className="rounded-xl overflow-hidden border-2 border-emerald-500 h-52 bg-slate-100">
                <img 
                  src={issue.repairDetails.afterImageUrl || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop'} 
                  alt="After repair" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Repair specs */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-slate-400 font-mono text-[10px]">Materials Applied:</span>
              <p className="font-semibold text-slate-800">{issue.repairDetails.materialsUsed || 'Dense Bituminous Macadam (DBM)'}</p>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px]">Work Notes:</span>
              <p className="font-semibold text-slate-800">{issue.repairDetails.inspectionNotes || 'Completed and leveled with pavement.'}</p>
            </div>
          </div>

          {/* Citizen Verification Action Form */}
          {issue.status === 'AWAITING_CITIZEN_CONFIRMATION' && (
            <div className="mt-4 p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
              <h4 className="text-xs font-bold text-purple-950 flex items-center">
                <ThumbsUp className="w-4 h-4 text-purple-600 mr-1.5" />
                Citizen Satisfaction Confirmation
              </h4>
              <p className="text-xs text-purple-800">
                Has the road issue been fixed to your satisfaction? Your confirmation officially closes the incident and awards civic points.
              </p>
              <input
                type="text"
                placeholder="Optional feedback comments..."
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-purple-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex items-center space-x-3">
                <button
                  disabled={feedbackSubmitting}
                  onClick={() => handleCitizenVerification('FIXED')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  ✓ Confirm: Road Fixed
                </button>
                <button
                  disabled={feedbackSubmitting}
                  onClick={() => handleCitizenVerification('NOT_FIXED')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  ✗ Not Fixed (Reopen Ticket)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Officer Maintenance Management Toolbar */}
      {isOfficerOrAdmin && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold">Officer Dispatch & Maintenance Console</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">ROLE: {role}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Assign Officer Dropdown */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Assign Authority Officer</label>
              <div className="flex space-x-2">
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Officer...</option>
                  {officers.map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.fullName} ({off.role.replace('ROLE_', '')})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAssignOfficer}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold transition"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Quick Status Transitions */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Change Operational Status</label>
              <div className="flex space-x-2">
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold transition"
                >
                  Set In Progress
                </button>
                <button
                  disabled={statusUpdating}
                  onClick={() => handleUpdateStatus('VERIFIED')}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold transition"
                >
                  Mark Verified
                </button>
              </div>
            </div>

            {/* Submit Repair Evidence Button */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Repair Execution</label>
              <button
                onClick={() => onOpenRepairModal(issue)}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm transition flex items-center justify-center space-x-1.5"
              >
                <Wrench className="w-4 h-4" />
                <span>Upload After-Repair Evidence</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
