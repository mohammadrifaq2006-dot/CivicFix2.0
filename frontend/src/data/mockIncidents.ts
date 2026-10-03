import { RoadIncident } from '../types';
import { DAMAGED_ROAD_IMG, REPAIRED_ROAD_IMG } from './assets';

export const INITIAL_INCIDENTS: RoadIncident[] = [
  {
    id: 'CR-2026-00452',
    referenceCode: 'CR-2026-00452',
    location: 'Central Demo Road',
    zone: 'Zone 04 (Central Business District)',
    coordinates: { x: 52, y: 46, lat: 12.9716, lng: 77.5946 },
    damageType: 'Pothole',
    severity: 'HIGH',
    confidence: 92,
    priorityScore: 87,
    reportsCount: 6,
    evidenceCount: 4,
    status: 'IN_PROGRESS',
    reportedAt: '12 mins ago',
    updatedAt: 'Just now',
    areaEstimateM2: 2.8,
    safetyRisk: 'Elevated',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    assignedTeam: {
      id: 'TEAM-ALPHA',
      name: 'RoadWorks Alpha',
      crewSize: 5,
      etaMinutes: 12,
    },
    factors: [
      {
        id: 'f1',
        name: 'Damage Severity',
        score: 30,
        maxScore: 30,
        description: 'Deep cavity rupture (>8.2cm) with progressive sub-base collapse',
        category: 'physical'
      },
      {
        id: 'f2',
        name: 'Major Road',
        score: 20,
        maxScore: 20,
        description: 'Central arterial demo corridor with ~18,400 daily vehicle transits',
        category: 'exposure'
      },
      {
        id: 'f3',
        name: 'Community Reports',
        score: 15,
        maxScore: 15,
        description: '6 distinct citizen reports verified within the same 4-hour window',
        category: 'social'
      },
      {
        id: 'f4',
        name: 'Safety-Sensitive Area',
        score: 15,
        maxScore: 15,
        description: 'Transit hub proximity, school bus pathway & motorcycle rollover risk',
        category: 'safety'
      },
      {
        id: 'f5',
        name: 'Unresolved Duration',
        score: 7,
        maxScore: 10,
        description: 'Progressively decaying past initial 24h threshold',
        category: 'geospatial'
      }
    ],
    reports: [
      {
        id: 'rep-1042',
        citizenName: 'Aarav Sharma',
        timestamp: '08:14 AM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'Large pothole emerging near bus stop. Cars swerving aggressively.',
        gps: { lat: 12.9715, lng: 77.5945 },
        deviceInfo: 'iPhone 15 Pro • GPS ±2.1m'
      },
      {
        id: 'rep-1047',
        citizenName: 'Priya Sundaram',
        timestamp: '09:02 AM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'Bumper scrape on low sedan. Needs quick repair before evening rush.',
        gps: { lat: 12.9717, lng: 77.5947 },
        deviceInfo: 'Samsung S24 • GPS ±1.8m'
      },
      {
        id: 'rep-1051',
        citizenName: 'Rohan Mehta',
        timestamp: '10:45 AM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'Water ponding inside hole, completely hiding depth from scooters.',
        gps: { lat: 12.9716, lng: 77.5946 },
        deviceInfo: 'Google Pixel 8 • GPS ±2.4m'
      },
      {
        id: 'rep-1055',
        citizenName: 'Ananya Rao',
        timestamp: '11:30 AM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'Deep road pit expanding towards lane center line.',
        gps: { lat: 12.9716, lng: 77.5948 },
        deviceInfo: 'OnePlus 12 • GPS ±3.1m'
      },
      {
        id: 'rep-1059',
        citizenName: 'Vikram Joshi',
        timestamp: '01:15 PM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'School bus had to brake abruptly to avoid rim damage.',
        gps: { lat: 12.9714, lng: 77.5945 },
        deviceInfo: 'iPhone 14 • GPS ±2.0m'
      },
      {
        id: 'rep-1063',
        citizenName: 'Kavita Patel',
        timestamp: '02:40 PM',
        imageUrl: DAMAGED_ROAD_IMG,
        description: 'Dangerous road crater at MG Road intersection. Please dispatch repair.',
        gps: { lat: 12.9718, lng: 77.5949 },
        deviceInfo: 'Motorola Edge • GPS ±2.7m'
      }
    ],
    timeline: [
      { step: 'REPORTED', label: '6 Community Reports Received', time: 'Today 08:14 - 14:40', completed: true, actor: 'Citizens (6)' },
      { step: 'AI_ANALYZED', label: 'AI Incident Fusion & Computer Vision', time: '14:41', completed: false, actor: 'CivicRoad Neural Engine' },
      { step: 'PRIORITIZED', label: 'Priority Escalated to 87/100', time: '14:42', completed: false, actor: 'Risk Matrix Algorithm' },
      { step: 'ASSIGNED', label: 'Rapid Asphalt Unit #4 Dispatched', time: 'Pending', completed: false, actor: 'Municipal Dispatch' },
      { step: 'IN_PROGRESS', label: 'Excavation & Bituminous Patching', time: 'Pending', completed: false, actor: 'Field Crew #4' },
      { step: 'VERIFIED', label: 'Citizen Community Verified', time: 'Pending', completed: false, actor: 'Community Consensus' }
    ],
    communityVotes: {
      fixed: 0,
      unfixed: 0
    }
  },
  {
    id: 'CR-2037',
    referenceCode: 'CR-2037',
    location: 'Outer Ring Road • Junction 9',
    zone: 'Zone 02 (North Ring)',
    coordinates: { x: 74, y: 28, lat: 13.0112, lng: 77.6254 },
    damageType: 'Road Collapse Risk & Subsidence',
    severity: 'CRITICAL',
    confidence: 96.8,
    priorityScore: 94,
    reportsCount: 9,
    evidenceCount: 18,
    status: 'IN_PROGRESS',
    reportedAt: '1h 45m ago',
    updatedAt: '12m ago',
    areaEstimateM2: 6.4,
    safetyRisk: 'Severe',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    assignedTeam: {
      id: 'CREW-01',
      name: 'Heavy Civil Infrastructure #1',
      crewSize: 8,
      etaMinutes: 0,
    },
    factors: [
      { id: 'f1', name: 'Sub-base Structural Void', score: 30, maxScore: 30, description: 'Underground cavity detected beneath storm drain', category: 'physical' },
      { id: 'f2', name: 'High-Speed Ring Traffic', score: 25, maxScore: 25, description: 'Speed limit 80km/h with heavy freight transit', category: 'exposure' },
      { id: 'f3', name: 'Catastrophic Collapse Risk', score: 24, maxScore: 25, description: 'High likelihood of pavement cave-in under heavy axle loads', category: 'safety' },
      { id: 'f4', name: 'Verified Citizen Warnings', score: 9, maxScore: 10, description: '9 independent notifications logged', category: 'social' },
      { id: 'f5', name: 'Critical Transit Arterial', score: 6, maxScore: 10, description: 'Connects industrial freight terminal to city center', category: 'geospatial' }
    ],
    reports: [],
    timeline: [
      { step: 'REPORTED', label: '9 Reports Received', time: 'Today 13:10', completed: true },
      { step: 'AI_ANALYZED', label: 'Severe Subsidence Flagged', time: '13:15', completed: true },
      { step: 'PRIORITIZED', label: 'Critical Tier Escalated (94/100)', time: '13:16', completed: true },
      { step: 'ASSIGNED', label: 'Heavy Civil #1 On Site', time: '13:45', completed: true },
      { step: 'IN_PROGRESS', label: 'Soil Grouting in Progress', time: '14:20', completed: true, active: true },
      { step: 'VERIFIED', label: 'Awaiting Final Inspection', time: 'Pending', completed: false }
    ],
    communityVotes: { fixed: 4, unfixed: 0 }
  },
  {
    id: 'CR-2029',
    referenceCode: 'CR-2029',
    location: 'Sector 12 • 4th Main Road',
    zone: 'Zone 05 (South Suburbs)',
    coordinates: { x: 32, y: 72, lat: 12.9145, lng: 77.5689 },
    damageType: 'Surface Alligator Cracking',
    severity: 'HIGH',
    confidence: 91.2,
    priorityScore: 79,
    reportsCount: 4,
    evidenceCount: 7,
    status: 'ASSIGNED',
    reportedAt: '3h ago',
    updatedAt: '45m ago',
    areaEstimateM2: 5.2,
    safetyRisk: 'Moderate',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    assignedTeam: {
      id: 'CREW-09',
      name: 'Pavement Resurfacing Team B',
      crewSize: 4,
      etaMinutes: 35,
    },
    factors: [
      { id: 'f1', name: 'Extensive Cracking Pattern', score: 24, maxScore: 30, description: 'Interconnected crocodile cracking spreading across 5.2m²', category: 'physical' },
      { id: 'f2', name: 'Residential Traffic Feeder', score: 20, maxScore: 25, description: 'Moderate traffic density feeding three school zones', category: 'exposure' },
      { id: 'f3', name: 'Monsoon Water Infiltration', score: 18, maxScore: 25, description: 'Risk of rapid water seepage breaking sub-base foundation', category: 'safety' },
      { id: 'f4', name: 'Neighborhood Petitions', score: 10, maxScore: 10, description: '4 localized resident reports submitted', category: 'social' },
      { id: 'f5', name: 'Proximity to Clinic', score: 7, maxScore: 10, description: 'Adjacent to primary healthcare dispensary', category: 'geospatial' }
    ],
    reports: [],
    timeline: [
      { step: 'REPORTED', label: '4 Citizen Reports', time: '11:40', completed: true },
      { step: 'AI_ANALYZED', label: 'Alligator Fissure Model Verified', time: '11:42', completed: true },
      { step: 'PRIORITIZED', label: 'Score Calculated: 79/100', time: '11:44', completed: true },
      { step: 'ASSIGNED', label: 'Team B Dispatched', time: '14:15', completed: true, active: true },
      { step: 'IN_PROGRESS', label: 'Slurry Sealing Scheduled', time: 'Pending', completed: false },
      { step: 'VERIFIED', label: 'Pending Completion', time: 'Pending', completed: false }
    ],
    communityVotes: { fixed: 1, unfixed: 0 }
  },
  {
    id: 'CR-2015',
    referenceCode: 'CR-2015',
    location: 'Tech Park Expressway • Slip Road',
    zone: 'Zone 03 (East Corridor)',
    coordinates: { x: 78, y: 64, lat: 12.9567, lng: 77.6892 },
    damageType: 'Shoulder Edge Breakdown',
    severity: 'MEDIUM',
    confidence: 88.5,
    priorityScore: 68,
    reportsCount: 3,
    evidenceCount: 5,
    status: 'AI_ANALYZED',
    reportedAt: '5h ago',
    updatedAt: '2h ago',
    areaEstimateM2: 1.9,
    safetyRisk: 'Moderate',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    factors: [
      { id: 'f1', name: 'Asphalt Curb Crumbling', score: 20, maxScore: 30, description: 'Edge raveling into dirt shoulder', category: 'physical' },
      { id: 'f2', name: 'Commuter Car Volume', score: 18, maxScore: 25, description: 'Morning tech worker traffic spike', category: 'exposure' },
      { id: 'f3', name: 'Cyclist Lane Obstruction', score: 16, maxScore: 25, description: 'Forces bicycles into main carriage stream', category: 'safety' },
      { id: 'f4', name: 'Citizen Alerts', score: 8, maxScore: 10, description: '3 verified mobile photo reports', category: 'social' },
      { id: 'f5', name: 'Suburban Corridor', score: 6, maxScore: 10, description: 'Outer IT park spur', category: 'geospatial' }
    ],
    reports: [],
    timeline: [],
    communityVotes: { fixed: 0, unfixed: 0 }
  },
  {
    id: 'CR-1994',
    referenceCode: 'CR-1994',
    location: 'Old Airport Road • Km 4.2',
    zone: 'Zone 03 (East Corridor)',
    coordinates: { x: 62, y: 55, lat: 12.9599, lng: 77.6433 },
    damageType: 'Sunken Manhole Cover Depression',
    severity: 'HIGH',
    confidence: 93.1,
    priorityScore: 82,
    reportsCount: 5,
    evidenceCount: 9,
    status: 'IN_PROGRESS',
    reportedAt: '6h ago',
    updatedAt: '30m ago',
    areaEstimateM2: 1.4,
    safetyRisk: 'Elevated',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    assignedTeam: {
      id: 'CREW-03',
      name: 'Utility Collar Adjustment Squad',
      crewSize: 3,
      etaMinutes: 0
    },
    factors: [],
    reports: [],
    timeline: [],
    communityVotes: { fixed: 2, unfixed: 0 }
  },
  {
    id: 'CR-1981',
    referenceCode: 'CR-1981',
    location: 'Heritage Boulevard • North Gate',
    zone: 'Zone 01 (Heritage North)',
    coordinates: { x: 26, y: 35, lat: 13.0022, lng: 77.5811 },
    damageType: 'Minor Surface Abrasion',
    severity: 'LOW',
    confidence: 86.4,
    priorityScore: 42,
    reportsCount: 2,
    evidenceCount: 3,
    status: 'RESOLVED',
    reportedAt: '1 day ago',
    updatedAt: '3h ago',
    areaEstimateM2: 0.8,
    safetyRisk: 'Low',
    imageUrl: DAMAGED_ROAD_IMG,
    repairedImageUrl: REPAIRED_ROAD_IMG,
    factors: [],
    reports: [],
    timeline: [],
    communityVotes: { fixed: 12, unfixed: 0 }
  }
];

