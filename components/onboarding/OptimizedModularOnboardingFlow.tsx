import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { OnboardingProvider, useOnboardingContext } from '../../contexts/OnboardingContext';
import { onboardingConfig, getStepsForRole } from '../../config/onboardingConfig';
import { 
  ProgressBar, 
  StepIndicator, 
  ErrorMessage, 
  SuccessMessage, 
  LoadingSpinner,
  BadgeComponent
} from './OnboardingComponents';
import { OnboardingErrorBoundary } from './OnboardingErrorBoundary';
import type { OnboardingStepConfig, UserRole } from '../../types/onboarding';

// Memoized step component to prevent unnecessary re-renders
const MemoizedStepComponent = React.memo<{
  stepConfig: OnboardingStepConfig;
  sessionData: any;
  onDataChange: (data: any) => void;
  onValidationChange: (isValid: boolean) => void;
  context: any;
}>(({ stepConfig, sessionData, onDataChange, onValidationChange, context }) => {
  const StepComponent = stepConfig.component;
  
  return (
    <StepComponent
      context={context}
      data={sessionData}
      onDataChange={onDataChange}
      onValidationChange={onValidationChange}
    />
  );
});

// Main onboarding flow component with performance optimizations
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
    validateStep,
    getStepNavigation,
    getAvailableSteps,
    getCompletedSteps,
    getSkippedSteps,
    canProceedToNext,
    canSkipStep,
    canPauseSession,
    setError,
    clearError
  } = useOnboardingContext();

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Memoize expensive calculations
  const allSteps = useMemo(() => 
    state.session ? getStepsForRole(state.session.role) : [],
    [state.session?.role]
  );

  const completedSteps = useMemo(() => 
    getCompletedSteps(),
    [state.session?.progress]
  );

  const skippedSteps = useMemo(() => 
    getSkippedSteps(),
    [state.session?.progress]
  );

  const currentStepConfig = useMemo(() => 
    state.session ? getAvailableSteps().find(step => step.id === state.session.currentStep) : null,
    [state.session?.currentStep, state.session?.role]
  );

  const progressPercentage = useMemo(() => 
    Math.round((completedSteps.length / allSteps.length) * 100),
    [completedSteps.length, allSteps.length]
  );

  // Initialize session on mount
  useEffect(() => {
    if (!state.session) {
      initializeSession(userId, role, onboardingConfig);
    }
  }, [userId, role, initializeSession, state.session]);

  // Debounced auto-save
  useEffect(() => {
    if (!state.config?.settings.autoSave || !state.session) return;

    const timeoutId = setTimeout(() => {
      // Auto-save logic here
      if (state.session?.data) {
        // Save to localStorage or API
        localStorage.setItem(`onboarding_${userId}`, JSON.stringify(state.session.data));
      }
    }, state.config.settings.saveInterval * 1000);

    return () => clearTimeout(timeoutId);
  }, [state.session?.data, state.config?.settings.autoSave, userId]);

  // Memoized event handlers
  const handleNext = useCallback(async () => {
    if (!state.session || !currentStepConfig) return;

    try {
      setIsLoading(true);
      clearError();

      const validation = validateStep(currentStepConfig.id, state.session.data[currentStepConfig.id] || {});
      if (!validation.isValid) {
        setError('Please complete all required fields');
        return;
      }

      updateStepProgress(currentStepConfig.id, 'completed', state.session.data[currentStepConfig.id]);
      checkAchievements();

      const navigation = getStepNavigation(currentStepConfig.id);
      if (navigation.nextStepId) {
        setCurrentStep(navigation.nextStepId);
      } else {
        await handleComplete();
      }
    } catch (error) {
      setError('Failed to proceed to next step');
    } finally {
      setIsLoading(false);
    }
  }, [state.session, currentStepConfig, validateStep, updateStepProgress, getStepNavigation, setCurrentStep]);

  const handlePrevious = useCallback(() => {
    if (!state.session || !currentStepConfig) return;

    const navigation = getStepNavigation(currentStepConfig.id);
    if (navigation.previousStepId) {
      setCurrentStep(navigation.previousStepId);
    }
  }, [state.session, currentStepConfig, getStepNavigation, setCurrentStep]);

  const handleSkip = useCallback(() => {
    if (!state.session || !currentStepConfig) return;

    if (canSkipStep(currentStepConfig.id)) {
      skipStep(currentStepConfig.id);
      
      const navigation = getStepNavigation(currentStepConfig.id);
      if (navigation.nextStepId) {
        setCurrentStep(navigation.nextStepId);
      } else {
        handleComplete();
      }
    }
  }, [state.session, currentStepConfig, canSkipStep, skipStep, getStepNavigation, setCurrentStep]);

  const handleComplete = useCallback(async () => {
    try {
      setIsLoading(true);
      completeSession();
      setShowSuccess(true);
      
      setTimeout(() => {
        onComplete(state.session?.data || {});
      }, 2000);
    } catch (error) {
      setError('Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  }, [completeSession, onComplete, state.session?.data, setError]);

  const handleStepClick = useCallback((stepId: string) => {
    const stepProgress = state.session?.progress.find(p => p.stepId === stepId);
    if (stepProgress?.status === 'completed' || stepId === state.session?.currentStep) {
      setCurrentStep(stepId);
    }
  }, [state.session, setCurrentStep]);

  const handleDataChange = useCallback((stepId: string, data: any) => {
    updateSessionData({ [stepId]: data });
  }, [updateSessionData]);

  const checkAchievements = useCallback(() => {
    if (!state.session) return;

    const timeSpent = (Date.now() - state.session.startedAt.getTime()) / (1000 * 60);
    if (timeSpent < 10 && !state.session.badges.find(b => b.id === 'speed-demon')) {
      const badge = onboardingConfig.badges.find(b => b.id === 'speed-demon');
      if (badge) earnBadge(badge);
    }
  }, [state.session, earnBadge]);

  // Render current step component
  const renderCurrentStep = useCallback(() => {
    if (!currentStepConfig || !state.session) return null;

    const navigation = getStepNavigation(currentStepConfig.id);
    const stepData = state.session.data[currentStepConfig.id] || {};

    const context = {
      session: state.session,
      stepConfig: currentStepConfig,
      navigation,
      onNext: handleNext,
      onPrevious: handlePrevious,
      onSkip: handleSkip,
      onPause: pauseSession,
      onResume: resumeSession,
      onComplete: handleComplete,
      updateData: (data: any) => handleDataChange(currentStepConfig.id, data),
      validate: () => validateStep(currentStepConfig.id, stepData)
    };

    return (
      <MemoizedStepComponent
        stepConfig={currentStepConfig}
        sessionData={stepData}
        onDataChange={(data) => handleDataChange(currentStepConfig.id, data)}
        onValidationChange={() => {}} // Handled by step component
        context={context}
      />
    );
  }, [currentStepConfig, state.session, getStepNavigation, handleNext, handlePrevious, handleSkip, pauseSession, resumeSession, handleComplete, handleDataChange, validateStep]);

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
    <OnboardingErrorBoundary>
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
                      onClick={resumeSession}
                      disabled={isLoading}
                      className="px-6 py-2 text-green-600 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                  
                  {canPauseSession() && !state.isPaused && (
                    <button
                      onClick={pauseSession}
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
        </div>
      </div>
    </OnboardingErrorBoundary>
  );
};

// Main onboarding flow component with provider
export const OptimizedModularOnboardingFlow: React.FC<{
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
