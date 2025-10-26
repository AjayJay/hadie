import React from 'react';
import type { UserRole } from '../../types';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Handie! 🎉
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your trusted platform for home services and professional expertise
        </p>
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">What we offer:</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm">🏠</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Home Services</h3>
                <p className="text-blue-600 text-sm">Cleaning, repairs, maintenance</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm">💼</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Professional Services</h3>
                <p className="text-blue-600 text-sm">Salon, beauty, wellness</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Quick Booking</h3>
                <p className="text-blue-600 text-sm">Same-day service available</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                <span className="text-white text-sm">⭐</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Verified Experts</h3>
                <p className="text-blue-600 text-sm">Background checked professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Let's Get Started!
      </button>
    </div>
  );
};

interface RoleSelectionStepProps {
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onNext: () => void;
}

export const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({ 
  selectedRole, 
  onRoleSelect, 
  onNext 
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          How would you like to use Handie?
        </h2>
        <p className="text-lg text-gray-600">
          Choose your role to customize your experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div 
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedRole === 'customer' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-300 hover:bg-blue-25'
          }`}
          onClick={() => onRoleSelect('customer')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">I'm a Customer</h3>
            <p className="text-gray-600 mb-4">
              I want to book services for my home or personal needs
            </p>
            <ul className="text-sm text-gray-600 text-left">
              <li>• Book home cleaning services</li>
              <li>• Schedule salon appointments</li>
              <li>• Get appliance repairs</li>
              <li>• Track service providers</li>
            </ul>
          </div>
        </div>

        <div 
          className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
            selectedRole === 'expert' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-green-300 hover:bg-green-25'
          }`}
          onClick={() => onRoleSelect('expert')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">I'm an Expert</h3>
            <p className="text-gray-600 mb-4">
              I want to provide services and earn money
            </p>
            <ul className="text-sm text-gray-600 text-left">
              <li>• Offer your services</li>
              <li>• Set your availability</li>
              <li>• Manage bookings</li>
              <li>• Track earnings</li>
            </ul>
          </div>
        </div>
      </div>

      {selectedRole && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Continue as {selectedRole === 'customer' ? 'Customer' : 'Expert'}
          </button>
        </div>
      )}
    </div>
  );
};
