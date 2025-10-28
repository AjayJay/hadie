import React from 'react';
import type { 
  OnboardingConfig, 
  OnboardingStepConfig, 
  UserRole, 
  Badge, 
  Achievement
} from '../types/onboarding';

// Import step components
import { WelcomeStep } from '../components/onboarding/steps/WelcomeStep';
import { RoleSelectionStep } from '../components/onboarding/steps/RoleSelectionStep';
import { ProfileSetupStep } from '../components/onboarding/steps/ProfileSetupStep';
import { VerificationStep } from '../components/onboarding/steps/VerificationStep';
import { ServiceSelectionStep } from '../components/onboarding/steps/ServiceSelectionStep';
import { LocationSetupStep } from '../components/onboarding/steps/LocationSetupStep';
import { PreferencesStep } from '../components/onboarding/steps/PreferencesStep';
import { AvailabilityStep } from '../components/onboarding/steps/AvailabilityStep';
import { CompletionStep } from '../components/onboarding/steps/CompletionStep';

// Configuration constants
export const ONBOARDING_CONSTANTS = {
  DEFAULT_ESTIMATED_TIME: 3, // minutes
  DEFAULT_SAVE_INTERVAL: 30, // seconds
  MAX_FILE_SIZE: 5, // MB
  SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  SUPPORTED_FILE_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
  PHONE_VALIDATION_COUNTRIES: ['IN', 'US', 'UK'],
  MIN_AGE: 18,
  MAX_AGE: 100
} as const;

// Core steps (shared by all users)
const coreSteps: OnboardingStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome to Handie',
    description: 'Let\'s get you started with your account setup',
    component: WelcomeStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 2,
    order: 1,
    validation: (data) => !!data.started
  },
  {
    id: 'role-selection',
    title: 'Choose Your Role',
    description: 'Are you looking for services or providing them?',
    component: RoleSelectionStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 3,
    order: 2,
    validation: (data) => !!data.role
  },
  {
    id: 'profile-setup',
    title: 'Profile Setup',
    description: 'Tell us about yourself',
    component: ProfileSetupStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 5,
    order: 3,
    validation: (data) => {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
      return requiredFields.every(field => data[field]?.trim());
    }
  }
];

// Customer-specific steps
const customerSteps: OnboardingStepConfig[] = [
  {
    id: 'preferences',
    title: 'Service Preferences',
    description: 'What services are you interested in?',
    component: PreferencesStep,
    isRequired: false,
    isSkippable: true,
    estimatedTime: 4,
    roles: ['customer'],
    order: 4,
    validation: (data) => true // Optional step
  },
  {
    id: 'location-setup',
    title: 'Location Setup',
    description: 'Add your address for service delivery',
    component: LocationSetupStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 3,
    roles: ['customer'],
    order: 5,
    validation: (data) => {
      const requiredFields = ['street', 'city', 'state'];
      return requiredFields.every(field => data[field]?.trim());
    }
  }
];

// Expert-specific steps
const expertSteps: OnboardingStepConfig[] = [
  {
    id: 'verification',
    title: 'Identity Verification',
    description: 'Verify your identity and credentials',
    component: VerificationStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 10,
    roles: ['expert'],
    order: 4,
    validation: (data) => {
      return !!(
        data.idDocument?.number &&
        data.bankDetails?.accountNumber &&
        data.bankDetails?.ifscCode &&
        data.idDocument?.frontImage
      );
    }
  },
  {
    id: 'service-selection',
    title: 'Service Categories',
    description: 'Select the services you want to offer',
    component: ServiceSelectionStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 5,
    roles: ['expert'],
    order: 5,
    validation: (data) => {
      return !!(data.selectedCategories?.length > 0);
    }
  },
  {
    id: 'location-setup',
    title: 'Service Areas',
    description: 'Set your service areas and coverage',
    component: LocationSetupStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 4,
    roles: ['expert'],
    order: 6,
    validation: (data) => {
      return !!(data.serviceAreas?.length > 0);
    }
  },
  {
    id: 'availability',
    title: 'Availability Setup',
    description: 'Set your working hours and availability',
    component: AvailabilityStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 3,
    roles: ['expert'],
    order: 7,
    validation: (data) => {
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      return days.some(day => data[day]?.available);
    }
  }
];

