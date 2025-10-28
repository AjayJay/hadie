import React from 'react';
import type { 
  OnboardingConfig, 
  OnboardingStepConfig, 
  UserRole, 
  Badge, 
  Achievement,
  SurveyConfig,
  ResourceCenterConfig
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
    order: 1
  },
  {
    id: 'role-selection',
    title: 'Choose Your Role',
    description: 'Are you looking for services or providing them?',
    component: RoleSelectionStep,
    isRequired: true,
    isSkippable: true, // Make it skippable since role is selected during registration
    estimatedTime: 3,
    order: 2
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

// Customer-specific steps - Simplified to just collect address
const customerSteps: OnboardingStepConfig[] = [
  {
    id: 'customer-location-setup',
    title: 'Your Address',
    description: 'Add your address for service delivery',
    component: LocationSetupStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 3,
    roles: ['customer'],
    order: 4,
    validation: (data) => {
      return !!(data.street && data.city && data.state);
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
        data.bankDetails?.ifscCode
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
    id: 'expert-location-setup',
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
    component: () => React.createElement('div', null, 'Admin setup component'),
    isRequired: true,
    isSkippable: false,
    estimatedTime: 8,
    roles: ['admin'],
    order: 4
  }
];

// Optional steps (can be skipped)
const optionalSteps: OnboardingStepConfig[] = [
  {
    id: 'notifications',
    title: 'Notification Preferences',
    description: 'Customize your notification settings',
    component: () => React.createElement('div', null, 'Notification preferences component'),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 2,
    order: 8
  },
  {
    id: 'privacy',
    title: 'Privacy Settings',
    description: 'Configure your privacy preferences',
    component: () => React.createElement('div', null, 'Privacy settings component'),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 3,
    order: 9
  }
];

// Verification steps
const verificationSteps: OnboardingStepConfig[] = [
  {
    id: 'phone-verification',
    title: 'Phone Verification',
    description: 'Verify your phone number',
    component: () => React.createElement('div', null, 'Phone verification component'),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 2,
    order: 10
  },
  {
    id: 'email-verification',
    title: 'Email Verification',
    description: 'Verify your email address',
    component: () => React.createElement('div', null, 'Email verification component'),
    isRequired: false,
    isSkippable: true,
    estimatedTime: 1,
    order: 11
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
  order: 99
};

// Gamification elements
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
  }
];

// Survey configurations
export const surveyConfigs: Record<string, SurveyConfig> = {
  customerPreferences: {
    id: 'customer-preferences',
    title: 'Service Preferences',
    description: 'Help us understand what services you\'re interested in',
    questions: [
      {
        id: 'preferred-services',
        type: 'checkbox',
        question: 'Which services are you most interested in?',
        description: 'Select all that apply',
        options: ['Home Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Gardening', 'Appliance Repair'],
        required: true
      },
      {
        id: 'budget-range',
        type: 'multiple-choice',
        question: 'What\'s your typical budget range for services?',
        options: ['Under ₹500', '₹500-₹1000', '₹1000-₹2000', '₹2000-₹5000', 'Above ₹5000'],
        required: true
      },
      {
        id: 'frequency',
        type: 'multiple-choice',
        question: 'How often do you typically need these services?',
        options: ['Weekly', 'Monthly', 'Quarterly', 'As needed', 'One-time'],
        required: true
      }
    ],
    submitText: 'Save Preferences'
  },
  expertExperience: {
    id: 'expert-experience',
    title: 'Professional Experience',
    description: 'Tell us about your professional background',
    questions: [
      {
        id: 'experience-years',
        type: 'multiple-choice',
        question: 'How many years of experience do you have?',
        options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years'],
        required: true
      },
      {
        id: 'specialization',
        type: 'checkbox',
        question: 'What are your areas of specialization?',
        options: ['Residential', 'Commercial', 'Industrial', 'Emergency Services', 'Maintenance'],
        required: true
      },
      {
        id: 'certifications',
        type: 'text',
        question: 'List any relevant certifications or licenses',
        description: 'Separate multiple certifications with commas',
        required: false
      }
    ],
    submitText: 'Save Experience'
  }
};

// Resource center configurations
export const resourceConfigs: Record<string, ResourceCenterConfig> = {
  customerResources: {
    id: 'customer-resources',
    title: 'Customer Resources',
    description: 'Helpful guides and information for customers',
    resources: [
      {
        id: 'booking-guide',
        title: 'How to Book Services',
        description: 'Step-by-step guide to booking services on Handie',
        type: 'video',
        url: '/resources/booking-guide',
        duration: 5,
        tags: ['booking', 'tutorial', 'getting-started']
      },
      {
        id: 'payment-methods',
        title: 'Payment Methods',
        description: 'Learn about available payment options',
        type: 'article',
        url: '/resources/payment-methods',
        tags: ['payment', 'billing', 'help']
      },
      {
        id: 'cancellation-policy',
        title: 'Cancellation Policy',
        description: 'Understand our cancellation and refund policy',
        type: 'document',
        url: '/resources/cancellation-policy',
        tags: ['policy', 'cancellation', 'refunds']
      }
    ],
    categories: ['getting-started', 'payment', 'policy', 'tutorial']
  },
  expertResources: {
    id: 'expert-resources',
    title: 'Expert Resources',
    description: 'Resources to help you succeed as a service provider',
    resources: [
      {
        id: 'profile-optimization',
        title: 'Optimize Your Profile',
        description: 'Tips to make your profile stand out',
        type: 'video',
        url: '/resources/profile-optimization',
        duration: 8,
        tags: ['profile', 'optimization', 'tips']
      },
      {
        id: 'pricing-strategy',
        title: 'Pricing Strategy',
        description: 'How to price your services competitively',
        type: 'article',
        url: '/resources/pricing-strategy',
        tags: ['pricing', 'strategy', 'business']
      },
      {
        id: 'customer-service',
        title: 'Customer Service Best Practices',
        description: 'Build strong relationships with customers',
        type: 'video',
        url: '/resources/customer-service',
        duration: 12,
        tags: ['customer-service', 'communication', 'best-practices']
      }
    ],
    categories: ['profile', 'pricing', 'customer-service', 'business']
  }
};

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
    saveInterval: 30 // 30 seconds
  }
};

