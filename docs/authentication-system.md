# Authentication System

## 🎯 **Overview**

The authentication system handles user registration, login, logout, and session management using JWT tokens with refresh token mechanism.

## 🏗️ **Architecture**

### **Frontend Components**
- `AuthModal.tsx` - Modal-based login/signup interface
- `AuthScreen.tsx` - Legacy full-screen auth interface
- `AuthContext.tsx` - Authentication state management

### **Backend Components**
- `AuthController.ts` - Authentication endpoints
- `AuthService.ts` - Authentication business logic
- `AuthMiddleware.ts` - JWT validation middleware

## 🔄 **User Flows**

### **Registration Flow**
```
1. User clicks "Sign Up" → Opens AuthModal
2. User selects role (Customer/Expert)
3. User fills registration form
4. Frontend validates input
5. POST /api/auth/register
6. Backend validates & creates user
7. Returns JWT tokens
8. User redirected to onboarding
```

### **Login Flow**
```
1. User clicks "Login" → Opens AuthModal
2. User enters credentials
3. POST /api/auth/login
4. Backend validates credentials
5. Returns JWT tokens
6. User redirected to dashboard
```

### **Token Refresh Flow**
```
1. Access token expires
2. Frontend detects 401 response
3. POST /api/auth/refresh with refresh token
4. Backend validates refresh token
5. Returns new access token
6. Retry original request
```

## 📡 **API Contracts**

### **POST /api/auth/register**
```typescript
// Request
interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'expert';
}

// Response
interface AuthResponse {
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

### **POST /api/auth/login**
```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response
interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    tokens: TokenPair;
  };
  error?: string;
}
```

### **POST /api/auth/refresh**
```typescript
// Request
interface RefreshRequest {
  refreshToken: string;
}

// Response
interface RefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
  };
  error?: string;
}
```

### **POST /api/auth/logout**
```typescript
// Request
interface LogoutRequest {
  refreshToken: string;
}

// Response
interface LogoutResponse {
  success: boolean;
  message: string;
}
```

## 🗄️ **Database Schema**

### **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'expert', 'admin')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Refresh Tokens Table**
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 **Security Features**

### **Password Security**
- Minimum 8 characters
- Must contain uppercase, lowercase, number, special character
- bcrypt hashing with salt rounds: 12

### **JWT Configuration**
- Access Token: 15 minutes expiry
- Refresh Token: 7 days expiry
- Algorithm: HS256
- Secret: Environment variable

### **Validation Rules**
```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (India)
const phoneRegex = /^[6-9]\d{9}$/;

// Password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
```

## 🎨 **Frontend Implementation**

### **AuthContext Interface**
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: RegisterRequest) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}
```

### **AuthModal Props**
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}
```

## 🚀 **Error Handling**

### **Common Error Codes**
- `INVALID_CREDENTIALS` - Wrong email/password
- `USER_EXISTS` - Email already registered
- `INVALID_EMAIL` - Malformed email format
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `TOKEN_EXPIRED` - Access token expired
- `INVALID_REFRESH_TOKEN` - Refresh token invalid/expired

### **Error Response Format**
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  data?: any;
}
```

## 🧪 **Testing**

### **Unit Tests**
- Password validation
- Email validation
- JWT token generation/validation
- Password hashing

### **Integration Tests**
- Registration flow
- Login flow
- Token refresh flow
- Logout flow

### **Test Data**
```typescript
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPass123!',
  phone: '9876543210',
  role: 'customer'
};
```

## 📈 **Performance Considerations**

- **Token Storage**: localStorage for persistence
- **Auto-refresh**: Background token refresh before expiry
- **Request Interceptors**: Automatic token attachment
- **Error Recovery**: Graceful handling of auth failures

## 🔧 **Configuration**

### **Environment Variables**
```env
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=12
```

### **Rate Limiting**
- Login attempts: 5 per minute per IP
- Registration: 3 per minute per IP
- Token refresh: 10 per minute per user
