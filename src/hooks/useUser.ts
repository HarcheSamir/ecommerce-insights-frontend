import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type AxiosResponse, AxiosError } from 'axios';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

// Define the ContentCreator interface to match backend response
interface ContentCreator {
  id: string;
  nickname?: string;
  username: string;
  profileLink: string;
  instagram?: string;
  country: string;
  region?: {
    id: string;
    name: string;
    countryName: string;
    flag: string;
  };
  youtube?: string;
  followers?: number | null;
}

// Define the VisitedProfile interface
interface VisitedProfile {
  visitedAt: string | null;
  creator: ContentCreator;
}

// Define the SearchHistory interface
interface SearchHistory {
  id: string;
  keyword?: string;
  country?: string;
  createdAt: string;
}

// Define the User interface
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  accountType: string;
  createdAt: string;
  searchHistory: SearchHistory[];
  totalSearchCount: number;
  visitedProfiles: VisitedProfile[];
  totalVisitsCount: number;
  hasPaid: boolean;
}

// Define the response type for password update
interface PasswordUpdateResponse {
  message: string;
}

// --- Fetch User Profile Query ---
export const useUserProfile = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => apiClient.get<User>('/profile/me'),
    enabled: isAuthenticated,
    select: (data: AxiosResponse<User>) => data.data, // Return the User object
  });
};

// --- Update Password Mutation ---
interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const useUpdatePassword = () => {
  const queryClient = useQueryClient(); // Use queryClient for cache invalidation

  return useMutation({
    mutationFn: (passwordData: UpdatePasswordData) =>
      apiClient.patch<PasswordUpdateResponse>('/profile/update-password', passwordData),
    onSuccess: () => {
      // Invalidate user profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      // Show success message
      // Replace alert with a toast notification for better UX
      alert('Password updated successfully!');
    },
    onError: (error: AxiosError) => {
      console.error('Failed to update password:', error);
      // Replace alert with a toast notification for better UX
      alert('Failed to update password. Please check your current password.');
    },
  });
};

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  stripeInvoiceId: string;
}

// Define the response type for payment intent creation
interface PaymentIntentResponse {
  Message: string;
  clientSecret: string;
  transaction: Transaction;
}

// --- Create Payment Intent Mutation ---
export const useCreatePaymentIntent = () => {
  const { user } = useAuth(); // Assuming useAuth provides user object with id

  return useMutation({
    mutationFn: () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return apiClient.post<PaymentIntentResponse>(`/payment/create-intent/${user.id}`);
    },
    onSuccess: (data: AxiosResponse<PaymentIntentResponse>) => {
      // Return the response data (clientSecret and transaction)
      return data.data;
    },
    onError: (error: AxiosError) => {
      console.error('Failed to create payment intent:', error);
      // Replace alert with a toast notification for better UX
      alert('Failed to create payment intent. Please try again.');
    },
  });
};