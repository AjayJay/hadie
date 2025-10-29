# Onboarding System

## 🎯 **Overview**

The onboarding system provides role-specific setup processes for customers and experts, with smart step skipping and progressive validation.

## 🏗️ **Architecture**

### **Frontend Components**
- `OnboardingFlow.tsx` - Main onboarding container
- `OnboardingContext.tsx` - State management
- `onboardingConfig.ts` - Step configuration
- `steps/` - Individual step components

### **Backend Components**
- `OnboardingController.ts` - Onboarding endpoints
- `OnboardingService.ts` - Business logic
- Database tables for session management

## 🔄 **User Flows**

### **Customer Onboarding Flow**
```
1. Welcome Step
   ├── Display welcome message
   ├── Set started: true
   └── Auto-advance to Profile Setup

2. Profile Setup Step
   ├── Collect: firstName, lastName, email, phone
   ├── Validate required fields
   └── Auto-advance to Address

3. Address Step (customer-location-setup)
   ├── Collect: street, city, state
   ├── Validate required fields
   └── Complete onboarding
```

### **Expert Onboarding Flow**
```
1. Welcome Step
   ├── Display welcome message
   ├── Set started: true
   └── Auto-advance to Profile Setup

2. Profile Setup Step
   ├── Collect: firstName, lastName, email, phone, dateOfBirth, gender
   ├── Validate required fields
   └── Auto-advance to Verification

3. Verification Step
   ├── Collect: ID document, bank details
   ├── Upload documents
   └── Auto-advance to Service Selection

4. Service Selection Step
   ├── Select from 33+ service categories
   ├── Search and filter services
   └── Auto-advance to Service Areas

5. Service Areas Step (expert-location-setup)
   ├── Set service coverage areas
   ├── Define service radius
   └── Auto-advance to Availability

6. Availability Step
   ├── Set working hours
   ├── Define availability schedule
   └── Complete onboarding
```

### **Role Selection Auto-Skip Logic**
```
1. User registers with role selection
2. OnboardingContext detects existing role
3. Auto-mark role-selection step as skipped
4. Start from next available step
5. Pre-populate role data in session
```

## 📡 **API Contracts**

### **POST /api/onboarding/initialize**
```typescript
// Request
interface InitializeRequest {
  userId: string;
  role: 'customer' | 'expert';
}

// Response
interface OnboardingSession {
  sessionId: string;
  userId: string;
  role: string;
  currentStep: string;
  progress: StepProgress[];
  data: Record<string, any>;
  startedAt: string;
  lastActiveAt: string;
}
```

### **POST /api/onboarding/step/:stepId/complete**
```typescript
// Request
interface CompleteStepRequest {
  stepId: string;
  data: Record<string, any>;
}

// Response
interface StepCompletionResponse {
  success: boolean;
  nextStep?: string;
  isComplete: boolean;
  message: string;
}
```

### **POST /api/onboarding/step/:stepId/skip**
```typescript
// Request
interface SkipStepRequest {
  stepId: string;
  reason?: string;
}

// Response
interface SkipStepResponse {
  success: boolean;
  nextStep?: string;
  message: string;
}
```

### **GET /api/onboarding/session/:sessionId**
```typescript
// Response
interface OnboardingSessionResponse {
  session: OnboardingSession;
  availableSteps: OnboardingStepConfig[];
  completedSteps: string[];
  skippedSteps: string[];
  progress: number; // percentage
}
```

## 🗄️ **Database Schema**

### **Onboarding Sessions Table**
```sql
CREATE TABLE onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  current_step VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  total_time_spent INTEGER DEFAULT 0, -- in minutes
  is_paused BOOLEAN DEFAULT FALSE,
  paused_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Step Progress Table**
```sql
CREATE TABLE step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  step_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  data JSONB,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  skipped_at TIMESTAMP NULL,
  time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Onboarding Data Table**
