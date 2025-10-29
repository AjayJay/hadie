# Database Schema Documentation

## 🎯 **Overview**

This document provides a comprehensive overview of the Handie database schema, including all tables, relationships, indexes, and constraints.

## 🏗️ **Database Architecture**

### **Database Type**: PostgreSQL 13+
### **Naming Convention**: snake_case for tables and columns
### **Primary Keys**: UUID with gen_random_uuid()
### **Timestamps**: created_at, updated_at with automatic updates

## 📊 **Core Tables**

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
  profile_picture VARCHAR(500),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
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

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_revoked ON refresh_tokens(is_revoked);
```

## 🛠️ **Service Management Tables**

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

-- Indexes
CREATE INDEX idx_service_categories_category ON service_categories(category);
CREATE INDEX idx_service_categories_active ON service_categories(is_active);
CREATE INDEX idx_service_categories_order ON service_categories(order_index);
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

-- Indexes
CREATE INDEX idx_expert_service_categories_expert ON expert_service_categories(expert_id);
CREATE INDEX idx_expert_service_categories_category ON expert_service_categories(category_id);
CREATE INDEX idx_expert_service_categories_active ON expert_service_categories(is_active);
```

### **Expert Verification Table**
```sql
CREATE TABLE expert_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  document_images JSONB NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expert_verifications_expert ON expert_verifications(expert_id);
CREATE INDEX idx_expert_verifications_status ON expert_verifications(verification_status);
CREATE INDEX idx_expert_verifications_type ON expert_verifications(verification_type);
```

## 📍 **Location & Address Tables**

### **User Addresses Table**
```sql
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) DEFAULT 'primary' CHECK (address_type IN ('primary', 'secondary', 'service_area')),
  street VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'India',
  coordinates JSONB, -- {latitude: number, longitude: number}
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_type ON user_addresses(address_type);
CREATE INDEX idx_user_addresses_primary ON user_addresses(is_primary);
CREATE INDEX idx_user_addresses_coordinates ON user_addresses USING GIST ((coordinates::geometry));
```

### **Service Areas Table**
```sql
CREATE TABLE service_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
  area_name VARCHAR(100) NOT NULL,
  center_coordinates JSONB NOT NULL, -- {latitude: number, longitude: number}
  radius_km DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_service_areas_expert ON service_areas(expert_id);
CREATE INDEX idx_service_areas_active ON service_areas(is_active);
CREATE INDEX idx_service_areas_coordinates ON service_areas USING GIST ((center_coordinates::geometry));
```

## 🅿️ **Parking Space Tables**

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

-- Indexes
CREATE INDEX idx_parking_spaces_owner ON parking_spaces(owner_id);
CREATE INDEX idx_parking_spaces_active ON parking_spaces(is_active);
CREATE INDEX idx_parking_spaces_approved ON parking_spaces(is_approved);
CREATE INDEX idx_parking_spaces_rating ON parking_spaces(rating);
CREATE INDEX idx_parking_spaces_coordinates ON parking_spaces USING GIST (((address->>'coordinates')::geometry));
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

-- Indexes
CREATE INDEX idx_parking_bookings_space ON parking_bookings(space_id);
CREATE INDEX idx_parking_bookings_customer ON parking_bookings(customer_id);
CREATE INDEX idx_parking_bookings_owner ON parking_bookings(owner_id);
CREATE INDEX idx_parking_bookings_status ON parking_bookings(booking_status);
CREATE INDEX idx_parking_bookings_payment_status ON parking_bookings(payment_status);
CREATE INDEX idx_parking_bookings_time ON parking_bookings(start_time, end_time);
```

## 📅 **Onboarding Tables**

### **Onboarding Sessions Table**
```sql
CREATE TABLE onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL,
  current_step VARCHAR(50) NOT NULL,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  total_time_spent INTEGER DEFAULT 0, -- in minutes
  is_paused BOOLEAN DEFAULT FALSE,
  paused_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_onboarding_sessions_user ON onboarding_sessions(user_id);
CREATE INDEX idx_onboarding_sessions_role ON onboarding_sessions(role);
CREATE INDEX idx_onboarding_sessions_current_step ON onboarding_sessions(current_step);
CREATE INDEX idx_onboarding_sessions_completed ON onboarding_sessions(completed_at);
```

### **Step Progress Table**
```sql
CREATE TABLE step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
  step_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  data JSONB,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  skipped_at TIMESTAMP NULL,
  time_spent INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_step_progress_session ON step_progress(session_id);
CREATE INDEX idx_step_progress_step ON step_progress(step_id);
CREATE INDEX idx_step_progress_status ON step_progress(status);
```

## 💰 **Payment & Transaction Tables**

### **Payments Table**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID, -- Can reference parking_bookings or service_bookings
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('service', 'parking', 'subscription')),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  payment_method VARCHAR(20) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100) UNIQUE,
  gateway_response JSONB,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);
```

## 📊 **Analytics & Reviews Tables**

### **Service Reviews Table**
```sql
CREATE TABLE service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL, -- Can reference service_bookings
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_service_reviews_service ON service_reviews(service_id);
CREATE INDEX idx_service_reviews_customer ON service_reviews(customer_id);
CREATE INDEX idx_service_reviews_expert ON service_reviews(expert_id);
CREATE INDEX idx_service_reviews_rating ON service_reviews(rating);
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

-- Indexes
CREATE INDEX idx_parking_reviews_space ON parking_space_reviews(space_id);
CREATE INDEX idx_parking_reviews_customer ON parking_space_reviews(customer_id);
CREATE INDEX idx_parking_reviews_booking ON parking_space_reviews(booking_id);
CREATE INDEX idx_parking_reviews_rating ON parking_space_reviews(rating);
```

