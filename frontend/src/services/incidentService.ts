import { RoadIncident, IncidentReport, IncidentStatus, SeverityLevel } from '../types';
import { INITIAL_INCIDENTS } from '../data/mockIncidents';

/**
 * Service Abstraction for Incidents
 * Designed to interface cleanly with Spring Boot 3 REST APIs
 * (GET /api/issues, PUT /api/authority/issues/{id}/status, etc.)
 */
class IncidentService {
  private cache: RoadIncident[] = [];

  constructor() {
    this.cache = JSON.parse(JSON.stringify(INITIAL_INCIDENTS));
  }

  public async getIncidents(): Promise<RoadIncident[]> {
    return Promise.resolve([...this.cache]);
  }

  public async getIncidentById(id: string): Promise<RoadIncident | null> {
    const inc = this.cache.find(i => i.id === id);
    return Promise.resolve(inc ? { ...inc } : null);
  }

  public async updateStatus(id: string, status: IncidentStatus): Promise<RoadIncident> {
    const idx = this.cache.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Incident ${id} not found`);

    this.cache[idx] = {
      ...this.cache[idx],
      status,
      updatedAt: 'Just now'
    };
    return Promise.resolve({ ...this.cache[idx] });
  }

  public async assignCrew(id: string, team: { id: string; name: string; crewSize: number; etaMinutes: number }): Promise<RoadIncident> {
    const idx = this.cache.findIndex(i => i.id === id);
    if (idx === -1) throw new Error(`Incident ${id} not found`);

    this.cache[idx] = {
      ...this.cache[idx],
      status: 'ASSIGNED',
      assignedTeam: team,
      updatedAt: 'Just now'
    };
    return Promise.resolve({ ...this.cache[idx] });
  }
}

export const incidentService = new IncidentService();
