import React, { useState } from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const AvailabilityStep: React.FC<StepComponentProps> = ({ context, onDataChange, onValidationChange }) => {
  const [availability, setAvailability] = useState({
    monday: { start: '09:00', end: '18:00', available: true },
    tuesday: { start: '09:00', end: '18:00', available: true },
    wednesday: { start: '09:00', end: '18:00', available: true },
    thursday: { start: '09:00', end: '18:00', available: true },
    friday: { start: '09:00', end: '18:00', available: true },
    saturday: { start: '10:00', end: '16:00', available: true },
    sunday: { start: '10:00', end: '16:00', available: false }
  });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const handleDayToggle = (day: string) => {
    const newAvailability = {
      ...availability,
      [day]: {
        ...availability[day as keyof typeof availability],
        available: !availability[day as keyof typeof availability].available
      }
    };
    setAvailability(newAvailability);
    onDataChange(newAvailability);
    validateAvailability(newAvailability);
  };

  const handleTimeChange = (day: string, field: 'start' | 'end', value: string) => {
    const newAvailability = {
      ...availability,
      [day]: {
        ...availability[day as keyof typeof availability],
        [field]: value
      }
    };
    setAvailability(newAvailability);
    onDataChange(newAvailability);
    validateAvailability(newAvailability);
  };

  const validateAvailability = (data: typeof availability) => {
    const hasAvailableDay = Object.values(data).some(day => day.available);
    onValidationChange(hasAvailableDay);
    return hasAvailableDay;
  };

  const handleContinue = () => {
    if (validateAvailability(availability)) {
      context.updateSessionData({ 
        serviceInfo: { 
          ...context.session.data.serviceInfo,
          availability 
        }
      });
      context.onNext();
    }
  };

  const handleQuickSetup = (type: 'weekdays' | 'weekends' | 'all') => {
    const newAvailability = { ...availability };
    
    if (type === 'weekdays') {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = {
          start: '09:00',
          end: '18:00',
          available: true
        };
      });
      ['saturday', 'sunday'].forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = {
          start: '10:00',
          end: '16:00',
          available: false
        };
      });
    } else if (type === 'weekends') {
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = {
          start: '09:00',
          end: '18:00',
          available: false
        };
      });
      ['saturday', 'sunday'].forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = {
          start: '10:00',
          end: '16:00',
          available: true
        };
      });
    } else if (type === 'all') {
      Object.keys(newAvailability).forEach(day => {
        newAvailability[day as keyof typeof newAvailability] = {
          start: '09:00',
          end: '18:00',
          available: true
        };
      });
    }
    
    setAvailability(newAvailability);
    onDataChange(newAvailability);
    validateAvailability(newAvailability);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Set Your Availability
        </h1>
        <p className="text-lg text-gray-600">
          When are you available to provide services?
        </p>
      </div>

      {/* Quick Setup Options */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-blue-800 mb-4">
          Quick Setup Options
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleQuickSetup('weekdays')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Weekdays Only (Mon-Fri)
          </button>
          <button
            onClick={() => handleQuickSetup('weekends')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Weekends Only (Sat-Sun)
          </button>
          <button
            onClick={() => handleQuickSetup('all')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            All Days
          </button>
        </div>
      </div>

      {/* Detailed Schedule */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Detailed Schedule
        </h2>
        
        <div className="space-y-4">
          {days.map((day) => {
            const dayData = availability[day.key as keyof typeof availability];
            return (
              <div key={day.key} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={dayData.available}
                    onChange={() => handleDayToggle(day.key)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-700 w-20">
                    {day.label}
                  </span>
                </div>
                
                {dayData.available && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">From:</span>
                    <input
                      type="time"
                      value={dayData.start}
                      onChange={(e) => handleTimeChange(day.key, 'start', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">To:</span>
                    <input
                      type="time"
                      value={dayData.end}
                      onChange={(e) => handleTimeChange(day.key, 'end', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                
                {!dayData.available && (
                  <span className="text-gray-500 italic">Not available</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-gray-800 mb-2">
          Availability Summary
        </h3>
        <div className="text-sm text-gray-600">
          {Object.values(availability).filter(day => day.available).length} days available per week
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
