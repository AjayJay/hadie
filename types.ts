import type { ComponentType } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  // Fix: Replaced React.ComponentType with ComponentType and added the import to fix 'Cannot find namespace React' error.
  icon: ComponentType<{ className?: string }>;
  services: Service[];
}

export type UserRole = 'customer' | 'expert';

// Onboarding step types
export type OnboardingStep = 'welcome' | 'role-selection' | 'profile-setup' | 'verification' | 'service-selection' | 'location' | 'completion';

// Customer onboarding data
export interface CustomerOnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dateOfBirth?: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  preferences: {
    preferredServices: string[];
    notificationSettings: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Expert onboarding data
export interface ExpertOnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
  };
  professionalInfo: {
    experience: number;
    skills: string[];
    certifications: Array<{
      name: string;
      issuingOrganization: string;
      issueDate: string;
      expiryDate?: string;
    }>;
    languages: string[];
  };
  serviceInfo: {
    selectedCategories: string[];
    serviceAreas: Array<{
      city: string;
      state: string;
      radius: number; // in km
    }>;
    availability: {
      monday: { start: string; end: string; available: boolean };
      tuesday: { start: string; end: string; available: boolean };
      wednesday: { start: string; end: string; available: boolean };
      thursday: { start: string; end: string; available: boolean };
      friday: { start: string; end: string; available: boolean };
      saturday: { start: string; end: string; available: boolean };
      sunday: { start: string; end: string; available: boolean };
    };
  };
  verification: {
    idDocument: {
      type: 'aadhar' | 'pan' | 'passport' | 'driving_license';
      number: string;
      frontImage?: string;
      backImage?: string;
    };
    addressProof: {
      type: 'utility_bill' | 'bank_statement' | 'rental_agreement';
      documentImage?: string;
    };
    bankDetails: {
      accountNumber: string;
      ifscCode: string;
      accountHolderName: string;
    };
  };
}

// Combined onboarding data
export interface OnboardingData {
  role: UserRole;
  customerData?: CustomerOnboardingData;
  expertData?: ExpertOnboardingData;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  // Expert-specific fields
  serviceCategoryId?: string; // ID of the service category they specialize in
  experience?: number; // Years of experience
  isVerified?: boolean; // For experts
  createdAt: string;
  updatedAt: string;
}
