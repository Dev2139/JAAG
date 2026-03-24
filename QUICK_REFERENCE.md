# 🚀 QUICK REFERENCE - JNV Alumni Network

**Copy & paste these commands:**

---

## Installation (Copy & Paste)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env.local

# 3. Edit .env.local with your Supabase info
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=xxxxx
```

---

## Database Setup (Copy & Paste)

**In Supabase Dashboard:**

1. Go to SQL Editor
2. New Query
3. Copy everything from: `docs/database_schema_simple.sql`
4. Paste and Run
5. Wait for "success" message

**That's it!**

---

## Storage Bucket

Supabase → Storage → **Create a new bucket**

```
Name: profile-images
Type: Public
```

---

## Start Development

```bash
npm run dev
```

Open: `http://localhost:8082` (or whatever port shows)

---

## File Structure

```
src/pages/
  └── Home.tsx              ← EVERYTHING IS HERE!

docs/
  └── database_schema_simple.sql

.env.local                   ← YOUR SECRETS (create this!)
```

---

## How It Works

```
1. User visits homepage
2. Sees alumni grid (no login!)
3. Clicks "+ Add Your Profile"
4. Fills form
5. Submits
6. Profile appears in grid instantly
7. Others can click profile → email them
```

---

## Deployment

```bash
# Build
npm run build

# Output: /dist folder
# Upload /dist to any host (Vercel, Netlify, etc.)
```

---

## Database Commands

```sql
-- View all alumni
SELECT * FROM alumni ORDER BY created_at DESC;

-- View one
SELECT * FROM alumni WHERE full_name = 'Your Name';

-- Count
SELECT COUNT(*) FROM alumni;

-- By city
SELECT * FROM alumni WHERE current_city = 'Bangalore';
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to database" | Check .env.local has correct credentials |
| "Table alumni not found" | Run database_schema_simple.sql |
| "Image upload fails" | Create "profile-images" bucket as PUBLIC |
| "Port already in use" | Vite will try next port automatically |
| "Build fails" | Delete node_modules, run `npm install` |

---

## Customize In 5 Minutes

### Colors (In src/pages/Home.tsx)

```typescript
// Line ~1
className="bg-gradient-to-br from-BLUE-600 to-PURPLE-600"

// Change to:
className="bg-gradient-to-br from-red-600 to-pink-600"
// Or any Tailwind colors
```

### Houses (In src/pages/Home.tsx)

```typescript
const houses = [
  "Aravali",
  "Nilgiri", 
  "Shivalik",
  "Udaybir"
  // Add more here
];
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (your anon key)
```

**Get from:** Supabase Dashboard → Settings → API

---

## Key Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Check code quality
```

---

## Main Component

**Everything is in:** `src/pages/Home.tsx`

It contains:
- ✅ Add profile form
- ✅ Alumni grid display
- ✅ Search & filter
- ✅ Profile view modal
- ✅ Direct email contact

**One file. One page. Everything works.**

---

## Database Diagram

```
┌─────────┐
│ alumni  │
├─────────┤
│ id      │
│ name    │
│ batch   │
│ house   │
│ job     │
│ company │
│ city    │
│ email   │
│ phone   │
│ photo   │
│ bio     │
│ helps[] │
└─────────┘
```

---

## API Calls (In The Code)

```typescript
// Add alumni
await supabase.from("alumni").insert([alumniData]);

// Get all
const { data } = await supabase.from("alumni").select("*");

// Search
const { data } = await supabase
  .from("alumni")
  .select("*")
  .ilike("full_name", `%${searchTerm}%`);
```

---

## Features Status

```
✅ Add profile              Working now
✅ Browse alumni            Working now
✅ Search & filter          Working now
✅ View profiles            Working now
✅ Photo upload             Working now
✅ Email/phone exchange     Working now
🔄 Built-in messaging       Database ready
🔄 Connection requests      Database ready
🔄 Opportunities board      Database ready
```

---

## Support

1. Check [SIMPLE_SETUP.md](SIMPLE_SETUP.md)
2. Check [SIMPLIFIED_CHANGES.md](SIMPLIFIED_CHANGES.md)
3. Check src/pages/Home.tsx comments
4. Check Supabase docs: supabase.com/docs

---

## Did It Work?

- [ ] npm install - success
- [ ] .env.local created
- [ ] Database schema loaded
- [ ] Storage bucket created
- [ ] npm run dev - runs on port 8082
- [ ] Page loads at localhost
- [ ] Can add profile
- [ ] Profile appears in list
- [ ] Can search profiles
- [ ] Can view full profile

✅ **All checked? You're ready to deploy!**

---

## Deploy Now

```bash
# 1. Build
npm run build

# 2. Vercel (easiest)
# Push to GitHub
git push

# Go to vercel.com
# Click "New Project"
# Select your repo
# Add env variables
# Click Deploy

# 3. Or upload /dist anywhere
```

---

## 🎓 That's It!

You have a working alumni network.
No login needed.
Works perfectly.
Deploy in minutes.

Happy networking! 🚀
