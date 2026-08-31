import { apiGet } from './client';
import { ApiResponse, PersonnelMember, OperationalReadiness, ShiftSchedule } from '../types';

export async function fetchPersonnel(stationId: string): Promise<ApiResponse<PersonnelMember[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/personnel`);
  return {
    ...res,
    data: res.personnel || res.data || []
  };
}

export async function fetchPersonnelSummary(stationId: string): Promise<ApiResponse<OperationalReadiness>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/personnel/summary`);
  return {
    ...res,
    data: res.readiness || res.summary || res.data || { readiness_pct: 100, on_duty_count: 0, off_duty_count: 0, in_field_count: 0, by_department: {}, risk_level: 'LOW' }
  };
}

export async function fetchShifts(stationId: string): Promise<ApiResponse<ShiftSchedule[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/personnel/shifts`);
  return {
    ...res,
    data: res.shifts || res.data || []
  };
}
