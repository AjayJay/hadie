# Parking Space Rental System

## 🎯 **Overview**

The parking space rental system allows customers to rent out their parking spaces with flexible pricing models (hourly, daily, weekly, monthly) and provides a complete booking and management flow.

## 🏗️ **Architecture**

### **Frontend Components**
- `ParkingSpaceManagement.tsx` - Customer parking space management
- `ParkingSpaceListing.tsx` - Available parking spaces display
- `ParkingSpaceBooking.tsx` - Booking interface
- `ParkingSpaceMap.tsx` - Interactive map with parking locations

### **Backend Components**
- `ParkingSpaceController.ts` - Parking space endpoints
- `ParkingSpaceService.ts` - Business logic
- `BookingController.ts` - Booking management
- `PaymentController.ts` - Payment processing

## 🔄 **User Flows**

### **Customer Listing Parking Space**
```
1. Customer Dashboard → Parking Spaces
2. Click "List Your Parking Space"
3. Fill parking space details:
   ├── Location (address, coordinates)
   ├── Space type (indoor/outdoor, covered/uncovered)
   ├── Vehicle size (compact, sedan, SUV, truck)
   ├── Amenities (security, lighting, CCTV)
   ├── Availability schedule
   └── Pricing (hourly, daily, weekly, monthly rates)
4. Upload photos
5. Set availability calendar
6. Submit for approval
7. Space goes live after approval
```

### **Customer Booking Parking Space**
```
1. Search parking spaces by location
2. Filter by:
   ├── Date and time
   ├── Duration (hourly, daily, etc.)
   ├── Vehicle size
   ├── Price range
   └── Amenities
3. View space details and photos
4. Check availability calendar
5. Select time slot
6. Enter vehicle details
7. Review booking summary
8. Make payment
9. Receive booking confirmation
10. Access parking space (QR code/digital key)
```

### **Parking Space Management Flow**
```
1. Customer views their listed spaces
2. Monitor bookings and earnings
3. Update availability calendar
4. Modify pricing
5. Respond to customer inquiries
6. Manage space photos and details
7. Handle cancellations and refunds
```

## 📡 **API Contracts**

### **POST /api/parking-spaces**
```typescript
// Request
interface CreateParkingSpaceRequest {
  ownerId: string;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  spaceDetails: {
    type: 'indoor' | 'outdoor' | 'covered' | 'uncovered';
    vehicleSize: 'compact' | 'sedan' | 'suv' | 'truck' | 'motorcycle';
    amenities: string[];
    photos: string[];
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly?: number;
    monthly?: number;
    currency: string;
  };
  availability: {
    schedule: WeeklySchedule;
    exceptions: DateException[];
  };
}

// Response
interface ParkingSpaceResponse {
  success: boolean;
  message: string;
  data: {
    parkingSpace: ParkingSpace;
    qrCode: string;
    shareUrl: string;
  };
}
```

### **GET /api/parking-spaces/search**
```typescript
// Request
interface SearchParkingSpacesRequest {
  location: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  dateTime: {
    startTime: string;
    endTime: string;
  };
  filters?: {
    vehicleSize?: string;
    maxPrice?: number;
    amenities?: string[];
    spaceType?: string;
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

// Response
interface SearchParkingSpacesResponse {
  success: boolean;
  data: {
    parkingSpaces: ParkingSpace[];
    totalCount: number;
    hasMore: boolean;
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}
```

### **POST /api/parking-spaces/:spaceId/book**
```typescript
// Request
interface BookParkingSpaceRequest {
  spaceId: string;
  customerId: string;
  bookingDetails: {
    startTime: string;
    endTime: string;
    vehicleDetails: {
      make: string;
      model: string;
      licensePlate: string;
      color: string;
    };
    specialRequests?: string;
  };
  paymentMethod: {
    type: 'card' | 'wallet' | 'upi';
    details: any;
  };
}

// Response
interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: ParkingBooking;
    payment: PaymentDetails;
    accessCode: string;
    qrCode: string;
  };
}
```

### **GET /api/parking-spaces/owner/:ownerId**
```typescript
// Response
interface OwnerParkingSpacesResponse {
  success: boolean;
  data: {
    parkingSpaces: ParkingSpace[];
    totalEarnings: number;
    activeBookings: number;
    totalBookings: number;
    averageRating: number;
  };
}
```

## 🗄️ **Database Schema**

