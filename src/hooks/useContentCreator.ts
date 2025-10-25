// src/hooks/useContentCreator.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import { type AxiosResponse, AxiosError } from 'axios';
import apiClient from '../lib/apiClient';
import type { Region } from './useRegions';

// --- Type Definitions ---
export interface Creator {
  id: string;
  username: string | null;
  nickname: string | null;
  profileLink: string | null;
  country: string | null;
  region: Region ;
  followers: number | null;
  instagram: string | null;
  youtube: string | null;
  bio: string | null;
  email: string | null;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SearchResponse {
  data: Creator[];
  meta: Meta;
}

export interface SearchParams {
  keyword?: string;
  country?: string;
  platform?: string;
  minFollowers?: number;
  maxFollowers?: number;
  page?: number;
  limit?: number;
}


/**
 * Hook for fetching and searching content creators.
 * @param filters - The search, filter, and pagination parameters.
 */
export const useSearchCreators = (filters: SearchParams) => {
  return useQuery({
    queryKey: ['creators', filters],
    queryFn: async () => {
      const response: AxiosResponse<SearchResponse> = await apiClient.post('/content-creators/search', filters);
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
  });
};

// The useRecordVisit hook remains a mutation, which is correct for its purpose.
export const useRecordVisit = () => {
  return useMutation({
    mutationFn: (creatorId: string) =>
      apiClient.get(`/content-creators/${creatorId}/visit`  ),
    onSuccess: () => {
      console.log('Visit recorded successfully');
    },
    onError: (error: AxiosError) => {
      console.error('Failed to record visit:', error);
    },
  });
};