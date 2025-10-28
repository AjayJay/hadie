# Modular Onboarding System

A comprehensive, extensible onboarding flow system designed for Handie that supports multiple user roles, dynamic step loading, gamification, and flexible configuration.

## Features

### 🎯 Core Features
- **Modular Architecture**: Declarative step configuration with atomic, reusable components
- **Role-Based Flow**: Dynamic step loading based on user role (Customer, Expert, Admin)
- **Progress Tracking**: Real-time progress indicators with step completion tracking
- **Gamification**: Badges, achievements, and progress animations
- **Flexible Navigation**: Skip, pause, resume functionality with smart recommendations
- **Validation System**: Centralized validation with real-time feedback
- **State Management**: Centralized context with auto-save functionality

### 🛠️ Technical Features
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Extensible Design**: Easy to add new roles, steps, and features
- **Configuration-Driven**: Steps defined in configuration arrays, not hardcoded
- **Atomic Components**: Reusable UI components (progress bars, tooltips, surveys)
- **Context Management**: Centralized state with reducer pattern
- **Error Handling**: Comprehensive error states and recovery

## Architecture

### Core Components

```
types/onboarding.ts          # Type definitions
contexts/OnboardingContext.tsx # State management
config/onboardingConfig.ts    # Step configurations
components/onboarding/
├── OnboardingComponents.tsx  # Atomic UI components
├── ModularOnboardingFlow.tsx # Main flow component
└── steps/                   # Individual step components
    ├── WelcomeStep.tsx
    ├── RoleSelectionStep.tsx
    ├── ProfileSetupStep.tsx
    ├── VerificationStep.tsx
    ├── ServiceSelectionStep.tsx
    ├── LocationSetupStep.tsx
    ├── PreferencesStep.tsx
    ├── AvailabilityStep.tsx
    └── CompletionStep.tsx
```

### Data Flow

1. **Initialization**: User starts onboarding with role selection
2. **Step Loading**: System loads role-specific steps dynamically
3. **Progress Tracking**: Each step completion updates progress state
4. **Validation**: Real-time validation with error handling
5. **Gamification**: Badges and achievements earned based on progress
6. **Completion**: Final step triggers completion callback

## Usage

### Basic Usage

```tsx
import { ModularOnboardingFlow } from './components/onboarding/ModularOnboardingFlow';

function App() {
  const handleComplete = (userData) => {
    console.log('Onboarding completed:', userData);
    // Redirect to dashboard, save to API, etc.
  };

  return (
    <ModularOnboardingFlow
      userId="user123"
      role="customer"
      onComplete={handleComplete}
    />
  );
}
```

### Role-Specific Flows

```tsx
// Customer onboarding
<ModularOnboardingFlow
  userId="customer123"
  role="customer"
  onComplete={handleComplete}
/>

// Expert onboarding
<ModularOnboardingFlow
  userId="expert456"
  role="expert"
  onComplete={handleComplete}
/>

// Admin onboarding
<ModularOnboardingFlow
  userId="admin789"
  role="admin"
  onComplete={handleComplete}
/>
```

## Configuration

### Step Configuration

Steps are defined in `config/onboardingConfig.ts`:

```typescript
const stepConfig: OnboardingStepConfig = {
  id: 'profile-setup',
  title: 'Profile Setup',
  description: 'Tell us about yourself',
  component: ProfileSetupStep,
  isRequired: true,
  isSkippable: false,
  estimatedTime: 5,
  roles: ['customer', 'expert'],
  order: 3,
  validation: (data) => {
    return !!(data.firstName && data.lastName && data.email);
  }
};
```

### Adding New Steps

1. **Create Step Component**:
```tsx
const CustomStep: React.FC<StepComponentProps> = ({ context, onDataChange }) => {
  return (
    <div>
      <h1>Custom Step</h1>
      <button onClick={() => {
        onDataChange({ customData: 'value' });
        context.onNext();
      }}>
        Continue
      </button>
    </div>
  );
};
```

2. **Add Step Configuration**:
```typescript
const customStep: OnboardingStepConfig = {
  id: 'custom-step',
  title: 'Custom Step',
  description: 'A custom onboarding step',
  component: CustomStep,
  isRequired: false,
  isSkippable: true,
  estimatedTime: 3,
  roles: ['customer'],
  order: 10
};
```

3. **Update Configuration**:
```typescript
// Add to appropriate step array
const optionalSteps = [...existingSteps, customStep];
```

### Adding New Roles

1. **Define Role Steps**:
```typescript
const vendorSteps: OnboardingStepConfig[] = [
  {
    id: 'vendor-setup',
    title: 'Vendor Setup',
    description: 'Configure vendor settings',
    component: VendorSetupStep,
    isRequired: true,
    isSkippable: false,
    estimatedTime: 5,
    roles: ['vendor'],
    order: 4
  }
];
```

2. **Update Role Configuration**:
```typescript
const onboardingConfig: OnboardingConfig = {
  // ... existing config
  roleSteps: {
    customer: customerSteps,
    expert: expertSteps,
    admin: adminSteps,
    vendor: vendorSteps // New role
  }
};
```

