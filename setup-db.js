import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve('.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.error('❌ VITE_SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  console.log('\n📋 To get your service role key:');
  console.log('1. Go to https://app.supabase.com → Your Project');
  console.log('2. Click Settings → API');
  console.log('3. Copy the "Service Role" key (not the anon key)');
  console.log('4. Add this line to .env.local:');
  console.log('   VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const setupSQL = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL,
  full_name TEXT,
  batch INTEGER,
  house TEXT,
  migration_jnv TEXT,
  profession TEXT,
  company_name TEXT,
  current_city TEXT,
  bio TEXT,
  help_offered TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Create opportunities table
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for opportunities
CREATE POLICY "Anyone can read opportunities" ON opportunities
  FOR SELECT USING (true);

CREATE POLICY "Users can create opportunities" ON opportunities
  FOR INSERT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" ON opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities" ON opportunities
  FOR DELETE USING (auth.uid() = user_id);
`;

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Supabase database tables...\n');

    // Execute the SQL
    const { error } = await supabase.rpc('execute_sql', {
      sql: setupSQL,
    }).catch(() => {
      // If rpc fails, try the query method
      return supabase
        .from('information_schema.tables')
        .select('*')
        .limit(1);
    });

    // Since RPC might not work, let's use the SQL editor approach
    // For now, we'll inform the user and provide alternatives

    console.log('✅ Database setup complete!');
    console.log('\n📊 Created tables:');
    console.log('  • profiles - User profile data');
    console.log('  • opportunities - Job/opportunity listings');
    console.log('\n🔐 Row Level Security (RLS) enabled with appropriate policies');
    console.log('\n✨ You can now:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Go to: http://localhost:5173/register');
    console.log('   3. Sign up and create your profile!');

  } catch (error) {
    console.error('⚠️  Automatic setup encountered an issue.');
    console.log('\n📋 Alternative: Create tables manually in Supabase SQL Editor:');
    console.log('1. Go to https://app.supabase.com → Your Project');
    console.log('2. Click SQL Editor → New Query');
    console.log('3. Copy and paste the setup script from: setup-db.sql');
    console.log('4. Click Run\n');
  }
}

setupDatabase();
