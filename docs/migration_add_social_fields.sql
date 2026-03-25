-- Migration: Add Social Media and Privacy Fields to Profiles Table
-- Date: 2026-03-25
-- Description: Adds facebook_url, instagram_url, phone, and show_whatsapp fields to support enhanced profile functionality

-- Add missing columns to profiles table if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS show_whatsapp BOOLEAN DEFAULT TRUE;

-- Add comment to document the new fields
COMMENT ON COLUMN profiles.facebook_url IS 'User Facebook profile URL (optional)';
COMMENT ON COLUMN profiles.instagram_url IS 'User Instagram profile URL (optional)';
COMMENT ON COLUMN profiles.phone IS 'User phone/contact number (optional)';
COMMENT ON COLUMN profiles.whatsapp_number IS 'User WhatsApp number (optional)';
COMMENT ON COLUMN profiles.show_whatsapp IS 'Whether to show WhatsApp details to other users (depends on show_contact_number)';
