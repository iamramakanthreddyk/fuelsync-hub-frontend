
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import { FuelInventoryParams } from '@/api/api-contract';

export const useFuelInventory = (params?: FuelInventoryParams) => {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: () => inventoryApi.getFuelInventory(params)
  });
};

export const useFuelInventorySummary = () => {
  return useQuery({
    queryKey: ['inventory-summary'],
    queryFn: () => inventoryApi.getInventorySummary()
  });
};

export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => inventoryApi.getInventoryAlerts()
  });
};
