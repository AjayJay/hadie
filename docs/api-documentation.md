# API Documentation

## 🎯 **Overview**

This document provides comprehensive API documentation for all Handie platform endpoints, including request/response formats, authentication, and error handling.

## 🏗️ **API Architecture**

### **Base URL**: `https://api.handie.com/v1`
### **Authentication**: JWT Bearer Token
### **Content-Type**: `application/json`
### **Rate Limiting**: 1000 requests/hour per user

## 🔐 **Authentication Endpoints**

### **POST /api/auth/register**
Register a new user account.

**Request:**
```typescript
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'expert';
}
```

**Response:**
```typescript
interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      onboardingCompleted: boolean;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  error?: string;
}
```

**Example:**
```bash
curl -X POST https://api.handie.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "9876543210",
    "role": "customer"
  }'
```

### **POST /api/auth/login**
Authenticate user and return tokens.

**Request:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:**
```typescript
interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  error?: string;
}
```

### **POST /api/auth/refresh**
Refresh access token using refresh token.

**Request:**
```typescript
interface RefreshRequest {
  refreshToken: string;
}
```

**Response:**
```typescript
interface RefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
  };
  error?: string;
}
```

### **POST /api/auth/logout**
Logout user and invalidate refresh token.

**Request:**
```typescript
interface LogoutRequest {
  refreshToken: string;
}
```

## 👤 **User Management Endpoints**

### **GET /api/users/profile**
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```typescript
interface UserProfileResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: string;
      onboardingCompleted: boolean;
      profilePicture?: string;
      dateOfBirth?: string;
      gender?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}
```

### **PUT /api/users/profile**
Update user profile.

**Request:**
```typescript
interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  profilePicture?: string;
  dateOfBirth?: string;
  gender?: string;
}
```

### **GET /api/users/:userId/addresses**
Get user addresses.

**Response:**
```typescript
interface UserAddressesResponse {
  success: boolean;
  data: {
    addresses: UserAddress[];
  };
}

interface UserAddress {
  id: string;
  addressType: 'primary' | 'secondary' | 'service_area';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isPrimary: boolean;
  isActive: boolean;
}
```

### **POST /api/users/:userId/addresses**
Add new address for user.

**Request:**
```typescript
interface CreateAddressRequest {
  addressType: 'primary' | 'secondary' | 'service_area';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isPrimary?: boolean;
}
```

## 🛠️ **Service Categories Endpoints**

### **GET /api/services/categories**
Get all service categories.

**Response:**
```typescript
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
```

### **GET /api/services/categories/search**
Search service categories.

**Query Parameters:**
- `query` (string): Search term
- `category` (string): Filter by category
- `limit` (number): Results limit (default: 20)
- `offset` (number): Results offset (default: 0)

