// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'expert';
}

// User types (matching backend)
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'expert';
  onboardingCompleted: boolean;
  onboardingData?: OnboardingData;
  serviceCategoryId?: string;
  experience?: number;
  isVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingData {
  role: 'customer' | 'expert';
  customerData?: CustomerOnboardingData;
  expertData?: ExpertOnboardingData;
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
}

export type OnboardingStep = 'welcome' | 'role-selection' | 'profile-setup' | 'verification' | 'service-selection' | 'location' | 'completion';

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
      radius: number;
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

// API Client class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokenFromStorage();
  }

  // Load token from localStorage
  private loadTokenFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
  }

  // Set access token
  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  // Clear access token
  clearAccessToken(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Get headers for API requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Make API request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.request<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.clearAccessToken();
    return response;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Onboarding methods
  async getOnboardingData(): Promise<ApiResponse<OnboardingData>> {
    return this.request<OnboardingData>('/onboarding');
  }

  async updateOnboardingData(data: OnboardingData): Promise<ApiResponse<OnboardingData>> {
    return this.request<OnboardingData>('/onboarding', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async completeOnboarding(): Promise<ApiResponse<User>> {
    return this.request<User>('/onboarding/complete', {
      method: 'POST',
    });
  }

  async resetOnboarding(): Promise<ApiResponse<OnboardingData>> {
    return this.request<OnboardingData>('/onboarding/reset', {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/', {
      method: 'GET',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for use in components
export type { User, OnboardingData, CustomerOnboardingData, ExpertOnboardingData };
