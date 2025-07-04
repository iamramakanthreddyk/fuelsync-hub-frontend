/**
 * @file nozzles.ts
 * @description API client for nozzles endpoints
 */
import { apiClient } from './client';

// Types
export interface Nozzle {
  id: string;
  pumpId?: string;
  pump_id?: string;
  nozzleNumber?: number;
  nozzle_number?: number;
  fuelType?: string;
  fuel_type?: string;
  status: string;
  createdAt?: string;
  created_at?: string;
}

export interface CreateNozzleRequest {
  pumpId: string;
  nozzleNumber: number;
  fuelType: string;
  status?: string;
}

export interface UpdateNozzleRequest {
  nozzleNumber?: number;
  fuelType?: string;
  status?: string;
}

// Helper function to normalize nozzle data
const normalizeNozzle = (nozzle: any): Nozzle => {
  return {
    id: nozzle.id,
    pumpId: nozzle.pumpId || nozzle.pump_id,
    pump_id: nozzle.pump_id || nozzle.pumpId,
    nozzleNumber: nozzle.nozzleNumber || nozzle.nozzle_number,
    nozzle_number: nozzle.nozzle_number || nozzle.nozzleNumber,
    fuelType: nozzle.fuelType || nozzle.fuel_type,
    fuel_type: nozzle.fuel_type || nozzle.fuelType,
    status: nozzle.status || 'inactive',
    createdAt: nozzle.createdAt || nozzle.created_at,
    created_at: nozzle.created_at || nozzle.createdAt
  };
};

export const nozzlesService = {
  getNozzles: async (pumpId: string): Promise<Nozzle[]> => {
    try {
      console.log('[NOZZLES-API] Fetching nozzles for pump:', pumpId);
      
      if (!pumpId) {
        console.error('[NOZZLES-API] No pumpId provided to getNozzles');
        return [];
      }
      
      const response = await apiClient.get(`/nozzles?pumpId=${pumpId}`);
      
      // Extract nozzles from response
      let nozzlesArray = [];
      
      if (response.data?.data?.nozzles) {
        nozzlesArray = response.data.data.nozzles;
      } else if (response.data?.nozzles) {
        nozzlesArray = response.data.nozzles;
      } else if (Array.isArray(response.data)) {
        nozzlesArray = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        nozzlesArray = response.data.data;
      }
      
      // Normalize all nozzles
      const normalizedNozzles = nozzlesArray.map(normalizeNozzle);
      console.log(`[NOZZLES-API] Successfully fetched ${normalizedNozzles.length} nozzles`);
      return normalizedNozzles;
    } catch (error) {
      console.error('[NOZZLES-API] Error in getNozzles:', error);
      return [];
    }
  },

  getNozzle: async (id: string): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.get(`/nozzles/${id}`);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error(`[NOZZLES-API] Error in getNozzle: ${id}`, error);
      return null;
    }
  },

  createNozzle: async (data: CreateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.post('/nozzles', data);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error('[NOZZLES-API] Error in createNozzle:', error);
      throw error;
    }
  },

  updateNozzle: async (id: string, data: UpdateNozzleRequest): Promise<Nozzle | null> => {
    try {
      const response = await apiClient.put(`/nozzles/${id}`, data);
      return normalizeNozzle(response.data);
    } catch (error) {
      console.error(`[NOZZLES-API] Error in updateNozzle: ${id}`, error);
      throw error;
    }
  },

  deleteNozzle: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/nozzles/${id}`);
    } catch (error) {
      console.error(`[NOZZLES-API] Error in deleteNozzle: ${id}`, error);
      throw error;
    }
  }
  ,
  getNozzleSettings: async (id: string): Promise<any> => {
    const response = await apiClient.get(`/nozzles/${id}/settings`);
    return response.data?.data ?? response.data;
  },
  updateNozzleSettings: async (id: string, data: any): Promise<any> => {
    const response = await apiClient.put(`/nozzles/${id}/settings`, data);
    return response.data?.data ?? response.data;
  }
};