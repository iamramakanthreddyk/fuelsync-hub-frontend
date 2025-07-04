
import { apiClient, extractApiData, extractApiArray } from './client';
import type { FuelPrice, CreateFuelPriceRequest, ApiResponse } from './api-contract';

export const fuelPricesApi = {
  // Get all fuel prices
  getFuelPrices: async (): Promise<FuelPrice[]> => {
    try {
      console.log('[FUEL-PRICES-API] Fetching fuel prices...');
      const response = await apiClient.get('/fuel-prices');
      console.log('[FUEL-PRICES-API] Raw response:', response.data);
      
      const rawPrices = extractApiArray<any>(response);
      
      // Convert snake_case to camelCase
      const fuelPrices = rawPrices.map((price: any) => ({
        id: price.id,
        stationId: price.station_id,
        fuelType: price.fuel_type,
        price: parseFloat(price.price) || 0,
        validFrom: price.valid_from,
        createdAt: price.created_at,
        // Include station info if available
        station: price.station ? {
          name: price.station.name
        } : undefined
      }));
      
      console.log('[FUEL-PRICES-API] Converted fuel prices:', fuelPrices);
      return fuelPrices;
    } catch (error) {
      console.error('[FUEL-PRICES-API] Error fetching fuel prices:', error);
      return [];
    }
  },

  // Create new fuel price
  createFuelPrice: async (data: CreateFuelPriceRequest): Promise<FuelPrice> => {
    console.log('[FUEL-PRICES-API] Creating fuel price:', data);
    const response = await apiClient.post('/fuel-prices', data);
    console.log('[FUEL-PRICES-API] Create response:', response.data);
    return extractApiData<FuelPrice>(response);
  },

  // Update fuel price using PUT - OpenAPI spec shows request body as object (no specific fields defined)
  updateFuelPrice: async (id: string, data: object): Promise<FuelPrice> => {
    console.log('[FUEL-PRICES-API] Updating fuel price:', id, data);
    const response = await apiClient.put(`/fuel-prices/${id}`, data);
    console.log('[FUEL-PRICES-API] Update response:', response.data);
    return extractApiData<FuelPrice>(response);
  },

  // Delete fuel price
  deleteFuelPrice: async (id: string): Promise<void> => {
    console.log('[FUEL-PRICES-API] Deleting fuel price:', id);
    await apiClient.delete(`/fuel-prices/${id}`);
    console.log('[FUEL-PRICES-API] Fuel price deleted successfully');
  }
};

// Export types for backward compatibility
export type { FuelPrice, CreateFuelPriceRequest };
