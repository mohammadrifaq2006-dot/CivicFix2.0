import React, { useState } from 'react';
import { authorityAPI } from '../services/api';
import { X, Edit3, ShieldAlert } from 'lucide-react';

export default function OverrideModal({ issue, onClose, onSuccess }) {
  const [damageType, setDamageType] = useState(issue?.damageType || 'POTHOLE');
  const [severity, setSeverity] = useState(issue?.severity || 'HIGH');
  const [priorityScore, setPriorityScore] = useState(issue?.priorityScore || 80);
  const [reason, setReason] = useState('Officer visual on-site inspection confirmed higher cavity depth and bus route obstruction.');
  const [submitting, setSubmitting] = useState(false);

  if (!issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authorityAPI.overrideAI(issue.id, {
        damageType,
        severity,
        priorityScore: parseInt(priorityScore),
        overrideReason: reason
      });
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to override AI: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Human-in-the-Loop AI Override</h3>
              <p className="text-[11px] text-slate-400 font-mono">Case: {issue.referenceCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Overridden Damage Classification</label>
            <select
              value={damageType}
              onChange={(e) => setDamageType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="POTHOLE">Pothole</option>
              <option value="ALLIGATOR_CRACKING">Alligator Cracking</option>
              <option value="LONGITUDINAL_CRACK">Longitudinal Crack</option>
              <option value="TRANSVERSE_CRACK">Transverse Crack</option>
              <option value="OPEN_INFRASTRUCTURE">Open Drain / Hazard</option>
              <option value="WATER_DAMAGE">Water Damage</option>
              <option value="ROAD_DEPRESSION">Road Depression</option>
              <option value="EDGE_DAMAGE">Edge Damage</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assessed Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Manual Priority (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={priorityScore}
                onChange={(e) => setPriorityScore(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Audit Justification & Reason</label>
            <textarea
              rows="3"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State why the AI classification or severity was modified..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Applying...' : 'Apply Human Override'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
