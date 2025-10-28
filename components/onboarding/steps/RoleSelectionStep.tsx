import React, { useState } from 'react';
import type { StepComponentProps, UserRole } from '../../types/onboarding';

export const RoleSelectionStep: React.FC<StepComponentProps> = ({ context, onDataChange }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    onDataChange({ role });
  };

  // Role selection is handled automatically when user selects a role
  // The main onboarding flow handles navigation with Next/Previous buttons

  const roles = [
    {
      id: 'customer' as UserRole,
      title: 'I need services',
      description: 'Book skilled professionals for home services',
      icon: '🏠',
      features: ['Easy booking', 'Verified experts', 'Secure payments', '24/7 support']
    },
    {
      id: 'expert' as UserRole,
      title: 'I provide services',
      description: 'Offer your skills and grow your business',
      icon: '🛠️',
      features: ['Flexible schedule', 'Direct payments', 'Customer reviews', 'Business tools']
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          How would you like to use Handie?
        </h1>
        <p className="text-lg text-gray-600">
          Choose the option that best describes your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => handleRoleSelect(role.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {role.description}
              </p>
              
              <div className="space-y-2">
                {role.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            {selectedRole === role.id && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm rounded-full">
                  Selected
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
