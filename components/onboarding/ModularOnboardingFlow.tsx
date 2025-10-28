import React, { useEffect, useState } from 'react';
import { OnboardingProvider, useOnboardingContext } from '../../contexts/OnboardingContext';
import { onboardingConfig, getStepsForRole, getOptionalStepsForRole } from '../../config/onboardingConfig';
import { 
  ProgressBar, 
  StepIndicator, 
  ErrorMessage, 
  SuccessMessage, 
  LoadingSpinner,
  BadgeComponent,
  AchievementComponent
} from './OnboardingComponents';
import type { OnboardingStepConfig, UserRole } from '../../types/onboarding';

// Main onboarding flow component
const OnboardingFlowContent: React.FC<{
  userId: string;
  role: UserRole;
  onComplete: (userData: any) => void;
}> = ({ userId, role, onComplete }) => {
  const {
    state,
    initializeSession,
    setCurrentStep,
    updateStepProgress,
    updateSessionData,
    pauseSession,
    resumeSession,
    completeSession,
    skipStep,
    earnBadge,
    updateAchievement,
    validateStep,
    getStepNavigation,
    getAvailableSteps,
    getCompletedSteps,
    getSkippedSteps,
    getStepProgress,
    canProceedToNext,
    canSkipStep,
    canPauseSession,
    getRecommendedSteps,
    setError,
    clearError
  } = useOnboardingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    if (!state.session) {
      initializeSession(userId, role, onboardingConfig);
    }
  }, [userId, role, initializeSession, state.session]);

  // Get current step configuration
  const currentStepConfig = state.session 
    ? getAvailableSteps().find(step => step.id === state.session.currentStep)
    : null;

  // Get all steps for progress calculation
  const allSteps = state.session ? getStepsForRole(state.session.role) : [];
  const completedSteps = getCompletedSteps();
  const skippedSteps = getSkippedSteps();
  const currentStepIndex = allSteps.findIndex(step => step.id === state.session?.currentStep) + 1;

  // Handle step navigation
  const handleNext = async () => {
    if (!state.session || !currentStepConfig) return;

    try {
      setIsLoading(true);
      clearError();

      // Validate current step
      const validation = validateStep(currentStepConfig.id, state.session.data[currentStepConfig.id] || {});
      if (!validation.isValid) {
        setError('Please complete all required fields');
        return;
      }

      // Mark current step as completed
      updateStepProgress(currentStepConfig.id, 'completed', state.session.data[currentStepConfig.id]);

      // Check for achievements
      checkAchievements();

      // Move to next step
      const navigation = getStepNavigation(currentStepConfig.id);
      if (navigation.nextStepId) {
        setCurrentStep(navigation.nextStepId);
      } else {
        // No more steps, complete onboarding
        await handleComplete();
      }
    } catch (error) {
      setError('Failed to proceed to next step');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (!state.session || !currentStepConfig) return;

    const navigation = getStepNavigation(currentStepConfig.id);
    if (navigation.previousStepId) {
      setCurrentStep(navigation.previousStepId);
    }
  };

  const handleSkip = () => {
    if (!state.session || !currentStepConfig) return;

    if (canSkipStep(currentStepConfig.id)) {
      skipStep(currentStepConfig.id);
      
      // Move to next step
      const navigation = getStepNavigation(currentStepConfig.id);
      if (navigation.nextStepId) {
        setCurrentStep(navigation.nextStepId);
      } else {
        handleComplete();
      }
    }
  };

  const handlePause = () => {
    pauseSession();
  };

  const handleResume = () => {
    resumeSession();
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      
      // Mark onboarding as completed
      completeSession();
      
      // Show success message
      setShowSuccess(true);
      
      // Call completion callback after a delay
      setTimeout(() => {
        onComplete(state.session?.data || {});
      }, 2000);
    } catch (error) {
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepClick = (stepId: string) => {
    // Only allow clicking on completed steps or current step
    const stepProgress = getStepProgress(stepId);
    if (stepProgress?.status === 'completed' || stepId === state.session?.currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleDataChange = (stepId: string, data: any) => {
    updateSessionData({ [stepId]: data });
  };

  const checkAchievements = () => {
    if (!state.session) return;

    // Check for speed demon badge
    const timeSpent = (Date.now() - state.session.startedAt.getTime()) / (1000 * 60); // minutes
    if (timeSpent < 10 && !state.session.badges.find(b => b.id === 'speed-demon')) {
      const badge = onboardingConfig.badges.find(b => b.id === 'speed-demon');
      if (badge) earnBadge(badge);
    }

    // Check for perfectionist badge
    const hasSkippedSteps = getSkippedSteps().length > 0;
    if (!hasSkippedSteps && !state.session.badges.find(b => b.id === 'perfectionist')) {
      const badge = onboardingConfig.badges.find(b => b.id === 'perfectionist');
      if (badge) earnBadge(badge);
    }

    // Update achievements
    const profileCompletion = onboardingConfig.achievements.find(a => a.id === 'profile-completion');
    if (profileCompletion && state.session.data['profile-setup']) {
      updateAchievement({ ...profileCompletion, progress: 100 });
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    if (!currentStepConfig || !state.session) return null;

    const StepComponent = currentStepConfig.component;
    const stepData = state.session.data[currentStepConfig.id] || {};
    const navigation = getStepNavigation(currentStepConfig.id);

    return (
      <StepComponent
        context={{
          session: state.session,
          stepConfig: currentStepConfig,
          navigation,
          onNext: handleNext,
          onPrevious: handlePrevious,
          onSkip: handleSkip,
          onPause: handlePause,
          onResume: handleResume,
          onComplete: handleComplete,
          updateData: (data) => handleDataChange(currentStepConfig.id, data),
          validate: () => validateStep(currentStepConfig.id, stepData)
        }}
        data={stepData}
        onDataChange={(data) => handleDataChange(currentStepConfig.id, data)}
        onValidationChange={(isValid) => {
          // Validation state is handled by the step component
        }}
      />
    );
  };

  if (!state.session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Initializing onboarding...</p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <SuccessMessage 
            message="Onboarding completed successfully!" 
            className="mb-4"
          />
          <p className="text-gray-600">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Handie
          </h1>
          <p className="text-gray-600">
            Let's get your {state.session.role} account set up
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Progress
            </h2>
            <div className="text-sm text-gray-600">
              {completedSteps.length} of {allSteps.length} steps completed
            </div>
          </div>
          
          <ProgressBar
            current={completedSteps.length}
            total={allSteps.length}
            showPercentage={true}
            showSteps={true}
            className="mb-4"
          />

          {/* Step Indicator */}
          <StepIndicator
            steps={allSteps.map(step => ({
              id: step.id,
              title: step.title,
              status: completedSteps.includes(step.id) 
                ? 'completed' 
                : skippedSteps.includes(step.id)
                ? 'skipped'
                : step.id === state.session.currentStep
                ? 'current'
                : 'pending'
            }))}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Gamification Section */}
        {onboardingConfig.settings.enableGamification && state.session.badges.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🏆 Your Badges
            </h2>
            <div className="flex space-x-4">
              {state.session.badges.map((badge) => (
                <BadgeComponent
                  key={badge.id}
                  badge={badge}
                  size="md"
                  showAnimation={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          {state.error && (
            <ErrorMessage 
              message={state.error} 
              onDismiss={clearError}
              className="mb-6"
            />
          )}
          
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        {currentStepConfig && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={isLoading || !getStepNavigation(currentStepConfig.id).canGoPrevious}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {canSkipStep(currentStepConfig.id) && (
                  <button
                    onClick={handleSkip}
                    disabled={isLoading}
                    className="px-6 py-2 text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  >
                    Skip
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                {canPauseSession() && state.isPaused && (
                  <button
                    onClick={handleResume}
                    disabled={isLoading}
                    className="px-6 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    Resume
                  </button>
                )}
                
                {canPauseSession() && !state.isPaused && (
                  <button
                    onClick={handlePause}
                    disabled={isLoading}
                    className="px-6 py-2 text-orange-600 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
                  >
                    Pause
                  </button>
                )}

                <button
                  onClick={handleNext}
                  disabled={isLoading || !canProceedToNext(currentStepConfig.id)}
                  className={`px-8 py-2 rounded-lg font-medium transition-colors ${
                    canProceedToNext(currentStepConfig.id) && !isLoading
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Loading...
                    </div>
                  ) : (
                    'Next'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Steps */}
        {getRecommendedSteps().length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">
              💡 Recommended Next Steps
            </h3>
            <div className="space-y-2">
              {getRecommendedSteps().slice(0, 3).map((stepId) => {
                const step = getAvailableSteps().find(s => s.id === stepId);
                return step ? (
                  <div key={stepId} className="text-blue-700">
                    • {step.title} - {step.description}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main onboarding flow component with provider
export const ModularOnboardingFlow: React.FC<{
  userId: string;
  role: UserRole;
  onComplete: (userData: any) => void;
}> = ({ userId, role, onComplete }) => {
  return (
    <OnboardingProvider>
      <OnboardingFlowContent
        userId={userId}
        role={role}
        onComplete={onComplete}
      />
    </OnboardingProvider>
  );
};
