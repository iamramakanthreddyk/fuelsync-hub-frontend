
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesApi } from '@/api/fuel-prices';
import { toast } from '@/hooks/use-toast';

export { useFuelPriceValidation } from './useFuelPriceValidation';
export { useCreateFuelPrice } from './useCreateFuelPrice';

export const useFuelPrices = (stationId?: string) => {
  return useQuery({
    queryKey: ['fuel-prices', stationId],
    queryFn: () => fuelPricesApi.getFuelPrices(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useDeleteFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; stationId: string }) => {
      return fuelPricesApi.deleteFuelPrice(params.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete fuel price",
        variant: "destructive",
      });
    }
  });
};
