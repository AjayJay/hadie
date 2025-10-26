import React, { useState } from 'react';
import Header from './Header';
import ServiceCategoryCard from './ServiceCategoryCard';
import ServiceList from './ServiceList';
import BookingModal from './BookingModal';
import { SERVICE_CATEGORIES } from '../constants';
import type { ServiceCategory, Service, User } from '../types';

interface CustomerDashboardProps {
    user: User;
    onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [serviceToBook, setServiceToBook] = useState<Service | null>(null);

  const handleSelectCategory = (category: ServiceCategory) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };
  
  const handleSelectService = (service: Service) => {
    setServiceToBook(service);
  };

  const handleCloseModal = () => {
    setServiceToBook(null);
  };

  const renderContent = () => {
    if (selectedCategory) {
      return (
        <ServiceList
          category={selectedCategory}
          onBack={handleBackToCategories}
          onSelectService={handleSelectService}
        />
      );
    }

    return (
      <>
        <Header title="Handie" user={user} onLogout={onLogout}/>
        <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">Welcome back, {user.name.split(' ')[0]}!</h2>
              <p className="text-slate-600 mt-2 text-lg">What can we help you with today?</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <ServiceCategoryCard
                key={category.id}
                category={category}
                onClick={() => handleSelectCategory(category)}
              />
            ))}
          </div>
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      {renderContent()}
      {serviceToBook && selectedCategory && (
        <BookingModal 
            service={serviceToBook} 
            category={selectedCategory}
            onClose={handleCloseModal} 
        />
      )}
      <style>
      {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        
        @keyframes modal-pop {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modal-pop { animation: modal-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}
      </style>
    </div>
  );
};

export default CustomerDashboard;