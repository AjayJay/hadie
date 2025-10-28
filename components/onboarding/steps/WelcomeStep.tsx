import React from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const WelcomeStep: React.FC<StepComponentProps> = ({ context, onDataChange }) => {
  const handleGetStarted = () => {
    onDataChange({ started: true });
    context.onNext();
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">👋</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Handie!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your trusted platform for connecting customers with skilled service providers
        </p>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          What you'll get:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Quick & easy service booking</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Verified professionals</span>
          </div>
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            <span>Secure payments</span>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-8">
        <p>This setup will take about 5-10 minutes</p>
      </div>

      <button
        onClick={handleGetStarted}
        className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Let's Get Started
      </button>
    </div>
  );
};
