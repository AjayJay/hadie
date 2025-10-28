import React, { useState, useEffect } from 'react';
import type { 
  StepProgress, 
  Badge, 
  Achievement, 
  OnboardingSession,
  TooltipConfig,
  SurveyConfig,
  ResourceCenterConfig,
  StepComponentProps
} from '../../types/onboarding';

// Progress Bar Component
interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showSteps?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  showPercentage = true,
  showSteps = true,
  className = ''
}) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showSteps && (
          <span className="text-sm font-medium text-gray-700">
            Step {current} of {total}
          </span>
        )}
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">
            {percentage}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Step Indicator Component
interface StepIndicatorProps {
  steps: Array<{
    id: string;
    title: string;
    status: 'pending' | 'current' | 'completed' | 'skipped';
  }>;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  onStepClick,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`flex flex-col items-center cursor-pointer ${
              onStepClick ? 'hover:opacity-80' : ''
            }`}
            onClick={() => onStepClick?.(step.id)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step.status === 'completed'
                  ? 'bg-green-500 text-white'
                  : step.status === 'current'
                  ? 'bg-blue-500 text-white'
                  : step.status === 'skipped'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.status === 'completed' ? '✓' : index + 1}
            </div>
            <span className="text-xs mt-1 text-center max-w-20">
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                step.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Checklist Component
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required?: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  onItemToggle: (itemId: string) => void;
  className?: string;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  onItemToggle,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <label
          key={item.id}
          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            type="checkbox"
            checked={item.completed}
            onChange={() => onItemToggle(item.id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className={`ml-3 ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
            {item.text}
            {item.required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      ))}
    </div>
  );
};

// Tooltip Component
interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  showArrow = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg ${positionClasses[position]} ${className}`}
        >
          {content}
          {showArrow && (
            <div
              className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Badge Component
interface BadgeProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  className?: string;
}

export const BadgeComponent: React.FC<BadgeProps> = ({
  badge,
  size = 'md',
  showAnimation = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  };

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${showAnimation ? 'animate-bounce' : ''} ${className}`}
      title={badge.description}
    >
      {badge.icon}
    </div>
  );
};

// Achievement Component
interface AchievementProps {
  achievement: Achievement;
  className?: string;
}

export const AchievementComponent: React.FC<AchievementProps> = ({
  achievement,
  className = ''
}) => {
  const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

  return (
    <div className={`bg-white rounded-lg p-4 shadow-md ${className}`}>
      <div className="flex items-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="text-right text-sm text-gray-500 mt-1">
        {achievement.progress}/{achievement.maxProgress}
      </div>
    </div>
  );
};

// Survey Component
interface SurveyProps {
  config: SurveyConfig;
  data: Record<string, any>;
  onDataChange: (data: Record<string, any>) => void;
  onSubmit: (data: Record<string, any>) => void;
  className?: string;
}

export const Survey: React.FC<SurveyProps> = ({
  config,
  data,
  onDataChange,
  onSubmit,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(data);

  const currentQuestion = config.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;

  const handleAnswerChange = (questionId: string, value: any) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    onDataChange(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your answer..."
          />
        );
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  checked={answers[currentQuestion.id] === option}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {currentQuestion.options?.map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={answers[currentQuestion.id]?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = answers[currentQuestion.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleAnswerChange(currentQuestion.id, newValues);
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswerChange(currentQuestion.id, rating)}
                className={`w-10 h-10 rounded-full border-2 ${
                  answers[currentQuestion.id] === rating
                    ? 'bg-yellow-400 border-yellow-500'
                    : 'bg-gray-100 border-gray-300'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h2>
        <p className="text-gray-600">{config.description}</p>
        <div className="mt-4">
          <ProgressBar
            current={currentQuestionIndex + 1}
            total={config.questions.length}
            showPercentage={false}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {currentQuestion.question}
          </h3>
          {currentQuestion.description && (
            <p className="text-gray-600 text-sm">{currentQuestion.description}</p>
          )}
        </div>

        <div className="mb-6">
          {renderQuestion()}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !answers[currentQuestion.id]}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? (config.submitText || 'Submit') : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Resource Center Component
interface ResourceCenterProps {
  config: ResourceCenterConfig;
  className?: string;
}

export const ResourceCenter: React.FC<ResourceCenterProps> = ({
  config,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResources = selectedCategory === 'all'
    ? config.resources
    : config.resources.filter(resource => resource.tags.includes(selectedCategory));

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'document': return '📋';
      case 'link': return '🔗';
      default: return '📄';
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{config.title}</h2>
        <p className="text-gray-600">{config.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Resources
          </button>
          {config.categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(resource.url, '_blank')}
          >
            <div className="flex items-start mb-3">
              <span className="text-2xl mr-3">{getResourceIcon(resource.type)}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {resource.duration && (
                <span className="text-xs text-gray-500">{resource.duration} min</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full h-full w-full border-b-2 border-blue-500"></div>
    </div>
  );
};

// Error Message Component
interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  className = ''
}) => {
  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded ${className}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// Success Message Component
interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss,
  className = ''
}) => {
  return (
    <div className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded ${className}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-green-500 hover:text-green-700 ml-2"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};