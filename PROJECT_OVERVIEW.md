# Handie - On-Demand Service Platform

## 🎯 **What is Handie?**

Handie is a comprehensive on-demand service platform that connects customers with skilled experts for everyday tasks. Whether you need home cleaning, car maintenance, cooking services, or any other handy work, Handie makes it easy to find reliable professionals in your area.

## 🏗️ **Project Architecture**

### **Frontend (React + TypeScript)**
- **Landing Page**: Professional marketing page with login/signup options
- **Authentication**: Modal-based login/signup system
- **Onboarding Flow**: Role-specific setup process
- **Dashboards**: Separate interfaces for customers and experts
- **Service Management**: Comprehensive service category selection

### **Backend (Node.js + Express)**
- **RESTful API**: Clean API endpoints for all operations
- **Authentication**: JWT-based auth with refresh tokens
- **Database**: PostgreSQL with proper schema design
- **Validation**: Comprehensive input validation and error handling

## 👥 **User Roles**

### **Customer**
- **Purpose**: Book services for personal needs
- **Onboarding**: Simple 3-step process (Welcome → Profile → Address)
- **Features**: 
  - Browse available services
  - Search experts by location (find nearby service providers)
  - Book appointments
  - Track service providers
  - Rate and review services
  - Rent out parking spaces (hourly/daily rates)

### **Expert**
- **Purpose**: Provide services and grow business
- **Onboarding**: Comprehensive 6-step process
  - Welcome → Profile → Verification → Service Selection → Service Areas → Availability
- **Features**:
  - Select from 30+ service categories
  - Set availability and service areas
  - Manage bookings
  - Track earnings

## 🛠️ **Service Categories**

Handie offers 30+ comprehensive service categories organized into groups:

### **Vehicle Services**
- Car Cleaning (car wash, interior cleaning, detailing)
- Bike Cleaning (motorcycle cleaning, bicycle maintenance)
- Vehicle Repair (basic car/bike repairs, maintenance)

### **Home Cleaning & Maintenance**
- Home Cleaning (house cleaning, deep cleaning, move-in/out)
- Kitchen Cleaning (kitchen deep clean, appliance cleaning)
- Bathroom Cleaning (bathroom deep clean, tile cleaning)
- Window Cleaning (interior/exterior window cleaning)

### **Cooking & Food Services**
- Cooking (home cooking, meal prep, catering)
- Baking (cakes, cookies, bread baking)
- Meal Prep (weekly meal preparation, healthy cooking)

### **Plumbing & Electrical**
- Plumbing (pipe repairs, faucet installation, drain cleaning)
- Electrical (wiring, outlet installation, electrical repairs)
- AC Repair (air conditioning maintenance and repair)

### **Home Improvement**
- Painting (interior/exterior painting, wall repairs)
- Carpentry (furniture repair, custom woodwork, installations)
- Flooring (tile work, laminate installation, floor repair)

### **Outdoor & Garden**
- Gardening (landscaping, plant care, lawn maintenance)
- Outdoor Cleaning (patio cleaning, outdoor furniture care)
- Fence Repair (fence installation, repair, maintenance)

### **Appliance & Electronics**
- Appliance Repair (washing machine, refrigerator, microwave repair)
- Electronics (TV mounting, smart home setup, device repair)
- Computer Repair (PC repair, laptop maintenance, software help)

### **General Handyman**
- General Handyman (general repairs, installations, maintenance)
- Furniture Assembly (IKEA assembly, furniture setup)
- Moving Help (packing, unpacking, furniture moving)

### **Personal Services**
- Pet Care (pet grooming, walking, basic pet care)
- Elderly Care (companion care, assistance with daily tasks)
- Childcare (babysitting, child supervision, tutoring)

### **Specialized Services**
- Photography (event photography, portrait sessions)
- Tutoring (academic tutoring, skill teaching)
- Delivery Services (package delivery, grocery shopping)

