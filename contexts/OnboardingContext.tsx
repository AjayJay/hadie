import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  OnboardingSession,
  OnboardingConfig,
  OnboardingStepConfig,
  StepProgress,
  StepStatus,
  UserRole,
  ValidationResult,
  StepNavigation,
  Badge,
  Achievement
} from '../../types/onboarding';

// Action types
type OnboardingAction =
  | { type: 'INITIALIZE_SESSION'; payload: { userId: string; role: UserRole; config: OnboardingConfig } }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'UPDATE_STEP_PROGRESS'; payload: { stepId: string; status: StepStatus; data?: any } }
  | { type: 'UPDATE_SESSION_DATA'; payload: Record<string, any> }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SKIP_STEP'; payload: string }
  | { type: 'EARN_BADGE'; payload: Badge }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

// State interface
interface OnboardingState {
  session: OnboardingSession | null;
  config: OnboardingConfig | null;
  isLoading: boolean;
  error: string | null;
  isPaused: boolean;
}

// Initial state
const initialState: OnboardingState = {
  session: null,
  config: null,
  isLoading: false,
  error: null,
  isPaused: false
};

// Reducer
const onboardingReducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      // Auto-skip role selection if user already has a role
      const initialProgress = [];
      const userRole = action.payload.role;
      
      // If user already has a role, mark role-selection as skipped
      if (userRole) {
        initialProgress.push({
          stepId: 'role-selection',
          status: 'skipped',
          skippedAt: new Date(),
          data: { role: userRole }
        });
      }
      
      // Determine starting step - skip role-selection if user has role
      const coreSteps = action.payload.config.coreSteps;
      const startingStep = userRole 
        ? coreSteps.find(step => step.id !== 'role-selection')?.id || coreSteps[0]?.id || ''
        : coreSteps[0]?.id || '';
      
      return {
        ...state,
        session: {
          id: `session_${Date.now()}`,
          userId: action.payload.userId,
          role: action.payload.role,
          currentStep: startingStep,
          startedAt: new Date(),
          lastActiveAt: new Date(),
          totalTimeSpent: 0,
          progress: initialProgress,
          badges: [],
          achievements: [],
          data: userRole ? { 'role-selection': { role: userRole } } : {}
        },
        config: action.payload.config,
        isLoading: false,
        error: null
      };

    case 'SET_CURRENT_STEP':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          currentStep: action.payload,
          lastActiveAt: new Date()
        }
      };

    case 'UPDATE_STEP_PROGRESS':
      if (!state.session) return state;
      const existingProgressIndex = state.session.progress.findIndex(
        p => p.stepId === action.payload.stepId
      );
      
      const updatedProgress = [...state.session.progress];
      if (existingProgressIndex >= 0) {
        updatedProgress[existingProgressIndex] = {
          ...updatedProgress[existingProgressIndex],
          ...action.payload,
          completedAt: action.payload.status === 'completed' ? new Date() : undefined,
          skippedAt: action.payload.status === 'skipped' ? new Date() : undefined,
          pausedAt: action.payload.status === 'paused' ? new Date() : undefined
        };
      } else {
        updatedProgress.push({
          stepId: action.payload.stepId,
          status: action.payload.status,
          completedAt: action.payload.status === 'completed' ? new Date() : undefined,
          skippedAt: action.payload.status === 'skipped' ? new Date() : undefined,
          pausedAt: action.payload.status === 'paused' ? new Date() : undefined,
          attempts: 1
        });
      }

      return {
        ...state,
        session: {
          ...state.session,
          progress: updatedProgress,
          lastActiveAt: new Date()
        }
      };

    case 'UPDATE_SESSION_DATA':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          data: { ...state.session.data, ...action.payload },
          lastActiveAt: new Date()
        }
      };

    case 'PAUSE_SESSION':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          pausedAt: new Date(),
          lastActiveAt: new Date()
        },
        isPaused: true
      };

    case 'RESUME_SESSION':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          pausedAt: undefined,
          lastActiveAt: new Date()
        },
        isPaused: false
      };

    case 'COMPLETE_SESSION':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          completedAt: new Date(),
          lastActiveAt: new Date()
        }
      };

    case 'SKIP_STEP':
      if (!state.session) return state;
      const skipProgressIndex = state.session.progress.findIndex(
        p => p.stepId === action.payload
      );
      
      const skipUpdatedProgress = [...state.session.progress];
      if (skipProgressIndex >= 0) {
        skipUpdatedProgress[skipProgressIndex] = {
          ...skipUpdatedProgress[skipProgressIndex],
          status: 'skipped',
          skippedAt: new Date()
        };
      } else {
        skipUpdatedProgress.push({
          stepId: action.payload,
          status: 'skipped',
          skippedAt: new Date()
        });
      }

      return {
        ...state,
        session: {
          ...state.session,
          progress: skipUpdatedProgress,
          lastActiveAt: new Date()
        }
      };

    case 'EARN_BADGE':
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          badges: [...state.session.badges, { ...action.payload, earnedAt: new Date() }]
        }
      };

    case 'UPDATE_ACHIEVEMENT':
      if (!state.session) return state;
      const achievementIndex = state.session.achievements.findIndex(
        a => a.id === action.payload.id
      );
      
      const updatedAchievements = [...state.session.achievements];
      if (achievementIndex >= 0) {
        updatedAchievements[achievementIndex] = {
          ...updatedAchievements[achievementIndex],
          ...action.payload,
          earnedAt: action.payload.progress >= action.payload.maxProgress ? new Date() : undefined
        };
      } else {
        updatedAchievements.push(action.payload);
      }

      return {
        ...state,
        session: {
          ...state.session,
          achievements: updatedAchievements
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Context interface
interface OnboardingContextType {
  state: OnboardingState;
  initializeSession: (userId: string, role: UserRole, config: OnboardingConfig) => void;
  setCurrentStep: (stepId: string) => void;
  updateStepProgress: (stepId: string, status: StepStatus, data?: any) => void;
  updateSessionData: (data: Record<string, any>) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipStep: (stepId: string) => void;
  earnBadge: (badge: Badge) => void;
  updateAchievement: (achievement: Achievement) => void;
  validateStep: (stepId: string, data: any) => ValidationResult;
  getStepNavigation: (stepId: string) => StepNavigation;
  getAvailableSteps: () => OnboardingStepConfig[];
  getCompletedSteps: () => string[];
  getSkippedSteps: () => string[];
  getStepProgress: (stepId: string) => StepProgress | undefined;
  canProceedToNext: (stepId: string) => boolean;
  canSkipStep: (stepId: string) => boolean;
  canPauseSession: () => boolean;
  getRecommendedSteps: () => string[];
  setError: (error: string) => void;
  clearError: () => void;
}

// Create context
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Initialize session
  const initializeSession = useCallback((userId: string, role: UserRole, config: OnboardingConfig) => {
    dispatch({ type: 'INITIALIZE_SESSION', payload: { userId, role, config } });
  }, []);

  // Set current step
  const setCurrentStep = useCallback((stepId: string) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: stepId });
  }, []);

  // Update step progress
  const updateStepProgress = useCallback((stepId: string, status: StepStatus, data?: any) => {
    dispatch({ type: 'UPDATE_STEP_PROGRESS', payload: { stepId, status, data } });
  }, []);

  // Update session data
  const updateSessionData = useCallback((data: Record<string, any>) => {
    dispatch({ type: 'UPDATE_SESSION_DATA', payload: data });
  }, []);

  // Pause session
  const pauseSession = useCallback(() => {
    dispatch({ type: 'PAUSE_SESSION' });
  }, []);

  // Resume session
  const resumeSession = useCallback(() => {
    dispatch({ type: 'RESUME_SESSION' });
  }, []);

  // Complete session
  const completeSession = useCallback(() => {
    dispatch({ type: 'COMPLETE_SESSION' });
  }, []);

  // Skip step
  const skipStep = useCallback((stepId: string) => {
    dispatch({ type: 'SKIP_STEP', payload: stepId });
  }, []);

  // Earn badge
  const earnBadge = useCallback((badge: Badge) => {
    dispatch({ type: 'EARN_BADGE', payload: badge });
  }, []);

  // Update achievement
  const updateAchievement = useCallback((achievement: Achievement) => {
    dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: achievement });
  }, []);

  // Validate step
  const validateStep = useCallback((stepId: string, data: any): ValidationResult => {
    if (!state.config) {
      return { isValid: false, errors: ['Configuration not loaded'], warnings: [] };
    }

    const stepConfig = [...state.config.coreSteps, ...state.config.roleSteps[state.session?.role || 'customer'], ...state.config.optionalSteps]
      .find(step => step.id === stepId);

    if (!stepConfig) {
      return { isValid: false, errors: ['Step configuration not found'], warnings: [] };
    }

    if (stepConfig.validation) {
      const isValid = stepConfig.validation(data);
      return {
        isValid,
        errors: isValid ? [] : ['Validation failed'],
        warnings: []
      };
    }

    return { isValid: true, errors: [], warnings: [] };
  }, [state.config, state.session]);

  // Get step navigation
  const getStepNavigation = useCallback((stepId: string): StepNavigation => {
    if (!state.config || !state.session) {
      return {
        canGoNext: false,
        canGoPrevious: false,
        canSkip: false,
        canPause: false,
        recommendedSteps: []
      };
    }

    const allSteps = [
      ...state.config.coreSteps,
      ...state.config.roleSteps[state.session.role],
      ...state.config.optionalSteps
    ];

    const currentIndex = allSteps.findIndex(step => step.id === stepId);
    const currentStep = allSteps[currentIndex];

    return {
      canGoNext: currentIndex < allSteps.length - 1,
      canGoPrevious: currentIndex > 0,
      canSkip: currentStep?.isSkippable || false,
      canPause: state.config.settings.allowPause,
      nextStepId: currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1].id : undefined,
      previousStepId: currentIndex > 0 ? allSteps[currentIndex - 1].id : undefined,
      recommendedSteps: getRecommendedSteps()
    };
  }, [state.config, state.session]);

  // Get available steps
  const getAvailableSteps = useCallback((): OnboardingStepConfig[] => {
    if (!state.config || !state.session) return [];

    return [
      ...state.config.coreSteps,
      ...state.config.roleSteps[state.session.role],
      ...state.config.optionalSteps
    ];
  }, [state.config, state.session]);

  // Get completed steps
  const getCompletedSteps = useCallback((): string[] => {
    if (!state.session) return [];
    return state.session.progress
      .filter(p => p.status === 'completed')
      .map(p => p.stepId);
  }, [state.session]);

  // Get skipped steps
  const getSkippedSteps = useCallback((): string[] => {
    if (!state.session) return [];
    return state.session.progress
      .filter(p => p.status === 'skipped')
      .map(p => p.stepId);
  }, [state.session]);

  // Get step progress
  const getStepProgress = useCallback((stepId: string): StepProgress | undefined => {
    if (!state.session) return undefined;
    return state.session.progress.find(p => p.stepId === stepId);
  }, [state.session]);

  // Can proceed to next
  const canProceedToNext = useCallback((stepId: string): boolean => {
    const validation = validateStep(stepId, state.session?.data[stepId] || {});
    return validation.isValid;
  }, [validateStep, state.session]);

  // Can skip step
  const canSkipStep = useCallback((stepId: string): boolean => {
    if (!state.config) return false;
    const stepConfig = [...state.config.coreSteps, ...state.config.roleSteps[state.session?.role || 'customer'], ...state.config.optionalSteps]
      .find(step => step.id === stepId);
    return stepConfig?.isSkippable || false;
  }, [state.config, state.session]);

  // Can pause session
  const canPauseSession = useCallback((): boolean => {
    return state.config?.settings.allowPause || false;
  }, [state.config]);

  // Get recommended steps
  const getRecommendedSteps = useCallback((): string[] => {
    if (!state.config || !state.session) return [];

    const completedSteps = getCompletedSteps();
    const skippedSteps = getSkippedSteps();
    const allSteps = getAvailableSteps();

    // Recommend steps based on role and completion status
    return allSteps
      .filter(step => 
        step.roles?.includes(state.session!.role) &&
        !completedSteps.includes(step.id) &&
        !skippedSteps.includes(step.id) &&
        step.prerequisites?.every(prereq => completedSteps.includes(prereq))
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(step => step.id);
  }, [state.config, state.session, getCompletedSteps, getSkippedSteps, getAvailableSteps]);

  // Set error
  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!state.config?.settings.autoSave || !state.session) return;

    const interval = setInterval(() => {
      // Auto-save logic would go here
      // This could save to localStorage or send to API
      console.log('Auto-saving onboarding session...');
    }, state.config.settings.saveInterval * 1000);

    return () => clearInterval(interval);
  }, [state.config, state.session]);

  const contextValue: OnboardingContextType = {
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
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook to use onboarding context
export const useOnboardingContext = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
};
