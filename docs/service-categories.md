# Service Categories System

## 🎯 **Overview**

The service categories system manages 33+ comprehensive service categories organized into logical groups, with search, filtering, and selection capabilities for experts.

## 🏗️ **Architecture**

### **Frontend Components**
- `ServiceSelectionStep.tsx` - Service category selection interface
- Service category configuration
- Search and filtering components

### **Backend Components**
- Service category models
- Category management endpoints
- Search and filtering APIs

## 📊 **Service Categories Structure**

### **Vehicle Services**
```typescript
const vehicleServices = [
  {
    id: 'car-cleaning',
    name: 'Car Cleaning',
    icon: '🚗',
    description: 'Car wash, interior cleaning, detailing',
    category: 'vehicle',
    subcategories: ['exterior-wash', 'interior-cleaning', 'detailing']
  },
  {
    id: 'bike-cleaning',
    name: 'Bike Cleaning',
    icon: '🏍️',
    description: 'Motorcycle cleaning, bicycle maintenance',
    category: 'vehicle',
    subcategories: ['motorcycle-cleaning', 'bicycle-maintenance']
  },
  {
    id: 'vehicle-repair',
    name: 'Vehicle Repair',
    icon: '🔧',
    description: 'Basic car/bike repairs, maintenance',
    category: 'vehicle',
    subcategories: ['basic-repairs', 'maintenance', 'diagnostics']
  }
];
```

### **Home Cleaning & Maintenance**
```typescript
const homeCleaningServices = [
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    icon: '🧹',
    description: 'House cleaning, deep cleaning, move-in/out',
    category: 'cleaning',
    subcategories: ['regular-cleaning', 'deep-cleaning', 'move-in-out']
  },
  {
    id: 'kitchen-cleaning',
    name: 'Kitchen Cleaning',
    icon: '🍳',
    description: 'Kitchen deep clean, appliance cleaning',
    category: 'cleaning',
    subcategories: ['deep-clean', 'appliance-cleaning', 'cabinet-cleaning']
  },
  {
    id: 'bathroom-cleaning',
    name: 'Bathroom Cleaning',
    icon: '🚿',
    description: 'Bathroom deep clean, tile cleaning',
    category: 'cleaning',
    subcategories: ['deep-clean', 'tile-cleaning', 'grout-cleaning']
  },
  {
    id: 'window-cleaning',
    name: 'Window Cleaning',
    icon: '🪟',
    description: 'Interior/exterior window cleaning',
    category: 'cleaning',
    subcategories: ['interior', 'exterior', 'commercial']
  }
];
```

### **Cooking & Food Services**
```typescript
const cookingServices = [
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '👨‍🍳',
    description: 'Home cooking, meal prep, catering',
    category: 'food',
    subcategories: ['home-cooking', 'meal-prep', 'catering']
  },
  {
    id: 'baking',
    name: 'Baking',
    icon: '🥧',
    description: 'Cakes, cookies, bread baking',
    category: 'food',
    subcategories: ['cakes', 'cookies', 'bread', 'pastries']
  },
  {
    id: 'meal-prep',
    name: 'Meal Prep',
    icon: '🍱',
    description: 'Weekly meal preparation, healthy cooking',
    category: 'food',
    subcategories: ['weekly-prep', 'healthy-cooking', 'diet-specific']
  }
];
```

### **Space Rental Services**
```typescript
const spaceRentalServices = [
  {
    id: 'parking-rental',
    name: 'Parking Space Rental',
    icon: '🅿️',
    description: 'Rent out parking spaces by hour/day',
    category: 'rental',
    subcategories: ['hourly', 'daily', 'monthly'],
    pricingModels: ['hourly', 'daily', 'weekly', 'monthly']
  },
  {
    id: 'storage-rental',
    name: 'Storage Space Rental',
    icon: '📦',
    description: 'Rent out storage space for belongings',
    category: 'rental',
    subcategories: ['indoor', 'outdoor', 'climate-controlled'],
    pricingModels: ['monthly', 'quarterly', 'yearly']
  },
  {
    id: 'event-space',
    name: 'Event Space Rental',
    icon: '🎉',
    description: 'Rent out space for events and gatherings',
    category: 'rental',
    subcategories: ['indoor', 'outdoor', 'venue'],
    pricingModels: ['hourly', 'daily', 'event-based']
  }
];
```