## 🔧 **System Tables**

### **Audit Logs Table**
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50) NOT NULL,
  record_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### **System Settings Table**
```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_active ON system_settings(is_active);
```

## 🔗 **Relationships & Constraints**

### **Foreign Key Relationships**
```sql
-- Users to Refresh Tokens
ALTER TABLE refresh_tokens ADD CONSTRAINT fk_refresh_tokens_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users to Expert Service Categories
ALTER TABLE expert_service_categories ADD CONSTRAINT fk_expert_service_categories_expert 
  FOREIGN KEY (expert_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users to User Addresses
ALTER TABLE user_addresses ADD CONSTRAINT fk_user_addresses_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users to Parking Spaces
ALTER TABLE parking_spaces ADD CONSTRAINT fk_parking_spaces_owner 
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;

-- Parking Spaces to Parking Bookings
ALTER TABLE parking_bookings ADD CONSTRAINT fk_parking_bookings_space 
  FOREIGN KEY (space_id) REFERENCES parking_spaces(id) ON DELETE CASCADE;

-- Users to Parking Bookings (Customer)
ALTER TABLE parking_bookings ADD CONSTRAINT fk_parking_bookings_customer 
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE;

-- Users to Parking Bookings (Owner)
ALTER TABLE parking_bookings ADD CONSTRAINT fk_parking_bookings_owner 
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE;
```

### **Check Constraints**
```sql
-- User role validation
ALTER TABLE users ADD CONSTRAINT chk_users_role 
  CHECK (role IN ('customer', 'expert', 'admin'));

-- User gender validation
ALTER TABLE users ADD CONSTRAINT chk_users_gender 
  CHECK (gender IN ('male', 'female', 'other'));

-- Address type validation
ALTER TABLE user_addresses ADD CONSTRAINT chk_address_type 
  CHECK (address_type IN ('primary', 'secondary', 'service_area'));

-- Payment status validation
ALTER TABLE payments ADD CONSTRAINT chk_payment_status 
  CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled'));

-- Booking status validation
ALTER TABLE parking_bookings ADD CONSTRAINT chk_booking_status 
  CHECK (booking_status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'));

-- Rating validation
ALTER TABLE service_reviews ADD CONSTRAINT chk_service_rating 
  CHECK (rating >= 1 AND rating <= 5);

ALTER TABLE parking_space_reviews ADD CONSTRAINT chk_parking_rating 
  CHECK (rating >= 1 AND rating <= 5);
```

## 📈 **Performance Optimizations**

### **Indexes for Common Queries**
```sql
-- Composite indexes for complex queries
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_parking_spaces_location_active ON parking_spaces(is_active, is_approved) 
  WHERE is_active = true AND is_approved = true;

-- Partial indexes for specific conditions
CREATE INDEX idx_active_experts ON users(id) WHERE role = 'expert' AND is_active = true;
CREATE INDEX idx_active_customers ON users(id) WHERE role = 'customer' AND is_active = true;

-- Text search indexes
CREATE INDEX idx_users_name_search ON users USING gin(to_tsvector('english', name));
CREATE INDEX idx_parking_spaces_title_search ON parking_spaces USING gin(to_tsvector('english', title));
```

### **Partitioning Strategy**
```sql
-- Partition parking_bookings by date for better performance
CREATE TABLE parking_bookings_y2024 PARTITION OF parking_bookings
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE parking_bookings_y2025 PARTITION OF parking_bookings
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

## 🔒 **Security Considerations**

### **Row Level Security (RLS)**
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY user_own_data ON users
  FOR ALL TO authenticated_users
  USING (id = current_user_id());

CREATE POLICY user_own_payments ON payments
  FOR ALL TO authenticated_users
  USING (user_id = current_user_id());
```

### **Data Encryption**
```sql
-- Encrypt sensitive fields
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Example: Encrypt phone numbers
ALTER TABLE users ADD COLUMN phone_encrypted BYTEA;
UPDATE users SET phone_encrypted = pgp_sym_encrypt(phone, 'encryption_key');
```

## 📊 **Database Maintenance**

### **Automated Cleanup**
```sql
-- Clean up expired refresh tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM refresh_tokens 
  WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job
SELECT cron.schedule('cleanup-tokens', '0 2 * * *', 'SELECT cleanup_expired_tokens();');
```

### **Statistics and Monitoring**
```sql
-- Create view for database statistics
CREATE VIEW db_stats AS
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

## 🚀 **Migration Strategy**

### **Version Control**
```sql
-- Create migrations table
CREATE TABLE schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example migration
INSERT INTO schema_migrations (version) VALUES ('001_initial_schema');
INSERT INTO schema_migrations (version) VALUES ('002_add_parking_tables');
INSERT INTO schema_migrations (version) VALUES ('003_add_review_tables');
```

### **Backup Strategy**
```bash
# Daily backup script
#!/bin/bash
pg_dump -h localhost -U handie_user -d handie_db > backup_$(date +%Y%m%d).sql
gzip backup_$(date +%Y%m%d).sql
```

This comprehensive database schema provides a solid foundation for the Handie platform with proper indexing, relationships, and security measures.
