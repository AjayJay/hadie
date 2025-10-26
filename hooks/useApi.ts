import { useState, useCallback } from 'react';
import { apiClient, ApiResponse } from '../services/apiService';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiFunction(...args);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        return response.data;
      } else {
        const errorMessage = response.error || response.message || 'API request failed';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        return null;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for common API operations
export function useAuth() {
  const login = useApi(apiClient.login.bind(apiClient));
  const register = useApi(apiClient.register.bind(apiClient));
  const logout = useApi(apiClient.logout.bind(apiClient));
  const getProfile = useApi(apiClient.getProfile.bind(apiClient));
  const updateProfile = useApi(apiClient.updateProfile.bind(apiClient));

  return {
    login,
    register,
    logout,
    getProfile,
    updateProfile,
  };
}

export function useOnboarding() {
  const getOnboardingData = useApi(apiClient.getOnboardingData.bind(apiClient));
  const updateOnboardingData = useApi(apiClient.updateOnboardingData.bind(apiClient));
  const completeOnboarding = useApi(apiClient.completeOnboarding.bind(apiClient));
  const resetOnboarding = useApi(apiClient.resetOnboarding.bind(apiClient));

  return {
    getOnboardingData,
    updateOnboardingData,
    completeOnboarding,
    resetOnboarding,
  };
}
