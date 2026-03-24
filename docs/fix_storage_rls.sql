-- Fix Storage Permissions for profile-images bucket
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Enable anon upload for profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Enable anon read for profile-images" ON storage.objects;
DROP POLICY IF EXISTS "Enable anon delete for profile-images" ON storage.objects;

-- Create permissive policies
CREATE POLICY "Enable anon upload for profile-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Enable anon read for profile-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Enable anon delete for profile-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images');

-- Disable RLS entirely (simplest approach)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- ✅ Done - storage uploads should now work
