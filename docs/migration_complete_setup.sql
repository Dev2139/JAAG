-- Complete Migration: Setup Profiles Table for Non-Authenticated System
-- Date: 2026-03-25

-- Step 1: Drop existing constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Modify id column to auto-generate UUID if not provided
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Step 3: Disable RLS to allow public writes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Add missing columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS show_whatsapp BOOLEAN DEFAULT TRUE;

-- That's it! The table is now ready for non-authenticated profile creation
