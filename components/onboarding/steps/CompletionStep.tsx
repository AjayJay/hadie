import React from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const CompletionStep: React.FC<StepComponentProps> = ({ context }) => {
  const handleComplete = () => {
    context.onComplete();
  };

  const getRoleSpecificMessage = () => {
    switch (context.session.role) {
      case 'customer':
        return {
          title: 'Welcome to Handie! 🎉',
          message: 'Your account is ready! Start browsing services and book your first appointment.',
          nextSteps: [
            'Browse available services',
            'Book your first appointment',
            'Rate and review experts',
            'Manage your bookings'
          ]
        };
      case 'expert':
        return {
          title: 'Welcome to the Handie Expert Community! 🛠️',
          message: 'Your expert profile is set up! Complete verification to start receiving bookings.',
          nextSteps: [
            'Complete identity verification',
            'Set your availability',
            'Start receiving booking requests',
            'Build your reputation'
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard Ready! ⚙️',
          message: 'Your admin account is configured. Manage the platform and support users.',
          nextSteps: [
            'Review user registrations',
            'Monitor platform activity',
            'Manage service categories',
            'Handle support requests'
          ]
        };
      default:
        return {
          title: 'Setup Complete! ✅',
          message: 'Your account is ready to use.',
          nextSteps: []
        };
    }
  };

  const roleMessage = getRoleSpecificMessage();

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-3xl">✓</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {roleMessage.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {roleMessage.message}
        </p>
      </div>

      {roleMessage.nextSteps.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">
            What's next?
          </h2>
          <div className="space-y-3">
            {roleMessage.nextSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-center">
                <span className="text-blue-500 mr-3">→</span>
                <span className="text-blue-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Need Help?
        </h3>
        <p className="text-gray-600 mb-4">
          Our support team is here to help you get started.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            📞 Contact Support
          </button>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            📚 Help Center
          </button>
        </div>
      </div>

      <button
        onClick={handleComplete}
        className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
      >
        Complete Setup
      </button>
    </div>
  );
};
