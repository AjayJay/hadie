import React from 'react';
import { ModularOnboardingFlow } from '../components/onboarding/ModularOnboardingFlow';
import type { UserRole } from '../types/onboarding';

// Example usage of the modular onboarding system
export const OnboardingExample: React.FC = () => {
  const handleOnboardingComplete = (userData: any) => {
    console.log('Onboarding completed with data:', userData);
    // Handle completion - redirect to dashboard, save to API, etc.
  };

  return (
    <div>
      {/* Customer Onboarding */}
      <ModularOnboardingFlow
        userId="user123"
        role="customer"
        onComplete={handleOnboardingComplete}
      />

      {/* Expert Onboarding */}
      <ModularOnboardingFlow
        userId="expert456"
        role="expert"
        onComplete={handleOnboardingComplete}
      />

      {/* Admin Onboarding */}
      <ModularOnboardingFlow
        userId="admin789"
        role="admin"
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

// Example of how to extend the onboarding system with custom steps
export const createCustomStep = () => {
  // Custom step component
  const CustomStep: React.FC<any> = ({ context, onDataChange }) => {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Custom Step
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          This is a custom onboarding step
        </p>
        <button
          onClick={() => {
            onDataChange({ customData: 'example' });
            context.onNext();
          }}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </div>
    );
  };

  // Custom step configuration
  const customStepConfig = {
    id: 'custom-step',
    title: 'Custom Step',
    description: 'A custom onboarding step',
    component: CustomStep,
    isRequired: false,
    isSkippable: true,
    estimatedTime: 3,
    roles: ['customer', 'expert'],
    order: 10,
    validation: (data: any) => {
      return !!(data.customData);
    }
  };

  return customStepConfig;
};

// Example of how to add new roles
export const addNewRole = () => {
  // Add 'vendor' role to the system
  const vendorSteps = [
    {
      id: 'vendor-setup',
      title: 'Vendor Setup',
      description: 'Configure vendor-specific settings',
      component: () => <div>Vendor setup component</div>,
      isRequired: true,
      isSkippable: false,
      estimatedTime: 5,
      roles: ['vendor'],
      order: 4
    }
  ];

  // Update the onboarding configuration
  const updatedConfig = {
    // ... existing config
    roleSteps: {
      customer: [], // existing customer steps
      expert: [], // existing expert steps
      admin: [], // existing admin steps
      vendor: vendorSteps // new vendor steps
    }
  };

  return updatedConfig;
};

// Example of how to customize gamification
export const addCustomBadges = () => {
  const customBadges = [
    {
      id: 'early-adopter',
      name: 'Early Adopter',
      description: 'Joined during beta testing',
      icon: '🚀',
      criteria: {
        // Custom criteria logic
      }
    },
    {
      id: 'power-user',
      name: 'Power User',
      description: 'Completed all advanced features',
      icon: '⚡',
      criteria: {
        // Custom criteria logic
      }
    }
  ];

  return customBadges;
};

// Example of how to integrate with external services
export const integrateWithExternalServices = () => {
  // Example: Integrate with payment gateway for verification
  const paymentVerificationStep = {
    id: 'payment-verification',
    title: 'Payment Verification',
    description: 'Verify payment method for secure transactions',
    component: () => {
      // Component that integrates with payment gateway
      return (
        <div>
          <h1>Payment Verification</h1>
          {/* Payment gateway integration */}
        </div>
      );
    },
    isRequired: true,
    isSkippable: false,
    estimatedTime: 5,
    roles: ['expert'],
    order: 8,
    validation: async (data: any) => {
      // Async validation with external service
      try {
        // Call payment gateway API
        // const result = await paymentGateway.verify(data);
        // return result.isValid;
        return true; // Placeholder
      } catch (error) {
        return false;
      }
    }
  };

  return paymentVerificationStep;
};

// Example of how to add conditional steps
export const addConditionalSteps = () => {
  const conditionalStep = {
    id: 'conditional-step',
    title: 'Conditional Step',
    description: 'This step appears based on previous selections',
    component: () => <div>Conditional step component</div>,
    isRequired: false,
    isSkippable: true,
    estimatedTime: 3,
    roles: ['customer'],
    order: 6,
    prerequisites: ['profile-setup'], // Only show after profile setup
    conditionalLogic: (sessionData: any) => {
      // Custom logic to determine if step should be shown
      return sessionData['profile-setup']?.someCondition === true;
    }
  };

  return conditionalStep;
};

// Example of how to add multi-step workflows
export const addMultiStepWorkflow = () => {
  const multiStepWorkflow = [
    {
      id: 'workflow-step-1',
      title: 'Workflow Step 1',
      description: 'First step in multi-step workflow',
      component: () => <div>Workflow step 1</div>,
      isRequired: true,
      isSkippable: false,
      estimatedTime: 3,
      roles: ['expert'],
      order: 5,
      workflowId: 'expert-verification' // Group related steps
    },
    {
      id: 'workflow-step-2',
      title: 'Workflow Step 2',
      description: 'Second step in multi-step workflow',
      component: () => <div>Workflow step 2</div>,
      isRequired: true,
      isSkippable: false,
      estimatedTime: 3,
      roles: ['expert'],
      order: 6,
      workflowId: 'expert-verification',
      prerequisites: ['workflow-step-1']
    }
  ];

  return multiStepWorkflow;
};
