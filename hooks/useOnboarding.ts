import { useState, useCallback } from 'react';
import type { 
  OnboardingData, 
  OnboardingStep, 
  UserRole, 
  CustomerOnboardingData, 
  ExpertOnboardingData 
} from '../types';

interface UseOnboardingReturn {
  onboardingData: OnboardingData;
  updateRole: (role: UserRole) => void;
  updateCustomerData: (data: Partial<CustomerOnboardingData>) => void;
  updateExpertData: (data: Partial<ExpertOnboardingData>) => void;
  goToStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeOnboarding: () => void;
  isStepCompleted: (step: OnboardingStep) => boolean;
  canProceedToNext: () => boolean;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'role-selection',
  'profile-setup',
  'verification',
  'service-selection',
  'location',
  'completion'
];

export const useOnboarding = (): UseOnboardingReturn => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    role: 'customer',
    currentStep: 'welcome',
    completedSteps: [],
  });

  const updateRole = useCallback((role: UserRole) => {
    setOnboardingData(prev => ({
      ...prev,
      role,
      completedSteps: [...prev.completedSteps, 'role-selection']
    }));
  }, []);

  const updateCustomerData = useCallback((data: Partial<CustomerOnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      customerData: {
        ...prev.customerData,
        ...data,
        personalInfo: {
          ...prev.customerData?.personalInfo,
          ...data.personalInfo
        },
        address: {
          ...prev.customerData?.address,
          ...data.address
        },
        preferences: {
          ...prev.customerData?.preferences,
          ...data.preferences
        }
      }
    }));
  }, []);

  const updateExpertData = useCallback((data: Partial<ExpertOnboardingData>) => {
    setOnboardingData(prev => ({
      ...prev,
      expertData: {
        ...prev.expertData,
        ...data,
        personalInfo: {
          ...prev.expertData?.personalInfo,
          ...data.personalInfo
        },
        professionalInfo: {
          ...prev.expertData?.professionalInfo,
          ...data.professionalInfo
        },
        serviceInfo: {
          ...prev.expertData?.serviceInfo,
          ...data.serviceInfo
        },
        verification: {
          ...prev.expertData?.verification,
          ...data.verification
        }
      }
    }));
  }, []);

  const goToStep = useCallback((step: OnboardingStep) => {
    setOnboardingData(prev => ({
      ...prev,
      currentStep: step
    }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.indexOf(onboardingData.currentStep);
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      const nextStep = ONBOARDING_STEPS[currentIndex + 1];
      setOnboardingData(prev => ({
        ...prev,
        currentStep: nextStep,
        completedSteps: [...prev.completedSteps, prev.currentStep]
      }));
    }
  }, [onboardingData.currentStep]);

  const previousStep = useCallback(() => {
    const currentIndex = ONBOARDING_STEPS.indexOf(onboardingData.currentStep);
    if (currentIndex > 0) {
      const prevStep = ONBOARDING_STEPS[currentIndex - 1];
      setOnboardingData(prev => ({
        ...prev,
        currentStep: prevStep
      }));
    }
  }, [onboardingData.currentStep]);

  const completeOnboarding = useCallback(() => {
    setOnboardingData(prev => ({
      ...prev,
      currentStep: 'completion',
      completedSteps: [...prev.completedSteps, prev.currentStep]
    }));
  }, []);

  const isStepCompleted = useCallback((step: OnboardingStep) => {
    return onboardingData.completedSteps.includes(step);
  }, [onboardingData.completedSteps]);

  const canProceedToNext = useCallback(() => {
    const { currentStep, role, customerData, expertData } = onboardingData;
    
    switch (currentStep) {
      case 'welcome':
        return true;
      case 'role-selection':
        return !!role;
      case 'profile-setup':
        if (role === 'customer') {
          return !!(
            customerData?.personalInfo?.firstName &&
            customerData?.personalInfo?.lastName &&
            customerData?.personalInfo?.phone &&
            customerData?.personalInfo?.email
          );
        } else {
          return !!(
            expertData?.personalInfo?.firstName &&
            expertData?.personalInfo?.lastName &&
            expertData?.personalInfo?.phone &&
            expertData?.personalInfo?.email &&
            expertData?.personalInfo?.dateOfBirth
          );
        }
      case 'verification':
        if (role === 'expert') {
          return !!(
            expertData?.verification?.idDocument?.number &&
            expertData?.verification?.bankDetails?.accountNumber &&
            expertData?.verification?.bankDetails?.ifscCode
          );
        }
        return true; // Customers don't need verification
      case 'service-selection':
        if (role === 'expert') {
          return !!(expertData?.serviceInfo?.selectedCategories?.length);
        }
        return true; // Customers can skip this step
      case 'location':
        if (role === 'customer') {
          return !!(
            customerData?.address?.street &&
            customerData?.address?.city &&
            customerData?.address?.state
          );
        } else {
          return !!(expertData?.serviceInfo?.serviceAreas?.length);
        }
      case 'completion':
        return true;
      default:
        return false;
    }
  }, [onboardingData]);

  return {
    onboardingData,
    updateRole,
    updateCustomerData,
    updateExpertData,
    goToStep,
    nextStep,
    previousStep,
    completeOnboarding,
    isStepCompleted,
    canProceedToNext,
  };
};
