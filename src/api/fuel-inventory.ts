
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelInventory, FuelInventoryParams, FuelInventorySummary } from './api-contract';

export const fuelInventoryApi = {
  // Get fuel inventory status with optional filtering
  getFuelInventory: async (params?: FuelInventoryParams): Promise<FuelInventory[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.fuelType) searchParams.append('fuelType', params.fuelType);
      
      const response = await apiClient.get(`/inventory?${searchParams.toString()}`);
      return extractApiArray<FuelInventory>(response, 'inventory');
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
  }
};
