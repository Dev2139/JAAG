# JNV Alumni Network - Quick Start Guide

Get the JNV Alumni Network application up and running in 10 minutes!

## 🚀 Quick Setup (5 minutes)

### Step 1: Prerequisites
Make sure you have:
- Node.js 18+ installed
- npm or yarn
- A Supabase account (free at supabase.com)

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your credentials:
   - Project URL
   - Anon Key
3. Create `.env.local` file in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Setup Database

1. Go to **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Copy and paste the SQL from `docs/database_schema.sql`
4. Run the query
5. Check for success messages

### Step 5: Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **Create a new bucket**
3. Name: `profile-images`
4. Select **Public** bucket type
5. ✅ Done!

### Step 6: Run Locally
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser

## 📱 Using the App

### First Time Users

1. **Sign Up** - Enter email and password
2. **Complete Profile** - Fill in your details:
   - Upload a profile photo
   - Enter batch year and house
   - Add professional information
   - Select how you can help others
3. **Wait for Approval** - Admin will verify your profile
4. **Browse Directory** - Once approved, explore other alumni
5. **Connect** - Send messages and build relationships

### Admin Users

1. Go to `/admin` (must be set as admin in Supabase)
2. **Approve Profiles** - Review pending profiles
3. **View Statistics** - See network metrics
4. **Manage Opportunities** - Review posted opportunities

## 🔐 Enable Authentication Providers

### Email Only (Already Enabled)
Default setup - users register with email/password

### (Optional) Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth credentials:
   - Type: Web application
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `https://your-domain.com/auth/callback`
5. In Supabase, go to **Auth** → **Providers**
6. Enable Google and add:
   - Client ID
   - Client Secret

## 📊 View Your Data

### Access Database
1. Supabase Dashboard → **SQL Editor**
2. Run queries on:
   - `profiles` - All user profiles
   - `opportunities` - Posted opportunities
   - `messages` - User messages

### View Uploaded Images
- Images stored in: `profile-images/profiles/{userId}.jpg`
- Access via URL: `https://your-project.supabase.co/storage/v1/object/public/profile-images/profiles/{userId}.jpg`

## ✨ Key Features

| Feature | Status | Route |
|---------|--------|-------|
| Sign Up | ✅ | `/signup` |
| Login | ✅ | `/login` |
| Complete Profile | ✅ | `/complete-profile` |
| Browse Directory | ✅ | `/directory` |
| View Profile | ✅ | `/profile/:id` |
| Post Opportunities | 🔄 | In Dashboard |
| Admin Panel | ✅ | `/admin` |

🔄 = In progress or framework ready

## 🧪 Testing

### Test Account
Create accounts with different emails to test:
- Profile creation
- Directory browsing
- Profile viewing
- Messaging

### Test Data
Sample profiles are created when you sign up and complete profiles.

## 🐛 Common Issues

### "Supabase credentials not configured"
- **Fix:** Check `.env.local` is in project root
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Restart dev server: `npm run dev`

### Image upload fails
- **Fix:** Verify `profile-images` bucket exists and is public
- Check file size < 5MB

### "User table not found"
- **Fix:** Run the SQL setup from `docs/database_schema.sql`
- Check for error messages when running SQL

### Profile doesn't appear in directory
- **Fix:** Profile must be approved by admin
- Check `is_approved` field in database

## 📖 Full Documentation

- **Setup Guide:** [SETUP.md](SETUP.md) - Complete setup with deployment options
- **Features:** [FEATURES.md](FEATURES.md) - Detailed feature documentation
- **Database Schema:** [docs/database_schema.sql](docs/database_schema.sql) - Database structure
- **API Reference:** Supabase auto-docs at your project dashboard

## 🚀 Next Steps

After getting the app running locally:

1. **Customize Branding**
   - Update logo and colors in `src/App.tsx`
   - Modify TailwindCSS config
   - Update email templates

2. **Test Features**
   - Create multiple test accounts
   - Upload profile photos
   - Create opportunities
   - Test search and filtering

3. **Deploy to Production**
   - Choose hosting (Vercel, Netlify, Azure, AWS)
   - Set up custom domain
   - Configure environment variables
   - Enable email verification

4. **Enable Advanced Features**
   - Set up email notifications
   - Configure OAuth providers
   - Enable analytics
   - Add admin users

## 🆘 Need Help?

1. Check [FEATURES.md](FEATURES.md) for detailed feature docs
2. Review [SETUP.md](SETUP.md) for troubleshooting section
3. Check Supabase documentation: https://supabase.com/docs
4. Create GitHub issue with:
   - What you're trying to do
   - Error message (if any)
   - Steps to reproduce

## 📱 Commands Reference

```bash
# Start development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format

# E2E tests
npm run e2e
```

## 🎯 Development Roadmap

- [ ] Real-time messaging
- [ ] Event management system
- [ ] LinkedIn integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered recommendations
- [ ] Video profiles
- [ ] Calendar integration

## 📝 License

This project is licensed under the MIT License.

---

**Questions?** Check the [full documentation](SETUP.md) or create an issue on GitHub.

Happy networking! 🎓✨