```sql
CREATE TABLE onboarding_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  step_id VARCHAR(50) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## ⚙️ **Configuration**

### **Step Configuration Structure**
```typescript
interface OnboardingStepConfig {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<StepComponentProps>;
  isRequired: boolean;
  isSkippable: boolean;
  estimatedTime: number; // minutes
  roles?: UserRole[];
  order: number;
  validation?: (data: any) => boolean;
}
```

### **Customer Steps Configuration**
```typescript
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
    validation: (data) => !!(data.street && data.city && data.state)
  }
];
```

### **Expert Steps Configuration**
```typescript
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
    validation: (data) => !!(
      data.idDocument?.number &&
      data.bankDetails?.accountNumber &&
      data.bankDetails?.ifscCode
    )
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
    validation: (data) => !!(data.selectedCategories?.length > 0)
  }
  // ... more steps
];
```

## 🎨 **Frontend Implementation**

### **OnboardingContext Interface**
```typescript
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
  validateStep: (stepId: string, data: any) => ValidationResult;
  getStepNavigation: (stepId: string) => StepNavigation;
  getAvailableSteps: () => OnboardingStepConfig[];
  getCompletedSteps: () => string[];
  getSkippedSteps: () => string[];
  canProceedToNext: (stepId: string) => boolean;
  canSkipStep: (stepId: string) => boolean;
  canPauseSession: () => boolean;
}
```

### **Step Component Props**
```typescript
interface StepComponentProps {
  context: {
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
  };
  data: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onValidationChange: (isValid: boolean) => void;
}
```

## 🔄 **State Management**

### **Onboarding State**
```typescript
interface OnboardingState {
  session: OnboardingSession | null;
  config: OnboardingConfig | null;
  isLoading: boolean;
  error: string | null;
  isPaused: boolean;
}
```

### **Step Progress Tracking**
```typescript
interface StepProgress {
  stepId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  data?: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  skippedAt?: Date;
  timeSpent: number; // minutes
}
```

## 🚀 **Smart Features**

### **Auto-Skip Logic**
```typescript
// In OnboardingContext initialization
const initializeSession = (userId: string, role: UserRole, config: OnboardingConfig) => {
  const initialProgress = [];
  
  // Auto-skip role selection if user already has a role
  if (role) {
    initialProgress.push({
      stepId: 'role-selection',
      status: 'skipped',
      skippedAt: new Date(),
      data: { role }
    });
  }
  
  // Determine starting step
  const coreSteps = config.coreSteps;
  const startingStep = role 
    ? coreSteps.find(step => step.id !== 'role-selection')?.id || coreSteps[0]?.id || ''
    : coreSteps[0]?.id || '';
    
  // Initialize session with auto-skipped steps
  dispatch({
    type: 'INITIALIZE_SESSION',
    payload: {
      userId,
      role,
      config,
      startingStep,
      initialProgress,
      initialData: role ? { 'role-selection': { role } } : {}
    }
  });
};
```

### **Progressive Validation**
```typescript
const validateStep = (stepId: string, data: any): ValidationResult => {
  const stepConfig = getStepConfig(stepId);
  
  if (!stepConfig) {
    return { isValid: false, errors: ['Step configuration not found'] };
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
};
```

## 🧪 **Testing**

### **Unit Tests**
- Step validation functions
- Auto-skip logic
- Progress calculation
- Navigation logic

### **Integration Tests**
- Complete customer onboarding flow
- Complete expert onboarding flow
- Step skipping scenarios
- Session persistence

### **Test Scenarios**
```typescript
describe('Onboarding Flow', () => {
  test('Customer onboarding completes in 3 steps', async () => {
    // Test customer flow
  });
  
  test('Expert onboarding completes in 6 steps', async () => {
    // Test expert flow
  });
  
  test('Role selection is auto-skipped when role exists', async () => {
    // Test auto-skip logic
  });
  
  test('Step validation works correctly', async () => {
    // Test validation
  });
});
```

## 📈 **Analytics & Metrics**

### **Tracked Metrics**
- Completion rate by role
- Average time per step
- Drop-off points
- Skip rates
- Validation failure rates

### **Analytics Events**
```typescript
interface OnboardingAnalytics {
  sessionId: string;
  userId: string;
  role: string;
  stepId: string;
  action: 'start' | 'complete' | 'skip' | 'pause' | 'resume';
  timestamp: Date;
  timeSpent?: number;
  data?: Record<string, any>;
}
```

## 🔧 **Configuration Management**

### **Environment Variables**
```env
ONBOARDING_AUTO_SAVE_INTERVAL=30 # seconds
ONBOARDING_MAX_SESSION_DURATION=24 # hours
ONBOARDING_ALLOW_PAUSE=true
ONBOARDING_SHOW_PROGRESS=true
```

### **Feature Flags**
```typescript
interface OnboardingSettings {
  allowSkip: boolean;
  allowPause: boolean;
  showProgress: boolean;
  enableGamification: boolean;
  autoSave: boolean;
  saveInterval: number;
}
```
