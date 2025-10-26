// Shared types between frontend and backend
export type UserRole = 'customer' | 'expert';

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

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  // Expert-specific fields
  serviceCategoryId?: string;
  experience?: number;
  isVerified?: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  // Internal fields (not exposed to frontend)
  password?: string;
  password_hash?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  customerId: string;
  expertId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Error types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