### **Parking Spaces Table**
```sql
CREATE TABLE parking_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  address JSONB NOT NULL,
  space_details JSONB NOT NULL,
  pricing JSONB NOT NULL,
  availability JSONB NOT NULL,
  photos JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  approval_status VARCHAR(20) DEFAULT 'pending',
  rating DECIMAL(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Parking Bookings Table**
```sql
CREATE TABLE parking_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_details JSONB NOT NULL,
  vehicle_details JSONB NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  booking_status VARCHAR(20) DEFAULT 'confirmed',
  access_code VARCHAR(20) UNIQUE,
  qr_code TEXT,
  special_requests TEXT,
  cancellation_reason TEXT,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Parking Space Reviews Table**
```sql
CREATE TABLE parking_space_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES parking_bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Parking Space Availability Table**
```sql
CREATE TABLE parking_space_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id UUID REFERENCES parking_spaces(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slots JSONB NOT NULL, -- Array of available time slots
  is_blocked BOOLEAN DEFAULT FALSE,
  block_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(space_id, date)
);
```

## 🎨 **Frontend Implementation**

### **Parking Space Management Component**
```typescript
interface ParkingSpaceManagementProps {
  ownerId: string;
}

const ParkingSpaceManagement: React.FC<ParkingSpaceManagementProps> = ({ ownerId }) => {
  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchOwnerParkingSpaces();
  }, [ownerId]);

  const fetchOwnerParkingSpaces = async () => {
    try {
      const response = await fetch(`/api/parking-spaces/owner/${ownerId}`);
      const data = await response.json();
      setParkingSpaces(data.data.parkingSpaces);
    } catch (error) {
      console.error('Error fetching parking spaces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Parking Spaces</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          List New Space
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkingSpaces.map((space) => (
            <ParkingSpaceCard
              key={space.id}
              space={space}
              onEdit={() => handleEditSpace(space.id)}
              onDelete={() => handleDeleteSpace(space.id)}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateParkingSpaceModal
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchOwnerParkingSpaces();
          }}
        />
      )}
    </div>
  );
};
```

### **Parking Space Search Component**
```typescript
interface ParkingSpaceSearchProps {
  onSpaceSelect: (space: ParkingSpace) => void;
}

