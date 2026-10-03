import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RoadIncident, IncidentStatus, ToastMessage, DemoStep } from '../types';
import { INITIAL_INCIDENTS } from '../data/mockIncidents';
import { soundService } from '../services/soundService';

interface IncidentContextType {
  incidents: RoadIncident[];
  selectedIncident: RoadIncident | null;
  setSelectedIncident: (incident: RoadIncident | null) => void;
  selectedZone: string | null;
  setSelectedZone: (zone: string | null) => void;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  assignTeam: (id: string, team: { id: string; name: string; crewSize: number; etaMinutes: number }) => void;
  verifyCommunity: (id: string, isFixed: boolean) => void;
  createNewReport: (data: { location: string; damageType: string; imageUrl?: string; description?: string }) => RoadIncident;
  resetAllData: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'ai') => void;
  removeToast: (id: string) => void;

  // Sound
  soundEnabled: boolean;
  toggleSound: () => void;

  // Modals & Panels
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  incidentDrawerOpen: boolean;
  setIncidentDrawerOpen: (open: boolean) => void;

  // Demo Mode
  isDemoRunning: boolean;
  isDemoPaused: boolean;
  demoStepIndex: number;
  demoStep: DemoStep;
  demoProgress: number; // 0 - 100
  startDemo: () => void;
  pauseDemo: () => void;
  resumeDemo: () => void;
  skipDemoStep: () => void;
  restartDemo: () => void;
  stopDemo: () => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

