
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelDelivery, CreateFuelDeliveryRequest, FuelInventory } from './api-contract';

export const fuelDeliveriesApi = {
  // Get all fuel deliveries
  getFuelDeliveries: async (stationId?: string): Promise<FuelDelivery[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);
      
      const response = await apiClient.get(`/fuel-deliveries?${params.toString()}`);
      return extractApiArray<FuelDelivery>(response);
    } catch (error) {
      console.error('Error fetching fuel deliveries:', error);
      return [];
    }
  },

  // Create new fuel delivery
  createFuelDelivery: async (deliveryData: CreateFuelDeliveryRequest): Promise<FuelDelivery> => {
    const response = await apiClient.post('/fuel-deliveries', deliveryData);
    return extractApiData<FuelDelivery>(response);
  },

  // Get inventory levels after deliveries
  getDeliveriesInventory: async (stationId?: string): Promise<FuelInventory[]> => {
    try {
      const params = new URLSearchParams();
      if (stationId) params.append('stationId', stationId);

      const response = await apiClient.get(`/fuel-deliveries/inventory?${params.toString()}`);
      return extractApiArray<FuelInventory>(response);
    } catch (error) {
      console.error('Error fetching deliveries inventory:', error);
      return [];
    }
  }
};

// Export types for backward compatibility
export type { FuelDelivery, CreateFuelDeliveryRequest };
