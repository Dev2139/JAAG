# JNV Connect - Setup Guide

This guide will help you set up the complete JNV Alumni network application locally and deploy to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Running Locally](#running-locally)
7. [Deployment](#deployment)
8. [Database Schema Details](#database-schema-details)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** or **yarn** package manager
- A **Supabase** account (https://supabase.com - free tier available)
- A **GitHub** account (for OAuth setup, optional)
- A text editor or IDE (VS Code recommended)

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd jnv_connect

# Install dependencies
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Enter project name: `jnv-alumni-dev`
5. Enter a secure database password
6. Select region closest to you
7. Click **"Create new project"**
8. Wait for the project to initialize (2-3 minutes)

## Supabase Configuration

### 1. Get Credentials

After your Supabase project is created:

1. Go to **Project Settings** → **API** (or Settings icon)
2. Copy:
   - **Project URL** (labeled as `VITE_SUPABASE_URL`)
   - **Anon Key** (labeled as `VITE_SUPABASE_ANON_KEY`)

### 2. Configure Authentication

#### Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Find **Email** and click the toggle to enable it
3. Under **Email Provider Settings**:
   - Enable **"Confirm email"** (recommended for production)
   - Set **"Email Confirmation Window"** to 24 hours

#### (Optional) Enable Google OAuth

1. Go to **Authentication** → **Providers**
2. Click **Google**
3. Set **Enabled** toggle to ON
4. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `https://your-domain.com/auth/callback`
   - Copy the Client ID and Client Secret into Supabase

### 3. Create Storage Bucket

1. Go to **Storage** → **Buckets**
2. Click **"Create a new bucket"**
3. Name it: `profile-images`
4. Select **Public** (for public profile photos)
5. Click **"Create bucket"**
6. Go to **Bucket Settings** (right-click on bucket) → **Policies**
7. Add the following policies:

**SELECT Policy (Public Read):**
```sql
((bucket_id = 'profile-images'::text) AND (auth.role() = 'anon'::text))
```

**INSERT/UPDATE Policy (Authenticated Users):**
```sql
((bucket_id = 'profile-images'::text) AND (auth.uid() = owner::uuid))
```

## Database Setup

### 1. Create Tables

1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Paste the SQL from [Database Schema](#database-schema-details) section below
4. Click **"Run"**
5. You should see success messages

### 2. Create RLS Policies

After creating tables, enable Row Level Security (RLS):

#### Profiles Table

1. Go to **Authentication** → **Policies** (or **Tables** → **profiles** → **RLS**)
2. For `profiles` table, create policies:

**SELECT (Anyone can view):**
```sql
true
```

**INSERT (Only current user's own profile):**
```sql
auth.uid() = id
```

**UPDATE (Only current user's own profile):**
```sql
auth.uid() = id
```

**DELETE (Admin only):**
```sql
auth.jwt() ->> 'role' = 'admin'
```

#### Opportunities Table

**SELECT (All authenticated users):**
```sql
auth.role() = 'authenticated'::text
```

**INSERT (Authenticated users):**
```sql
auth.role() = 'authenticated'::text
```

**UPDATE/DELETE (Own posts only):**
```sql
auth.uid() = user_id
```

## Environment Variables

### 1. Create `.env.local` file

Create a file named `.env.local` in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: API Configuration
VITE_API_BASE_URL=http://localhost:5173

# Optional: Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

### 2. Keep `.env.example` Updated

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: API Configuration
VITE_API_BASE_URL=http://localhost:5173

# Optional: Feature Flags
VITE_ENABLE_GOOGLE_AUTH=true
VITE_ENABLE_EMAIL_VERIFICATION=true
```

## Running Locally

### 1. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 2. Test the Application

1. Go to http://localhost:5173
2. Click **"Sign Up"**
3. Create a test account with your email
4. Complete your profile
5. Browse other profiles (use incognito for multiple accounts)
6. Test posting opportunities

### 3. Common Development Tasks

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Prerequisites
- GitHub account with repository pushed
- Vercel account

#### Steps

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy"**

#### Custom Domain

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update domain DNS settings as instructed

### Option 2: Azure/AWS Static Hosting

#### Azure Static Web Apps

```bash
# Install Azure CLI
npm install -g @azure/static-web-apps-cli

# Create resource group
az group create --name jnv-alumni --location eastus

# Deploy
az staticwebapp create \
  --name jnv-alumni \
  --resource-group jnv-alumni \
  --source https://github.com/your-username/jnv_connect \
  --branch main \
  --app-location "." \
  --output-location "dist"
```

#### AWS Amplify

1. Go to AWS Amplify Console
2. Select GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables
5. Deploy

### Option 3: Docker Deployment

```dockerfile
# See Dockerfile in project root
# Build: docker build -t jnv-alumni .
# Run: docker run -p 80:80 jnv-alumni
```

## Database Schema Details

### profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  batch_year INT NOT NULL,
  house VARCHAR(50) NOT NULL CHECK (house IN ('Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri')),
  migration_jnv VARCHAR(255),
  profession VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  help_offered TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### opportunities Table

```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Internship', 'Job', 'Mentorship', 'Collaboration', 'Other')),
  company_name VARCHAR(255),
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Tables SQL

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  batch_year INT NOT NULL,
  house VARCHAR(50) NOT NULL CHECK (house IN ('Aravali', 'Nilgiri', 'Shivalik', 'Udaygiri')),
  migration_jnv VARCHAR(255),
  profession VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  current_city VARCHAR(100) NOT NULL,
  bio TEXT,
  profile_image_url TEXT,
  help_offered TEXT[] DEFAULT '{}',
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Internship', 'Job', 'Mentorship', 'Collaboration', 'Other')),
  company_name VARCHAR(255),
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Allow public read" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Allow users to insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Create policies for opportunities
CREATE POLICY "Allow authenticated read" ON opportunities FOR SELECT USING (auth.role() = 'authenticated'::text);
CREATE POLICY "Allow authenticated insert" ON opportunities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own opportunity" ON opportunities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own opportunity" ON opportunities FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_batch_year ON profiles(batch_year);
CREATE INDEX idx_profiles_profession ON profiles(profession);
CREATE INDEX idx_profiles_current_city ON profiles(current_city);
CREATE INDEX idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_is_active ON opportunities(is_active);
```

## Troubleshooting

### Supabase Connection Issues

**Problem**: Environment variables not loading
- Solution: Ensure `.env.local` is in project root
- Vite environment variables must start with `VITE_`
- Restart dev server after changing env

**Problem**: Authentication errors
- Solution: Check that Auth providers are enabled in Supabase dashboard
- Verify callback URLs match your domain

### Database Issues

**Problem**: Table not found
- Solution: Run SQL setup queries again
- Check for typos in table names

**Problem**: Row-level security blocked access
- Solution: Review RLS policies
- Ensure `auth.uid()` is being set correctly

### Storage Issues

**Problem**: Image uploads failing
- Solution: Check bucket exists and is public
- Verify RLS policies are correct
- Check file size limits (default 5MB)

## Next Steps

1. **Set up CI/CD**: Configure GitHub Actions for automated testing and deployment
2. **Custom Domain**: Set up SSL certificate and custom domain
3. **Email Service**: Configure Supabase email templates for verification
4. **Monitoring**: Set up error tracking (Sentry) and analytics
5. **Backup**: Enable automated backups in Supabase dashboard

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review Supabase documentation
3. Open an issue on GitHub

## License

This project is licensed under the MIT License - see LICENSE.md for details.
