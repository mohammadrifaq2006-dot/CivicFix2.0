import React, { useState, useEffect } from 'react';
import { useIncidents } from '../../context/IncidentContext';
import { Button } from '../ui/Button';
import { ShieldCheck, Plus, Wrench, AlertTriangle, MessageSquare, Radio } from 'lucide-react';

interface NavbarProps {
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat }) => {
  const { setReportModalOpen } = useIncidents();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F17]/95 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-xl'
          : 'bg-[#0B0F17]/60 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => scrollTo('section-hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 via-teal-600/30 to-cyan-500/20 border border-emerald-400/40 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">CivicRoad</span>
            </div>
            <span className="text-[9px] tracking-widest text-slate-400 uppercase hidden sm:block">
              Telangana Road Infrastructure System
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => scrollTo('section-problem')}
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Citizen
          </button>
          <button
            onClick={() => scrollTo('section-video-guide')}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>Repair Guide</span>
          </button>
          <button
            onClick={() => scrollTo('section-ai-authenticity')}
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Real Image AI
          </button>
          <button
            onClick={() => scrollTo('section-fusion')}
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Evidence Fusion
          </button>
          <button
            onClick={() => scrollTo('section-command')}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Potholes &amp; Damage</span>
          </button>
          <button
            onClick={() => scrollTo('section-impact')}
            className="text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Impact
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Live System Operational Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-medium tracking-wider text-emerald-400 uppercase">
              GHMC &bull; Active
            </span>
          </div>

          {/* AI Chatbot Launcher Button */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 text-xs font-semibold transition-all cursor-pointer"
              title="Open Automated Civic Assistant"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AI Help</span>
            </button>
          )}

          {/* Primary Report CTA - High-end Emerald Green */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs tracking-wide shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span>Report Damage</span>
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 cursor-pointer"
            aria-label="Toggle Mobile Menu"
          >
            <Radio className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 px-4 py-4 bg-[#111827]/98 backdrop-blur-2xl border-b border-white/10 space-y-3 animate-in fade-in">
          <button
            onClick={() => scrollTo('section-problem')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-emerald-400"
          >
            Citizen Portal
          </button>
          <button
            onClick={() => scrollTo('section-video-guide')}
            className="block w-full text-left py-2 text-sm font-semibold text-emerald-400"
          >
            Repair Guide
          </button>
          <button
            onClick={() => scrollTo('section-ai-authenticity')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-cyan-400"
          >
            Real Image AI Verification
          </button>
          <button
            onClick={() => scrollTo('section-fusion')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-emerald-400"
          >
            Evidence Fusion
          </button>
          <button
            onClick={() => scrollTo('section-command')}
            className="block w-full text-left py-2 text-sm font-semibold text-amber-300"
          >
            Potholes &amp; Property Damage
          </button>
          <button
            onClick={() => scrollTo('section-impact')}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-200 hover:text-white"
          >
            Impact
          </button>
          {onOpenChat && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="block w-full text-left py-2 text-sm font-semibold text-emerald-300"
            >
              Open AI Citizen Chatbot
            </button>
          )}
        </div>
      )}
    </header>
  );
};
