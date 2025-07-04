import { apiClient, extractApiArray, extractApiData } from './client';
import type { InventoryItem, Alert, InventoryUpdateRequest } from './api-contract';

export const inventoryApi = {
  getInventory: async (): Promise<InventoryItem[]> => {
    try {
      const response = await apiClient.get('/inventory');
      return extractApiArray<InventoryItem>(response, 'data');
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return [];
    }
  },

  getInventoryAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await apiClient.get('/inventory/alerts');
      return extractApiArray<Alert>(response, 'data');
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