## 📡 **API Contracts**

### **GET /api/services/categories**
```typescript
// Response
interface ServiceCategoriesResponse {
  success: boolean;
  data: {
    categories: ServiceCategory[];
    groups: CategoryGroup[];
    totalCount: number;
  };
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  subcategories: string[];
  pricingModels?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryGroup {
  name: string;
  categories: ServiceCategory[];
  order: number;
}
```

### **GET /api/services/categories/search**
```typescript
// Request
interface SearchCategoriesRequest {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

// Response
interface SearchCategoriesResponse {
  success: boolean;
  data: {
    categories: ServiceCategory[];
    totalCount: number;
    hasMore: boolean;
  };
}
```

### **POST /api/services/categories/select**
```typescript
// Request
interface SelectCategoriesRequest {
  userId: string;
  selectedCategories: string[];
}

// Response
interface SelectCategoriesResponse {
  success: boolean;
  message: string;
  data: {
    selectedCategories: string[];
    totalSelected: number;
  };
}
```

### **GET /api/services/categories/:categoryId**
```typescript
// Response
interface CategoryDetailsResponse {
  success: boolean;
  data: {
    category: ServiceCategory;
    subcategories: Subcategory[];
    pricingModels: PricingModel[];
    requirements: string[];
    averagePricing: {
      min: number;
      max: number;
      currency: string;
    };
  };
}
```

## 🗄️ **Database Schema**

### **Service Categories Table**
```sql
CREATE TABLE service_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  subcategories JSONB DEFAULT '[]',
  pricing_models JSONB DEFAULT '[]',
  requirements JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Expert Service Categories Table**
```sql
CREATE TABLE expert_service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id VARCHAR(50) REFERENCES service_categories(id) ON DELETE CASCADE,
  subcategories JSONB DEFAULT '[]',
  pricing JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(expert_id, category_id)
);
```

### **Category Groups Table**
```sql
CREATE TABLE category_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 **Frontend Implementation**

### **Service Selection Component**
```typescript
interface ServiceSelectionStepProps {
  context: StepComponentProps['context'];
  onDataChange: (data: Record<string, any>) => void;
  onValidationChange: (isValid: boolean) => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  context,
  onDataChange,
  onValidationChange
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<CategoryGroup[]>([]);

  // Group categories by type
  const categoryGroups = useMemo(() => {
    return Object.entries(serviceCategories.reduce((groups, category) => {
      const groupName = getCategoryGroup(category.category);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(category);
      return groups;
    }, {} as Record<string, ServiceCategory[]>)).map(([name, categories]) => ({
      name,
      categories
    }));
  }, []);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    return serviceCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newSelection);
    onDataChange({ selectedCategories: newSelection });
    onValidationChange(newSelection.length > 0);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grouped Categories */}
      <div className="space-y-8">
        {filteredGroups.map((group) => (
          <div key={group.name}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {group.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {group.categories.map((category) => (
                <ServiceCategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategories.includes(category.id)}
                  onToggle={() => handleCategoryToggle(category.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Categories Summary */}
      {selectedCategories.length > 0 && (
        <SelectedCategoriesSummary
          selectedCategories={selectedCategories}
          serviceCategories={serviceCategories}
        />
      )}
    </div>
  );
};
```

### **Service Category Card Component**
```typescript
interface ServiceCategoryCardProps {
  category: ServiceCategory;
  isSelected: boolean;
  onToggle: () => void;
}

const ServiceCategoryCard: React.FC<ServiceCategoryCardProps> = ({
  category,
  isSelected,
  onToggle
}) => {
  return (
    <div
      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      onClick={onToggle}
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
      
      {isSelected && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
            Selected
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🔍 **Search & Filtering**

### **Search Implementation**
```typescript
const useServiceSearch = (query: string) => {
  const [results, setResults] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Debounced search
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/services/categories/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.data.categories);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isLoading };
};
```

### **Category Grouping Logic**
```typescript
const getCategoryGroup = (category: string): string => {
  const groupMapping: Record<string, string> = {
    'vehicle': 'Vehicle Services',
    'cleaning': 'Home Cleaning & Maintenance',
    'food': 'Cooking & Food Services',
    'plumbing': 'Plumbing & Electrical',
    'electrical': 'Plumbing & Electrical',
    'improvement': 'Home Improvement',
    'outdoor': 'Outdoor & Garden',
    'appliance': 'Appliance & Electronics',
    'electronics': 'Appliance & Electronics',
    'handyman': 'General Handyman',
    'personal': 'Personal Services',
    'specialized': 'Specialized Services',
    'rental': 'Space Rental Services'
  };
  
  return groupMapping[category] || 'Other Services';
};
```

## 🚀 **Advanced Features**

### **Category Recommendations**
```typescript
interface CategoryRecommendation {
  categoryId: string;
  reason: string;
  confidence: number;
}

