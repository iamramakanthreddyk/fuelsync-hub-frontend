/**
 * @file stationsService.ts
 * @description Service for stations API endpoints
 * @see docs/API_INTEGRATION_GUIDE.md - API integration patterns
 * @see docs/journeys/OWNER.md - Owner journey for station management
 */
import apiClient, { extractData, extractArray } from '../core/apiClient';
import API_CONFIG from '../core/config';
import { ApiResponse } from '../types/responses';
import type { StationMetric, StationComparison } from '../api-contract';

// Types
export interface Station {
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
}

export interface StationWithMetrics extends Station {
  metrics?: {
    totalSales: number;
    activePumps: number;
    totalPumps: number;
  };
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
  lastActivity?: string;
  efficiency?: number;
}

export interface CreateStationRequest {
  name: string;
  address: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationRequest {
  name?: string;
  address?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

/**
 * Service for stations API
 */
export const stationsService = {
  /**
   * Get all stations
   * @param includeMetrics Whether to include metrics in the response
   * @returns List of stations
   */
  getStations: async (includeMetrics = false): Promise<StationWithMetrics[]> => {
    try {
      const params = includeMetrics ? { includeMetrics: true } : {};
      const response = await apiClient.get('/stations', { params });
      return extractArray<StationWithMetrics>(response, 'stations');
    } catch (error) {
      console.error('[STATIONS-SERVICE] Error fetching stations:', error);
      throw error;
    }
  },
  
  /**
   * Get a station by ID
   * @param id Station ID
   * @returns Station details
   */
  getStation: async (id: string): Promise<Station> => {
    try {
      const response = await apiClient.get(`/stations/${id}`);
      return extractData<Station>(response);
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error fetching station ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new station
   * @param data Station data
   * @returns Created station
   */
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    try {
      const response = await apiClient.post('/stations', data);
      return extractData<Station>(response);
    } catch (error) {
      console.error('[STATIONS-SERVICE] Error creating station:', error);
      throw error;
    }
  },
  
  /**
   * Update a station
   * @param id Station ID
   * @param data Station data to update
   * @returns Updated station
   */
  updateStation: async (id: string, data: UpdateStationRequest): Promise<Station> => {
    try {
      const response = await apiClient.put(`/stations/${id}`, data);
      return extractData<Station>(response);
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error updating station ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete a station
   * @param id Station ID
   */
  deleteStation: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/stations/${id}`);
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error deleting station ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get metrics for a station
   * @param id Station ID
   * @returns Station metrics data
   */
  getStationMetrics: async (id: string): Promise<StationMetric> => {
    try {
      const url = API_CONFIG.endpoints.stations.metrics(id);
      const response = await apiClient.get(url);
      return extractData<StationMetric>(response);
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error fetching metrics for station ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get performance comparison for a station
   * @param id Station ID
   * @returns Performance metrics
   */
  getStationPerformance: async (id: string): Promise<StationComparison[]> => {
    try {
      const url = API_CONFIG.endpoints.stations.performance(id);
      const response = await apiClient.get(url);
      return extractArray<StationComparison>(response, 'data');
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error fetching performance for station ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get efficiency metric for a station
   * @param id Station ID
   * @returns Efficiency percentage
   */
  getStationEfficiency: async (id: string): Promise<number> => {
    try {
      const url = API_CONFIG.endpoints.stations.efficiency(id);
      const response = await apiClient.get(url);
      const data = extractData<{ efficiency: number }>(response);
      return data.efficiency;
    } catch (error) {
      console.error(`[STATIONS-SERVICE] Error fetching efficiency for station ${id}:`, error);
      throw error;
    }
  }
};

export default stationsService;