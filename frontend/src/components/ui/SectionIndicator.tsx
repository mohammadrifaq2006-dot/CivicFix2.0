import React, { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'section-hero', label: '01', title: 'OVERVIEW' },
  { id: 'section-problem', label: '02', title: 'CITIZEN' },
  { id: 'section-video-guide', label: '03', title: 'VIDEO GUIDE' },
  { id: 'section-ai-authenticity', label: '04', title: 'AI AUTHENTICITY' },
  { id: 'section-fusion', label: '05', title: 'FUSION' },
  { id: 'section-accidents', label: '06', title: 'ACCIDENTS' },
  { id: 'section-command', label: '07', title: 'COMMAND' },
  { id: 'section-repair', label: '08', title: 'VERIFIED' },
  { id: 'section-impact', label: '09', title: 'IMPACT' },
];

export const SectionIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState('section-hero');

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.45) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 pointer-events-auto">
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="group flex items-center gap-2 text-right transition-all duration-300 focus:outline-none cursor-pointer"
            aria-label={`Scroll to ${sec.title}`}
          >
            <span
              className={`text-[9px] font-mono tracking-widest uppercase transition-all duration-300 ${
                isActive
                  ? 'text-emerald-400 font-bold translate-x-0 opacity-100'
                  : 'text-slate-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {sec.label} — {sec.title}
            </span>
            <div
              className={`rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-2 h-5 bg-emerald-400 shadow-md'
                  : 'w-1.5 h-1.5 bg-slate-700 group-hover:bg-slate-400'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
