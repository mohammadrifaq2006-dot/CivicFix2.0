import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';
import RoadMap from '../components/RoadMap';
import { 
  Filter, 
  Search, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Layers, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function LiveMapPage({ setActivePage, setSelectedIssueId }) {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [damageFilter, setDamageFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await issueAPI.getMapIssues();
      setIssues(res.data || []);
      setFilteredIssues(res.data || []);
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...issues];

    if (statusFilter !== 'ALL') {
      result = result.filter(i => i.status?.toUpperCase() === statusFilter);
    }
    if (severityFilter !== 'ALL') {
      result = result.filter(i => i.severity?.toUpperCase() === severityFilter);
    }
    if (damageFilter !== 'ALL') {
      result = result.filter(i => i.damageType?.toUpperCase() === damageFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(i => 
        (i.referenceCode && i.referenceCode.toLowerCase().includes(s)) ||
        (i.address && i.address.toLowerCase().includes(s)) ||
        (i.roadName && i.roadName.toLowerCase().includes(s)) ||
        (i.damageType && i.damageType.toLowerCase().includes(s))
      );
    }

    setFilteredIssues(result);
  }, [statusFilter, severityFilter, damageFilter, search, issues]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center">
            <MapPin className="w-6 h-6 text-brand-600 mr-2" />
            Civic Road Damage Geospatial Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time interactive incident map with automated severity and priority indicators
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <span>Active Issues on Map:</span>
          <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg">{filteredIssues.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code, road, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">🔴 Critical</option>
          <option value="HIGH">🟠 High</option>
          <option value="MEDIUM">🟡 Medium</option>
          <option value="LOW">🟢 Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="REPORTED">Reported</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REPAIR_COMPLETED">Awaiting Confirmation</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ESCALATED">⚠ Escalated</option>
        </select>

        {/* Damage Type Filter */}
        <select
          value={damageFilter}
          onChange={(e) => setDamageFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
        >
          <option value="ALL">All Damage Types</option>
          <option value="POTHOLE">Pothole</option>
          <option value="ALLIGATOR_CRACKING">Alligator Cracking</option>
          <option value="OPEN_INFRASTRUCTURE">Open Drain / Hazard</option>
          <option value="WATER_DAMAGE">Water Damage</option>
          <option value="ROAD_DEPRESSION">Road Depression</option>
        </select>
      </div>

      {/* Main Map + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map (2 cols) */}
        <div className="lg:col-span-2">
          <RoadMap 
            issues={filteredIssues}
            onSelectIssue={(id) => {
              setSelectedIssueId(id);
              setActivePage('issue-detail');
            }}
            height="620px"
          />
        </div>

        {/* Sidebar Issue Feed (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col h-[620px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Filtered Incident Queue</h3>
            <span className="text-[11px] text-slate-400 font-mono">{filteredIssues.length} cases</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 mt-2">
            {filteredIssues.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                No road issues match the selected filters.
              </div>
            ) : (
              filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  onClick={() => {
                    setSelectedIssueId(issue.id);
                    setActivePage('issue-detail');
                  }}
                  className="py-3 px-2 hover:bg-slate-50 rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-brand-600 transition">
                      {issue.referenceCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      issue.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      issue.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                      issue.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-700 mt-1">
                    {issue.damageType?.replace('_', ' ')}
                  </p>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {issue.address || issue.roadName || 'City road'}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px]">
                    <span className="font-bold text-slate-700">
                      Priority: {issue.priorityScore}/100
                    </span>
                    <span className="font-semibold text-brand-600 flex items-center group-hover:translate-x-0.5 transition">
                      Details <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
