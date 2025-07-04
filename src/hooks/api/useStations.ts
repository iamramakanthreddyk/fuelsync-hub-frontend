
/**
 * @file hooks/api/useStations.ts
 * @description React Query hooks for stations API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stationsApi, CreateStationData, UpdateStationData } from '@/api/stations';
import { stationsService } from '@/api/services/stationsService';
import type { StationMetric, StationComparison } from '@/api/api-contract';

/**
 * Hook to fetch all stations
 * @returns Query result with stations data
 */
export const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations(),
    gcTime: 60000, // 1 minute
  });
};

/**
 * Hook to fetch a station by ID
 * @param id Station ID
 * @returns Query result with station data
 */
export const useStation = (id: string) => {
  return useQuery({
    queryKey: ['station', id],
    queryFn: () => stationsApi.getStation(id),
    enabled: !!id,
    gcTime: 60000, // 1 minute
  });
};

/**
 * Hook to create a station
 * @returns Mutation result for creating a station
 */
export const useCreateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStationData) => stationsApi.createStation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

/**
 * Hook to update a station
 * @returns Mutation result for updating a station
 */
export const useUpdateStation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStationData }) => stationsApi.updateStation(id, data),
    onSuccess: (station, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['station', id] });
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

/**
 * Hook to delete a station
 * @returns Mutation result for deleting a station
 */
export const useDeleteStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stationsApi.deleteStation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stations'] });
    },
  });
};

/**
 * Hook to fetch metrics for a station
 */
export const useStationMetrics = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'metrics'],
    queryFn: () => stationsService.getStationMetrics(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

/**
 * Hook to fetch performance data for a station
 */
export const useStationPerformance = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'performance'],
    queryFn: () => stationsService.getStationPerformance(id),
    enabled: !!id,
    staleTime: 60000,
  });
};

/**
 * Hook to fetch efficiency metric for a station
 */
export const useStationEfficiency = (id: string) => {
  return useQuery({
    queryKey: ['station', id, 'efficiency'],
    queryFn: () => stationsService.getStationEfficiency(id),
    enabled: !!id,
    staleTime: 60000,
  });
};
