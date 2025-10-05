import { useMutation } from '@tanstack/react-query';
import { type AxiosResponse, AxiosError } from 'axios';
import apiClient from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

// Define types for the function arguments
interface AuthCredentials {
  email: string;
  password: string;
}

interface SignupData extends AuthCredentials {
  firstName: string;
  lastName: string;
}

// Define the expected API response
interface AuthResponse {
  token: string;
}

/**
 * Hook for handling user login mutation.
 * @returns {Object} Mutation object with `mutate`, `isPending`, `error`, etc.
 * Example usage: `const { mutate: loginUser, isPending, error } = useLogin();`
 */
export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) =>
      apiClient.post<AuthResponse>('/auth/login', credentials),
    onSuccess: (data: AxiosResponse<AuthResponse>) => {
      // Assuming your backend returns a token in data.data.token
      if (data.data.token) {
        login(data.data.token);
      }
    },
    onError: (error: AxiosError) => {
      console.error('Login failed:', error);
      // Optionally use a toast notification
      // toast.error('Login failed. Please check your credentials.');
    },
  });
};

/**
 * Hook for handling user signup mutation.
 * @returns {Object} Mutation object with `mutate`, `isPending`, `error`, etc.
 * Example usage: `const { mutate: signupUser, isPending, error } = useSignup();`
 */
export const useSignup = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (userData: SignupData) =>
      apiClient.post<AuthResponse>('/auth/signup', userData),
    onSuccess: (data: AxiosResponse<AuthResponse>) => {
      // Log the user in immediately after successful signup
      if (data.data.token) {
        login(data.data.token);
      }
    },
    onError: (error: AxiosError) => {
      console.error('Signup failed:', error);
      // Optionally use a toast notification
      // toast.error('Signup failed. Please try again.');
    },
  });
};