// Admin-specific steps
const adminSteps: OnboardingStepConfig[] = [
  {
    id: 'admin-setup',
    title: 'Admin Configuration',
    description: 'Configure admin settings and permissions',
    component: () => (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Configuration
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Configure your admin settings and permissions
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-yellow-800">
            Admin configuration will be implemented in the next phase.
          </p>
        </div>
      </div>
    ),
    isRequired: true,
    isSkippable: false,
    estimatedTime: 8,
    roles: ['admin'],
    order: 4,
    validation: (data) => true // Placeholder validation
  }
];

// Optional steps (can be skipped)
const optionalSteps: OnboardingStepConfig[] = [
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Customize your notification settings',
    component: () => (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Notification Preferences
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Customize how you want to receive notifications
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-800">
            Notification preferences will be implemented in the next phase.
          </p>
        </div>
      </div>
    ),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 2,
    order: 8,
    validation: (data) => true
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Configure your privacy preferences',
    component: () => (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Privacy Settings
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Configure your privacy and data preferences
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-800">
            Privacy settings will be implemented in the next phase.
          </p>
        </div>
      </div>
    ),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 3,
    order: 9,
    validation: (data) => true
  }
];

// Verification steps
const verificationSteps: OnboardingStepConfig[] = [
  {
    id: 'phone-verification',
    title: 'Phone Verification',
    description: 'Verify your phone number',
    component: () => (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Phone Verification
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We'll send you a verification code via SMS
        </p>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-purple-800">
            Phone verification will be implemented in the next phase.
          </p>
        </div>
      </div>
    ),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 2,
    order: 10,
    validation: (data) => true
  },
  {
    id: 'email-verification',
    title: 'Email Verification',
    description: 'Verify your email address',
    component: () => (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Email Verification
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We'll send you a verification link via email
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <p className="text-indigo-800">
            Email verification will be implemented in the next phase.
          </p>
        </div>
      </div>
    ),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 1,
    order: 11,
    validation: (data) => true
  }
];

// Completion step
const completionStep: OnboardingStepConfig = {
  id: 'completion',
  title: 'Setup Complete',
  description: 'Welcome to Handie!',
  component: CompletionStep,
  isRequired: true,
  isSkippable: false,
  estimatedTime: 1,
  order: 99,
  validation: (data) => true
};

// Enhanced gamification elements
const badges: Badge[] = [
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Completed onboarding in under 10 minutes',
    icon: '⚡',
    criteria: {
      timeLimit: 10
    }
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Completed all steps without skipping any',
    icon: '🎯',
    criteria: {
      perfectScore: true
    }
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visited all optional steps',
    icon: '🗺️',
    criteria: {}
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Completed onboarding on the first day',
    icon: '🐦',
    criteria: {}
  },
  {
    id: 'detail-oriented',
    name: 'Detail Oriented',
    description: 'Completed all verification steps',
    icon: '🔍',
    criteria: {
      stepId: 'verification'
    }
  }
];

const achievements: Achievement[] = [
  {
    id: 'profile-completion',
    name: 'Profile Master',
    description: 'Complete your profile setup',
    icon: '👤',
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'service-setup',
    name: 'Service Expert',
    description: 'Set up your services',
    icon: '🛠️',
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'verification-complete',
    name: 'Verified Professional',
    description: 'Complete identity verification',
    icon: '✅',
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'location-setup',
    name: 'Location Master',
    description: 'Set up your location preferences',
    icon: '📍',
    progress: 0,
    maxProgress: 100
  }
];

// Main onboarding configuration
export const onboardingConfig: OnboardingConfig = {
  coreSteps,
  roleSteps: {
    customer: customerSteps,
    expert: expertSteps,
    admin: adminSteps
  },
  optionalSteps,
  verificationSteps,
  badges,
  achievements,
  settings: {
    allowSkip: true,
    allowPause: true,
    showProgress: true,
    enableGamification: true,
    autoSave: true,
    saveInterval: ONBOARDING_CONSTANTS.DEFAULT_SAVE_INTERVAL
  }
};

