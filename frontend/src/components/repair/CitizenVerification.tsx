import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { useIncidents } from '../../context/IncidentContext';
import { DAMAGE_PHASE_2, DAMAGE_PHASE_4 } from '../../data/assets';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertCircle, ThumbsUp, ThumbsDown, Sparkles, ShieldCheck, XCircle, MapPin, Camera } from 'lucide-react';

export const CitizenVerification: React.FC = () => {
  const { selectedIncident, verifyCommunity, updateIncidentStatus } = useIncidents();
  const [hasVoted, setHasVoted] = useState(false);
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no' | null>(null);

  const handleVote = (choice: 'yes' | 'no') => {
    if (!selectedIncident) return;
    setHasVoted(true);
    setVoteChoice(choice);

    if (choice === 'yes') {
      verifyCommunity(selectedIncident.id, true);
      updateIncidentStatus(selectedIncident.id, 'VERIFIED');

      // Trigger Confetti Celebration
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
        colors: ['#00FF88', '#00E5FF', '#38BDF8', '#F59E0B']
      });
    } else {
      verifyCommunity(selectedIncident.id, false);
    }
  };

  const isVerified = selectedIncident?.status === 'VERIFIED' || (hasVoted && voteChoice === 'yes');

  return (
    <div className="mt-12 w-full max-w-3xl mx-auto">
      <GlassCard intensity="high" className="p-6 sm:p-8 border-[#00FF88]/30 shadow-2xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#00FF88] text-xs font-mono uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Section 23 &bull; Decentralized Verification</span>
        </div>

        {/* Section 23 Prompt Headline */}
        <h3 className="text-2xl sm:text-4xl font-black text-white">
          Did we actually fix it?
        </h3>

        <p className="mt-2 text-sm text-[#8EA4BC] max-w-md mx-auto">
          Municipal contractors submit photo proof. However, the ticket is only signed off when verified by local citizens who commute on Central Demo Road daily.
        </p>

        {/* Photo Proof Submission Card from Contractor */}
        <div className="mt-6 mb-6 rounded-2xl bg-[#080D1A] border border-white/10 p-3 sm:p-4 text-left">
          <div className="flex items-center justify-between text-xs font-mono mb-2.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#00FF88]" />
              Contractor Completed Work Audit
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-[#00FF88] border border-emerald-500/30 font-bold">
              GPS TIMESTAMP VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-white/10 group">
              <img
                src={DAMAGE_PHASE_2}
                alt="Initial Reported Damage"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-red-300 border border-red-500/30">
                INITIAL HAZARD &bull; 8.5cm Depth
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[16/10] border border-emerald-500/30 group">
              <img
                src={DAMAGE_PHASE_4}
                alt="Contractor Completed Work"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#00FF88] border border-emerald-500/30">
                REPAIRED SURFACE &bull; Hot-Mix Seal
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00FF88]" />
              Outer Ring Road &bull; Pillar 142 (17.4399° N, 78.3489° E)
            </span>
            <span className="text-emerald-400 font-bold">Jetpatcher Unit #GHMC-4</span>
          </div>
        </div>

        {/* Voting Action Buttons or Verified State */}
        {!isVerified && !hasVoted ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              variant="accent"
              onClick={() => handleVote('yes')}
              icon={<ThumbsUp className="w-4 h-4 ml-1" />}
            >
              YES — FIXED
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleVote('no')}
              icon={<ThumbsDown className="w-4 h-4 ml-1 text-slate-400" />}
            >
              STILL DAMAGED
            </Button>
          </div>
        ) : isVerified ? (
          <div className="mt-6 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-[#00FF88]" />
            </div>

            <div className="text-xl font-extrabold text-white font-mono">
              COMMUNITY VERIFIED &bull; INCIDENT RESOLVED
            </div>

            <p className="text-xs font-mono text-emerald-300 mt-2">
              Citizen consensus: 99.8% confirmed &bull; Municipal contractor SLA bonus unlocked
            </p>
          </div>
        ) : (
          <div className="mt-6 p-6 rounded-2xl bg-amber-950/40 border border-amber-500/40 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto mb-3 text-amber-400">
              <XCircle className="w-8 h-8" />
            </div>

            <div className="text-xl font-extrabold text-white font-mono">
              RE-INSPECTION ESCALATED
            </div>

            <p className="text-xs font-mono text-amber-300 mt-2">
              Citizen flagged residual damage &bull; Dispatch alerted for quality audit
            </p>
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-[#8EA4BC] font-mono">
          <span>Community Consensus: 99.8%</span>
          <span className="text-[#00FF88]">Closed-Loop Verification &bull; 100% Traceable</span>
        </div>
      </GlassCard>
    </div>
  );
};
