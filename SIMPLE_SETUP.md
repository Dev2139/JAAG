# JNV Alumni Network - Simplified Version 🎓

**Simple. No Login. Pure Connection.**

Connect with JNV alumni instantly - no sign-up required. List yourself, browse others, and connect!

## 🚀 Quick Start (5 Minutes)

### Step 1: Install & Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with Supabase credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 2: Setup Database
1. Go to [Supabase Dashboard](https://supabase.com)
2. Create new project (free tier)
3. Go to **SQL Editor**
4. Open and run: `docs/database_schema_simple.sql`
5. Wait for success message

### Step 3: Create Storage Bucket
1. Go to **Storage** → **Create a new bucket**
2. Name: `profile-images`
3. Type: **Public**
4. Click **Create**

### Step 4: Run!
```bash
npm run dev
```

Visit `http://localhost:5173` - You're done! 🎉

---

## 💡 How It Works

### Adding Yourself
1. Click **"+ Add Your Profile"**
2. Fill in your details:
   - Name, batch, house
   - Professional info (job, company, city)
   - Email & phone (optional)
   - Photo (optional)
   - How you can help
3. Click **Add My Profile**
4. ✅ Your profile is live!

### Finding Others
1. **Browse** - Scroll through all alumni
2. **Search** - Find by name or company
3. **Filter** - By profession or city
4. **Click Profile** - See full details
5. **Connect** - Email or call directly

---

## 📱 Features

✅ **Zero Login** - No registration needed
✅ **List Yourself** - Add profile instantly
✅ **Browse Alumni** - See all listings
✅ **Search & Filter** - Find what you need
✅ **Direct Contact** - Email & phone
✅ **Photo Upload** - Add profile picture
✅ **Mobile Friendly** - Works on all devices

---

## 🗄️ Database Tables

### alumni
- Name, batch, house
- Professional info
- Photo, bio, contact
- Help offered categories

### connections  
- Track connections between alumni
- Pending/connected status

### messages
- Direct messaging (ready to build)

### opportunities
- Job, internship postings (ready to build)

---

## 🎯 Complete Flow

```
Visit Home Page
        ↓
See Alumni Grid + Search
        ↓
(Option A) Add Your Profile
  ├─ Fill form
  ├─ Upload photo
  └─ Done! Listed
        ↓
(Option B) Browse Others
  ├─ Search/Filter
  ├─ Click profile
  ├─ See full details
  └─ Email/Call
```

---

## 📧 Contact Between Alumni

- **Email**: Click "Connect via Email" - opens email client
- **Phone**: Click phone number to call directly
- **Future**: Built-in messaging system ready

---

## 🚀 Deployment (2 Options)

### Option 1: Vercel (Easiest)
```bash
# Push to GitHub
git push origin main

# Go to vercel.com
# Import repository
# Set environment variables
# Auto-deploys on push
```

### Option 2: Any Host
```bash
npm run build
# Upload /dist folder to your host
```

---

## 🔧 Environment Variables

```env
# Required - Get from Supabase Dashboard
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 📊 Add Sample Data (Optional)

In Supabase SQL Editor, uncomment and run this:

```sql
INSERT INTO alumni (full_name, batch_year, house, profession, company_name, current_city, email, phone, bio, help_offered)
VALUES 
  ('Rajesh Kumar', 2015, 'Aravali', 'Software Engineer', 'Google', 'Bangalore', 'rajesh@example.com', '+919999999999', 'Tech lead with 8 years experience', '{"Mentorship", "Job Opportunities"}'),
  ('Priya Singh', 2016, 'Nilgiri', 'Product Manager', 'Microsoft', 'Delhi', 'priya@example.com', '+919888888888', 'Product strategy expert', '{"Career Guidance", "Mentorship"}'),
  ('Amit Patel', 2017, 'Shivalik', 'Data Scientist', 'Amazon', 'Mumbai', 'amit@example.com', '+919777777777', 'ML enthusiast', '{"Technical Support", "Job Opportunities"}');
```

---

## 🧪 Test Locally

1. **Add Profile**
   - Click "+ Add Your Profile"
   - Fill in details
   - Submit
   - See your profile in grid

2. **Search**
   - Type name in search
   - Filter by profession
   - Filter by city

3. **View Profile**
   - Click on any profile card
   - See full details
   - Test email/phone links

4. **Refresh**
   - Close & reopen browser
   - Profiles should persist

---

## 🎨 Customization

### Colors & Branding
Edit `tailwind.config.ts`:
- Blue accent: Change `bg-blue-600` to your color
- Purple gradient: Update to-purple-600

### Houses
Edit available houses in `src/pages/Home.tsx`:
```typescript
<SelectItem value="Aravali">Aravali</SelectItem>
<SelectItem value="Nilgiri">Nilgiri</SelectItem>
<SelectItem value="Shivalik">Shivalik</SelectItem>
<SelectItem value="Udaygiri">Udaygiri</SelectItem>
```

### Help Categories
Edit `HELP_OFFERED_OPTIONS` in `src/pages/Home.tsx`

---

## 📁 Project Structure

```
src/
├── pages/
│   └── Home.tsx          ← Main page (everything is here!)
├── lib/
│   ├── supabase/
│   │   └── client.ts    ← Database connection
│   └── types.ts         ← TypeScript types
└── App.tsx              ← Single route to Home
```

Simple! Just one page component doing everything.

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- ✅ Check `.env.local` has correct credentials
- ✅ Verify Supabase project is running
- ✅ Restart dev server: `npm run dev`

### "album table not found"
- ✅ Run SQL from `docs/database_schema_simple.sql`
- ✅ Check for error messages

### "Image upload fails"
- ✅ Verify `profile-images` bucket exists and is PUBLIC
- ✅ Check file < 5MB

### "Profiles not showing"
- ✅ Refresh page (Ctrl+F5)
- ✅ Check Supabase Storage is working
- ✅ Verify data in database

---

## 📚 Development

```bash
# Start dev
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Run tests
npm run test

# Lint
npm run lint
```

---

## 🎯 Next Steps (Optional Features)

### Phase 1 (Current) ✅
- [x] List yourself
- [x] Browse alumni
- [x] Search & filter
- [x] Contact exchange

### Phase 2 (Coming Soon)
- [ ] Built-in messaging
- [ ] Connection requests
- [ ] Profile reviews
- [ ] Verified alumni

### Phase 3 (Future)
- [ ] Opportunities board
- [ ] Event management
- [ ] Batch groups
- [ ] Analytics

---

## 🆘 Support

### Still stuck?
1. Check **Troubleshooting** section above
2. Review `docs/database_schema_simple.sql`
3. Check Supabase documentation: https://supabase.com/docs
4. Create issue on GitHub

### Common Issues
- **DB not connected?** → Check .env.local
- **Build fails?** → Delete node_modules, run `npm install`
- **Storage errors?** → Create bucket named exactly `profile-images`

---

## 🚀 Deploy to Production

### Vercel (1 Click)
1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy!
6. Auto updates on every push

### Manual Deployment
```bash
npm run build
# Upload /dist folder to any static host
```

---

## 📞 Database Quick Reference

```sql
-- View all alumni
SELECT * FROM alumni ORDER BY created_at DESC;

-- Find by city
SELECT * FROM alumni WHERE current_city = 'Bangalore';

-- Find by profession  
SELECT * FROM alumni WHERE profession = 'Software Engineer';

-- Count by batch
SELECT batch_year, COUNT(*) FROM alumni GROUP BY batch_year;

-- Count by house
SELECT house, COUNT(*) FROM alumni GROUP BY house;
```

---

## ✨ That's It!

You now have a fully functional alumni network. Alumni can:
- ✅ List themselves instantly  
- ✅ Browse all alumni
- ✅ Search and filter
- ✅ Exchange contact info
- ✅ Request connections

**Zero complexity. Maximum connection.** 🎓

---

**Made with ❤️ for JNV Alumni**

Happy networking! 🚀
