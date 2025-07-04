
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import type { SalesReportFilters, SalesReportExportFilters } from '@/api/api-contract';

export const useSalesReport = (filters: SalesReportFilters) => {
  return useQuery({
    queryKey: ['sales-report', filters],
    queryFn: () => reportsApi.getSalesReport(filters),
    enabled: !!(filters.startDate && filters.endDate),
  });
};

export const useReportExport = () => {
  const exportMutation = useMutation({
    mutationFn: reportsApi.exportReport,
  });

  const scheduleMutation = useMutation({
    mutationFn: reportsApi.scheduleReport,
  });

  return {
    exportReport: exportMutation.mutateAsync,
    scheduleReport: scheduleMutation.mutateAsync,
    isExporting: exportMutation.isPending,
  };
};

export const useExportSalesReport = (filters: SalesReportExportFilters) => {
  return useMutation({
    mutationFn: () => reportsApi.exportSalesReport(filters),
  });
};

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.getReports(),
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: ['report', id],
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => reportsApi.generateReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: (id: string) => reportsApi.downloadReport(id),
    onSuccess: (url) => {
      if (url) window.open(url, '_blank');
    },
  });
};