const ParkingSpaceSearch: React.FC<ParkingSpaceSearchProps> = ({ onSpaceSelect }) => {
  const [searchParams, setSearchParams] = useState<SearchParkingSpacesRequest>({
    location: { latitude: 0, longitude: 0, radius: 5 },
    dateTime: { startTime: '', endTime: '' },
    filters: {},
    pagination: { page: 1, limit: 20 }
  });
  const [results, setResults] = useState<ParkingSpace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/parking-spaces/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams)
      });
      const data = await response.json();
      setResults(data.data.parkingSpaces);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Parking Space</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter address or area"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={searchParams.dateTime.startTime}
              onChange={(e) => setSearchParams({
                ...searchParams,
                dateTime: { ...searchParams.dateTime, startTime: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="datetime-local"
              value={searchParams.dateTime.endTime}
              onChange={(e) => setSearchParams({
                ...searchParams,
                dateTime: { ...searchParams.dateTime, endTime: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Size
            </label>
            <select
              value={searchParams.filters?.vehicleSize || ''}
              onChange={(e) => setSearchParams({
                ...searchParams,
                filters: { ...searchParams.filters, vehicleSize: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Size</option>
              <option value="compact">Compact</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price (per hour)
            </label>
            <input
              type="number"
              placeholder="Enter max price"
              value={searchParams.filters?.maxPrice || ''}
              onChange={(e) => setSearchParams({
                ...searchParams,
                filters: { ...searchParams.filters, maxPrice: Number(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Space Type
            </label>
            <select
              value={searchParams.filters?.spaceType || ''}
              onChange={(e) => setSearchParams({
                ...searchParams,
                filters: { ...searchParams.filters, spaceType: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Type</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="covered">Covered</option>
              <option value="uncovered">Uncovered</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((space) => (
          <ParkingSpaceResultCard
            key={space.id}
            space={space}
            onSelect={() => onSpaceSelect(space)}
          />
        ))}
      </div>
    </div>
  );
};
```

## 🗺️ **Interactive Map Integration**

### **Parking Space Map Component**
```typescript
interface ParkingSpaceMapProps {
  spaces: ParkingSpace[];
  selectedSpace?: ParkingSpace;
  onSpaceSelect: (space: ParkingSpace) => void;
}

const ParkingSpaceMap: React.FC<ParkingSpaceMapProps> = ({
  spaces,
  selectedSpace,
  onSpaceSelect
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      setMap(newMap);
    }
  }, []);

  useEffect(() => {
    if (map && spaces.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      // Add new markers
      const newMarkers = spaces.map(space => {
        const marker = new google.maps.Marker({
          position: {
            lat: space.address.coordinates.latitude,
            lng: space.address.coordinates.longitude
          },
          map: map,
          title: space.title,
          icon: {
            url: '/parking-icon.png',
            scaledSize: new google.maps.Size(30, 30)
          }
        });

        marker.addListener('click', () => {
          onSpaceSelect(space);
        });

        return marker;
      });

      setMarkers(newMarkers);

      // Fit map to show all markers
      if (spaces.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        spaces.forEach(space => {
          bounds.extend({
            lat: space.address.coordinates.latitude,
            lng: space.address.coordinates.longitude
          });
        });
        map.fitBounds(bounds);
      }
    }
  }, [map, spaces]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};
```

## 💰 **Pricing & Payment**

### **Dynamic Pricing Calculation**
```typescript
interface PricingCalculation {
  basePrice: number;
  duration: number; // in hours
  pricingModel: 'hourly' | 'daily' | 'weekly' | 'monthly';
  discounts: {
    earlyBird?: number;
    longTerm?: number;
    loyalty?: number;
  };
  fees: {
    platformFee: number;
    serviceFee: number;
    taxes: number;
  };
  total: number;
}

const calculatePricing = (
  space: ParkingSpace,
  startTime: Date,
  endTime: Date,
  pricingModel: string
): PricingCalculation => {
  const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // hours
  
  let basePrice = 0;
  switch (pricingModel) {
    case 'hourly':
      basePrice = space.pricing.hourly * duration;
      break;
    case 'daily':
      basePrice = space.pricing.daily * Math.ceil(duration / 24);
      break;
    case 'weekly':
      basePrice = space.pricing.weekly * Math.ceil(duration / (24 * 7));
      break;
    case 'monthly':
      basePrice = space.pricing.monthly * Math.ceil(duration / (24 * 30));
      break;
  }

  const platformFee = basePrice * 0.1; // 10% platform fee
  const serviceFee = basePrice * 0.05; // 5% service fee
  const taxes = (basePrice + platformFee + serviceFee) * 0.18; // 18% GST

  return {
    basePrice,
    duration,
    pricingModel: pricingModel as any,
    discounts: {},
    fees: {
      platformFee,
      serviceFee,
      taxes
    },
    total: basePrice + platformFee + serviceFee + taxes
  };
};
```

## 🧪 **Testing**

### **Unit Tests**
```typescript
describe('Parking Space Rental', () => {
  test('should calculate pricing correctly', () => {
    const space = createMockParkingSpace();
    const startTime = new Date('2024-01-01T10:00:00');
    const endTime = new Date('2024-01-01T12:00:00');
    
    const pricing = calculatePricing(space, startTime, endTime, 'hourly');
    expect(pricing.duration).toBe(2);
    expect(pricing.basePrice).toBe(space.pricing.hourly * 2);
  });

  test('should validate booking time slots', () => {
    const space = createMockParkingSpace();
    const bookingTime = new Date('2024-01-01T10:00:00');
    
    const isValid = validateBookingTimeSlot(space, bookingTime);
    expect(isValid).toBe(true);
  });
});
```

### **Integration Tests**
```typescript
describe('Parking Space API', () => {
  test('POST /api/parking-spaces creates new space', async () => {
    const spaceData = createMockSpaceData();
    const response = await request(app)
      .post('/api/parking-spaces')
      .send(spaceData);
    
    expect(response.status).toBe(201);
    expect(response.body.data.parkingSpace).toBeDefined();
  });

  test('GET /api/parking-spaces/search returns filtered results', async () => {
    const searchParams = createMockSearchParams();
    const response = await request(app)
      .post('/api/parking-spaces/search')
      .send(searchParams);
    
    expect(response.status).toBe(200);
    expect(response.body.data.parkingSpaces).toBeInstanceOf(Array);
  });
});
```

## 📈 **Analytics & Metrics**

### **Parking Space Analytics**
```typescript
interface ParkingSpaceAnalytics {
  spaceId: string;
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  occupancyRate: number;
  popularTimeSlots: TimeSlot[];
  customerDemographics: {
    ageGroups: Record<string, number>;
    vehicleTypes: Record<string, number>;
  };
  revenueTrends: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
}
```

## 🔧 **Configuration**

### **Environment Variables**
```env
PARKING_SPACE_PLATFORM_FEE_PERCENTAGE=10
PARKING_SPACE_SERVICE_FEE_PERCENTAGE=5
PARKING_SPACE_TAX_PERCENTAGE=18
PARKING_SPACE_MAX_PHOTOS=10
PARKING_SPACE_MIN_BOOKING_HOURS=1
PARKING_SPACE_MAX_BOOKING_DAYS=30
PARKING_SPACE_CANCELLATION_WINDOW_HOURS=2
```
