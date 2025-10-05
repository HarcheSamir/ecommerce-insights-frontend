import { useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import apiClient from '../lib/apiClient'; // Make sure this path is correct

// --- Type Definition ---
export type Region = {
  id: string;
  name: string;
  countryName: string;
  flag: string; // The flag emoji
};

// --- Regions Query Hook ---
export const useRegions = () => {
  return useQuery<{data:Region[]}, AxiosError>({
    /**
     * queryKey: A unique key for this query. React Query uses this for caching.
     * The query will be automatically refetched when this key changes.
     */
    queryKey: ['regions'],

    /**
     * queryFn: The asynchronous function that fetches the data.
     * It must return a promise.
     */
    queryFn: async () => {
      // Use the apiClient to make the GET request
      const response = await apiClient.get<{data:Region[]}>('/content-creators/regions');
      console.log('Fetched regions:', response.data.data);
      // The actual data from an Axios response is in the `data` property
      return response.data;
    },

    // --- Optional but Recommended Configuration ---
    /**
     * staleTime: The time in milliseconds that data is considered "fresh".
     * Fresh data will be served from the cache without a background refetch.
     * 5 minutes is a good default for data that doesn't change often.
     */
    staleTime: 1000 * 60 * 5, // 5 minutes

    /**
     * refetchOnWindowFocus: If set to false, the query will not refetch
     * just because the user switched tabs and came back. Useful for static data.
     */
    refetchOnWindowFocus: false,
  });
};