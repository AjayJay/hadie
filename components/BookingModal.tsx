import React, { useState, useEffect } from 'react';
import type { Service, ServiceCategory } from '../types';
import { XMarkIcon, SparklesIcon } from './Icon';
import { generateBookingSummary } from '../services/geminiService';

interface BookingModalProps {
  service: Service;
  category: ServiceCategory;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, category, onClose }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      const generatedSummary = await generateBookingSummary(service.name, category.name);
      setSummary(generatedSummary);
      setIsLoading(false);
    };
    
    fetchSummary();
  }, [service, category]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 ease-out scale-95 animate-modal-pop">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{service.name}</h2>
              <p className="text-sm text-slate-500">{category.name}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 p-4 bg-sky-50 rounded-lg">
             <div className="flex items-start">
                 <SparklesIcon className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                 <div className="ml-3">
                    <h3 className="text-sm font-semibold text-sky-800">Booking Summary</h3>
                     {isLoading ? (
                        <div className="mt-2 space-y-2">
                          <div className="h-2.5 bg-slate-300 rounded-full w-48 animate-pulse"></div>
                          <div className="h-2.5 bg-slate-300 rounded-full w-64 animate-pulse"></div>
                          <div className="h-2.5 bg-slate-300 rounded-full w-32 animate-pulse"></div>
                        </div>
                     ) : (
                        <p className="text-sm text-sky-700 mt-1">{summary}</p>
                     )}
                 </div>
             </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-slate-600">Total Price:</span>
                  <span className="text-slate-900">${service.price}</span>
              </div>
          </div>

        </div>
        <div className="bg-slate-50 px-6 py-4 rounded-b-xl">
           <button
            onClick={onClose}
            className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-300"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;