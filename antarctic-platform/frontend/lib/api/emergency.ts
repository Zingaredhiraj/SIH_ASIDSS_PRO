import { apiGet, apiPost } from './client';
import { ApiResponse, Incident, MusterEntry, EvacuationRoute } from '../types';

export async function triggerIncident(data: {station_id: string; type: string; severity: string | number; description: string}): Promise<ApiResponse<any>> {
  return apiPost<ApiResponse<any>>(`/api/emergency/trigger`, {
    ...data,
    severity: String(data.severity)
  });
}

export async function fetchIncidents(stationId: string): Promise<ApiResponse<Incident[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/incidents`);
  return {
    ...res,
    data: res.incidents || res.data || []
  };
}

export async function escalateIncident(incidentId: string): Promise<ApiResponse<any>> {
  return apiPost<ApiResponse<any>>(`/api/incidents/${incidentId}/escalate`, {});
}

export async function resolveIncident(incidentId: string): Promise<ApiResponse<any>> {
  return apiPost<ApiResponse<any>>(`/api/incidents/${incidentId}/resolve`, {});
}

export async function fetchMuster(stationId: string): Promise<ApiResponse<MusterEntry[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/muster`);
  return {
    ...res,
    data: res.muster_roll || res.muster || res.data || []
  };
}

export async function markCrewSafe(crewId: string): Promise<ApiResponse<any>> {
  return apiPost<ApiResponse<any>>(`/api/muster/${crewId}/safe`, {});
}

export async function fetchEvacuationRoutes(stationId: string): Promise<ApiResponse<EvacuationRoute[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/evacuation`);
  return {
    ...res,
    data: res.routes || res.data || []
  };
}
