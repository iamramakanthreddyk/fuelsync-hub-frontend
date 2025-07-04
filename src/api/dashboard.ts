
import { apiClient, extractApiData, extractApiArray } from './client';
import type { 
  SalesSummary, 
  PaymentMethodBreakdown, 
  FuelTypeBreakdown, 
  TopCreditor, 
  DailySalesTrend, 
  StationMetric 
} from './api-contract';

interface DashboardFilters {
  stationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const dashboardApi = {
  getSalesSummary: async (range: string = 'monthly', filters: DashboardFilters = {}): Promise<SalesSummary> => {
    const response = await apiClient.get('/dashboard/sales-summary', {
      params: { range, ...filters }
    });
    return extractApiData<SalesSummary>(response);
  },

  getPaymentMethodBreakdown: async (filters: DashboardFilters = {}): Promise<PaymentMethodBreakdown[]> => {
    const response = await apiClient.get('/dashboard/payment-methods', {
      params: filters
    });
    return extractApiArray<PaymentMethodBreakdown>(response);
  },

  getFuelTypeBreakdown: async (filters: DashboardFilters = {}): Promise<FuelTypeBreakdown[]> => {
    const response = await apiClient.get('/api/v1/dashboard/fuel-breakdown', {
      params: filters
    });
    return extractApiArray<FuelTypeBreakdown>(response);
  },

  getTopCreditors: async (limit: number = 5): Promise<TopCreditor[]> => {
    const response = await apiClient.get('/dashboard/top-creditors', {
      params: { limit }
    });
    return extractApiArray<TopCreditor>(response);
  },

  getDailySalesTrend: async (days: number = 7, filters: DashboardFilters = {}): Promise<DailySalesTrend[]> => {
    const response = await apiClient.get('/api/v1/dashboard/sales-trend', {
      params: { days, ...filters }
    });
    return extractApiArray<DailySalesTrend>(response);
  },

  getStationMetrics: async (): Promise<StationMetric[]> => {
    const response = await apiClient.get('/dashboard/station-metrics');
    return extractApiArray<StationMetric>(response);
  },
};
