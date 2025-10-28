import React, { useState } from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const LocationSetupStep: React.FC<StepComponentProps> = ({ context, onDataChange, onValidationChange }) => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    coordinates: null as { latitude: number; longitude: number } | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
    
    validateForm(newData);
  };

  const validateForm = (data: typeof formData) => {
    const newErrors: Record<string, string> = {};
    
    if (!data.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    
    if (!data.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!data.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidationChange(isValid);
    
    return isValid;
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setFormData({ ...formData, coordinates });
          onDataChange({ ...formData, coordinates });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleContinue = () => {
    if (validateForm(formData)) {
      if (context.session.role === 'customer') {
        context.updateSessionData({ address: formData });
      } else {
        // For experts, this would be service areas
        context.updateSessionData({ 
          serviceInfo: { 
            serviceAreas: [{
              city: formData.city,
              state: formData.state,
              radius: 10 // default radius in km
            }]
          }
        });
      }
      context.onNext();
    }
  };

  const isCustomer = context.session.role === 'customer';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {isCustomer ? 'Your Location' : 'Service Areas'}
        </h1>
        <p className="text-lg text-gray-600">
          {isCustomer 
            ? 'Add your address for service delivery'
            : 'Set your service areas and coverage radius'
          }
        </p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.street ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your street address"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter ZIP code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="India">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>

          {isCustomer && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                📍 Use Current Location
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Allow us to automatically detect your location for faster setup
              </p>
              <button
                onClick={handleGetCurrentLocation}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
              >
                Get Current Location
              </button>
              {formData.coordinates && (
                <p className="text-green-600 text-sm mt-2">
                  ✓ Location detected successfully
                </p>
              )}
            </div>
          )}

          {!isCustomer && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                🚗 Service Coverage
              </h3>
              <p className="text-sm text-blue-600">
                You can add more service areas and adjust coverage radius after completing setup.
                Default coverage radius is 10km from your location.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleContinue}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
