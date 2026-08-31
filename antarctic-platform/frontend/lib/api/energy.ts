import { apiGet, apiPost } from './client';
import { ApiResponse, TelemetryData, HealthIndex } from '../types';

export interface WhatIfResult { fuel_saved_pct: number; autonomy_days_change: number; new_health_index: HealthIndex; warnings: string[]; }
export interface EnergyReport { summary: string; recommendations: string[]; priority_alerts: string[]; }

export async function fetchTelemetry(stationId: string): Promise<ApiResponse<TelemetryData>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/telemetry`);
  return {
    ...res,
    data: res.telemetry || res.data
  };
}

export async function fetchTelemetryHistory(stationId: string, hours: number = 24): Promise<ApiResponse<TelemetryData[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/telemetry/history?hours=${hours}`);
  return {
    ...res,
    data: res.history || res.data || []
  };
}

export async function fetchWhatIf(stationId: string, params: {solar_multiplier: number; wind_multiplier: number; load_reduction_pct: number}): Promise<ApiResponse<WhatIfResult>> {
  const res = await apiPost<any>(`/api/stations/${stationId}/telemetry/whatif`, params);
  return {
    ...res,
    data: res.result || res.data || res
  };
}

export async function fetchEnergyReport(stationId: string): Promise<ApiResponse<EnergyReport>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/telemetry/report`);
  return {
    ...res,
    data: res.report || res.data || res
  };
}
