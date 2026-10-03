// Ultra-High Resolution Real-Life Pothole & Road Damage Photography
// Authentic Community Uploads: Outer Ring Road & Hyderabad Arterial Corridors

import damagePhase1 from '../assets/images/damage-phase1.webp';
import damagePhase2 from '../assets/images/damage-phase2.webp';
import damagePhase3 from '../assets/images/damage-phase3.webp';
import damagePhase4 from '../assets/images/damage-phase4.webp';

// Direct Phase Exports (Used in 4-Phase Repair Guide)
export const DAMAGE_PHASE_1 = damagePhase1;
export const DAMAGE_PHASE_2 = damagePhase2;
export const DAMAGE_PHASE_3 = damagePhase3;
export const DAMAGE_PHASE_4 = damagePhase4;

// Genuine road damage photo from user uploads
export const MATCHING_POTHOLE_PRIMARY = damagePhase2;
export const MATCHING_POTHOLE_CLOSEUP = damagePhase1;
export const MATCHING_POTHOLE_WATER = damagePhase4;
export const MATCHING_POTHOLE_CULVERT = damagePhase3;
export const MATCHING_POTHOLE_REPAIRED = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=1200&q=85';

export const REAL_POTHOLE_PRIMARY = damagePhase2;
export const REAL_ROAD_FISSURE = damagePhase1;
export const REAL_REPAIRED_ROAD = MATCHING_POTHOLE_REPAIRED;
export const DAMAGED_ROAD_IMG = damagePhase2;
export const REPAIRED_ROAD_IMG = MATCHING_POTHOLE_REPAIRED;

export const REAL_ROAD_WORKERS = damagePhase3;
export const REAL_TELANGANA_HIGHWAY = damagePhase4;

export const FUSED_MATCHING_REPORTS = [
  {
    id: 'rep-ghmc-01',
    label: 'Report #1042 — Mid-Lane Driver Perspective',
    time: '08:14 AM',
    citizen: 'K. Venkat Rao (Daily Commuter)',
    imageUrl: damagePhase2,
    angle: 'Mid-Lane Driver Perspective (2m distance)',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: '8.5cm cavity causing severe swerving in slow lane with car and two-wheeler traffic',
    propertyDamageWitnessed: 'Wheel Rim Dent & Two-Wheeler Spill Risk',
    matchConfidence: 99.4
  },
  {
    id: 'rep-ghmc-02',
    label: 'Report #1047 — Rainwater Pothole Hazard',
    time: '09:02 AM',
    citizen: 'Priya Sharma (Motorcyclist)',
    imageUrl: damagePhase1,
    angle: 'Motorcycle Commuter Rainwater Angle (0.8m)',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: 'Standing rainwater hides deep sub-surface cavity from two-wheeler riders',
    propertyDamageWitnessed: 'Bent Alloy Rim & Tyre Air Loss',
    matchConfidence: 98.9
  },
  {
    id: 'rep-ghmc-03',
    label: 'Report #1051 — Sub-Base Drainage Excavation',
    time: '10:45 AM',
    citizen: 'Ramesh Reddy (Auto Driver)',
    imageUrl: damagePhase3,
    angle: 'Drainage Culvert Structural Angle',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: 'Sub-base erosion near stormwater conduit line causing roadway collapse',
    propertyDamageWitnessed: 'Suspension Strut Impact & Ground Clearance Scrape',
    matchConfidence: 99.1
  },
  {
    id: 'rep-ghmc-04',
    label: 'Report #1055 — Arterial Waterlogged Corridor',
    time: '11:30 AM',
    citizen: 'Arun Varma (Delivery Courier)',
    imageUrl: damagePhase4,
    angle: 'Peak Traffic Approach Perspective',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: 'Heavily flooded corridor forcing traffic into oncoming lane',
    propertyDamageWitnessed: 'Multiple Tyre Sidewall Cuts Recorded',
    matchConfidence: 98.6
  },
  {
    id: 'rep-ghmc-05',
    label: 'Report #1059 — Deep Asphalt Fracture Rim',
    time: '01:15 PM',
    citizen: 'Syed Moiz (Resident)',
    imageUrl: damagePhase2,
    angle: 'Ground Level Crater Rim Angle',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: 'Fractured aggregate breaking loose under vehicle tires',
    propertyDamageWitnessed: 'Bumper Scrape on Sedan',
    matchConfidence: 99.5
  },
  {
    id: 'rep-ghmc-06',
    label: 'Report #1063 — Commuter Skid Risk Angle',
    time: '02:40 PM',
    citizen: 'Deepa Narayan (Cyclist)',
    imageUrl: damagePhase1,
    angle: 'Two-Wheeler Wheel Track View',
    location: 'ORR Service Rd, Gachibowli • Pillar 142',
    notes: 'Two-wheeler lost balance navigating water-filled crater',
    propertyDamageWitnessed: 'Motorbike Handlebar & Rim Damage',
    matchConfidence: 99.8
  }
];
