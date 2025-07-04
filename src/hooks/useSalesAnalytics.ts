import { useQuery } from '@tanstack/react-query';
import { salesApi } from '@/api/sales';

/**
 * React Query hook to fetch sales analytics
 */
export const useSalesAnalytics = () => {
  return useQuery({
    queryKey: ['sales-analytics'],
    queryFn: () => salesApi.getSalesAnalytics(),
  });
};

