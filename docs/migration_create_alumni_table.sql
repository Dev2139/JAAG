-- Migration: Create Alumni Table
-- Purpose: Create the alumni table to store user profiles with user tracking
-- Created: 2026-03-25
-- Note: This is required for the app to function. The alumni table stores
--       all user profiles and links them to the authenticated user via user_id

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing alumni table if it exists (be careful with production!)
-- DROP TABLE IF EXISTS alumni CASCADE;

-- Create alumni table with user tracking
CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,  -- Links to Supabase auth.users(id)
  full_name VARCHAR(255) NOT NULL,
  batch_year INTEGER NOT NULL,
  house VARCHAR(50) NOT NULL,
  profession VARCHAR(255),
  company_name VARCHAR(255),
  current_city VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp_number VARCHAR(20),
  bio TEXT,
  profile_image_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  profile_password VARCHAR(255),
  show_contact_number BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_alumni_user_id ON alumni(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_created_at ON alumni(created_at DESC);

-- Optional: Add constraint to ensure user_id is not null
ALTER TABLE alumni ADD CONSTRAINT check_user_id_not_null
CHECK (user_id IS NOT NULL) ON CONFLICT DO NOTHING;

-- Note: If you have existing data in Supabase, you may need to:
-- 1. Backup the data first
-- 2. Set user_id for existing records (if you have a way to map them)
-- 3. Or delete the old data and start fresh with the new schema
