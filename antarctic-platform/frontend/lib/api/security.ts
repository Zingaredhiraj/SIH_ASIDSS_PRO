import { apiGet } from './client';
import { ApiResponse, AccessPoint, AccessEvent, SecurityRisk } from '../types';

export async function fetchAccessPoints(stationId: string): Promise<ApiResponse<AccessPoint[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/security`);
  return {
    ...res,
    data: res.access_points || res.points || res.data || []
  };
}

export async function fetchAccessEvents(stationId: string, limit: number = 50): Promise<ApiResponse<AccessEvent[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/security/events?limit=${limit}`);
  return {
    ...res,
    data: res.events || res.data || []
  };
}

export async function fetchSecurityRisk(stationId: string): Promise<ApiResponse<SecurityRisk>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/security`);
  return {
    ...res,
    data: res.risk_assessment || res.risk || res.data || { overall_risk: 'LOW', risk_score: 10, alerts: [] }
  };
}
