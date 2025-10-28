import React, { useState } from 'react';
import type { StepComponentProps } from '../../types/onboarding';

export const ServiceSelectionStep: React.FC<StepComponentProps> = ({ context, onDataChange, onValidationChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const serviceCategories = [
    // Vehicle Services
    { id: 'car-cleaning', name: 'Car Cleaning', icon: '🚗', description: 'Car wash, interior cleaning, detailing' },
    { id: 'bike-cleaning', name: 'Bike Cleaning', icon: '🏍️', description: 'Motorcycle cleaning, bicycle maintenance' },
    { id: 'vehicle-repair', name: 'Vehicle Repair', icon: '🔧', description: 'Basic car/bike repairs, maintenance' },
    
    // Home Cleaning & Maintenance
    { id: 'home-cleaning', name: 'Home Cleaning', icon: '🧹', description: 'House cleaning, deep cleaning, move-in/out' },
    { id: 'kitchen-cleaning', name: 'Kitchen Cleaning', icon: '🍳', description: 'Kitchen deep clean, appliance cleaning' },
    { id: 'bathroom-cleaning', name: 'Bathroom Cleaning', icon: '🚿', description: 'Bathroom deep clean, tile cleaning' },
    { id: 'window-cleaning', name: 'Window Cleaning', icon: '🪟', description: 'Interior/exterior window cleaning' },
    
    // Cooking & Food Services
    { id: 'cooking', name: 'Cooking', icon: '👨‍🍳', description: 'Home cooking, meal prep, catering' },
    { id: 'baking', name: 'Baking', icon: '🥧', description: 'Cakes, cookies, bread baking' },
    { id: 'meal-prep', name: 'Meal Prep', icon: '🍱', description: 'Weekly meal preparation, healthy cooking' },
    
    // Plumbing & Electrical
    { id: 'plumbing', name: 'Plumbing', icon: '🚰', description: 'Pipe repairs, faucet installation, drain cleaning' },
    { id: 'electrical', name: 'Electrical', icon: '⚡', description: 'Wiring, outlet installation, electrical repairs' },
    { id: 'ac-repair', name: 'AC Repair', icon: '❄️', description: 'Air conditioning maintenance and repair' },
    
    // Home Improvement
    { id: 'painting', name: 'Painting', icon: '🎨', description: 'Interior/exterior painting, wall repairs' },
    { id: 'carpentry', name: 'Carpentry', icon: '🔨', description: 'Furniture repair, custom woodwork, installations' },
    { id: 'flooring', name: 'Flooring', icon: '🏠', description: 'Tile work, laminate installation, floor repair' },
    
    // Outdoor & Garden
    { id: 'gardening', name: 'Gardening', icon: '🌱', description: 'Landscaping, plant care, lawn maintenance' },
    { id: 'outdoor-cleaning', name: 'Outdoor Cleaning', icon: '🧽', description: 'Patio cleaning, outdoor furniture care' },
    { id: 'fence-repair', name: 'Fence Repair', icon: '🚧', description: 'Fence installation, repair, maintenance' },
    
    // Appliance & Electronics
    { id: 'appliance-repair', name: 'Appliance Repair', icon: '🔌', description: 'Washing machine, refrigerator, microwave repair' },
    { id: 'electronics', name: 'Electronics', icon: '📱', description: 'TV mounting, smart home setup, device repair' },
    { id: 'computer-repair', name: 'Computer Repair', icon: '💻', description: 'PC repair, laptop maintenance, software help' },
    
    // General Handyman
    { id: 'handyman', name: 'General Handyman', icon: '🛠️', description: 'General repairs, installations, maintenance' },
    { id: 'furniture-assembly', name: 'Furniture Assembly', icon: '🪑', description: 'IKEA assembly, furniture setup' },
    { id: 'moving-help', name: 'Moving Help', icon: '📦', description: 'Packing, unpacking, furniture moving' },
    
    // Personal Services
    { id: 'pet-care', name: 'Pet Care', icon: '🐕', description: 'Pet grooming, walking, basic pet care' },
    { id: 'elderly-care', name: 'Elderly Care', icon: '👴', description: 'Companion care, assistance with daily tasks' },
    { id: 'childcare', name: 'Childcare', icon: '👶', description: 'Babysitting, child supervision, tutoring' },
    
    // Specialized Services
    { id: 'photography', name: 'Photography', icon: '📸', description: 'Event photography, portrait sessions' },
    { id: 'tutoring', name: 'Tutoring', icon: '📚', description: 'Academic tutoring, skill teaching' },
    { id: 'delivery', name: 'Delivery Services', icon: '🚚', description: 'Package delivery, grocery shopping' }
  ];

  // Group categories by type
  const categoryGroups = {
    'Vehicle Services': serviceCategories.slice(0, 3),
    'Home Cleaning & Maintenance': serviceCategories.slice(3, 7),
    'Cooking & Food Services': serviceCategories.slice(7, 10),
    'Plumbing & Electrical': serviceCategories.slice(10, 13),
    'Home Improvement': serviceCategories.slice(13, 16),
    'Outdoor & Garden': serviceCategories.slice(16, 19),
    'Appliance & Electronics': serviceCategories.slice(19, 22),
    'General Handyman': serviceCategories.slice(22, 25),
    'Personal Services': serviceCategories.slice(25, 28),
    'Specialized Services': serviceCategories.slice(28, 31)
  };

  // Filter categories based on search term
  const filteredCategories = serviceCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter groups based on search term
  const filteredGroups = Object.entries(categoryGroups).map(([groupName, categories]) => ({
    name: groupName,
    categories: categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.categories.length > 0);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onDataChange({ selectedCategories: newSelection });
    onValidationChange(newSelection.length > 0);
  };

  // Service selection is handled automatically when user selects categories
  // The main onboarding flow handles navigation with Next/Previous buttons

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Select Your Services
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Choose the service categories you want to offer
        </p>
        
        {/* Search Input */}
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Grouped Categories */}
      <div className="space-y-8 mb-8">
        {filteredGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {group.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {group.categories.map((category) => (
                <div
                  key={category.id}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {category.description}
                    </p>
                  </div>
                  
                  {selectedCategories.includes(category.id) && (
                    <div className="mt-3 text-center">
                      <div className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedCategories.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">
            Selected Services ({selectedCategories.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => {
              const category = serviceCategories.find(c => c.id === categoryId);
              return (
                <span
                  key={categoryId}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full"
                >
                  {category?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
