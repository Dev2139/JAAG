-- JNV Alumni Network - Database Schema Setup

-- ======================================
-- Create Tables
-- ======================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  batch_year INT NOT NULL,
  house VARCHAR(50) NOT NULL CHECK (house IN ('Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri')),
  migration_jnv VARCHAR(255),
  profession VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  help_offered TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT FALSE,
  profile_password VARCHAR(255),
  show_contact_number BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities Table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Internship', 'Job', 'Mentorship', 'Collaboration', 'Other')),
  company_name VARCHAR(255),
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table for user communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Enable RLS (Row Level Security)
-- ======================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ======================================
-- RLS Policies for Profiles
-- ======================================

-- Anyone can view approved profiles
CREATE POLICY "Allow public read approved profiles" ON profiles 
  FOR SELECT 
  USING (is_approved = TRUE);

-- Users can insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Allow users to update their own profile" ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Allow users to delete their own profile" ON profiles 
  FOR DELETE 
  USING (auth.uid() = id);

-- ======================================
-- RLS Policies for Opportunities
-- ======================================

-- All authenticated users can view active opportunities
CREATE POLICY "Allow authenticated to read opportunities" ON opportunities 
  FOR SELECT 
  USING (is_active = TRUE AND auth.role() = 'authenticated'::text);

-- Authenticated users can create opportunities
CREATE POLICY "Allow authenticated to create opportunities" ON opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own opportunities
CREATE POLICY "Allow users to update their own opportunities" ON opportunities 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own opportunities
CREATE POLICY "Allow users to delete their own opportunities" ON opportunities 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ======================================
-- RLS Policies for Messages
-- ======================================

-- Users can read their own messages
CREATE POLICY "Allow users to read their own messages" ON messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages
CREATE POLICY "Allow authenticated to send messages" ON messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Users can update their own messages
CREATE POLICY "Allow users to update their own messages" ON messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- ======================================
-- Create Indexes for Performance
-- ======================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_batch_year ON profiles(batch_year);
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON profiles(profession);
CREATE INDEX IF NOT EXISTS idx_profiles_current_city ON profiles(current_city);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_house ON profiles(house);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_at ON opportunities(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);

-- ======================================
-- Create Views for Analytics
-- ======================================

-- Profiles by batch year count
CREATE OR REPLACE VIEW profile_stats_by_batch AS
SELECT 
  batch_year,
  COUNT(*) as count,
  COUNT(CASE WHEN is_approved THEN 1 END) as approved_count
FROM profiles
GROUP BY batch_year
ORDER BY batch_year DESC;

-- Profiles by profession count
CREATE OR REPLACE VIEW profile_stats_by_profession AS
SELECT 
  profession,
  COUNT(*) as count
FROM profiles
WHERE is_approved = TRUE
GROUP BY profession
ORDER BY count DESC;

-- Profiles by city count
CREATE OR REPLACE VIEW profile_stats_by_city AS
SELECT 
  current_city,
  COUNT(*) as count
FROM profiles
WHERE is_approved = TRUE
GROUP BY current_city
ORDER BY count DESC;

-- ======================================
-- Create Functions
-- ======================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================
-- Seed Data (Optional - for development)
-- ======================================

-- Note: Uncomment below to add test data
-- INSERT INTO profiles (id, email, full_name, batch_year, house, profession, company_name, current_city, is_approved)
-- VALUES 
--   (gen_random_uuid(), 'test1@example.com', 'Test User 1', 2015, 'Aravali', 'Software Engineer', 'Google', 'Bangalore', TRUE),
--   (gen_random_uuid(), 'test2@example.com', 'Test User 2', 2016, 'Nilgiri', 'Product Manager', 'Microsoft', 'Delhi', TRUE),
--   (gen_random_uuid(), 'test3@example.com', 'Test User 3', 2017, 'Shivalik', 'Designer', 'Amazon', 'Mumbai', TRUE);

-- ======================================
-- Notes
-- ======================================
-- 1. Remember to set up Storage bucket 'profile-images' in Supabase dashboard
-- 2. Configure storage policies for public read and user upload
-- 3. Enable Email authentication in Supabase Auth settings
-- 4. Optionally enable Google OAuth
-- 5. Set up email templates for authentication in Supabase dashboard
