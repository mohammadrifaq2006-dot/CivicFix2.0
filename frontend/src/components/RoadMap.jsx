import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function RoadMap({
  issues = [],
  center = [17.42, 78.44],
  zoom = 12,
  onSelectIssue,
  isPicker = false,
  pickerLocation = null,
  onLocationChange = null,
  height = '500px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);
  const pickerMarkerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: pickerLocation ? [pickerLocation.lat, pickerLocation.lng] : center,
        zoom: zoom,
        zoomControl: true,
      });

      // CartoDB Positron clean map tiles (or OpenStreetMap)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      markerGroupRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;

      // Picker mode click handler
      if (isPicker && onLocationChange) {
        map.on('click', (e) => {
          onLocationChange(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers for Issues
  useEffect(() => {
    if (!mapInstanceRef.current || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    // In picker mode, show draggable pin
    if (isPicker && pickerLocation) {
      const customPickerIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            <div style="width: 24px; height: 24px; background: #16a34a; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
              <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
            </div>
            <div style="position: absolute; bottom: -6px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid #16a34a;"></div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38]
      });

      const pickerMarker = L.marker([pickerLocation.lat, pickerLocation.lng], {
        icon: customPickerIcon,
        draggable: true
      }).addTo(markerGroupRef.current);

      pickerMarker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (onLocationChange) onLocationChange(lat, lng);
      });

      pickerMarkerRef.current = pickerMarker;
      mapInstanceRef.current.setView([pickerLocation.lat, pickerLocation.lng], 15);
      return;
    }

    // Normal issues mode
    if (!issues || issues.length === 0) return;

    issues.forEach((issue) => {
      if (!issue.latitude || !issue.longitude) return;

      const sev = (issue.severity || 'MEDIUM').toUpperCase();
      let color = '#eab308'; // Medium yellow
      if (sev === 'CRITICAL') color = '#ef4444';
      else if (sev === 'HIGH') color = '#f97316';
      else if (sev === 'LOW') color = '#10b981';

      const isCritical = sev === 'CRITICAL';

      const customIcon = L.divIcon({
        className: 'custom-issue-marker',
        html: `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
            ${isCritical ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: ${color}; opacity: 0.35; animation: pulse-ring 2s infinite ease-out;"></div>` : ''}
            <div style="width: 26px; height: 26px; background: ${color}; border: 2.5px solid white; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: white;">
              ${issue.priorityScore || '!'}
            </div>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([issue.latitude, issue.longitude], { icon: customIcon });

      const popupHtml = `
        <div style="min-width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 700; font-size: 13px; color: #0f172a;">${issue.referenceCode}</span>
            <span style="background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">${sev}</span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">
            ${(issue.damageType || '').replace('_', ' ')}
          </div>
          <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0; line-height: 1.4;">
            ${issue.address || issue.roadName || 'Road Damage Location'}
          </p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 6px; margin-top: 6px;">
            <span style="font-size: 11px; color: #475569; font-weight: 600;">Priority: ${issue.priorityScore || 0}/100</span>
            <button id="view-issue-${issue.id}" style="background: #16a34a; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
              View Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-issue-${issue.id}`);
        if (btn && onSelectIssue) {
          btn.onclick = () => onSelectIssue(issue.id);
        }
      });

      marker.addTo(markerGroupRef.current);
    });

  }, [issues, isPicker, pickerLocation]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} style={{ height: height, width: '100%' }} />
      {/* Legend overlay */}
      {!isPicker && (
        <div className="absolute bottom-4 left-4 z-[500] bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-md text-xs space-y-1">
          <div className="font-bold text-slate-800 text-[11px] mb-1">Priority & Severity</div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="text-slate-700">Critical (76-100)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span>
            <span className="text-slate-700">High (51-75)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="text-slate-700">Medium (26-50)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="text-slate-700">Low (0-25)</span>
          </div>
        </div>
      )}
    </div>
  );
}
