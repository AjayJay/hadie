-- Seed data for initial setup
-- Created: 2024-01-01
-- Description: Initial data for Handie platform

-- Insert service categories
INSERT INTO service_categories (id, name, description, icon) VALUES
('cat-1', 'Home Cleaning', 'Professional home cleaning services', 'home-icon'),
('cat-2', 'Salon for Women', 'Beauty and wellness services for women', 'sparkles-icon'),
('cat-3', 'Appliance Repair', 'Home appliance repair and maintenance', 'wrench-icon'),
('cat-4', 'Plumbing', 'Plumbing services and repairs', 'pipe-icon'),
('cat-5', 'Electrical', 'Electrical services and repairs', 'bolt-icon'),
('cat-6', 'Painting', 'Interior and exterior painting services', 'paint-icon');

-- Insert services for Home Cleaning
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-1a', 'Full Home Deep Clean', 'Comprehensive cleaning for your entire home', 120.00, '4-5 hours', 'cat-1'),
('serv-1b', 'Bathroom & Kitchen Cleaning', 'Intensive cleaning for wet areas', 70.00, '2 hours', 'cat-1'),
('serv-1c', 'Sofa & Carpet Shampooing', 'Removes deep-seated dirt and stains', 90.00, '3 hours', 'cat-1'),
('serv-1d', 'Window Cleaning', 'Professional window cleaning service', 50.00, '1 hour', 'cat-1'),
('serv-1e', 'Move-in/Move-out Cleaning', 'Complete cleaning for moving', 150.00, '5-6 hours', 'cat-1');

-- Insert services for Salon for Women
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-2a', 'Deluxe Manicure & Pedicure', 'Complete pampering for your hands and feet', 60.00, '1.5 hours', 'cat-2'),
('serv-2b', 'Hydrating Facial', 'Rejuvenate your skin with our special treatment', 80.00, '1 hour', 'cat-2'),
('serv-2c', 'Hair Spa & Styling', 'Get a fresh new look', 100.00, '2 hours', 'cat-2'),
('serv-2d', 'Bridal Makeup', 'Complete bridal makeup package', 200.00, '3 hours', 'cat-2'),
('serv-2e', 'Eyebrow Threading', 'Professional eyebrow shaping', 25.00, '30 minutes', 'cat-2');

-- Insert services for Appliance Repair
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-3a', 'Air Conditioner Servicing', 'Ensure your AC runs cool and efficiently', 50.00, '1 hour', 'cat-3'),
('serv-3b', 'Washing Machine Repair', 'Fixing all common washing machine issues', 65.00, '1-2 hours', 'cat-3'),
('serv-3c', 'Refrigerator Check-up', 'Preventive maintenance and repair', 55.00, '1 hour', 'cat-3'),
('serv-3d', 'Microwave Repair', 'Quick microwave repair service', 45.00, '1 hour', 'cat-3'),
('serv-3e', 'Water Purifier Service', 'Water purifier maintenance and repair', 40.00, '1 hour', 'cat-3');

-- Insert services for Plumbing
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-4a', 'Pipe Leak Repair', 'Fix leaking pipes and faucets', 80.00, '1-2 hours', 'cat-4'),
('serv-4b', 'Drain Cleaning', 'Unclog blocked drains', 60.00, '1 hour', 'cat-4'),
('serv-4c', 'Bathroom Renovation', 'Complete bathroom makeover', 500.00, '1-2 days', 'cat-4'),
('serv-4d', 'Water Tank Cleaning', 'Professional water tank cleaning', 100.00, '2 hours', 'cat-4');

-- Insert services for Electrical
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-5a', 'Switch & Socket Repair', 'Fix faulty switches and sockets', 70.00, '1 hour', 'cat-5'),
('serv-5b', 'Wiring Installation', 'New electrical wiring installation', 150.00, '2-3 hours', 'cat-5'),
('serv-5c', 'Fan Installation', 'Ceiling fan installation and repair', 80.00, '1 hour', 'cat-5'),
('serv-5d', 'Light Fixture Installation', 'Install new light fixtures', 60.00, '1 hour', 'cat-5');

-- Insert services for Painting
INSERT INTO services (id, name, description, price, duration, category_id) VALUES
('serv-6a', 'Interior Wall Painting', 'Professional interior wall painting', 200.00, '1 day', 'cat-6'),
('serv-6b', 'Exterior Wall Painting', 'Weather-resistant exterior painting', 300.00, '2 days', 'cat-6'),
('serv-6c', 'Room Painting', 'Complete room painting service', 150.00, '1 day', 'cat-6'),
('serv-6d', 'Furniture Painting', 'Furniture restoration and painting', 100.00, '1 day', 'cat-6');

-- Create a sample admin user (password: admin123)
INSERT INTO users (id, email, password_hash, phone, name, role, onboarding_completed, is_verified) VALUES
('admin-1', 'admin@handie.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43210', 'Admin User', 'expert', true, true);

-- Create sample customers
INSERT INTO users (id, email, password_hash, phone, name, role, onboarding_completed) VALUES
('customer-1', 'customer1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43211', 'John Doe', 'customer', true),
('customer-2', 'customer2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43212', 'Jane Smith', 'customer', true);

-- Create sample experts
INSERT INTO users (id, email, password_hash, phone, name, role, onboarding_completed, service_category_id, experience, is_verified) VALUES
('expert-1', 'expert1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43213', 'Mike Johnson', 'expert', true, 'cat-1', 5, true),
('expert-2', 'expert2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43214', 'Sarah Wilson', 'expert', true, 'cat-2', 3, true),
('expert-3', 'expert3@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43215', 'David Brown', 'expert', true, 'cat-3', 7, true);
