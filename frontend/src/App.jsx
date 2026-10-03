import React, { useState } from 'react';
import { IncidentProvider } from './context/IncidentContext';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Preloader } from './components/layout/Preloader';
import { Navbar } from './components/layout/Navbar';
import { SectionIndicator } from './components/ui/SectionIndicator';
import { HeroSection } from './components/hero/HeroSection';
import { ProblemSection } from './components/problem/ProblemSection';
import { PotholeRepairEngineeringGuide } from './components/guide/PotholeRepairEngineeringGuide';
import { AIVisionInspection } from './components/ai/AIVisionInspection';
import { IncidentFusion } from './components/problem/IncidentFusion';
import { SmartCityMap } from './components/map/SmartCityMap';
import { CommandCenter } from './components/command/CommandCenter';
import { BeforeAfterSlider } from './components/repair/BeforeAfterSlider';
import { CitizenVerification } from './components/repair/CitizenVerification';
import { ImpactStats } from './components/impact/ImpactStats';
import { CinematicFooter } from './components/footer/CinematicFooter';
import { IncidentDetailDrawer } from './components/command/IncidentDetailDrawer';
import { CitizenReportModal } from './components/report/CitizenReportModal';
import { CivicChatbot } from './components/chat/CivicChatbot';
import { ToastSystem } from './components/ui/ToastSystem';
import { DemoControlBar } from './components/demo/DemoControlBar';
import { Wrench, MessageSquare } from 'lucide-react';

function PrototypeContent() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-[#050811] text-[#F8FAFC] selection:bg-[#00FF88] selection:text-black">
      {/* 2-Second Initializing Screen */}
      {!loadingComplete && (
        <Preloader onComplete={() => setLoadingComplete(true)} />
      )}

      {/* Floating Section Progress Indicator */}
      <SectionIndicator />

      {/* Top Navigation */}
      <Navbar onOpenChat={() => setChatOpen(true)} />

      {/* Main Flow */}
      <main>
        {/* 01: Hero Section */}
        <HeroSection />

        {/* 02: Problem Statement with Real Citizen Signals */}
        <ProblemSection />

        {/* 03: Pothole Repair & Restoration Engineering Guide (Glitch-Free) */}
        <PotholeRepairEngineeringGuide />

        {/* 04: AI Real Image vs. Fake Image Authenticity Check */}
        <AIVisionInspection />

        {/* 05: Multi-Angle Matching Incident Fusion */}
        <IncidentFusion />

        {/* 06: Smart-City Spatial Vector Map */}
        <SmartCityMap />

        {/* 07: Pothole & Property Damage Command Console */}
        <CommandCenter />

        {/* 08: Physical Repair Inspection & Citizen Verification */}
        <section id="section-repair" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#080E1B] border-t border-white/[0.08]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-4">
                <Wrench className="w-3.5 h-3.5" />
                <span>Physical Execution &bull; Public Quality Audit</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Resolution &amp; Community Verification
              </h2>

              <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                The feedback loop never ends at municipal paperwork. Citizens inspect the physical asphalt repair, closing the circle of civic accountability.
              </p>
            </div>

            {/* Before/After Split Comparison */}
            <BeforeAfterSlider />

            {/* Citizen Consensus Voting */}
            <CitizenVerification />
          </div>
        </section>

        {/* 09: Verified Impact Statistics */}
        <ImpactStats />
      </main>

      {/* Closing Frame */}
      <CinematicFooter />

      {/* Floating Chatbot Bubble (Bottom Right) */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
          aria-label="Open CivicRoad Assistant"
        >
          <MessageSquare className="w-5 h-5 text-slate-950" />
          <span className="text-xs font-mono font-extrabold hidden sm:inline">AI Road Assistant</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
        </button>
      )}

      {/* Automated Civic Chatbot Window */}
      <CivicChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Drawers, Modals & Toast System */}
      <IncidentDetailDrawer />
      <CitizenReportModal />
      <ToastSystem />
      <DemoControlBar />
    </div>
  );
}

export default function App() {
  return (
    <IncidentProvider>
      <PrototypeContent />
    </IncidentProvider>
  );
}
