
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi } from '@/api/stations';
import type { CreateStationData, UpdateStationData } from '@/api/stations';

export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
    staleTime: 0, // Always consider data stale
    gcTime: 1000, // Short cache time
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
};

export const useStationsWithMetrics = () => {
  return useStations();
};

export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsApi.getStation(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStationData) => stationsApi.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

export const useUpdateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationData }) =>
      stationsApi.updateStation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationsApi.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

export const useStationMetrics = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'metrics'],
    queryFn: () => stationsApi.getStationMetrics(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useStationPerformance = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'performance'],
    queryFn: () => stationsApi.getStationPerformance(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

export const useStationEfficiency = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'efficiency'],
    queryFn: () => stationsApi.getStationEfficiency(id),
    enabled: !!id,
    staleTime: 60000,
  });
};
