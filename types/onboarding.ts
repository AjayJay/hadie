import type { ComponentType } from 'react';

// Base step configuration
export interface OnboardingStepConfig {
  id: string;
  title: string;
  description: string;
  component: ComponentType<any>;
  validation?: (data: any) => boolean;
  isRequired?: boolean;
  isSkippable?: boolean;
  estimatedTime?: number; // in minutes
  prerequisites?: string[]; // step IDs that must be completed first
  roles?: UserRole[]; // which roles this step applies to
  order?: number; // for ordering within role-specific steps
}

// Step categories
export type StepCategory = 'core' | 'role-specific' | 'optional' | 'verification';

// User roles
export type UserRole = 'customer' | 'expert' | 'admin';

// Step status
export type StepStatus = 'pending' | 'in-progress' | 'completed' | 'skipped' | 'paused';

// Progress tracking
export interface StepProgress {
  stepId: string;
  status: StepStatus;
  completedAt?: Date;
  skippedAt?: Date;
  pausedAt?: Date;
  timeSpent?: number; // in seconds
  attempts?: number;
}

// Gamification elements
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  criteria: {
    stepId?: string;
    timeLimit?: number; // complete within X minutes
    perfectScore?: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  progress: number; // 0-100
  maxProgress: number;
}

// Onboarding session data
export interface OnboardingSession {
  id: string;
  userId: string;
  role: UserRole;
  currentStep: string;
  startedAt: Date;
  lastActiveAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  totalTimeSpent: number;
  progress: StepProgress[];
  badges: Badge[];
  achievements: Achievement[];
  data: Record<string, any>;
}

// Step navigation
export interface StepNavigation {
  canGoNext: boolean;
  canGoPrevious: boolean;
  canSkip: boolean;
  canPause: boolean;
  nextStepId?: string;
  previousStepId?: string;
  recommendedSteps: string[];
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Step context
export interface StepContext {
  session: OnboardingSession;
  stepConfig: OnboardingStepConfig;
  navigation: StepNavigation;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
  updateData: (data: any) => void;
  validate: () => ValidationResult;
}

// Onboarding configuration
export interface OnboardingConfig {
  coreSteps: OnboardingStepConfig[];
  roleSteps: Record<UserRole, OnboardingStepConfig[]>;
  optionalSteps: OnboardingStepConfig[];
  verificationSteps: OnboardingStepConfig[];
  badges: Badge[];
  achievements: Achievement[];
  settings: {
    allowSkip: boolean;
    allowPause: boolean;
    showProgress: boolean;
    enableGamification: boolean;
    autoSave: boolean;
    saveInterval: number; // in seconds
  };
}

// Step component props
export interface StepComponentProps {
  context: StepContext;
  data: any;
  onDataChange: (data: any) => void;
  onValidationChange: (isValid: boolean) => void;
}

// Progress indicator props
export interface ProgressIndicatorProps {
  session: OnboardingSession;
  onStepClick: (stepId: string) => void;
  showTimeEstimates?: boolean;
  showBadges?: boolean;
}

// Navigation component props
export interface NavigationProps {
  context: StepContext;
  isLoading?: boolean;
  error?: string;
}

// Tooltip configuration
export interface TooltipConfig {
  id: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'focus';
  showArrow?: boolean;
}

// Survey question types
export type SurveyQuestionType = 'text' | 'multiple-choice' | 'rating' | 'checkbox' | 'date' | 'file';

export interface SurveyQuestion {
  id: string;
  type: SurveyQuestionType;
  question: string;
  description?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
}

export interface SurveyConfig {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  submitText?: string;
  allowPartialSave?: boolean;
}

// Resource center
export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'document' | 'link';
  url: string;
  duration?: number; // for videos
  tags: string[];
}

export interface ResourceCenterConfig {
  id: string;
  title: string;
  description: string;
  resources: ResourceItem[];
  categories: string[];
}
