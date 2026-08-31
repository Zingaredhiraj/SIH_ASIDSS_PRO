import { apiGet } from './client';
import { ApiResponse, WeatherReading, HazardThreshold } from '../types';

export async function fetchWeather(stationId: string): Promise<ApiResponse<WeatherReading>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/environment/weather`);
  return {
    ...res,
    data: res.weather || res.data
  };
}

export async function fetchWeatherHistory(stationId: string, hours: number = 48): Promise<ApiResponse<WeatherReading[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/environment/trend?hours=${hours}`);
  return {
    ...res,
    data: res.trend?.history || res.history || res.data || []
  };
}

export async function fetchHazards(stationId: string): Promise<ApiResponse<HazardThreshold[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/environment/hazards`);
  return {
    ...res,
    data: res.hazards || res.data || []
  };
}
