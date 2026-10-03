import React, { useState } from 'react';
import { authorityAPI } from '../services/api';
import { X, Wrench, Upload, Camera } from 'lucide-react';

export default function RepairModal({ issue, onClose, onSuccess }) {
  const [materialsUsed, setMaterialsUsed] = useState('Dense Bituminous Macadam (DBM) hot-mix asphalt + tack coat');
  const [costEstimate, setCostEstimate] = useState('18500');
  const [inspectionNotes, setInspectionNotes] = useState('Repaired cavity, compacted base with vibratory roller, sealed perimeter.');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop');
  const [submitting, setSubmitting] = useState(false);

  if (!issue) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('materialsUsed', materialsUsed);
      formData.append('costEstimate', parseFloat(costEstimate) || 0.0);
      formData.append('inspectionNotes', inspectionNotes);
      if (file) {
        formData.append('afterImage', file);
      }
      await authorityAPI.submitRepair(issue.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to submit repair: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload After-Repair Evidence</h3>
              <p className="text-[11px] text-slate-400 font-mono">Case: {issue.referenceCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Photo Preview / Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">After-Repair Photograph</label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 overflow-hidden group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              {preview ? (
                <div className="space-y-2">
                  <img src={preview} alt="Repaired road" className="h-36 w-full object-cover rounded-xl" />
                  <span className="text-[10px] text-brand-600 font-semibold">Click or drop to replace image</span>
                </div>
              ) : (
                <div className="py-4">
                  <Camera className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-500 font-medium">Select after-repair photo</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Materials Used</label>
            <input
              type="text"
              value={materialsUsed}
              onChange={(e) => setMaterialsUsed(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cost Estimate (₹ / INR)</label>
              <input
                type="number"
                value={costEstimate}
                onChange={(e) => setCostEstimate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target State</label>
              <input
                type="text"
                disabled
                value="Awaiting Citizen Confirmation"
                className="w-full px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Inspection Notes</label>
            <textarea
              rows="2"
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit & Notify Citizen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