// Helper functions with improved error handling
export const getStepsForRole = (role: UserRole): OnboardingStepConfig[] => {
  try {
    const steps = [
      ...coreSteps,
      ...onboardingConfig.roleSteps[role],
      completionStep
    ];
    
    return steps.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Error getting steps for role:', error);
    return [];
  }
};

export const getOptionalStepsForRole = (role: UserRole): OnboardingStepConfig[] => {
  try {
    return [
      ...optionalSteps,
      ...verificationSteps
    ].filter(step => !step.roles || step.roles.includes(role));
  } catch (error) {
    console.error('Error getting optional steps for role:', error);
    return [];
  }
};

export const getStepById = (stepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  try {
    const allSteps = [
      ...coreSteps,
      ...onboardingConfig.roleSteps[role],
      ...optionalSteps,
      ...verificationSteps,
      completionStep
    ];
    
    return allSteps.find(step => step.id === stepId);
  } catch (error) {
    console.error('Error getting step by ID:', error);
    return undefined;
  }
};

export const getNextStep = (currentStepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  try {
    const steps = getStepsForRole(role);
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex >= 0 && currentIndex < steps.length - 1) {
      return steps[currentIndex + 1];
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting next step:', error);
    return undefined;
  }
};

export const getPreviousStep = (currentStepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  try {
    const steps = getStepsForRole(role);
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    
    if (currentIndex > 0) {
      return steps[currentIndex - 1];
    }
    
    return undefined;
  } catch (error) {
    console.error('Error getting previous step:', error);
    return undefined;
  }
};

export const calculateProgress = (completedSteps: string[], totalSteps: number): number => {
  try {
    if (totalSteps === 0) return 0;
    return Math.round((completedSteps.length / totalSteps) * 100);
  } catch (error) {
    console.error('Error calculating progress:', error);
    return 0;
  }
};

export const getEstimatedTimeRemaining = (
  completedSteps: string[], 
  role: UserRole
): number => {
  try {
    const steps = getStepsForRole(role);
    const remainingSteps = steps.filter(step => !completedSteps.includes(step.id));
    
    return remainingSteps.reduce((total, step) => total + (step.estimatedTime || ONBOARDING_CONSTANTS.DEFAULT_ESTIMATED_TIME), 0);
  } catch (error) {
    console.error('Error getting estimated time remaining:', error);
    return 0;
  }
};

// Configuration validation
export const validateOnboardingConfig = (config: OnboardingConfig): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  try {
    // Check if all roles have steps
    const roles: UserRole[] = ['customer', 'expert', 'admin'];
    for (const role of roles) {
      if (!config.roleSteps[role] || config.roleSteps[role].length === 0) {
        errors.push(`No steps defined for role: ${role}`);
      }
    }

    // Check if core steps exist
    if (!config.coreSteps || config.coreSteps.length === 0) {
      errors.push('No core steps defined');
    }

    // Check for duplicate step IDs
    const allStepIds = [
      ...config.coreSteps.map(s => s.id),
      ...Object.values(config.roleSteps).flat().map(s => s.id),
      ...config.optionalSteps.map(s => s.id),
      ...config.verificationSteps.map(s => s.id)
    ];
    
    const duplicateIds = allStepIds.filter((id, index) => allStepIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate step IDs found: ${duplicateIds.join(', ')}`);
    }

    // Check for duplicate badge IDs
    const badgeIds = config.badges.map(b => b.id);
    const duplicateBadgeIds = badgeIds.filter((id, index) => badgeIds.indexOf(id) !== index);
    if (duplicateBadgeIds.length > 0) {
      errors.push(`Duplicate badge IDs found: ${duplicateBadgeIds.join(', ')}`);
    }

    return { isValid: errors.length === 0, errors };
  } catch (error) {
    errors.push(`Configuration validation error: ${error}`);
    return { isValid: false, errors };
  }
};

// Export configuration validation result
export const configValidation = validateOnboardingConfig(onboardingConfig);
