
import { apiClient, extractApiData, extractApiArray } from './client';

export interface TenantSetting {
  key: string;
  value: string;
  updatedAt: string;
}

export const tenantSettingsApi = {
  /**
   * Retrieve settings for the currently scoped tenant
   */
  getTenantSettings: async (): Promise<TenantSetting[]> => {
    try {
      const response = await apiClient.get('/tenant/settings');
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      console.error('[TENANT-SETTINGS] Error fetching tenant settings:', error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  /**
   * Update a single tenant setting
   */
  updateTenantSetting: async (key: string, value: string): Promise<TenantSetting> => {
    try {
      const response = await apiClient.post('/tenant/settings', { key, value });
      return extractApiData<TenantSetting>(response);
    } catch (error) {
      console.error(`[TENANT-SETTINGS] Error updating setting ${key}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  /**
   * Superadmin: fetch settings for a specific tenant
   */
  getTenantSettingsForTenant: async (tenantId: string): Promise<TenantSetting[]> => {
    try {
      const response = await apiClient.get(`/admin/tenants/${tenantId}/settings`);
      return extractApiArray<TenantSetting>(response, 'settings');
    } catch (error) {
      console.error(`[TENANT-SETTINGS] Error fetching settings for tenant ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  },

  /**
   * Superadmin: update setting for a specific tenant
   */
  updateTenantSettingForTenant: async (tenantId: string, key: string, value: string): Promise<TenantSetting> => {
    try {
      const response = await apiClient.put(`/admin/tenants/${tenantId}/settings/${encodeURIComponent(key)}`, { value });
      return extractApiData<TenantSetting>(response);
    } catch (error) {
      console.error(`[TENANT-SETTINGS] Error updating ${key} for tenant ${tenantId}:`, error);
      if (error.response?.data?.message) {
        console.error('Backend error message:', error.response.data.message);
      }
      throw error;
    }
  }
};
