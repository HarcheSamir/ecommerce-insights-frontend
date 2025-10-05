// src/hooks/useSearchCreators.ts

import { useMutation } from '@tanstack/react-query';
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
  // ... other fields from your API response
}

// Meta information for pagination
interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// CORRECTED: This now matches the API response structure { data: [], meta: {} }
interface SearchResponse {
  data: Creator[];
  meta: Meta;
}

interface SearchParams {
  keyword?: string;
  country?: string; // This expects the country code, e.g., "AE"
  platform?: string; // Filter by platform: 'instagram', 'youtube', 'tiktok'
  minFollowers?: number; // Minimum follower count
  maxFollowers?: number; // Maximum follower count
  page?: number;
  limit?: number;
}

export const useSearchCreators = () => {
  return useMutation({
    mutationFn: (params: SearchParams) =>
      apiClient.post<SearchResponse>('/content-creators/search', params),
    onSuccess: (data: AxiosResponse<SearchResponse>) => {
      console.log('Search successful:', data.data);
    },
    onError: (error: AxiosError) => {
      console.error('Search failed:', error);
    },
  });
};

// ... (useRecordVisit hook remains the same)

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
}