## Gamification

### Badges

Badges are earned based on specific criteria:

```typescript
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
    description: 'Completed all steps without skipping',
    icon: '🎯',
    criteria: {
      perfectScore: true
    }
  }
];
```

### Achievements

Achievements track progress toward goals:

```typescript
const achievements: Achievement[] = [
  {
    id: 'profile-completion',
    name: 'Profile Master',
    description: 'Complete your profile setup',
    icon: '👤',
    progress: 0,
    maxProgress: 100
  }
];
```

## Atomic Components

### Progress Bar
```tsx
<ProgressBar
  current={5}
  total={10}
  showPercentage={true}
  showSteps={true}
/>
```

### Step Indicator
```tsx
<StepIndicator
  steps={[
    { id: 'step1', title: 'Welcome', status: 'completed' },
    { id: 'step2', title: 'Profile', status: 'current' }
  ]}
  onStepClick={(stepId) => console.log('Clicked:', stepId)}
/>
```

### Survey Component
```tsx
<Survey
  config={surveyConfig}
  data={surveyData}
  onDataChange={handleDataChange}
  onSubmit={handleSubmit}
/>
```

### Tooltip
```tsx
<Tooltip content="This is helpful information" position="top">
  <button>Hover me</button>
</Tooltip>
```

## State Management

### Context Usage

```tsx
import { useOnboardingContext } from '../contexts/OnboardingContext';

const MyComponent = () => {
  const {
    state,
    setCurrentStep,
    updateStepProgress,
    validateStep,
    canProceedToNext
  } = useOnboardingContext();

  // Use context methods
};
```

### Session Data

The onboarding session tracks:
- Current step and progress
- Completed and skipped steps
- User data for each step
- Badges and achievements
- Time spent and pause state

## Validation

### Step Validation

```typescript
const validation = validateStep('profile-setup', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});

if (validation.isValid) {
  // Proceed to next step
} else {
  // Show validation errors
  console.log(validation.errors);
}
```

### Custom Validation

```typescript
const customStep: OnboardingStepConfig = {
  // ... other config
  validation: (data) => {
    // Custom validation logic
    return data.customField && data.customField.length > 5;
  }
};
```

## Error Handling

### Error States

```tsx
// Error message component
<ErrorMessage
  message="Something went wrong"
  onDismiss={() => clearError()}
/>

// Success message component
<SuccessMessage
  message="Step completed successfully"
  onDismiss={() => clearSuccess()}
/>
```

### Recovery

The system provides automatic recovery options:
- Retry failed operations
- Resume from last completed step
- Clear error states
- Fallback to previous step

## Customization

### Themes and Styling

Components use Tailwind CSS classes and can be customized:

```tsx
<ProgressBar
  className="custom-progress-bar"
  // ... other props
/>
```

### Custom Components

You can replace any component with custom implementations:

```typescript
const customStep: OnboardingStepConfig = {
  // ... other config
  component: YourCustomComponent
};
```

## Best Practices

### 1. Step Design
- Keep steps focused and single-purpose
- Provide clear progress indicators
- Use progressive disclosure
- Include helpful tooltips and guidance

### 2. Validation
- Validate early and often
- Provide clear error messages
- Use real-time validation where possible
- Allow users to correct errors easily

### 3. User Experience
- Respect user's time with skip options
- Provide pause/resume functionality
- Use gamification appropriately
- Show clear next steps

### 4. Performance
- Lazy load step components
- Optimize re-renders
- Use efficient state updates
- Implement proper error boundaries

## Migration Guide

### From Old System

1. **Replace Old Components**:
```tsx
// Old
<OnboardingFlow onComplete={handleComplete} />

// New
<ModularOnboardingFlow
  userId={userId}
  role={role}
  onComplete={handleComplete}
/>
```

2. **Update Step Definitions**:
```typescript
// Old: Hardcoded switch statements
// New: Configuration-driven approach
```

3. **Migrate State Management**:
```typescript
// Old: Local useState
// New: Centralized context
```

## Troubleshooting

### Common Issues

1. **Step Not Loading**: Check step configuration and component imports
2. **Validation Failing**: Verify validation function logic
3. **State Not Updating**: Ensure proper context usage
4. **Navigation Issues**: Check step prerequisites and order

### Debug Mode

Enable debug logging:

```typescript
const onboardingConfig: OnboardingConfig = {
  // ... other config
  settings: {
    // ... other settings
    debugMode: true
  }
};
```

## API Integration

### Save Progress

```typescript
const handleSaveProgress = async (sessionData) => {
  try {
    await api.saveOnboardingProgress(sessionData);
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};
```

### Load Progress

```typescript
const handleLoadProgress = async (userId) => {
  try {
    const data = await api.loadOnboardingProgress(userId);
    return data;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
};
```

## Contributing

### Adding Features

1. Create feature branch
2. Add tests for new functionality
3. Update documentation
4. Submit pull request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write comprehensive tests

## License

This project is licensed under the MIT License.