// Helper function to get steps for a specific role
export const getStepsForRole = (role: UserRole): OnboardingStepConfig[] => {
  const steps = [
    ...coreSteps,
    ...onboardingConfig.roleSteps[role],
    completionStep
  ];
  
  return steps.sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Helper function to get optional steps for a role
export const getOptionalStepsForRole = (role: UserRole): OnboardingStepConfig[] => {
  return [
    ...optionalSteps,
    ...verificationSteps
  ].filter(step => !step.roles || step.roles.includes(role));
};

// Helper function to get step by ID
export const getStepById = (stepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  const allSteps = [
    ...coreSteps,
    ...onboardingConfig.roleSteps[role],
    ...optionalSteps,
    ...verificationSteps,
    completionStep
  ];
  
  return allSteps.find(step => step.id === stepId);
};

// Helper function to get next step
export const getNextStep = (currentStepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  const steps = getStepsForRole(role);
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  
  if (currentIndex >= 0 && currentIndex < steps.length - 1) {
    return steps[currentIndex + 1];
  }
  
  return undefined;
};

// Helper function to get previous step
export const getPreviousStep = (currentStepId: string, role: UserRole): OnboardingStepConfig | undefined => {
  const steps = getStepsForRole(role);
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  
  if (currentIndex > 0) {
    return steps[currentIndex - 1];
  }
  
  return undefined;
};

// Helper function to calculate progress percentage
export const calculateProgress = (completedSteps: string[], totalSteps: number): number => {
  return Math.round((completedSteps.length / totalSteps) * 100);
};

// Helper function to get estimated time remaining
export const getEstimatedTimeRemaining = (
  completedSteps: string[], 
  role: UserRole
): number => {
  const steps = getStepsForRole(role);
  const remainingSteps = steps.filter(step => !completedSteps.includes(step.id));
  
  return remainingSteps.reduce((total, step) => total + (step.estimatedTime || 0), 0);
};