const getCategoryRecommendations = async (
  userId: string,
  selectedCategories: string[]
): Promise<CategoryRecommendation[]> => {
  // AI-powered recommendations based on:
  // - User's location
  // - Selected categories
  // - Market demand
  // - Expert success rates
  
  const response = await fetch('/api/services/categories/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, selectedCategories })
  });
  
  return response.json();
};
```

### **Pricing Information**
```typescript
interface PricingInfo {
  categoryId: string;
  location: string;
  pricing: {
    hourly: { min: number; max: number; average: number };
    daily: { min: number; max: number; average: number };
    currency: string;
  };
  marketDemand: 'low' | 'medium' | 'high';
  competitionLevel: 'low' | 'medium' | 'high';
}

const getPricingInfo = async (categoryId: string, location: string): Promise<PricingInfo> => {
  const response = await fetch(`/api/services/categories/${categoryId}/pricing?location=${location}`);
  return response.json();
};
```

## 🧪 **Testing**

### **Unit Tests**
```typescript
describe('Service Categories', () => {
  test('should filter categories by search term', () => {
    const categories = getServiceCategories();
    const filtered = filterCategories(categories, 'cleaning');
    expect(filtered).toContainEqual(expect.objectContaining({ name: 'Home Cleaning' }));
  });

  test('should group categories correctly', () => {
    const categories = getServiceCategories();
    const groups = groupCategories(categories);
    expect(groups).toHaveProperty('Vehicle Services');
    expect(groups['Vehicle Services']).toHaveLength(3);
  });

  test('should validate category selection', () => {
    const selectedCategories = ['car-cleaning', 'home-cleaning'];
    const isValid = validateCategorySelection(selectedCategories);
    expect(isValid).toBe(true);
  });
});
```

### **Integration Tests**
```typescript
describe('Service Categories API', () => {
  test('GET /api/services/categories returns all categories', async () => {
    const response = await request(app).get('/api/services/categories');
    expect(response.status).toBe(200);
    expect(response.body.data.categories).toHaveLength(33);
  });

  test('POST /api/services/categories/select saves expert selections', async () => {
    const selections = { userId: 'user-1', selectedCategories: ['car-cleaning', 'home-cleaning'] };
    const response = await request(app)
      .post('/api/services/categories/select')
      .send(selections);
    expect(response.status).toBe(200);
  });
});
```

## 📈 **Analytics & Metrics**

### **Category Performance Metrics**
```typescript
interface CategoryMetrics {
  categoryId: string;
  selectionCount: number;
  completionRate: number;
  averageEarnings: number;
  marketDemand: number;
  competitionLevel: number;
  trendingScore: number;
}
```

### **Search Analytics**
```typescript
interface SearchAnalytics {
  query: string;
  resultsCount: number;
  clickThroughRate: number;
  conversionRate: number;
  averageSearchTime: number;
  popularSearches: string[];
}
```

## 🔧 **Configuration**

### **Category Configuration**
```typescript
interface CategoryConfig {
  maxSelectionsPerExpert: number;
  minSelectionsRequired: number;
  enableRecommendations: boolean;
  enablePricingInfo: boolean;
  enableMarketAnalytics: boolean;
  searchDebounceMs: number;
  cacheExpiryMinutes: number;
}
```

### **Environment Variables**
```env
SERVICE_CATEGORIES_CACHE_TTL=3600
SERVICE_CATEGORIES_MAX_SELECTIONS=10
SERVICE_CATEGORIES_MIN_SELECTIONS=1
ENABLE_CATEGORY_RECOMMENDATIONS=true
ENABLE_PRICING_ANALYTICS=true
```
