import React, { useState } from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const PreferencesStep: React.FC<StepComponentProps> = ({ context, onDataChange }) => {
  const [preferences, setPreferences] = useState({
    preferredServices: [] as string[],
    budgetRange: '',
    frequency: '',
    notificationSettings: {
      email: true,
      sms: true,
      push: true
    }
  });

  const serviceOptions = [
    'Home Cleaning', 'Plumbing', 'Electrical', 'Painting', 
    'Gardening', 'Appliance Repair', 'Carpentry', 'Handyman'
  ];

  const budgetRanges = [
    'Under ₹500',
    '₹500-₹1000', 
    '₹1000-₹2000',
    '₹2000-₹5000',
    'Above ₹5000'
  ];

  const frequencyOptions = [
    'Weekly',
    'Monthly', 
    'Quarterly',
    'As needed',
    'One-time'
  ];

  const handleServiceToggle = (service: string) => {
    const newServices = preferences.preferredServices.includes(service)
      ? preferences.preferredServices.filter(s => s !== service)
      : [...preferences.preferredServices, service];
    
    setPreferences({ ...preferences, preferredServices: newServices });
    onDataChange({ ...preferences, preferredServices: newServices });
  };

  const handlePreferenceChange = (field: string, value: string) => {
    const newPreferences = { ...preferences, [field]: value };
    setPreferences(newPreferences);
    onDataChange(newPreferences);
  };

  const handleNotificationToggle = (type: keyof typeof preferences.notificationSettings) => {
    const newSettings = {
      ...preferences.notificationSettings,
      [type]: !preferences.notificationSettings[type]
    };
    const newPreferences = { ...preferences, notificationSettings: newSettings };
    setPreferences(newPreferences);
    onDataChange(newPreferences);
  };

  const handleContinue = () => {
    context.updateSessionData({ preferences });
    context.onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Service Preferences
        </h1>
        <p className="text-lg text-gray-600">
          Help us personalize your experience
        </p>
      </div>

      <div className="space-y-8">
        {/* Preferred Services */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Which services are you most interested in?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceOptions.map((service) => (
              <button
                key={service}
                onClick={() => handleServiceToggle(service)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  preferences.preferredServices.includes(service)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Range */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            What's your typical budget range for services?
          </h2>
          <div className="space-y-2">
            {budgetRanges.map((range) => (
              <label key={range} className="flex items-center">
                <input
                  type="radio"
                  name="budgetRange"
                  value={range}
                  checked={preferences.budgetRange === range}
                  onChange={(e) => handlePreferenceChange('budgetRange', e.target.value)}
                  className="mr-3"
                />
                {range}
              </label>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            How often do you typically need these services?
          </h2>
          <div className="space-y-2">
            {frequencyOptions.map((frequency) => (
              <label key={frequency} className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value={frequency}
                  checked={preferences.frequency === frequency}
                  onChange={(e) => handlePreferenceChange('frequency', e.target.value)}
                  className="mr-3"
                />
                {frequency}
              </label>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Notification Preferences
          </h2>
          <div className="space-y-3">
            {Object.entries(preferences.notificationSettings).map(([type, enabled]) => (
              <label key={type} className="flex items-center justify-between">
                <span className="capitalize">{type} notifications</span>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleNotificationToggle(type as keyof typeof preferences.notificationSettings)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleContinue}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
