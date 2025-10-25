// src/hooks/useRegions.ts

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse } from 'axios';
import apiClient from '../lib/apiClient';

// Type Definition for a single region/country
export type Region = {
  id: string;
  name: string;
  countryName: string | null; // <-- Correctly typed to allow null
  flag: string | null;      // <-- Correctly typed to allow null
};

// Type for the full API response from your backend
interface RegionsResponse {
  data: Region[];
}

// Custom hook to fetch the list of regions
export const useRegions = () => {
  return useQuery<Region[], AxiosError>({
    queryKey: ['regions'],
    queryFn: async () => {
      const response: AxiosResponse<RegionsResponse> = await apiClient.get('/content-creators/regions');
      
      const regionsData = response.data.data;

      // THIS IS THE FIX:
      // We must handle the case where countryName can be null.
      // This sort function safely handles nulls by treating them as less than any string.
      regionsData.sort((a, b) => {
        if (a.countryName === null) return -1;
        if (b.countryName === null) return 1;
        return a.countryName.localeCompare(b.countryName);
      });
      
      return regionsData;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    refetchOnWindowFocus: false,
  });
};