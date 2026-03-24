-- JNV Alumni Connect - Supabase Database Schema & RLS Policies
-- Created: 2026-03-24

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  batch_year INTEGER NOT NULL,
  house TEXT NOT NULL CHECK (house IN ('Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri')),
  migration_jnv TEXT,
  profession TEXT NOT NULL,
  company_name TEXT NOT NULL,
  current_city TEXT NOT NULL,
  help_offered TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT,
  profile_image_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  email TEXT,
  whatsapp TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABLE: connections
-- ============================================================================
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT no_self_connection CHECK (sender_id != receiver_id),
  CONSTRAINT unique_connection UNIQUE (sender_id, receiver_id)
);

-- ============================================================================
-- TABLE: bookmarks
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  saved_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_bookmark UNIQUE (user_id, saved_profile_id),
  CONSTRAINT no_self_bookmark CHECK (user_id != saved_profile_id)
);

-- ============================================================================
-- TABLE: admin_logs
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_batch_year ON profiles(batch_year);
CREATE INDEX IF NOT EXISTS idx_profiles_house ON profiles(house);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(current_city);
CREATE INDEX IF NOT EXISTS idx_profiles_profession ON profiles(profession);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_connections_sender ON connections(sender_id);
CREATE INDEX IF NOT EXISTS idx_connections_receiver ON connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES RLS POLICIES
-- ============================================================================

-- Users can view only approved profiles (except their own)
CREATE POLICY "Users can view approved profiles"
  ON profiles FOR SELECT
  USING (is_approved = TRUE OR auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
  );

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
  )
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
  );

-- ============================================================================
-- CONNECTIONS RLS POLICIES
-- ============================================================================

-- Users can view connection requests/accepts they're involved in
CREATE POLICY "Users can view their connections"
  ON connections FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can create connection requests
CREATE POLICY "Users can create connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update connections they're involved in
CREATE POLICY "Users can update their connections"
  ON connections FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================================================
-- BOOKMARKS RLS POLICIES
-- ============================================================================

-- Users can view their own bookmarks
CREATE POLICY "Users can view their bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookmarks
CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- ADMIN LOGS RLS POLICIES
-- ============================================================================

-- Only admins can view and create admin logs
CREATE POLICY "Admins can view admin logs"
  ON admin_logs FOR SELECT
  USING (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
  );

CREATE POLICY "Admins can create admin logs"
  ON admin_logs FOR INSERT
  WITH CHECK (
    (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE AND
    auth.uid() = admin_id
  );

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get connection status between two users
CREATE OR REPLACE FUNCTION get_connection_status(user_id UUID, target_user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT status FROM connections
    WHERE (sender_id = user_id AND receiver_id = target_user_id)
       OR (sender_id = target_user_id AND receiver_id = user_id)
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to check if users are connected
CREATE OR REPLACE FUNCTION are_connected(user_id UUID, target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM connections
    WHERE (sender_id = user_id AND receiver_id = target_user_id AND status = 'accepted')
       OR (sender_id = target_user_id AND receiver_id = user_id AND status = 'accepted')
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get suggested profiles (same batch, house, or city)
CREATE OR REPLACE FUNCTION get_suggestions(user_id UUID, limit_count INT DEFAULT 10)
RETURNS TABLE (
  suggested_id UUID,
  full_name TEXT,
  profession TEXT,
  batch_year INTEGER,
  house TEXT,
  current_city TEXT,
  profile_image_url TEXT,
  match_reason TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_profile AS (
    SELECT batch_year, house, current_city FROM profiles WHERE id = user_id
  ),
  excluded_ids AS (
    SELECT sender_id as excluded_id FROM connections WHERE receiver_id = user_id AND status = 'pending'
    UNION
    SELECT receiver_id FROM connections WHERE sender_id = user_id AND status = 'pending'
    UNION
    SELECT sender_id FROM connections WHERE receiver_id = user_id AND status = 'accepted'
    UNION
    SELECT receiver_id FROM connections WHERE sender_id = user_id AND status = 'accepted'
    UNION
    SELECT user_id
  )
  SELECT
    p.id,
    p.full_name,
    p.profession,
    p.batch_year,
    p.house,
    p.current_city,
    p.profile_image_url,
    CASE
      WHEN p.batch_year = up.batch_year THEN 'Same Batch'
      WHEN p.house = up.house THEN 'Same House'
      WHEN p.current_city = up.current_city THEN 'Same City'
      ELSE 'Similar Profile'
    END as match_reason
  FROM profiles p
  CROSS JOIN user_profile up
  WHERE p.is_approved = TRUE
    AND p.id NOT IN (SELECT excluded_id FROM excluded_ids)
    AND (
      p.batch_year = up.batch_year
      OR p.house = up.house
      OR p.current_city = up.current_city
    )
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Note: In production, remove this. This is just for testing.
-- Users should be created through Supabase Auth in the client app

-- ============================================================================
-- Triggers for updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at
BEFORE UPDATE ON connections
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FINAL NOTES:
-- ============================================================================
-- 1. After running this schema, set up an admin user manually in Supabase
-- 2. Update the admin user's profile with is_admin = TRUE
-- 3. Storage bucket "profile-images" should be created publicly accessible
-- 4. All queries respect RLS policies automatically
