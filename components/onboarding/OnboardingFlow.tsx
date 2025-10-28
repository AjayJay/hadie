import React, { useState, useEffect } from 'react';
import { ModularOnboardingFlow } from './ModularOnboardingFlow';
import { useOnboarding as useOnboardingAPI } from '../../hooks/useApi';
import type { UserRole } from '../../types/onboarding';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
  userId?: string;
  role?: UserRole;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onComplete, 
  userId = 'default-user',
  role = 'customer' 
}) => {
  const {
    getOnboardingData: getOnboardingDataAPI,
    updateOnboardingData: updateOnboardingDataAPI,
    completeOnboarding: completeOnboardingAPI,
  } = useOnboardingAPI();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load onboarding data from API on component mount
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const data = await getOnboardingDataAPI.execute();
        if (data) {
          // Handle any pre-existing onboarding data
          console.log('Loaded existing onboarding data:', data);
        }
      } catch (error) {
        console.error('Failed to load onboarding data:', error);
      }
    };

    loadOnboardingData();
  }, []);

  const handleOnboardingComplete = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save onboarding data to API
      await updateOnboardingDataAPI.execute(userData);
      
      // Complete onboarding via API
      const completedUserData = await completeOnboardingAPI.execute();
      
      if (completedUserData) {
        onComplete(completedUserData);
      } else {
        setError('Failed to complete onboarding. Please try again.');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => setError(null)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ModularOnboardingFlow
      userId={userId}
      role={role}
      onComplete={handleOnboardingComplete}
    />
  );
};
