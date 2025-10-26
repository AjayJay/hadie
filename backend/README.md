# Handie Backend API

A comprehensive Node.js backend API for the Handie gig-economy platform, built with Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Complete user lifecycle management
- **Onboarding System**: Step-by-step onboarding for customers and experts
- **Real-time Communication**: Socket.io integration for live updates
- **Database Management**: PostgreSQL with automated migrations
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Scalable Architecture**: Modular design with clean separation of concerns

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (optional, for caching)

## 🛠️ Installation

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=handie_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up PostgreSQL database**:
   ```sql
   CREATE DATABASE handie_db;
   ```

5. **Run database migrations**:
   ```bash
   npm run migrate
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Onboarding
- `GET /api/onboarding` - Get onboarding data
- `PUT /api/onboarding` - Update onboarding data
- `POST /api/onboarding/complete` - Complete onboarding
- `POST /api/onboarding/reset` - Reset onboarding (testing)

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── migrations/          # Database migrations
├── package.json
└── tsconfig.json
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm test` - Run tests

## 🗄️ Database Schema

The database includes the following main tables:
- `users` - User accounts and profiles
- `service_categories` - Service categories
- `services` - Individual services
- `bookings` - Service bookings
- `reviews` - Customer reviews
- `expert_verifications` - Expert verification documents
- `notifications` - User notifications

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Rate Limiting**: Prevent abuse and DoS attacks
- **CORS Protection**: Configured for specific origins
- **Helmet Security**: Security headers
- **SQL Injection Protection**: Parameterized queries

## 🌐 Real-time Features

Socket.io integration for:
- Live booking updates
- Real-time notifications
- Chat between customers and experts
- Location tracking

## 📱 Mobile-Ready

The API is designed to work seamlessly with React Native:
- RESTful API design
- JSON responses
- Token-based authentication
- Real-time capabilities

## 🚀 Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Run migrations**:
   ```bash
   npm run migrate
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
npm test
```

## 📝 API Documentation

The API follows RESTful conventions:
- `GET` for retrieving data
- `POST` for creating resources
- `PUT` for updating resources
- `DELETE` for removing resources

All responses follow this format:
```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "error": string
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
