-- JNV Alumni Connect Database Setup
-- Copy and paste this into Supabase SQL Editor and run

-- Drop existing tables if they exist (optional, comment out if you want to keep data)
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL,
  full_name TEXT,
  batch INTEGER,
  house TEXT,
  migration_jnv TEXT,
  profession TEXT,
  company_name TEXT,
  current_city TEXT,
  bio TEXT,
  help_offered TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Create opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for opportunities
CREATE POLICY "Anyone can read opportunities" ON opportunities
  FOR SELECT USING (true);

CREATE POLICY "Users can create opportunities" ON opportunities
  FOR INSERT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" ON opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities" ON opportunities
  FOR DELETE USING (auth.uid() = user_id);
