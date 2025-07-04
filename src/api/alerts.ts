
import { apiClient, extractApiData, extractApiArray } from './client';
import type { Alert, AlertsParams, ApiResponse } from './api-contract';

export const alertsApi = {
  getAlerts: async (params?: AlertsParams): Promise<Alert[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.stationId) searchParams.append('stationId', params.stationId);
      if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
      
      const response = await apiClient.get(`/alerts?${searchParams.toString()}`);
      return extractApiArray<Alert>(response);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  markAsRead: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/alerts/${id}/read`);
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw new Error('Failed to mark alert as read');
    }
  },

  dismissAlert: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/alerts/${id}`);
    } catch (error) {
      console.error('Error dismissing alert:', error);
      throw new Error('Failed to dismiss alert');
    }
  },

  createAlert: async (alert: Omit<Alert, 'id' | 'createdAt'>): Promise<Alert> => {
    try {
      const response = await apiClient.post('/alerts', alert);
      return extractApiData<Alert>(response);
    } catch (error) {
      console.error('Error creating alert:', error);
      throw new Error('Failed to create alert');
    }
  },
};
