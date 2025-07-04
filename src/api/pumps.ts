import { apiClient, extractApiData, extractApiArray } from './client';
import type { Pump, CreatePumpRequest, ApiResponse } from './api-contract';

export const pumpsApi = {
  // Get pumps for a station
  getPumps: async (stationId: string): Promise<Pump[]> => {
    try {
      const url = stationId === 'all' ? '/pumps' : `/pumps?stationId=${stationId}`;
      const response = await apiClient.get(url);
      return extractApiArray<Pump>(response);
    } catch (error) {
      console.error('[PUMPS-API] Error fetching pumps:', error);
      throw error; // Throw error to trigger React Query's retry mechanism
    }
  },
  
  // Create new pump
  createPump: async (data: CreatePumpRequest): Promise<Pump> => {
    try {
      console.log('[PUMPS-API] Creating pump with data:', data);
      
      const response = await apiClient.post('/pumps', data);
      const pump = extractApiData<Pump>(response);
      
      console.log('[PUMPS-API] Pump created successfully:', pump);
      return pump;
    } catch (error) {
      console.error('[PUMPS-API] Error creating pump:', error);
      throw error;
    }
  },
  
  // Get single pump
  getPump: async (pumpId: string): Promise<Pump> => {
    try {
      console.log(`[PUMPS-API] Fetching pump details for ID: ${pumpId}`);
      
      const response = await apiClient.get(`/pumps/${pumpId}`);
      const pump = extractApiData<Pump>(response);
      
      console.log('[PUMPS-API] Pump details:', pump);
      return pump;
    } catch (error) {
      console.error(`[PUMPS-API] Error fetching pump ${pumpId}:`, error);
      throw error;
    }
  },
  
  // Delete pump
  deletePump: async (pumpId: string): Promise<void> => {
    try {
      console.log(`[PUMPS-API] Deleting pump ${pumpId}`);
      
      await apiClient.delete(`/pumps/${pumpId}`);
      console.log(`[PUMPS-API] Pump ${pumpId} deleted successfully`);
    } catch (error) {
      console.error(`[PUMPS-API] Error deleting pump ${pumpId}:`, error);
      throw error;
    }
  }
  ,
  // Get pump settings
  getPumpSettings: async (pumpId: string): Promise<any> => {
    const response = await apiClient.get(`/pumps/${pumpId}/settings`);
    return extractApiData<any>(response);
  },

  // Update pump
  updatePump: async (id: string, data: Partial<CreatePumpRequest>): Promise<Pump> => {
    try {
      const response = await apiClient.put(`/pumps/${id}`, data);
      return extractApiData<Pump>(response);
    } catch (error) {
      console.error(`[PUMPS-API] Error updating pump ${id}:`, error);
      throw error;
    }
  },
  // Update pump settings
  updatePumpSettings: async (pumpId: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/pumps/${pumpId}/settings`, data);
    return extractApiData<any>(response);
  }
};

// Export types for backward compatibility
export type { Pump, CreatePumpRequest };
