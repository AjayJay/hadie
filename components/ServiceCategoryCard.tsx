import React from 'react';
import type { ServiceCategory } from '../types';

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onClick: () => void;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({ category, onClick }) => {
  const IconComponent = category.icon;
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer overflow-hidden transform hover:-translate-y-1 border-2 border-transparent hover:border-sky-200"
    >
      <div className="p-6 flex flex-col items-center text-center">
        <div className="bg-sky-100 text-sky-600 rounded-full p-4 mb-4 transition-colors duration-300 group-hover:bg-sky-500 group-hover:text-white">
          <IconComponent className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;