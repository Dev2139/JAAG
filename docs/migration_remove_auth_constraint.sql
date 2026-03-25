-- Migration: Remove Authentication Constraint from Profiles Table
-- Date: 2026-03-25
-- Description: Removes the foreign key constraint to auth.users to allow profiles 
-- to be created without authentication

-- Drop the foreign key constraint that requires an auth user
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Now the id column can accept any UUID without requiring an auth.users entry
-- Existing UUID generation in the code will work properly
