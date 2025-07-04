
/**
 * @file hooks/api/useInventory.ts
 * @description React Query hooks for fuel inventory API
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { inventoryService, FuelInventory, FuelInventorySummary, InventoryUpdatePayload } from '@/api/services/inventoryService';

/**
 * Hook to fetch fuel inventory
 * @param stationId Optional station ID to filter by
 * @returns Query result with fuel inventory data
 */
export const useInventory = (stationId?: string) => {
  return useQuery({
    queryKey: ['inventory', stationId],
    queryFn: () => inventoryService.getFuelInventory(stationId),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

/**
 * Hook to fetch fuel inventory summary
 * @returns Query result with inventory summary data
 */
export const useInventoryAlerts = () => {
  return useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: () => inventoryService.getInventoryAlerts(),
    staleTime: 60000, // 1 minute
    retry: 2
  });
};

export const useInventoryUpdate = () => {
  return useMutation({
    mutationFn: (payload: InventoryUpdatePayload) => inventoryService.updateInventory(payload)
  });
};
