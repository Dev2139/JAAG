-- Migration: Add Profile Security and Privacy Fields
-- Purpose: Add password protection and contact number privacy toggle to profiles table
-- Created: 2026-03-25

-- Step 1: Add profile_password column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_password VARCHAR(255);

-- Step 2: Add show_contact_number column with default value
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS show_contact_number BOOLEAN DEFAULT TRUE;

-- Step 3: Verify migration
-- Run this SELECT to verify the new columns are present
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name='profiles' 
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
--    a) Require them to set a password on next login
--    b) Set a default and ask them to change it
--
-- Example: Set default password for users without one
-- UPDATE profiles SET profile_password = 'CHANGE_ME_IMMEDIATELY' 
-- WHERE profile_password IS NULL;
--
-- 2. show_contact_number defaults to TRUE (contact is visible)
--    Existing users will have their contact visible by default
--    They can toggle this in their profile settings

-- ============================================================================
-- VERIFY THE MIGRATION
-- ============================================================================

-- Check if columns were added successfully
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'public' 
AND TABLE_NAME = 'profiles' 
AND COLUMN_NAME IN ('profile_password', 'show_contact_number', 'contact_number')
ORDER BY ORDINAL_POSITION;

-- Expected output:
-- TABLE_NAME | COLUMN_NAME              | DATA_TYPE
-- ---------- | ----------------------- | ---------------
-- profiles   | profile_password        | character varying
-- profiles   | show_contact_number     | boolean
-- profiles   | contact_number          | character varying
