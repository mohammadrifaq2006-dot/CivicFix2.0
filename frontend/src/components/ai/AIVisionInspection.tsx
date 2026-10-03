import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { REAL_POTHOLE_PRIMARY, REAL_ROAD_FISSURE } from '../../data/assets';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scan, 
  Camera, 
  Clock, 
  MapPin,
  Sparkles,
  Layers,
  FileCheck2
} from 'lucide-react';

export const AIVisionInspection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(REAL_POTHOLE_PRIMARY);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'REAL' | 'FAKE';
    authenticityScore: number;
    sensorSignature: string;
    details: string;
    ticketId: string;
  }>({
    status: 'REAL',
    authenticityScore: 99.2,
    sensorSignature: 'Sony IMX Mobile Sensor • Direct Hardware Bayer Matrix',
    details: 'Verified natural optical lens distortion and direct sensor grain. No synthetic diffusion or generative inpainting detected.',
    ticketId: 'TS-GHMC-2026-8492'
  });

  const handleRunScan = (imageType: 'REAL' | 'FAKE') => {
    setIsScanning(true);

    if (imageType === 'REAL') {
      setSelectedImage(REAL_POTHOLE_PRIMARY);
    } else {
      setSelectedImage(REAL_ROAD_FISSURE);
    }

    setTimeout(() => {
      setIsScanning(false);
      if (imageType === 'REAL') {
        setScanResult({
          status: 'REAL',
          authenticityScore: 99.4,
          sensorSignature: 'Smartphone CMOS Optical Sensor • Authentic GPS Metadata',
          details: 'Physical sunlight shadows and asphalt pebble depth validated. No generative AI artifacts detected.',
          ticketId: `TS-GHMC-2026-${Math.floor(1000 + Math.random() * 9000)}`
        });
      } else {
        setScanResult({
          status: 'FAKE',
          authenticityScore: 18.2,
          sensorSignature: 'Synthetic Generation Latent Space Detected • Diffusion Model',
          details: 'Repetitive fractal noise and non-physical asphalt lighting indicate AI synthetic generation. Flagged as non-genuine submission.',
          ticketId: 'FLAGGED-REJECTED'
        });
      }
    }, 1200);
  };

  return (
    <section id="section-ai-authenticity" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#070B12] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Spoofing &bull; Citizen Verification Filter</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            AI Real Image vs. Fake Image Detection
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            Before municipal crews are dispatched, our AI inspects camera sensor data to ensure the image is a genuine, authentic photo and not an AI-generated fake or internet composite.
          </p>
        </div>

        {/* Scan Inspection Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Viewport (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard intensity="high" className="p-4 sm:p-5 border-white/10">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-950 border border-white/10">
                <img
                  src={selectedImage}
                  alt="Road Inspection"
                  className="w-full h-full object-cover"
                />

                {/* Scanning Laser */}
                {isScanning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent animate-scan-beam pointer-events-none" />
                )}

                {/* Floating Authenticity Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl border text-xs font-mono font-bold ${
                    scanResult.status === 'REAL'
                      ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-lg'
                      : 'bg-red-950/80 border-red-500/40 text-red-300 shadow-lg'
                  }`}>
                    {scanResult.status === 'REAL' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>GENUINE REAL IMAGE ({scanResult.authenticityScore}%)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>SYNTHETIC AI FAKE FLAGGED</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] font-mono text-slate-300 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Hyderabad &bull; Telangana Highway Sector 4
                  </span>
                  <span className="text-emerald-400 font-bold">Authenticated</span>
                </div>
              </div>

              {/* Toggle Controls to test real vs fake */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRunScan('REAL')}
                    disabled={isScanning}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Test Real Camera Photo
                  </button>
                  <button
                    onClick={() => handleRunScan('FAKE')}
                    disabled={isScanning}
                    className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Test AI Synthetic Spoof
                  </button>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleRunScan('REAL')}
                  disabled={isScanning}
                  icon={<Scan className="w-3.5 h-3.5" />}
                >
                  {isScanning ? 'AUTHENTICATING...' : 'RE-AUTHENTICATE'}
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Municipal Confirmation & Intake (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {scanResult.status === 'REAL' ? (
              /* Problem Has Been Taken Card */
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#0A131F] to-[#070B12] border-2 border-emerald-500/40 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-2">
                  <FileCheck2 className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-1">
                    Official Municipal Intake
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    Problem has been taken, will be rectified soon.
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Your road complaint has been validated as a genuine physical hazard. It has been routed directly to the Telangana Roads &amp; Buildings / GHMC Rapid Maintenance Team for rectification.
                </p>

                <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/20 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tracking Reference:</span>
                    <span className="text-emerald-300 font-bold">{scanResult.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Guaranteed Action:</span>
                    <span className="text-white font-bold">Within 24 &ndash; 48 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Unit:</span>
                    <span className="text-cyan-300">GHMC Jetpatcher Unit #04</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SMS &amp; Web status tracking active for this ticket</span>
                </div>
              </div>
            ) : (
              /* Rejected Fake Warning */
              <div className="p-6 rounded-2xl bg-red-950/30 border-2 border-red-500/30 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-2">
                  <AlertTriangle className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-white">
                  Submission Blocked: Synthetic AI Image Detected
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {scanResult.details}
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-red-500/20 text-xs font-mono text-red-300">
                  Status: Fraudulent Submission Rejected &bull; No Crew Dispatched
                </div>
              </div>
            )}

            {/* Neural Authenticity Breakdown */}
            <div className="p-4 rounded-xl bg-[#0F1926]/80 border border-white/5 space-y-2 text-xs">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Sensor Signature Trace</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {scanResult.sensorSignature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