### **Space Rental Services**
- Parking Space Rental (rent out parking spaces by hour/day)
- Storage Space Rental (rent out storage space for belongings)
- Event Space Rental (rent out space for events and gatherings)

## 🚀 **Key Features**

### **Smart Onboarding**
- **Role-based flows**: Different experiences for customers vs experts
- **Auto-skip logic**: Eliminates redundant steps (e.g., role selection after registration)
- **Progressive validation**: Real-time form validation with clear error messages
- **Search & filter**: Easy service category discovery for experts

### **Modern UI/UX**
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile
- **Professional landing page**: Marketing-focused homepage with clear value proposition
- **Modal authentication**: Non-intrusive login/signup without page navigation
- **Consistent navigation**: Unified Next/Previous/Skip system throughout onboarding
- **Location-based search**: Find experts and services near your location
- **Interactive maps**: Visual representation of available services and parking spaces

### **Robust Backend**
- **Secure authentication**: JWT tokens with refresh mechanism
- **Comprehensive validation**: Server-side validation for all inputs
- **Error handling**: Graceful error responses with helpful messages
- **Database integrity**: Proper foreign keys and constraints

## 📁 **Project Structure**

```
handie/
├── components/
│   ├── LandingPage.tsx          # Main landing page
│   ├── AuthModal.tsx           # Login/signup modal
│   ├── AuthScreen.tsx          # Legacy auth screen
│   ├── CustomerDashboard.tsx   # Customer interface
│   ├── ExpertDashboard.tsx     # Expert interface
│   └── onboarding/
│       ├── OnboardingFlow.tsx  # Main onboarding component
│       └── steps/              # Individual onboarding steps
├── contexts/
│   ├── AuthContext.tsx         # Authentication state management
│   └── OnboardingContext.tsx   # Onboarding flow state
├── config/
│   └── onboardingConfig.ts     # Onboarding step configuration
├── backend/
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── middleware/        # Auth & validation middleware
│   └── migrations/             # Database migrations
└── types/                     # TypeScript type definitions
```

## 🔧 **Technical Stack**

### **Frontend**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Context API**: State management for auth and onboarding

### **Backend**
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Joi**: Schema validation library
- **bcrypt**: Password hashing

## 🎨 **Design Philosophy**

### **User-Centric**
- **Minimal friction**: Streamlined onboarding processes
- **Role-appropriate**: Different experiences for different user types
- **Progressive disclosure**: Show information when needed

### **Developer-Friendly**
- **Type safety**: Comprehensive TypeScript coverage
- **Modular architecture**: Reusable components and services
- **Clear separation**: Frontend/backend separation with clean APIs

### **Scalable**
- **Configurable onboarding**: Easy to add/modify steps
- **Extensible service categories**: Simple to add new services
- **Database normalization**: Proper relational design

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd handie

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### **Development**
```bash
# Frontend development
npm run dev

# Backend development
npm run dev:backend

# Run tests
npm test

# Build for production
npm run build
```

## 📈 **Future Roadmap**

### **Phase 1: Core Platform**
- ✅ User registration and authentication
- ✅ Role-based onboarding
- ✅ Service category management
- ✅ Location-based expert search
- ✅ Parking space rental system
- 🔄 Booking system
- 🔄 Payment integration

### **Phase 2: Enhanced Features**
- 📅 Calendar integration
- 📱 Mobile app development
- 🌍 Multi-language support
- 📊 Analytics dashboard

### **Phase 3: Advanced Features**
- 🤖 AI-powered service matching
- 📍 Real-time location tracking
- 💬 In-app messaging
- ⭐ Advanced rating system

## 🤝 **Contributing**

We welcome contributions! Please see our contributing guidelines for:
- Code style and standards
- Pull request process
- Issue reporting
- Feature requests

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 **Support**

For support, email support@handie.com or join our community Discord server.

---

**Handie** - *Get help in a handful of clicks* 🖐️
