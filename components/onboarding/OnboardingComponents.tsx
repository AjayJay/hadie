import React from 'react';
import type { OnboardingStep, UserRole } from '../types';

interface OnboardingStepProps {
  step: OnboardingStep;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  onStepClick: (step: OnboardingStep) => void;
}

const STEP_LABELS: Record<OnboardingStep, string> = {
  welcome: 'Welcome',
  'role-selection': 'Choose Role',
  'profile-setup': 'Profile Setup',
  verification: 'Verification',
  'service-selection': 'Services',
  location: 'Location',
  completion: 'Complete'
};

const STEP_DESCRIPTIONS: Record<OnboardingStep, string> = {
  welcome: 'Get started with Handie',
  'role-selection': 'Are you a customer or expert?',
  'profile-setup': 'Tell us about yourself',
  verification: 'Verify your identity',
  'service-selection': 'Select your services',
  location: 'Set your location',
  completion: 'You\'re all set!'
};

const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({ 
  step, 
  isActive, 
  isCompleted, 
  onClick 
}) => {
  return (
    <div 
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-blue-100 border-2 border-blue-500' 
          : isCompleted 
            ? 'bg-green-100 border-2 border-green-500' 
            : 'bg-gray-100 border-2 border-gray-300 hover:bg-gray-200'
      }`}
      onClick={onClick}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
        isCompleted 
          ? 'bg-green-500 text-white' 
          : isActive 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-400 text-white'
      }`}>
        {isCompleted ? '✓' : step === 'welcome' ? '1' : step === 'role-selection' ? '2' : step === 'profile-setup' ? '3' : step === 'verification' ? '4' : step === 'service-selection' ? '5' : step === 'location' ? '6' : '7'}
      </div>
      <div>
        <h3 className={`font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
          {STEP_LABELS[step]}
        </h3>
        <p className={`text-sm ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
          {STEP_DESCRIPTIONS[step]}
        </p>
      </div>
    </div>
  );
};

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({ 
  currentStep, 
  completedSteps, 
  onStepClick 
}) => {
  const steps: OnboardingStep[] = ['welcome', 'role-selection', 'profile-setup', 'verification', 'service-selection', 'location', 'completion'];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Onboarding Progress</h2>
      <div className="space-y-2">
        {steps.map((step) => (
          <OnboardingStepComponent
            key={step}
            step={step}
            isActive={step === currentStep}
            isCompleted={completedSteps.includes(step)}
            onClick={() => onStepClick(step)}
          />
        ))}
      </div>
    </div>
  );
};

interface OnboardingNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  canProceed: boolean;
  isLastStep: boolean;
  isLoading?: boolean;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  onNext,
  onPrevious,
  onComplete,
  canProceed,
  isLastStep,
  isLoading = false
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={onPrevious}
        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        disabled={isLoading}
      >
        Previous
      </button>
      
      <div className="flex space-x-3">
        {isLastStep ? (
          <button
            onClick={onComplete}
            disabled={!canProceed || isLoading}
            className={`px-8 py-2 rounded-lg font-medium transition-colors ${
              canProceed && !isLoading
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Completing...' : 'Complete Setup'}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={!canProceed || isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceed && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Loading...' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};
