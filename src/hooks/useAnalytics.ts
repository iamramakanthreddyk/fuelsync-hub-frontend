
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/api/analytics';
import { stationsApi } from '@/api/stations';
import { StationComparisonParams } from '@/api/api-contract';

export const useCompareStations = (opts: StationComparisonParams) => {
  return useQuery({
    queryKey: ['stations', 'compare', opts.stationIds, opts.period],
    queryFn: () => stationsApi.compareStations(opts),
    enabled: opts.stationIds.length > 0,
  });
};

export const useHourlySales = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['analytics', 'hourly-sales', stationId, dateRange],
    queryFn: () => analyticsApi.getHourlySales(stationId, dateRange),
  });
};

export const usePeakHours = (stationId?: string) => {
  return useQuery({
    queryKey: ['analytics', 'peak-hours', stationId],
    queryFn: () => analyticsApi.getPeakHours(stationId),
  });
};

export const useFuelPerformance = (stationId?: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['analytics', 'fuel-performance', stationId, dateRange],
    queryFn: () => analyticsApi.getFuelPerformance(stationId, dateRange),
  });
};

export const useStationRanking = (period: string) => {
  return useQuery({
    queryKey: ['stations', 'ranking', period],
    queryFn: () => stationsApi.getStationRanking(period),
  });
};

export const useSuperAdminAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'superadmin'],
    queryFn: () => analyticsApi.getSuperAdminAnalytics(),
  });
};

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => analyticsApi.getDashboardAnalytics(),
  });
};

export const useTenantAnalytics = (tenantId: string) => {
  return useQuery({
    queryKey: ['analytics', 'tenant', tenantId],
    queryFn: () => analyticsApi.getTenantAnalytics(tenantId),
    enabled: !!tenantId,
  });
};
