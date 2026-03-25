-- Migration: Add All Missing Columns to Profiles Table
-- Date: 2026-03-25
-- This adds all the columns needed for the application

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS batch_year INTEGER,
ADD COLUMN IF NOT EXISTS house VARCHAR(50),
ADD COLUMN IF NOT EXISTS migration_jnv TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS show_whatsapp BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS help_offered TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Also ensure these exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS profile_password VARCHAR(255),
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
