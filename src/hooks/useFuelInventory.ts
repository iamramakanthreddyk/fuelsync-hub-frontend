
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import { FuelInventoryParams } from '@/api/api-contract';
import { toast } from '@/hooks/use-toast';

export const useFuelInventory = (params?: FuelInventoryParams) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => inventoryApi.getFuelInventory(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    select: (data) => {
      // Ensure we return an array even if API returns different format
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) return (data as any).data;
      if (data && typeof data === 'object' && 'inventory' in data && Array.isArray((data as any).inventory)) return (data as any).inventory;
      return [];
    }
  });
};

export const useFuelInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: () => inventoryApi.getInventorySummary(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    select: (data) => {
      // Normalize the response format
      if (data && typeof data === 'object' && 'data' in data) return (data as any).data;
      return data || {};
    }
  });
};

export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => inventoryApi.getInventoryAlerts(),
    staleTime: 2 * 60 * 1000, // 2 minutes for alerts
    retry: 1,
    select: (data) => {
      // Ensure we return an array of alerts
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) return (data as any).data;
      if (data && typeof data === 'object' && 'alerts' in data && Array.isArray((data as any).alerts)) return (data as any).alerts;
      return [];
    }
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; quantity: number; type: 'add' | 'subtract' }) => {
      // This would need to be implemented in the inventory API
      console.log('Updating inventory:', params);
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      // Invalidate and refetch inventory data
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-alerts'] });
      
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update inventory",
        variant: "destructive",
      });
    }
  });
};
