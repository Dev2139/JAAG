-- Migration: Add Profile Security and Privacy Fields to Alumni Table
-- Purpose: Add password protection and contact number privacy toggle to alumni table
-- Created: 2026-03-25
-- Note: This migration is for the alumni table (used in production app)
--       The profiles table migration is in migration_profile_security.sql
--       Prerequisites: Alumni table must already exist with user_id column
--       See: migration_create_alumni_table.sql

-- Step 1: Add profile_password column
ALTER TABLE alumni 
ADD COLUMN IF NOT EXISTS profile_password VARCHAR(255);

-- Step 2: Add show_contact_number column with default value
ALTER TABLE alumni 
ADD COLUMN IF NOT EXISTS show_contact_number BOOLEAN DEFAULT TRUE;

-- Step 3: Verify migration
-- Run this SELECT to verify the new columns are present
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name='alumni' 
-- AND column_name IN ('profile_password', 'show_contact_number')
-- ORDER BY column_name;

-- Expected output:
-- Column                  | Is Nullable | Data Type
-- ----------------------- | ----------- | ---------
-- profile_password        | YES         | character varying(255)
-- show_contact_number     | YES         | boolean

-- ============================================================================
-- IMPORTANT NOTES FOR EXISTING USERS
-- ============================================================================

-- 1. For existing users without profile_password, you have two options:
--    a) Require them to set a password on next login (recommended)
--    b) Set a default and ask them to change it
--
-- Example: Set default password for users without one
-- UPDATE alumni SET profile_password = 'CHANGE_ME_IMMEDIATELY' 
-- WHERE profile_password IS NULL;
--
-- 2. show_contact_number defaults to TRUE (contact is visible)
--    Existing alumni will have their contact visible by default
--    They can toggle this in their profile settings

-- 3. For best security practices:
--    - This should be implemented with bcrypt hashing in production
--    - Current implementation uses plain text (should be improved)
