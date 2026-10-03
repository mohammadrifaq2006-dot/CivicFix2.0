/**
 * Service Abstraction for Civic Priority Calculation
 * Evaluates composite risk matrix: physical damage + traffic density + safety vulnerability
 */
class PriorityService {
  public calculatePriority(factors: {
    damageSize: number;
    trafficDensity: number;
    twoWheelerExposure: number;
    reportsClusterCount: number;
    locationSensitivity: number;
  }): { score: number; tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' } {
    const total = 
      factors.damageSize +
      factors.trafficDensity +
      factors.twoWheelerExposure +
      factors.reportsClusterCount +
      factors.locationSensitivity;

    let tier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (total >= 90) tier = 'CRITICAL';
    else if (total >= 75) tier = 'HIGH';
    else if (total >= 50) tier = 'MEDIUM';

    return { score: Math.min(100, total), tier };
  }
}

export const priorityService = new PriorityService();
