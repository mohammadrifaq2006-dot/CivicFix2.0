export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 
  | 'REPORTED' 
  | 'AI_ANALYZED' 
  | 'PRIORITIZED' 
  | 'ASSIGNED' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'VERIFIED';

export interface TimelineEvent {
  step: string;
  label: string;
  time: string;
  completed: boolean;
  active?: boolean;
  actor?: string;
}

export interface ExplainabilityFactor {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  description: string;
  category: 'physical' | 'exposure' | 'safety' | 'social' | 'geospatial';
}

export interface IncidentReport {
  id: string;
  citizenName: string;
  timestamp: string;
  imageUrl: string;
  description: string;
  gps: { lat: number; lng: number };
  deviceInfo: string;
}

export interface ResponseTeam {
  id: string;
  name: string;
  codeName: 'Team Alpha' | 'Team Bravo' | 'Team Charlie' | string;
  status: 'Available' | 'Responding' | 'On site' | 'Completed';
  crewSize: number;
  etaMinutes: number;
  currentAssignment?: string;
  vehicleType: string;
  specialty: string;
}

export interface RoadIncident {
  id: string;
  referenceCode: string;
  location: string;
  zone: string;
  coordinates: { x: number; y: number; lat: number; lng: number };
  damageType: string;
  severity: SeverityLevel;
  confidence: number;
  priorityScore: number;
  reportsCount: number;
  evidenceCount: number;
  status: IncidentStatus;
  reportedAt: string;
  updatedAt: string;
  assignedTeam?: {
    name: string;
    id: string;
    crewSize: number;
    etaMinutes: number;
  };
  areaEstimateM2: number;
  safetyRisk: 'Low' | 'Moderate' | 'Elevated' | 'Severe';
  imageUrl: string;
  repairedImageUrl: string;
  factors: ExplainabilityFactor[];
  reports: IncidentReport[];
  timeline: TimelineEvent[];
  communityVotes: {
    fixed: number;
    unfixed: number;
  };
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'ai';
  timestamp: number;
}

export type DemoStep = 
  | 'HERO'
  | 'REPORT'
  | 'AI_ANALYSIS'
  | 'FUSION'
  | 'PRIORITY'
  | 'COMMAND_CENTER'
  | 'ASSIGNMENT'
  | 'REPAIR'
  | 'VERIFICATION'
  | 'IMPACT';
