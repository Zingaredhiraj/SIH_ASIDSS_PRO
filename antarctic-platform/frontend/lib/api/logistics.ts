import { apiGet } from './client';
import { ApiResponse, ResupplyShipment, InventoryItem } from '../types';

export async function fetchShipments(stationId: string): Promise<ApiResponse<ResupplyShipment[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/logistics/resupply`);
  return {
    ...res,
    data: res.schedule || res.shipments || res.data || []
  };
}

export async function fetchInventory(stationId: string): Promise<ApiResponse<InventoryItem[]>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/logistics/inventory`);
  return {
    ...res,
    data: res.inventory || res.data || []
  };
}

export async function fetchTransportWindows(stationId: string): Promise<ApiResponse<any>> {
  const res = await apiGet<any>(`/api/stations/${stationId}/logistics/transport-window`);
  return {
    ...res,
    data: res.transport_window || res.data || {}
  };
}
