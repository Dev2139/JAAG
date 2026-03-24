-- JNV Alumni Network - SIMPLE Profile Directory
-- NO authentication, NO connections management
-- Just profiles showcasing contact links (Instagram, LinkedIn, WhatsApp)

-- Drop old tables if they exist
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS alumni CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ONLY TABLE: Alumni Profiles
CREATE TABLE public.alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  batch_year INT NOT NULL,
  house VARCHAR(50) NOT NULL,
  profession VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT DEFAULT '',
  profile_image_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  whatsapp_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for searching
CREATE INDEX idx_alumni_batch_year ON public.alumni(batch_year);
CREATE INDEX idx_alumni_profession ON public.alumni(profession);
CREATE INDEX idx_alumni_current_city ON public.alumni(current_city);
CREATE INDEX idx_alumni_house ON public.alumni(house);
CREATE INDEX idx_alumni_created_at ON public.alumni(created_at DESC);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_alumni_updated_at 
  BEFORE UPDATE ON public.alumni
  FOR EACH ROW 
  EXECUTE PROCEDURE public.update_updated_at_column();

-- Disable RLS (completely public)
ALTER TABLE public.alumni DISABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alumni TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- ✅ DONE! Simple profile directory ready.
-- Profiles can include: Instagram, LinkedIn, WhatsApp links
-- No connections management - users share their links directly
