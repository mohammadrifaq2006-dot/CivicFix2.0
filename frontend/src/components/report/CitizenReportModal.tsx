import React, { useState, useRef } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Button } from '../ui/Button';
import { MATCHING_POTHOLE_PRIMARY } from '../../data/assets';
import { 
  X, 
  Video, 
  Camera, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Upload, 
  AlertCircle, 
  ArrowRight,
  FileCheck2,
  Wrench,
  Play,
  RotateCcw
} from 'lucide-react';

export const CitizenReportModal: React.FC = () => {
  const { reportModalOpen, setReportModalOpen, createNewReport, addToast } = useIncidents();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image'>('image');
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [locationName, setLocationName] = useState('Outer Ring Road Service Road, Gachibowli Junction • Pillar 142');
  const [damageDescription, setDamageDescription] = useState('Deep pothole crater causing dangerous wheel rim fractures');
  
  // Property damage checklists
  const [propertyDamage, setPropertyDamage] = useState({
    rimDent: true,
    tyrePuncture: false,
    twoWheelerSpill: false,
    undercarriageScrape: false
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!reportModalOpen) return null;

  const handlePersonalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video') || file.name.match(/\.(mp4|mov|webm|mkv)$/i);
      setMediaType(isVideo ? 'video' : 'image');
      setVideoFileName(file.name);
      
      const fileUrl = URL.createObjectURL(file);
      setMediaPreview(fileUrl);
      addToast('Personal Media Loaded', `Loaded ${file.name} for evidence review.`, 'info');
    }
  };

  const handleUseSamplePothole = () => {
    setMediaType('image');
    setVideoFileName('pothole_evidence_sample.jpg');
    setMediaPreview(MATCHING_POTHOLE_PRIMARY);
  };

  const goToStep2 = () => {
    if (!mediaPreview) {
      handleUseSamplePothole();
    }
    setStep(2);
  };

  const goToStep3 = () => {
    setStep(3);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const generatedId = `TS-GHMC-${Math.floor(1000 + Math.random() * 9000)}`;
      setTicketId(generatedId);
    }, 1400);
  };

  const handleFinalSubmit = () => {
    createNewReport({
      location: locationName,
      damageType: 'Severe Pothole & Fissure',
      imageUrl: mediaPreview || MATCHING_POTHOLE_PRIMARY,
      description: damageDescription,
    });
    setStep(4);
  };

  const handleClose = () => {
    setReportModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setMediaPreview(null);
      setVideoFileName('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0E1524] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#131D30] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Report Road Hazard &amp; Property Damage</h3>
              <span className="text-[10px] font-mono text-emerald-400">STEP 0{step} OF 04 &bull; TELANGANA CITIZEN PORTAL</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* STEP 1: UPLOAD PERSONAL VIDEO / PHOTO */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h4 className="text-base font-extrabold text-white">Attach Your Personal Video Evidence</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upload personal smartphone or dashcam video (.mp4, .mov, .webm) or road photos to submit a validated complaint.
                </p>
              </div>

              {/* Upload & Embedded Video Player Display */}
              <div className="relative aspect-[16/10] rounded-2xl border-2 border-dashed border-white/20 bg-[#080D17] flex flex-col items-center justify-center overflow-hidden">
                {mediaPreview ? (
                  mediaType === 'video' ? (
                    <div className="w-full h-full relative bg-black flex flex-col items-center justify-center">
                      <video
                        src={mediaPreview}
                        controls
                        autoPlay
                        muted
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                        PERSONAL VIDEO &bull; {videoFileName}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <img src={mediaPreview} alt="Uploaded evidence" className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                        PHOTO EVIDENCE &bull; {videoFileName || 'Direct Capture'}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
                      <Video className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white">Upload Personal Road Video or Photo</span>
                    <span className="text-xs text-slate-400 mt-1">Supports MP4, MOV, WEBM, JPG, PNG up to 100MB</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs tracking-wide shadow-md hover:brightness-110 cursor-pointer"
                    >
                      Choose Video / Photo File
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*,image/*"
                      onChange={handlePersonalVideoUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-[#162032] border border-white/10 hover:border-emerald-500/30 text-xs font-semibold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{mediaPreview ? 'Change Personal Video' : 'Browse Local Video'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseSamplePothole}
                  className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] text-xs font-semibold text-slate-300 transition-all cursor-pointer"
                >
                  Use Sample Real Pothole Photo
                </button>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={goToStep2}
                  className="w-full"
                  icon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  NEXT: LOCATION &amp; PROPERTY DAMAGE
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & PROPERTY DAMAGE DETAILS */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h4 className="text-base font-extrabold text-white">Location &amp; Property Damage Details</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Record exact spot and specify any vehicular property damage caused by this pothole.
                </p>
              </div>

              {/* Location Input */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/10 space-y-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Road &amp; Nearest Landmark Location
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080D17] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Pothole / Road Damage Observations
                  </label>
                  <textarea
                    rows={2}
                    value={damageDescription}
                    onChange={(e) => setDamageDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080D17] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Dedicated Property Damage Checkboxes */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase mb-1">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>Property Damage Suffered / Witnessed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05]">
                    <input
                      type="checkbox"
                      checked={propertyDamage.rimDent}
                      onChange={(e) => setPropertyDamage({ ...propertyDamage, rimDent: e.target.checked })}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Wheel Rim Dent / Crack</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05]">
                    <input
                      type="checkbox"
                      checked={propertyDamage.tyrePuncture}
                      onChange={(e) => setPropertyDamage({ ...propertyDamage, tyrePuncture: e.target.checked })}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Tyre Blowout / Sidewall Cut</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05]">
                    <input
                      type="checkbox"
                      checked={propertyDamage.twoWheelerSpill}
                      onChange={(e) => setPropertyDamage({ ...propertyDamage, twoWheelerSpill: e.target.checked })}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Two-Wheeler Skid / Spill</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05]">
                    <input
                      type="checkbox"
                      checked={propertyDamage.undercarriageScrape}
                      onChange={(e) => setPropertyDamage({ ...propertyDamage, undercarriageScrape: e.target.checked })}
                      className="accent-emerald-500 rounded"
                    />
                    <span>Bumper / Undercarriage Damage</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={() => setStep(1)} className="w-1/3">
                  BACK
                </Button>
                <Button variant="primary" size="md" onClick={goToStep3} className="w-2/3" icon={<ShieldCheck className="w-4 h-4" />}>
                  RUN AI AUTHENTICITY CHECK
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: AI AUTHENTICITY VALIDATION */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <h4 className="text-base font-extrabold text-white">AI Real Camera Verification</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Validating physical camera sensor noise against generative AI manipulation.
                </p>
              </div>

              {isVerifying ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-emerald-300">ANALYZING SENSOR DEPTH &amp; OPTICAL METADATA...</span>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-emerald-300">
                        GENUINE CAMERA CAPTURE VERIFIED &bull; 99.4%
                      </div>
                      <div className="text-xs text-white font-semibold">
                        Real physical road pothole authenticated
                      </div>
                    </div>
                  </div>

                  {/* Clear Municipal Notice */}
                  <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 text-center space-y-1">
                    <h5 className="text-base font-black text-white">
                      Problem has been taken, will be rectified soon.
                    </h5>
                    <p className="text-xs text-slate-300">
                      Dispatched to GHMC / Telangana R&amp;B Rapid Pothole Rectification Wing.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" size="md" onClick={() => setStep(2)} className="w-1/3">
                  BACK
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinalSubmit}
                  disabled={isVerifying}
                  className="w-2/3"
                  icon={<FileCheck2 className="w-4 h-4 ml-1" />}
                >
                  CONFIRM &amp; LOG COMPLAINT
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>

              <h4 className="text-xl font-black text-white">
                Complaint Registered with Telangana Municipal R&amp;B
              </h4>

              <div className="p-4 rounded-2xl bg-[#111827] border border-white/10 text-xs font-mono max-w-sm mx-auto text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Complaint Reference:</span>
                  <span className="text-emerald-400 font-bold">{ticketId || 'TS-GHMC-8492'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Rectification:</span>
                  <span className="text-white font-bold">Within 24 &ndash; 48 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Crew:</span>
                  <span className="text-cyan-300">Jetpatcher Unit #04</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Problem has been taken, will be rectified soon. You can use the AI Chatbot at any time to check real-time progress on this complaint ID.
              </p>

              <div className="pt-2">
                <Button variant="primary" size="md" onClick={handleClose} className="w-full">
                  DONE
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