**Response:**
```typescript
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
Select service categories for expert.

**Request:**
```typescript
interface SelectCategoriesRequest {
  userId: string;
  selectedCategories: string[];
}
```

## 🅿️ **Parking Space Endpoints**

### **POST /api/parking-spaces**
Create new parking space.

**Request:**
```typescript
interface CreateParkingSpaceRequest {
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
```

**Response:**
```typescript
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
Search parking spaces.

**Request:**
```typescript
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
```

**Response:**
```typescript
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
Book parking space.

**Request:**
```typescript
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
```

**Response:**
```typescript
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
Get parking spaces owned by user.

**Response:**
```typescript
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

## 📅 **Onboarding Endpoints**

### **POST /api/onboarding/initialize**
Initialize onboarding session.

**Request:**
```typescript
interface InitializeRequest {
  userId: string;
  role: 'customer' | 'expert';
}
```

**Response:**
```typescript
interface OnboardingSessionResponse {
  success: boolean;
  data: {
    session: OnboardingSession;
    availableSteps: OnboardingStepConfig[];
    completedSteps: string[];
    skippedSteps: string[];
    progress: number; // percentage
  };
}
```

### **POST /api/onboarding/step/:stepId/complete**
Complete onboarding step.

**Request:**
```typescript
interface CompleteStepRequest {
  stepId: string;
  data: Record<string, any>;
}
```

**Response:**
```typescript
interface StepCompletionResponse {
  success: boolean;
  nextStep?: string;
  isComplete: boolean;
  message: string;
}
```

### **POST /api/onboarding/step/:stepId/skip**
Skip onboarding step.

**Request:**
```typescript
interface SkipStepRequest {
  stepId: string;
  reason?: string;
}
```

## 💰 **Payment Endpoints**

### **POST /api/payments/process**
Process payment for booking.

**Request:**
```typescript
interface ProcessPaymentRequest {
  bookingId: string;
  paymentType: 'service' | 'parking' | 'subscription';
  amount: number;
  currency: string;
  paymentMethod: {
    type: 'card' | 'wallet' | 'upi';
    details: any;
  };
}
```

**Response:**
```typescript
interface PaymentResponse {
  success: boolean;
  message: string;
  data: {
    payment: PaymentDetails;
    transactionId: string;
    gatewayResponse: any;
  };
}
```

### **POST /api/payments/refund**
Process refund for booking.

**Request:**
```typescript
interface RefundRequest {
  paymentId: string;
  amount?: number; // Partial refund if specified
  reason: string;
}
```

## 📊 **Analytics Endpoints**

### **GET /api/analytics/dashboard/:userId**
Get user dashboard analytics.

**Response:**
```typescript
interface DashboardAnalyticsResponse {
  success: boolean;
  data: {
    user: {
      totalBookings: number;
      totalEarnings: number;
      averageRating: number;
      completionRate: number;
    };
    recentActivity: Activity[];
    earnings: {
      daily: number[];
      weekly: number[];
      monthly: number[];
    };
    bookings: {
      upcoming: Booking[];
      completed: Booking[];
      cancelled: Booking[];
    };
  };
}
```

### **GET /api/analytics/parking-spaces/:spaceId**
Get parking space analytics.

**Response:**
```typescript
interface ParkingSpaceAnalyticsResponse {
  success: boolean;
  data: {
    space: {
      totalBookings: number;
      totalEarnings: number;
      averageRating: number;
      occupancyRate: number;
    };
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
  };
}
```

## 🔍 **Search Endpoints**

### **GET /api/search/experts**
Search experts by location and service.

**Query Parameters:**
- `latitude` (number): User latitude
- `longitude` (number): User longitude
- `radius` (number): Search radius in km (default: 10)
- `serviceCategory` (string): Service category filter
- `minRating` (number): Minimum rating filter
- `maxPrice` (number): Maximum price filter
- `availability` (string): Availability filter (now, today, this_week)

**Response:**
```typescript
interface ExpertSearchResponse {
  success: boolean;
  data: {
    experts: Expert[];
    totalCount: number;
    hasMore: boolean;
    averageDistance: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

interface Expert {
  id: string;
  name: string;
  profilePicture?: string;
  rating: number;
  totalBookings: number;
  serviceCategories: string[];
  distance: number; // in km
  pricing: {
    hourly: number;
    daily: number;
  };
  availability: {
    isAvailable: boolean;
    nextAvailableSlot?: string;
  };
}
```

## ⭐ **Review Endpoints**

### **POST /api/reviews/service**
Submit service review.

**Request:**
```typescript
interface ServiceReviewRequest {
  serviceId: string;
  customerId: string;
  expertId: string;
  rating: number; // 1-5
  reviewText?: string;
  photos?: string[];
}
```

### **POST /api/reviews/parking-space**
Submit parking space review.

**Request:**
```typescript
interface ParkingReviewRequest {
  spaceId: string;
  customerId: string;
  bookingId: string;
  rating: number; // 1-5
  reviewText?: string;
  photos?: string[];
}
```

## 🚨 **Error Handling**

### **Error Response Format**
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
}
```

### **Common Error Codes**
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_EXISTS` - Email already registered
- `INVALID_EMAIL` - Malformed email format
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `TOKEN_EXPIRED` - Access token expired
- `INVALID_REFRESH_TOKEN` - Refresh token invalid/expired
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `VALIDATION_ERROR` - Request validation failed
- `PAYMENT_FAILED` - Payment processing failed
- `BOOKING_CONFLICT` - Booking time conflict
- `RATE_LIMIT_EXCEEDED` - Too many requests

### **HTTP Status Codes**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔒 **Security**

### **Authentication**
All protected endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer <access_token>
```

### **Rate Limiting**
- **General API**: 1000 requests/hour per user
- **Authentication**: 5 login attempts/minute per IP
- **Registration**: 3 registrations/minute per IP
- **Search**: 100 searches/minute per user

### **Input Validation**
All inputs are validated using Joi schemas:
- Email format validation
- Phone number validation
- Password strength validation
- Coordinate validation
- Date/time validation

### **CORS Configuration**
```typescript
const corsOptions = {
  origin: ['https://handie.com', 'https://www.handie.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

## 📈 **Performance**

### **Response Times**
- **Authentication**: < 200ms
- **User Profile**: < 100ms
- **Service Search**: < 500ms
- **Parking Search**: < 300ms
- **Booking Creation**: < 1000ms

### **Caching Strategy**
- **Service Categories**: 1 hour cache
- **User Profiles**: 5 minutes cache
- **Parking Spaces**: 15 minutes cache
- **Search Results**: 5 minutes cache

### **Pagination**
All list endpoints support pagination:
```typescript
interface PaginationParams {
  page?: number; // default: 1
  limit?: number; // default: 20, max: 100
  offset?: number; // alternative to page
}
```

## 🧪 **Testing**

### **Test Environment**
- **Base URL**: `https://api-test.handie.com/v1`
- **Test Data**: Separate test database
- **Mock Payments**: Sandbox payment gateway

### **API Testing Examples**
```bash
# Test user registration
curl -X POST https://api-test.handie.com/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123!","phone":"9876543210","role":"customer"}'

# Test parking space search
curl -X POST https://api-test.handie.com/v1/parking-spaces/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"location":{"latitude":28.6139,"longitude":77.2090,"radius":5},"dateTime":{"startTime":"2024-01-01T10:00:00","endTime":"2024-01-01T12:00:00"}}'
```

This comprehensive API documentation provides all the necessary information for developers to integrate with the Handie platform.
