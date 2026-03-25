# Fix: Edit Profile Button Not Showing

## 🔍 Problem Analysis

The Edit Profile button wasn't showing because:
1. **Alumni table didn't exist** in Supabase
2. **No user tracking** - profiles weren't linked to logged-in users
3. **Missing user_id** - AddProfile wasn't storing which user created each profile

## ✅ Solution

The app code is already fixed. You just need to:

### Step 1: Create Alumni Table in Supabase

Go to **Supabase Dashboard** → Your Project → **SQL Editor** → **New Query**

Copy and paste this SQL:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS alumni (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  batch_year INTEGER NOT NULL,
  house VARCHAR(50) NOT NULL,
  profession VARCHAR(255),
  company_name VARCHAR(255),
  current_city VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp_number VARCHAR(20),
  bio TEXT,
  profile_image_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  profile_password VARCHAR(255),
  show_contact_number BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alumni_user_id ON alumni(user_id);
CREATE INDEX IF NOT EXISTS idx_alumni_created_at ON alumni(created_at DESC);
```

Click **Run** ✅

### Step 2: Add Security Columns

If you already created the alumni table without the security columns, run this:

```sql
ALTER TABLE alumni 
ADD COLUMN IF NOT EXISTS profile_password VARCHAR(255);

ALTER TABLE alumni 
ADD COLUMN IF NOT EXISTS show_contact_number BOOLEAN DEFAULT TRUE;
```

Click **Run** ✅

---

## 🧪 How to Test

### Test 1: Create a New Profile
1. Go to `/add-profile`
2. Fill out the form completely:
   - Full Name ✓
   - Batch Year ✓
   - House ✓
   - Profession ✓
   - Company ✓
   - City ✓
   - Phone ✓ (required)
   - Profile Password ✓ (required, min 6 chars)
3. Click "List Yourself"
4. Should see success notification

### Test 2: See Edit Profile Button
1. Go back to Home page
2. Click on the profile you just created
3. You should now see **two buttons** below "Connect via Email":
   - **Edit Profile** (blue button)
   - **Change Password** (outline button)

### Test 3: Edit Profile Works
1. Click **Edit Profile** button
2. Enter your password when prompted
3. After verification, you can edit your profile
4. Change something (e.g., toggle "Let others see my phone number" OFF)
5. Click Save
6. Go back and verify the change

---

## 📝 How It Works Now

### When Creating Profile (`/add-profile`):
```javascript
// Gets current logged-in user
const { data: { user } } = await supabase.auth.getUser();

// Stores user_id with profile
{
  user_id: user.id,  // ← Links profile to user
  full_name: "...",
  phone: "...",
  profile_password: "...",
  ...
}
```

### When Viewing Profile (Home page):
```javascript
// Gets current logged-in user
const currentUserId = user.id;

// Compares user_id
{currentUserId && selectedAlumni.user_id === currentUserId && (
  <Button>Edit Profile</Button>
)}
```

✅ **Only the owner sees the Edit Profile button!**

---

## 🐛 Troubleshooting

### Issue: Still no Edit Profile button
**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+R)
3. Make sure you're logged in (check profile/settings)
4. Check Supabase SQL Editor for errors

### Issue: Can't create profile - "table doesn't exist"
**Solution:**
1. Go to Supabase SQL Editor
2. Run the migration SQL from Step 1 above
3. Try creating profile again

### Issue: Edit button shows but password verification fails
**Solution:**
1. Check that profile_password was saved (go to Supabase table view)
2. Make sure you enter the EXACT password you set (case-sensitive)
3. Minimum 6 characters required

---

## 🗄️ Database Schema

Your alumni table now has:

```sql
alumni
├── id (UUID) - Auto-generated profile ID
├── user_id (UUID) - Link to logged-in user ← NEW!
├── full_name
├── phone
├── profile_password (VARCHAR 255)
├── show_contact_number (BOOLEAN)
├── ... other fields
└── created_at
```

---

## 📋 Migration Files Created

- **docs/migration_create_alumni_table.sql** - Creates alumni table from scratch
- **docs/migration_alumni_security.sql** - Adds password & privacy columns

Use these if you need to reset or recreate the table.

---

## ✨ What Changed in Code

### AddProfile.tsx
```javascript
// NOW INCLUDES:
const { data: { user } } = await supabase.auth.getUser();

// Stores user_id with each profile
user_id: user.id,
```

### Home.tsx
```javascript
// Alumni interface now includes:
interface Alumni {
  user_id: string;  // ← NEW
  // ... other fields
}

// Edit button only shows for owner:
{currentUserId && selectedAlumni.user_id === currentUserId && (
  <Button>Edit Profile</Button>
)}
```

---

## 🎯 Next Steps

1. ✅ Run the SQL migration in Supabase
2. ✅ Create a test profile via `/add-profile`
3. ✅ Verify Edit Profile button appears
4. ✅ Verify only profile owner sees the button
5. ✅ Test Edit functionality with password verification
6. ✅ Verify contact number privacy toggle works

**Then you're done!** The feature is fully working! 🎉
