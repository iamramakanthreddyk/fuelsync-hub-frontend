

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { nozzlesService, Nozzle } from '@/api/services/nozzlesService';
import { pumpsService, Pump } from '@/api/services/pumpsService';
import { stationsApi } from '@/api/stations';
import type { Station } from '@/api/api-contract';

interface DataMappingContextType {
  mapApiData: <T,>(data: any, mapping?: Record<string, string>) => T;
  mapArrayData: <T,>(data: any[], mapping?: Record<string, string>) => T[];
  getStationByNozzleId: (nozzleId: string) => Promise<string>;
  getNozzleNumber: (nozzleId: string) => Promise<number>;
  getNozzleFuelType: (nozzleId: string) => Promise<string>;
  isReady: boolean;
  isLoading: boolean;
}

const DataMappingContext = createContext<DataMappingContextType | undefined>(undefined);

interface DataMappingProviderProps {
  children: ReactNode;
}

export function DataMappingProvider({ children }: DataMappingProviderProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const mapApiData = <T,>(data: any, mapping?: Record<string, string>): T => {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (!mapping) {
      return data as T;
    }

    const mappedData: any = {};
    
    // Apply field mappings
    Object.entries(mapping).forEach(([apiField, localField]) => {
      if (data[apiField] !== undefined) {
        mappedData[localField] = data[apiField];
      }
    });

    // Keep unmapped fields
    Object.entries(data).forEach(([key, value]) => {
      if (!mapping[key] && !mappedData[key]) {
        mappedData[key] = value;
      }
    });

    return mappedData as T;
  };

  const mapArrayData = <T,>(data: any[], mapping?: Record<string, string>): T[] => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(item => mapApiData<T>(item, mapping));
  };

  // Local caches to avoid repeated API calls
  const nozzleCache = React.useRef<Map<string, Nozzle>>(new Map());
  const pumpCache = React.useRef<Map<string, Pump>>(new Map());
  const stationCache = React.useRef<Map<string, Station>>(new Map());

  const fetchNozzle = async (id: string): Promise<Nozzle | null> => {
    if (nozzleCache.current.has(id)) {
      return nozzleCache.current.get(id)!;
    }
    try {
      const nozzle = await nozzlesService.getNozzle(id);
      nozzleCache.current.set(id, nozzle);
      return nozzle;
    } catch (error) {
      console.error('[DATA-MAPPING] Failed to fetch nozzle', id, error);
      return null;
    }
  };

  const fetchPump = async (id: string): Promise<Pump | null> => {
    if (pumpCache.current.has(id)) {
      return pumpCache.current.get(id)!;
    }
    try {
      const pump = await pumpsService.getPump(id);
      pumpCache.current.set(id, pump);
      return pump;
    } catch (error) {
      console.error('[DATA-MAPPING] Failed to fetch pump', id, error);
      return null;
    }
  };

  const fetchStation = async (id: string): Promise<Station | null> => {
    if (stationCache.current.has(id)) {
      return stationCache.current.get(id)!;
    }
    try {
      const station = await stationsApi.getStation(id);
      stationCache.current.set(id, station);
      return station;
    } catch (error) {
      console.error('[DATA-MAPPING] Failed to fetch station', id, error);
      return null;
    }
  };

  const getStationByNozzleId = async (nozzleId: string): Promise<string> => {
    const nozzle = await fetchNozzle(nozzleId);
    if (!nozzle) return '';

    let stationId = (nozzle as any).stationId as string | undefined;

    if (!stationId && nozzle.pumpId) {
      const pump = await fetchPump(nozzle.pumpId);
      stationId = pump?.stationId;
    }

    if (!stationId) return '';

    const station = await fetchStation(stationId);
    return station?.name || '';
  };

  const getNozzleNumber = async (nozzleId: string): Promise<number> => {
    const nozzle = await fetchNozzle(nozzleId);
    return nozzle?.nozzleNumber ?? 0;
  };

  const getNozzleFuelType = async (nozzleId: string): Promise<string> => {
    const nozzle = await fetchNozzle(nozzleId);
    return nozzle?.fuelType || '';
  };

  const value: DataMappingContextType = {
    mapApiData,
    mapArrayData,
    getStationByNozzleId,
    getNozzleNumber,
    getNozzleFuelType,
    isReady: isAuthenticated && !authLoading,
    isLoading: authLoading,
  };

  return (
    <DataMappingContext.Provider value={value}>
      {children}
    </DataMappingContext.Provider>
  );
}

export function useDataMapping() {
  const context = useContext(DataMappingContext);
  if (context === undefined) {
    throw new Error('useDataMapping must be used within a DataMappingProvider');
  }
  return context;
}

