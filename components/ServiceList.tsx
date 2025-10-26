import React from 'react';
import type { Service, ServiceCategory } from '../types';
import { ArrowLeftIcon } from './Icon';

interface ServiceListProps {
  category: ServiceCategory;
  onBack: () => void;
  onSelectService: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ category, onBack, onSelectService }) => {
  return (
    <div className="animate-fade-in">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 focus:outline-none">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-slate-800 ml-4">{category.name}</h1>
            </div>
        </div>
      </header>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <ul className="space-y-4">
          {category.services.map((service) => (
            <li key={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{service.description}</p>
                    <div className="flex items-center text-sm text-slate-500 mt-2 space-x-4">
                        <span>${service.price}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{service.duration}</span>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                    <button
                      onClick={() => onSelectService(service)}
                      className="w-full sm:w-auto px-4 py-2 border border-sky-600 text-sky-600 font-semibold rounded-md hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceList;