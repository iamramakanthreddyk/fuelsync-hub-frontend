import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import type { InventoryUpdateRequest } from '@/api/api-contract';
import { useToast } from './use-toast';

export const useInventory = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryApi.getInventory(),
  });
};

export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: ['inventory', 'alerts'],
    queryFn: () => inventoryApi.getInventoryAlerts(),
  });
};

export const useInventoryUpdate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: InventoryUpdateRequest) => inventoryApi.updateInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', 'alerts'] });
      toast({ title: 'Inventory Updated', description: 'Inventory counts updated successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update inventory',
        variant: 'destructive',
      });
    },
  });
};