const DEMO_STEPS: { step: DemoStep; label: string; duration: number }[] = [
  { step: 'HERO', label: '01 / SYSTEM OVERVIEW', duration: 7000 },
  { step: 'REPORT', label: '02 / CITIZEN REPORTING', duration: 8000 },
  { step: 'AI_ANALYSIS', label: '03 / NEURAL VISION SCAN', duration: 9000 },
  { step: 'FUSION', label: '04 / MULTI-REPORT FUSION', duration: 9000 },
  { step: 'PRIORITY', label: '05 / CIVIC RISK ENGINE', duration: 8000 },
  { step: 'COMMAND_CENTER', label: '06 / MUNICIPAL DISPATCH', duration: 9000 },
  { step: 'REPAIR', label: '07 / INFRASTRUCTURE REPAIR', duration: 9000 },
  { step: 'VERIFICATION', label: '08 / COMMUNITY VERIFICATION', duration: 9000 },
  { step: 'IMPACT', label: '09 / CITY-WIDE IMPACT', duration: 7000 },
];

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<RoadIncident[]>(() => {
    return JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
  });
  const [selectedIncident, setSelectedIncident] = useState<RoadIncident | null>(() => incidents[0] || null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundService.isEnabled());
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [incidentDrawerOpen, setIncidentDrawerOpen] = useState(false);

  // Demo states
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [demoProgress, setDemoProgress] = useState(0);

  const addToast = useCallback((title: string, message: string, type: 'info' | 'success' | 'warning' | 'ai' = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-3), { id, title, message, type, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundService.setEnabled(next);
    if (next) soundService.playSuccess();
    addToast(next ? 'Sound Enabled' : 'Sound Muted', next ? 'Subtle synthesizer feedback active' : 'Audio muted', 'info');
  }, [soundEnabled, addToast]);

  const updateIncidentStatus = useCallback((id: string, status: IncidentStatus) => {
    setIncidents(prev => {
      return prev.map(inc => {
        if (inc.id !== id) return inc;
        const updatedTimeline = [...inc.timeline];
        const stepIdx = updatedTimeline.findIndex(t => t.step === status);
        if (stepIdx !== -1) {
          updatedTimeline[stepIdx] = { ...updatedTimeline[stepIdx], completed: true, active: false };
        }
        return {
          ...inc,
          status,
          updatedAt: 'Just now',
          timeline: updatedTimeline
        };
      });
    });

    // Update selected if matching
    setSelectedIncident(prev => {
      if (!prev || prev.id !== id) return prev;
      return { ...prev, status, updatedAt: 'Just now' };
    });

    if (status === 'IN_PROGRESS') {
      soundService.playClick();
      addToast('Repair Dispatched', `Work crew mobilized to ${id}`, 'warning');
    } else if (status === 'RESOLVED') {
      soundService.playSuccess();
      addToast('Incident Resolved', `Surface repaired and asphalt restored for ${id}`, 'success');
    }
  }, [addToast]);

  const assignTeam = useCallback((id: string, team: { id: string; name: string; crewSize: number; etaMinutes: number }) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'ASSIGNED',
        assignedTeam: team,
        updatedAt: 'Just now'
      };
    }));
    setSelectedIncident(prev => prev && prev.id === id ? { ...prev, status: 'ASSIGNED', assignedTeam: team } : prev);
    soundService.playClick();
    addToast('Crew Assigned', `${team.name} assigned (ETA: ${team.etaMinutes}m)`, 'info');
  }, [addToast]);

  const verifyCommunity = useCallback((id: string, isFixed: boolean) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      const votes = { ...inc.communityVotes };
      if (isFixed) votes.fixed += 1;
      else votes.unfixed += 1;

      return {
        ...inc,
        status: isFixed ? 'VERIFIED' : inc.status,
        communityVotes: votes,
        confidence: Math.min(99.9, Number((inc.confidence + 1.2).toFixed(1))),
        updatedAt: 'Just now'
      };
    }));

    setSelectedIncident(prev => {
      if (!prev || prev.id !== id) return prev;
      return {
        ...prev,
        status: isFixed ? 'VERIFIED' : prev.status,
        communityVotes: {
          fixed: prev.communityVotes.fixed + (isFixed ? 1 : 0),
          unfixed: prev.communityVotes.unfixed + (!isFixed ? 1 : 0)
        }
      };
    });

    if (isFixed) {
      soundService.playSuccess();
      addToast('Community Verified ✓', `Citizen confirmation recorded for ${id}`, 'success');
    }
  }, [addToast]);

  const createNewReport = useCallback((data: { location: string; damageType: string; imageUrl?: string; description?: string }): RoadIncident => {
    const newRef = `CR-${Math.floor(2100 + Math.random() * 800)}`;
    const newIncident: RoadIncident = {
      id: newRef,
      referenceCode: newRef,
      location: data.location || 'Residency Road • Zone 04',
      zone: 'Zone 04 (Central Business District)',
      coordinates: { x: 50 + Math.random() * 8 - 4, y: 48 + Math.random() * 8 - 4, lat: 12.972, lng: 77.595 },
      damageType: data.damageType || 'Pothole Cavity',
      severity: 'HIGH',
      confidence: 93.4,
      priorityScore: 84,
      reportsCount: 1,
      evidenceCount: 2,
      status: 'REPORTED',
      reportedAt: 'Just now',
      updatedAt: 'Just now',
      areaEstimateM2: 2.1,
      safetyRisk: 'Elevated',
      imageUrl: data.imageUrl || INITIAL_INCIDENTS[0].imageUrl,
      repairedImageUrl: INITIAL_INCIDENTS[0].repairedImageUrl,
      factors: INITIAL_INCIDENTS[0].factors,
      reports: [
        {
          id: 'rep-' + Date.now(),
          citizenName: 'You (Citizen Contributor)',
          timestamp: 'Just now',
          imageUrl: data.imageUrl || INITIAL_INCIDENTS[0].imageUrl,
          description: data.description || 'Pothole verified via mobile upload',
          gps: { lat: 12.972, lng: 77.595 },
          deviceInfo: 'Web Camera Upload • GPS Verified'
        }
      ],
      timeline: [
        { step: 'REPORTED', label: 'Citizen Mobile Upload Logged', time: 'Just now', completed: true },
        { step: 'AI_ANALYZED', label: 'Vision Model Inference', time: 'Pending', completed: false },
        { step: 'PRIORITIZED', label: 'Risk Calculation', time: 'Pending', completed: false },
        { step: 'ASSIGNED', label: 'Pending Dispatch', time: 'Pending', completed: false },
        { step: 'IN_PROGRESS', label: 'Repairs Pending', time: 'Pending', completed: false },
        { step: 'VERIFIED', label: 'Community Inspection', time: 'Pending', completed: false }
      ],
      communityVotes: { fixed: 0, unfixed: 0 }
    };

    setIncidents(prev => [newIncident, ...prev]);
    setSelectedIncident(newIncident);
    soundService.playSuccess();
    addToast('Incident Submitted', `${newRef} logged and queued for AI fusion`, 'success');
    return newIncident;
  }, [addToast]);

  const resetAllData = useCallback(() => {
    setIncidents(JSON.parse(JSON.stringify(INITIAL_INCIDENTS)));
    setSelectedIncident(INITIAL_INCIDENTS[0]);
    setIsDemoRunning(false);
    setIsDemoPaused(false);
    setDemoStepIndex(0);
    setDemoProgress(0);
    soundService.playClick();
    addToast('System Reset', 'All demo data & incident states restored to initial state', 'info');
  }, [addToast]);

  // Demo Controller Implementation
  const startDemo = useCallback(() => {
    setIsDemoRunning(true);
    setIsDemoPaused(false);
    setDemoStepIndex(0);
    setDemoProgress(0);
    soundService.playScan();
    addToast('▶ Demo Mode Initialized', 'Running 90-second autonomous presentation', 'ai');
  }, [addToast]);

  const pauseDemo = useCallback(() => {
    setIsDemoPaused(true);
    addToast('Demo Paused', 'Press [P] or Play to resume', 'info');
  }, [addToast]);

  const resumeDemo = useCallback(() => {
    setIsDemoPaused(false);
    addToast('Demo Resumed', 'Continuing walkthrough', 'info');
  }, [addToast]);

  const skipDemoStep = useCallback(() => {
    setDemoStepIndex(prev => {
      const next = prev + 1;
      if (next >= DEMO_STEPS.length) {
        setIsDemoRunning(false);
        addToast('Demo Completed', 'Full loop presented', 'success');
        return 0;
      }
      return next;
    });
    setDemoProgress(0);
    soundService.playClick();
  }, [addToast]);

  const restartDemo = useCallback(() => {
    resetAllData();
    setTimeout(() => {
      startDemo();
    }, 100);
  }, [resetAllData, startDemo]);

  const stopDemo = useCallback(() => {
    setIsDemoRunning(false);
    setIsDemoPaused(false);
    setDemoStepIndex(0);
    setDemoProgress(0);
  }, []);

  // Demo auto-advance timer & scroll trigger sync
  useEffect(() => {
    if (!isDemoRunning || isDemoPaused) return;

    const currentStepConfig = DEMO_STEPS[demoStepIndex];
    if (!currentStepConfig) return;

    const duration = currentStepConfig.duration;
    const intervalMs = 100;
    const progressInc = (intervalMs / duration) * 100;

    const timer = setInterval(() => {
      setDemoProgress(prev => {
        if (prev >= 100) {
          // Advance to next step
          if (demoStepIndex + 1 < DEMO_STEPS.length) {
            setDemoStepIndex(demoStepIndex + 1);
            return 0;
          } else {
            setIsDemoRunning(false);
            soundService.playSuccess();
            addToast('Demo Concluded', 'Citizen → AI → Action → Verification loop demonstrated', 'success');
            return 100;
          }
        }
        return prev + progressInc;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isDemoRunning, isDemoPaused, demoStepIndex, addToast]);

  // Execute step actions & smooth scroll target
  useEffect(() => {
    if (!isDemoRunning) return;
    const step = DEMO_STEPS[demoStepIndex]?.step;
    if (!step) return;

    // Scroll to matching section
    const targetMap: Record<DemoStep, string> = {
      HERO: 'section-hero',
      REPORT: 'section-problem',
      AI_ANALYSIS: 'section-ai',
      FUSION: 'section-fusion',
      PRIORITY: 'section-priority',
      COMMAND_CENTER: 'section-command',
      ASSIGNMENT: 'section-command',
      REPAIR: 'section-repair',
      VERIFICATION: 'section-repair',
      IMPACT: 'section-impact',
    };

    const targetId = targetMap[step];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Step reactive triggers
    if (step === 'FUSION') {
      soundService.playFusion();
    } else if (step === 'PRIORITY') {
      soundService.playEscalation();
    } else if (step === 'ASSIGNMENT') {
      updateIncidentStatus('CR-2048', 'ASSIGNED');
    } else if (step === 'REPAIR') {
      updateIncidentStatus('CR-2048', 'IN_PROGRESS');
    } else if (step === 'VERIFICATION') {
      verifyCommunity('CR-2048', true);
    }
  }, [isDemoRunning, demoStepIndex, updateIncidentStatus, verifyCommunity]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        if (isDemoRunning) {
          stopDemo();
        } else {
          startDemo();
        }
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (isDemoRunning) {
          if (isDemoPaused) resumeDemo();
          else pauseDemo();
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (isDemoRunning) {
          skipDemoStep();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        restartDemo();
      } else if (e.key === 'Escape') {
        setReportModalOpen(false);
        setIncidentDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDemoRunning, isDemoPaused, startDemo, stopDemo, pauseDemo, resumeDemo, skipDemoStep, restartDemo]);

  const currentStep = DEMO_STEPS[demoStepIndex]?.step || 'HERO';

  return (
    <IncidentContext.Provider
      value={{
        incidents,
        selectedIncident,
        setSelectedIncident,
        selectedZone,
        setSelectedZone,
        updateIncidentStatus,
        assignTeam,
        verifyCommunity,
        createNewReport,
        resetAllData,
        toasts,
        addToast,
        removeToast,
        soundEnabled,
        toggleSound,
        reportModalOpen,
        setReportModalOpen,
        incidentDrawerOpen,
        setIncidentDrawerOpen,
        isDemoRunning,
        isDemoPaused,
        demoStepIndex,
        demoStep: currentStep,
        demoProgress,
        startDemo,
        pauseDemo,
        resumeDemo,
        skipDemoStep,
        restartDemo,
        stopDemo,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export const useIncidents = () => {
  const ctx = useContext(IncidentContext);
  if (!ctx) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return ctx;
};
