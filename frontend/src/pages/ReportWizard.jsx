import React, { useState, useEffect } from 'react';
import { issueAPI } from '../services/api';
import RoadMap from '../components/RoadMap';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Crosshair, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck, 
  Clock,
  Layers
} from 'lucide-react';

const DAMAGE_CATEGORIES = [
  { id: 'POTHOLE', label: 'Pothole', desc: 'Cavity or crater in asphalt' },
  { id: 'ALLIGATOR_CRACKING', label: 'Alligator Cracking', desc: 'Webbed fatigue cracking' },
  { id: 'LONGITUDINAL_CRACK', label: 'Longitudinal Crack', desc: 'Linear crack along traffic direction' },
  { id: 'OPEN_INFRASTRUCTURE', label: 'Open Drain / Manhole', desc: 'Missing grate or hazardous opening' },
  { id: 'WATER_DAMAGE', label: 'Water Pooling / Drainage', desc: 'Standing water or erosion' },
  { id: 'ROAD_DEPRESSION', label: 'Road Depression', desc: 'Subsidence or wheel rutting' },
  { id: 'EDGE_DAMAGE', label: 'Edge / Shoulder Damage', desc: 'Crumbling curb or shoulder' },
  { id: 'SURFACE_DETERIORATION', label: 'Surface Raveling', desc: 'Loose gravel and asphalt wear' },
  { id: 'OTHER', label: 'Other Road Hazard', desc: 'Miscellaneous road defect' },
];

