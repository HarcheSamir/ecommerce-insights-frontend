// src/hooks/useTraining.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import apiClient from '../lib/apiClient';

// --- Type Definitions ---
export interface VideoProgress {
  id: string;
  completed: boolean;
  completedAt: string | null;
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string; // Using the full URL
  duration: number | null;
  order: number;
  courseId: string;
  progress: VideoProgress[]; 
}

export interface VideoCourse {
  id: string;
  title: string;
  description: string | null;
  order: number;
  videos: Video[]; 
  totalVideos?: number;
  completedVideos?: number;
}

// --- Hook to fetch all courses ---
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response: AxiosResponse<VideoCourse[]> = await apiClient.get('/training/courses');
      return response.data;
    },
  });
};

// --- Hook to fetch a single course with its videos and progress ---
export const useCourse = (courseId: string | null) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      const response: AxiosResponse<VideoCourse> = await apiClient.get(`/training/courses/${courseId}`);
      return response.data;
    },
    enabled: !!courseId,
  });
};

// --- Mutation to update video progress ---
export const useUpdateVideoProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ videoId, completed }: { videoId: string, completed: boolean }) =>
      apiClient.post(`/training/videos/${videoId}/progress`, { completed }),
    onSuccess: (data, variables) => {
      // Invalidate the query for the current course to refetch progress data
      queryClient.invalidateQueries({ queryKey: ['course'] });
    },
  });
};