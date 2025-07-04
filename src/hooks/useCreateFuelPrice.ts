
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fuelPricesApi } from '@/api/fuel-prices';
import { CreateFuelPriceRequest } from '@/api/api-contract';
import { toast } from '@/hooks/use-toast';

export const useCreateFuelPrice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateFuelPriceRequest) => {
      return fuelPricesApi.createFuelPrice(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuel-prices'] });
      toast({
        title: "Success",
        description: "Fuel price created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create fuel price",
        variant: "destructive",
      });
    }
  });
};
