import React, { useState, useEffect } from 'react';
import { issueAPI, adminAPI } from '../services/api';
import RoadMap from '../components/RoadMap';
import { 
  ShieldAlert, 
  MapPin, 
  ArrowRight, 
  Cpu, 
  Layers, 
  CheckCircle, 
  Sparkles, 
  Activity, 
  Eye, 
  Check, 
  Users, 
  AlertTriangle,
  Play
} from 'lucide-react';

export default function LandingPage({ setActivePage, setSelectedIssueId }) {
  const [mapIssues, setMapIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, analyticsRes] = await Promise.all([
        issueAPI.getMapIssues(),
        adminAPI.getAnalytics()
      ]);
      setMapIssues(issuesRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (e) {
      // fallback
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-emerald-400 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Assisted Municipal Road Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            See It. Report It. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Fix It.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn fragmented citizen road observations into actionable, explainable, and trackable municipal maintenance intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('report')}
              className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-7 py-3.5 rounded-xl font-bold text-base shadow-lg shadow-brand-600/30 transition hover:scale-105 active:scale-95"
            >
              <span>Report Road Damage</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActivePage('map')}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3.5 rounded-xl font-bold text-base backdrop-blur transition"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Explore Live Map</span>
            </button>
          </div>

          {/* Quick Hackathon Demo Bar */}
          <div className="pt-8">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl text-xs backdrop-blur">
              <span className="text-slate-400 font-medium">⚡ Hackathon Demo Journey:</span>
              <span className="text-emerald-400 font-semibold">1. Citizen Reports</span>
              <span className="text-slate-600">→</span>
              <span className="text-blue-400 font-semibold">2. AI Vision & Priority 87/100</span>
              <span className="text-slate-600">→</span>
              <span className="text-purple-400 font-semibold">3. Duplicate Merged</span>
              <span className="text-slate-600">→</span>
              <span className="text-amber-400 font-semibold">4. Officer Repairs & Citizen Confirms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 text-brand-600 mr-2" />
                Live Civic Road Damage Hotspots
              </h3>
              <p className="text-xs text-slate-500">Real-time geospatial damage tracking across municipal jurisdictions</p>
            </div>
            <button
              onClick={() => setActivePage('map')}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>Open Full Interactive Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <RoadMap 
            issues={mapIssues} 
            onSelectIssue={(id) => {
              setSelectedIssueId(id);
              setActivePage('issue-detail');
            }}
            height="440px"
          />
        </div>
      </section>

      {/* The 3 "WOW" Differentiators Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-brand-600 uppercase font-mono">Platform Differentiators</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2">Beyond Basic Complaint Portals</h3>
          <p className="text-sm text-slate-500 mt-2">CivicRoad AI delivers intelligent triage, explainable algorithms, and automated municipal operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WOW 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-600 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">1. AI Road Health Intelligence</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Dynamically computes an explainable <strong>Road Health Index (0–100)</strong> for every area and road segment based on unresolved cavities, traffic exposure, and repair frequency.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Demo Zone A Health:</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">72 / 100</span>
            </div>
          </div>

          {/* WOW 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">2. Community Evidence Fusion</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Detects duplicate reports within 150m and fuses multiple citizen observations into <strong>one single actionable maintenance task</strong>, preserving citizen attribution and multiple photo angles.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Duplicates Reduced:</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">24.5% Queue Reduction</span>
            </div>
          </div>

          {/* WOW 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">3. Explainable Priority (0–100)</h4>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Never a black box. Displays transparent mathematical factors: Severity (+30), Arterial Road (+20), 4 Reports (+12), Near Hospital (+15), and SLA Aging (+7) = <strong>84/100 CRITICAL</strong>.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Decision Model:</span>
              <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Transparent Formula</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works 6-Step Lifecycle */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-emerald-400 uppercase font-mono">The Complete Lifecycle</h2>
          <h3 className="text-3xl font-extrabold text-white mt-2">From Citizen Camera to Verified Asphalt</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
          {[
            { step: '1. Capture', desc: 'Citizen snaps damage photo & GPS' },
            { step: '2. Understand', desc: 'CV detects pothole & crack depth' },
            { step: '3. Fuse', desc: 'Clusters duplicate nearby reports' },
            { step: '4. Prioritize', desc: 'Computes explainable 0-100 score' },
            { step: '5. Repair', desc: 'Officer uploads after-repair evidence' },
            { step: '6. Verify', desc: 'Citizen confirms repair or auto-reopens' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto mb-3">
                {idx + 1}
              </div>
              <h5 className="font-bold text-sm text-white">{item.step}</h5>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-900">Ready to Improve Your City's Roads?</h3>
        <p className="text-sm text-slate-500">Every report directly assists municipal work crews in prioritizing urgent road repairs.</p>
        <button
          onClick={() => setActivePage('report')}
          className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-brand-600/20 transition active:scale-95"
        >
          <span>Submit Road Damage Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
