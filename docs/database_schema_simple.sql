-- JNV Alumni Network - Simple Database Schema (No Auth Required)

-- ======================================
-- Create Alumni Table
-- ======================================

CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  batch_year INT NOT NULL,
  house VARCHAR(50) NOT NULL CHECK (house IN ('Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri')),
  profession VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  profile_image_url TEXT,
  help_offered TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Create Connections Table (Simple Messaging/Follow)
-- ======================================

CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id_1 UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  alumni_id_2 UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'blocked')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(alumni_id_1, alumni_id_2)
);

-- ======================================
-- Create Messages Table (Optional for conversations)
-- ======================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Create Opportunities Table
-- ======================================

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES alumni(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Job', 'Internship', 'Mentorship', 'Collaboration', 'Other')),
  company_name VARCHAR(255),
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================
-- Create Indexes for Performance
-- ======================================

CREATE INDEX IF NOT EXISTS idx_alumni_batch_year ON alumni(batch_year);
CREATE INDEX IF NOT EXISTS idx_alumni_profession ON alumni(profession);
CREATE INDEX IF NOT EXISTS idx_alumni_current_city ON alumni(current_city);
CREATE INDEX IF NOT EXISTS idx_alumni_house ON alumni(house);
CREATE INDEX IF NOT EXISTS idx_alumni_created_at ON alumni(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_connections_alumni_id_1 ON connections(alumni_id_1);
CREATE INDEX IF NOT EXISTS idx_connections_alumni_id_2 ON connections(alumni_id_2);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);

CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_opportunities_alumni_id ON opportunities(alumni_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_is_active ON opportunities(is_active);

-- ======================================
-- Create Functions for Timestamps
-- ======================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON alumni
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connections_updated_at BEFORE UPDATE ON connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ======================================
-- Sample Data (Optional - For Testing)
-- ======================================

-- To add test data, uncomment below:
-- INSERT INTO alumni (full_name, batch_year, house, profession, company_name, current_city, email, phone, bio, help_offered)
-- VALUES 
--   ('Rajesh Kumar', 2015, 'Aravali', 'Software Engineer', 'Google', 'Bangalore', 'rajesh@example.com', '+919999999999', 'Tech lead with 8 years experience', '{"Mentorship", "Job Opportunities"}'),
--   ('Priya Singh', 2016, 'Nilgiri', 'Product Manager', 'Microsoft', 'Delhi', 'priya@example.com', '+919888888888', 'Product strategy expert', '{"Career Guidance", "Mentorship"}'),
--   ('Amit Patel', 2017, 'Shivalik', 'Data Scientist', 'Amazon', 'Mumbai', 'amit@example.com', '+919777777777', 'ML enthusiast', '{"Technical Support", "Job Opportunities"}');
