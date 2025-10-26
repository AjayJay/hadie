import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useOnboarding as useOnboardingAPI } from '../../hooks/useApi';
import { OnboardingProgress, OnboardingNavigation } from './OnboardingComponents';
import { WelcomeStep, RoleSelectionStep } from './WelcomeAndRoleSteps';
import { CustomerProfileStep, ExpertProfileStep } from './ProfileSteps';
import type { OnboardingStep } from '../../types';

interface OnboardingFlowProps {
  onComplete: (userData: any) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const {
    onboardingData,
    updateRole,
    updateCustomerData,
    updateExpertData,
    goToStep,
    nextStep,
    previousStep,
    completeOnboarding,
    canProceedToNext,
  } = useOnboarding();

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
          // Update local state with API data
          // This would need to be implemented in the useOnboarding hook
        }
      } catch (error) {
        console.error('Failed to load onboarding data:', error);
      }
    };

    loadOnboardingData();
  }, []);

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Save onboarding data to API
      await updateOnboardingDataAPI.execute(onboardingData);
      
      // Complete onboarding via API
      const userData = await completeOnboardingAPI.execute();
      
      if (userData) {
        completeOnboarding();
        onComplete(userData);
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

  const handleNext = async () => {
    try {
      // Save current progress to API
      await updateOnboardingDataAPI.execute(onboardingData);
      nextStep();
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
      setError('Failed to save progress. Please try again.');
    }
  };

  const renderCurrentStep = () => {
    switch (onboardingData.currentStep) {
      case 'welcome':
        return <WelcomeStep onNext={nextStep} />;
      
      case 'role-selection':
        return (
          <RoleSelectionStep
            selectedRole={onboardingData.role}
            onRoleSelect={updateRole}
            onNext={nextStep}
          />
        );
      
      case 'profile-setup':
        if (onboardingData.role === 'customer') {
          return (
            <CustomerProfileStep
              data={onboardingData.customerData}
              onUpdate={updateCustomerData}
            />
          );
        } else {
          return (
            <ExpertProfileStep
              data={onboardingData.expertData}
              onUpdate={updateExpertData}
            />
          );
        }
      
      case 'verification':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Verification Required
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {onboardingData.role === 'expert' 
                ? 'As an expert, you need to verify your identity and provide some additional documents.'
                : 'Verification is optional for customers, but recommended for better security.'
              }
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-yellow-800">
                {onboardingData.role === 'expert' 
                  ? 'Expert verification will be implemented in the next phase.'
                  : 'Customer verification is optional and can be completed later.'
                }
              </p>
            </div>
          </div>
        );
      
      case 'service-selection':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Selection
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {onboardingData.role === 'expert' 
                ? 'Select the services you want to offer.'
                : 'Choose your preferred services for quick booking.'
              }
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800">
                Service selection will be implemented in the next phase.
              </p>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Location Setup
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {onboardingData.role === 'expert' 
                ? 'Set your service areas and availability.'
                : 'Add your address for service delivery.'
              }
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800">
                Location setup will be implemented in the next phase.
              </p>
            </div>
          </div>
        );
      
      case 'completion':
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">✓</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Handie! 🎉
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Your account has been created successfully. You're all set to start using Handie!
              </p>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  What's next?
                </h3>
                <p className="text-blue-600">
                  {onboardingData.role === 'customer' 
                    ? 'Start browsing services and book your first appointment!'
                    : 'Complete your verification to start receiving bookings.'
                  }
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const isLastStep = onboardingData.currentStep === 'completion';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={onboardingData.currentStep}
          completedSteps={onboardingData.completedSteps}
          onStepClick={goToStep}
        />

        {/* Current Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {renderCurrentStep()}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Navigation */}
        {!isLastStep && (
          <OnboardingNavigation
            onNext={handleNext}
            onPrevious={previousStep}
            onComplete={handleComplete}
            canProceed={canProceedToNext()}
            isLastStep={isLastStep}
            isLoading={isLoading}
          />
        )}

        {/* Complete Button for last step */}
        {isLastStep && (
          <div className="text-center mt-8">
            <button
              onClick={handleComplete}
              className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
