import { apiClient, extractApiArray, extractApiData } from './client';
import type {
  InventoryItem,
  Alert,
  InventoryUpdateRequest,
  FuelInventory,
  FuelInventoryParams,
  FuelInventorySummary
} from './api-contract';

export const inventoryApi = {
  // Get fuel inventory status with optional filtering
  getFuelInventory: async (
    params?: FuelInventoryParams
  ): Promise<FuelInventory[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.fuelType) searchParams.append('fuelType', params.fuelType);

      const query = searchParams.toString();
      const response = await apiClient.get(
        `/fuel-inventory${query ? `?${query}` : ''}`
      );
      return extractApiArray<FuelInventory>(response);
    } catch (error) {
      console.error('Error fetching fuel inventory:', error);
      return [];
    }
  },

  // Get inventory summary totals
  getInventorySummary: async (): Promise<FuelInventorySummary | null> => {
    try {
      const response = await apiClient.get('/fuel-inventory/summary');
      return extractApiData<FuelInventorySummary>(response);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
      return null;
    }
  },
  getInventory: async (): Promise<InventoryItem[]> => {
    try {
      const response = await apiClient.get('/inventory');
      return extractApiArray<InventoryItem>(response);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  },

  getInventoryAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await apiClient.get('/inventory/alerts');
      return extractApiArray<Alert>(response);
    } catch (error) {
      console.error('Error fetching inventory alerts:', error);
      return [];
    }
  },

  updateInventory: async (data: InventoryUpdateRequest) => {
    const response = await apiClient.post('/inventory/update', data);
    return extractApiData<{ status: string }>(response);
  }
};
