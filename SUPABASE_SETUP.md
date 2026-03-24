# Supabase Setup Guide

## 1. Get Your Credentials

### Find Your Project URL and Anon Key:
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click on your project (or create one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** (looks like `https://XXX.supabase.co`)
   - **Anon/Public Key** (the long string under "anon (public)")

## 2. Configure Environment Variables

1. Open `.env.local` in the project root
2. Replace the values:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 3. Create Database Tables

Go to your Supabase dashboard and create these tables in the **SQL Editor**:

### profiles table
```sql
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

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only read their own profile
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create policy so users can update their own profile
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

### opportunities table (optional)
```sql
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read opportunities" ON opportunities
  FOR SELECT USING (true);

CREATE POLICY "Users can create opportunities" ON opportunities
  FOR INSERT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own opportunities" ON opportunities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opportunities" ON opportunities
  FOR DELETE USING (auth.uid() = user_id);
```

### Rotate Your Exposed Credentials

⚠️ **IMPORTANT**: You shared credentials in plain text earlier. Please:
1. Go to Supabase Dashboard → Settings → API
2. Click "Rotate" next to your Anon Key
3. Copy the NEW key and update `.env.local`
4. Press "Rotate" again for your Service Role Key

## 4. Available Hooks

### `useAuthContext()` - Global Auth State
```tsx
import { useAuthContext } from "@/lib/supabase/AuthContext";

function MyComponent() {
  const { user, session, loading, signIn, signUp, signOut } = useAuthContext();
  
  if (loading) return <div>Loading...</div>;
  if (user) return <div>Welcome {user.email}!</div>;
  
  return <button onClick={() => signOut()}>Sign Out</button>;
}
```

### `useAuth()` - Auth Operations Hook
```tsx
import { useAuth } from "@/hooks/useAuth";

function LoginForm() {
  const { signIn, loading, error } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await signIn(email, password);
    } catch (err) {
      console.error(err);
    }
  };
}
```

### `useDatabase()` - Database Operations
```tsx
import { useDatabase } from "@/hooks/useDatabase";

function ProfileList() {
  const { query, insert, update, delete: deleteRecord, loading } = useDatabase();
  
  // Get all profiles
  const profiles = await query("profiles");
  
  // Get specific profiles with filters
  const alumniBatch2020 = await query("profiles", {
    filters: { batch: 2020 },
    limit: 10,
    order: { column: "full_name", ascending: true }
  });
  
  // Insert new record
  await insert("profiles", {
    full_name: "John Doe",
    batch: 2020,
    house: "House A"
  });
  
  // Update record
  await update("profiles", userId, {
    profession: "Software Engineer"
  });
  
  // Delete record
  await deleteRecord("profiles", userId);
}
```

## 5. Using Supabase in Components

### Login/Register Example (Already Implemented)
- [Login.tsx](src/pages/Login.tsx) - Uses `useAuthContext()`
- [Register.tsx](src/pages/Register.tsx) - Uses both `useAuthContext()` and `useDatabase()`

### Dashboard with Real Data
```tsx
import { useEffect, useState } from "react";
import { useDatabase } from "@/hooks/useDatabase";
import { useAuthContext } from "@/lib/supabase/AuthContext";

function Dashboard() {
  const { user } = useAuthContext();
  const { query, loading } = useDatabase();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchProfiles = async () => {
        const data = await query("profiles", { limit: 20 });
        setProfiles(data || []);
      };
      fetchProfiles();
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {profiles.map(profile => (
        <div key={profile.id}>{profile.full_name}</div>
      ))}
    </div>
  );
}
```

## 6. Testing

```bash
npm run dev
```

1. Go to `http://localhost:5173/register`
2. Sign up with an email and password
3. You should get a confirmation email from Supabase
4. Verify your email (or skip for testing)
5. Go to `http://localhost:5173/login` and sign in

## 7. Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in the project root
- Restart the dev server after updating `.env.local`

### Auth not persisting after refresh
- Check browser console for errors
- Verify VITE_SUPABASE_ANON_KEY is correct
- Clear browser cache and cookies

### Database queries not working
- Ensure RLS (Row Level Security) policies are correctly set
- Check that you're logged in (user exists)
- Check browser console for specific error messages

## 8. Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