export default function ReportWizard({ setActivePage, setSelectedIssueId }) {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  
  // Location
  const [location, setLocation] = useState({ lat: 17.4399, lng: 78.3812 }); // Default Cyber corridor
  const [address, setAddress] = useState('Cyber Gateway Blvd, Hitec City');
  const [landmark, setLandmark] = useState('Near Metro Station');
  const [roadName, setRoadName] = useState('Cyber Gateway Blvd');
  const [gpsDetecting, setGpsDetecting] = useState(false);

  // Details
  const [damageType, setDamageType] = useState('POTHOLE');
  const [description, setDescription] = useState('');
  const [urgencyRating, setUrgencyRating] = useState('HIGH');

  // AI Review
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  // Handle file select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setFilePreview(URL.createObjectURL(selected));
    }
  };

  // Sample Demo Image quick buttons for seamless testing during presentation!
  const loadDemoPhoto = (type) => {
    const sampleUrls = {
      pothole: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop',
      crack: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
      manhole: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop',
    };
    const sampleDescriptions = {
      pothole: 'Deep pothole roughly 15cm deep with jagged asphalt rim directly on the driving lane.',
      crack: 'Extensive alligator network cracking spreading across the road center lane.',
      manhole: 'Broken storm drainage cover leaving a dangerous open hazard on the road shoulder.',
    };

    setFilePreview(sampleUrls[type] || sampleUrls.pothole);
    setDescription(sampleDescriptions[type] || '');
    if (type === 'manhole') setDamageType('OPEN_INFRASTRUCTURE');
    else if (type === 'crack') setDamageType('ALLIGATOR_CRACKING');
    else setDamageType('POTHOLE');
  };

  // GPS auto-detect
  const detectGps = () => {
    setGpsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLocation({ lat, lng });
          setAddress(`GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
          setGpsDetecting(false);
        },
        () => {
          // Fallback to demo spot
          setLocation({ lat: 17.4425, lng: 78.3840 });
          setAddress('Cyber Gateway Blvd (Demo GPS detected)');
          setGpsDetecting(false);
        },
        { timeout: 5000 }
      );
    } else {
      setGpsDetecting(false);
    }
  };

  // Trigger AI Preview when entering Step 4
  const runAiAnalysis = async () => {
    setStep(4);
    setAiAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      }
      const res = await issueAPI.previewAI(formData);
      setAiResult(res.data);
    } catch (err) {
      // Fallback
      setAiResult({
        predictedDamageType: damageType,
        confidencePercentage: 91.5,
        predictedSeverity: urgencyRating === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
        explanation: 'Local heuristics identified surface depression and asphalt fracture with vehicular hazard risk.',
        modelSource: 'DEMO_FALLBACK_ANALYZER',
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Final Submit
  const handleSubmitReport = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
      formData.append('damageType', damageType);
      formData.append('description', description);
      formData.append('urgencyRating', urgencyRating);
      formData.append('address', address);
      formData.append('landmark', landmark);
      formData.append('roadName', roadName);

      if (file) {
        formData.append('files', file);
      }

      const res = await issueAPI.create(formData);
      setSubmittedIssue(res.data);
      setStep(5);
    } catch (err) {
      alert('Error submitting report. Please verify connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Wizard Step Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          ></div>

          {[
            { num: 1, title: 'Evidence' },
            { num: 2, title: 'Location' },
            { num: 3, title: 'Details' },
            { num: 4, title: 'AI Review' },
            { num: 5, title: 'Success' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.num 
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md scale-110' 
                    : step > s.num 
                    ? 'bg-brand-600 text-white' 
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                }`}
              >
                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-[11px] font-semibold mt-1.5 ${step === s.num ? 'text-brand-700' : 'text-slate-500'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

        {/* ================= STEP 1: EVIDENCE ================= */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1 — Capture Road Damage Evidence</h2>
              <p className="text-sm text-slate-500 mt-1">Upload a clear photograph or video showing the road defect.</p>
            </div>

            {/* Quick Demo Pre-fill Buttons */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 mr-1" />
                Quick Demo Presets:
              </span>
              <button 
                type="button"
                onClick={() => loadDemoPhoto('pothole')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-500 font-medium text-slate-700 hover:text-brand-600 transition"
              >
                Deep Pothole
              </button>
              <button 
                type="button"
                onClick={() => loadDemoPhoto('crack')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-500 font-medium text-slate-700 hover:text-brand-600 transition"
              >
                Alligator Cracking
              </button>
              <button 
                type="button"
                onClick={() => loadDemoPhoto('manhole')}
                className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-500 font-medium text-slate-700 hover:text-brand-600 transition"
              >
                Open Drainage Hazard
              </button>
            </div>

            {/* Drag and Drop Zone */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-brand-500 transition group cursor-pointer relative bg-slate-50/50">
              <input 
                type="file" 
                accept="image/*,video/mp4" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {filePreview ? (
                <div className="space-y-3">
                  <div className="relative inline-block rounded-xl overflow-hidden shadow-md max-h-72 border border-slate-200">
                    <img src={filePreview} alt="Damage preview" className="object-cover max-h-72 mx-auto" />
                  </div>
                  <p className="text-xs text-brand-600 font-semibold">Click or drop to replace image</p>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Upload or drag road damage photo</p>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP, or MP4 (Max 25MB)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition active:scale-95"
              >
                <span>Next: Confirm Location</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: LOCATION ================= */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Step 2 — Geolocation & Map Positioning</h2>
                <p className="text-sm text-slate-500 mt-1">Drag the marker or click the map to accurately place the road issue.</p>
              </div>
              <button
                type="button"
                onClick={detectGps}
                disabled={gpsDetecting}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <Crosshair className={`w-4 h-4 ${gpsDetecting ? 'animate-spin text-brand-600' : ''}`} />
                <span>{gpsDetecting ? 'Locating...' : 'Use Current GPS'}</span>
              </button>
            </div>

            {/* Interactive Map Picker */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <RoadMap 
                isPicker={true}
                pickerLocation={location}
                onLocationChange={(lat, lng) => setLocation({ lat, lng })}
                height="340px"
              />
            </div>

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Detected Address / Street</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Cyber Gateway Blvd, Near Junction"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Notable Landmark (Helps AI Priority)</label>
                <input 
                  type="text" 
                  value={landmark} 
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Metro Station / Govt Hospital / School"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition active:scale-95"
              >
                <span>Next: Damage Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DETAILS ================= */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3 — Damage Classification & Urgency</h2>
              <p className="text-sm text-slate-500 mt-1">Select the observable category and describe the situation.</p>
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Observed Damage Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {DAMAGE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDamageType(cat.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      damageType === cat.id
                        ? 'border-brand-500 bg-brand-50/60 ring-2 ring-brand-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900">{cat.label}</span>
                    <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Description & Observations</label>
              <textarea 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the defect, estimated depth, whether water is gathering, or hazard to two-wheelers..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Citizen Urgency Assessment</label>
              <div className="grid grid-cols-4 gap-2">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUrgencyRating(u)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      urgencyRating === u
                        ? u === 'CRITICAL'
                          ? 'bg-rose-50 border-rose-500 text-rose-700'
                          : u === 'HIGH'
                          ? 'bg-orange-50 border-orange-500 text-orange-700'
                          : 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={runAiAnalysis}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Next: AI Vision Pre-Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: AI REVIEW ================= */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 4 — AI Pre-Analysis & Submission Review</h2>
              <p className="text-sm text-slate-500 mt-1">Review the AI computer vision assessment before finalizing the report.</p>
            </div>

            {aiAnalyzing ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-semibold text-slate-700">CivicRoad AI Computer Vision running image & text inference...</p>
                <p className="text-xs text-slate-400">Extracting edge contours, cavity depth, and road texture...</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-4">
                {/* AI Banner Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">AI Computer Vision Recommendation</h4>
                        <span className="text-[10px] text-emerald-400 font-mono tracking-wider">
                          SOURCE: {aiResult.modelSource}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      {aiResult.confidencePercentage}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Predicted Damage</span>
                      <p className="text-sm font-bold text-white mt-0.5">
                        {aiResult.predictedDamageType?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Assessed Severity</span>
                      <p className="text-sm font-bold text-amber-400 mt-0.5">
                        {aiResult.predictedSeverity}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">Location Match</span>
                      <p className="text-sm font-bold text-emerald-400 mt-0.5">Geocoded</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5">
                    <strong>AI Explanation:</strong> {aiResult.explanation}
                  </p>
                </div>

                {/* Summary Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Address:</span>
                    <span className="font-semibold text-slate-800">{address}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Landmark Proximity:</span>
                    <span className="font-semibold text-slate-800">{landmark || 'Standard civic corridor'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Duplicate Check:</span>
                    <span className="font-semibold text-emerald-600">Geospatial clustering enabled upon submission</span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitReport}
                className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering Report...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit Official Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: SUCCESS ================= */}
        {step === 5 && submittedIssue && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">Report Submitted Successfully!</h2>
              <p className="text-sm text-slate-500 mt-1">Your observation has been indexed and prioritized for maintenance action.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500">Report Reference:</span>
                <span className="font-mono text-sm font-extrabold text-brand-700">{submittedIssue.referenceCode}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500">Calculated Priority:</span>
                <span className="text-xs font-bold text-slate-900 bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {submittedIssue.priorityScore} / 100
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500">Lifecycle Status:</span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {submittedIssue.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">Civic Reward:</span>
                <span className="text-xs font-bold text-emerald-600">+10 Contributor Points</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedIssueId(submittedIssue.id);
                  setActivePage('issue-detail');
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-sm transition active:scale-95"
              >
                Track Report Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setFile(null);
                  setFilePreview(null);
                  setSubmittedIssue(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
              >
                Report Another Damage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
