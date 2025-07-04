
import { apiClient, extractApiData, extractApiArray } from './client';
import type {
  Station,
  ApiResponse,
  StationComparison,
  StationComparisonParams,
  StationRanking
} from './api-contract';

export interface CreateStationData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateStationData {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  managerId?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export const stationsApi = {
  // Get all stations
  getStations: async (includeMetrics = false): Promise<Station[]> => {
    try {
      const params = includeMetrics ? { includeMetrics: 'true' } : {};
      const response = await apiClient.get('/stations', { params });
      return extractApiArray<Station>(response, 'stations');
    } catch (error) {
      console.error('Error fetching stations:', error);
      return [];
    }
  },

  // Get station by ID
  getStation: async (id: string): Promise<Station> => {
    const response = await apiClient.get(`/stations/${id}`);
    return extractApiData<Station>(response);
  },

  // Create station
  createStation: async (data: CreateStationData): Promise<Station> => {
    const response = await apiClient.post('/stations', data);
    return extractApiData<Station>(response);
  },

  // Update station
  updateStation: async (id: string, data: UpdateStationData): Promise<Station> => {
    const response = await apiClient.put(`/stations/${id}`, data);
    return extractApiData<Station>(response);
  },

  // Delete station
  deleteStation: async (id: string): Promise<void> => {
    await apiClient.delete(`/stations/${id}`);
  },

  // Compare stations performance
  compareStations: async (params: StationComparisonParams): Promise<StationComparison[]> => {
    const search = new URLSearchParams({ stationIds: params.stationIds.join(',') });
    if (params.period) search.append('period', params.period);
    const response = await apiClient.get(`/stations/compare?${search}`);
    return extractApiArray<StationComparison>(response);
  },

  // Get station ranking
  getStationRanking: async (period: string): Promise<StationRanking[]> => {
    const response = await apiClient.get(`/stations/ranking?period=${period}`);
    return extractApiArray<StationRanking>(response);
  }
};