export const CITY_ZONES = [
  { id: 'z1', name: 'Zone 01: Heritage North', incidents: 6, healthIndex: 91, lat: 13.0022, lng: 77.5811 },
  { id: 'z2', name: 'Zone 02: North Ring Corridor', incidents: 14, healthIndex: 78, lat: 13.0112, lng: 77.6254 },
  { id: 'z3', name: 'Zone 03: East Tech Corridor', incidents: 11, healthIndex: 82, lat: 12.9599, lng: 77.6433 },
  { id: 'z4', name: 'Zone 04: Central Business District', incidents: 12, healthIndex: 74, lat: 12.9716, lng: 77.5946 },
  { id: 'z5', name: 'Zone 05: South Suburbs & Transit', incidents: 5, healthIndex: 88, lat: 12.9145, lng: 77.5689 }
];

export const RESPONSE_TEAMS = [
  {
    id: 'team-alpha',
    name: 'RoadWorks Alpha',
    codeName: 'Team Alpha',
    status: 'Responding' as const,
    crewSize: 5,
    etaMinutes: 12,
    currentAssignment: 'CR-2026-00452 • Central Demo Road',
    vehicleType: 'Bituminous Rapid Patcher & Infrared Recycler',
    specialty: 'Arterial Pothole Fast-Fill & Compaction',
  },
  {
    id: 'team-bravo',
    name: 'Asphalt Strike Bravo',
    codeName: 'Team Bravo',
    status: 'On site' as const,
    crewSize: 7,
    etaMinutes: 0,
    currentAssignment: 'CR-2037 • Outer Ring Road',
    vehicleType: 'Heavy Tandem Roller & Cold Milling Unit',
    specialty: 'Sub-base Void Stabilization & Structural Overhaul',
  },
  {
    id: 'team-charlie',
    name: 'Squad Charlie Standby',
    codeName: 'Team Charlie',
    status: 'Available' as const,
    crewSize: 4,
    etaMinutes: 25,
    currentAssignment: 'Depot Standby • Zone 02 Staging Bay',
    vehicleType: 'Emergency Slurry Seal & Crack Injection Van',
    specialty: 'Early Distress Mitigation & Surface Sealing',
  },
];

