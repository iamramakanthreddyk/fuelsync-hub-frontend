
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { readingsService } from '@/api/contract/readings.service';
import type { CreateReadingRequest } from '@/api/api-contract';
import { useToast } from '@/hooks/use-toast';

export const useReadings = (nozzleId?: string) => {
  return useQuery({
    queryKey: ['readings', nozzleId],
    queryFn: () => readingsService.getReadings({ nozzleId }),
  });
};


export const useCreateReading = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: readingsService.createReading,
    onSuccess: (data) => {
      console.log('[READINGS] Reading created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['readings'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['nozzles'] });
      toast({
        title: "Success",
        description: "Reading recorded successfully. Sale auto-generated.",
      });
    },
    onError: (error: any) => {
      console.error('[READINGS] Error creating reading:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to record reading",
        variant: "destructive",
      });
    },
  });
};

export const useLatestReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['readings', 'latest', nozzleId],
    queryFn: () => readingsService.getLatestReading(nozzleId),
    enabled: !!nozzleId,
  });
};

export const useCanCreateReading = (nozzleId: string) => {
  return useQuery({
    queryKey: ['can-create-reading', nozzleId],
    queryFn: () => readingsService.canCreateReading(nozzleId),
    enabled: !!nozzleId,
  });
};
