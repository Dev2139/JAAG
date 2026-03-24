# Using Cloudinary for Image Uploads

The app now uses **Cloudinary** to store profile photos (not Supabase storage).

## Setup Instructions:

### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (free tier is fine)
3. You'll get your **Cloud Name** (visible on dashboard)

### Step 2: Update App Code
1. In [src/pages/Home.tsx](../src/pages/Home.tsx), find line with:
   ```
   formData.append("upload_preset", "jnv_alumni");
   formData.append("cloud_name", "diqqf3eyx");
   ```

2. Replace:
   - `diqqf3eyx` with YOUR cloud name
   - `jnv_alumni` with your preset name (see Step 3)

### Step 3: Create Upload Preset
1. In Cloudinary dashboard, go to **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Create an unsigned preset**
4. Name it: `jnv_alumni`
5. Set **Signing Mode**: Unsigned
6. Save

### Step 4: Test
1. Refresh app: http://localhost:8080
2. Try uploading a profile photo
3. ✅ Should now upload to Cloudinary!

## Current Setup (Already Configured):
- Cloud Name: `diqqf3eyx`
- Upload Preset: `jnv_alumni`
- (You can keep this test setup or replace with your own)

## Benefits:
✅ No Supabase storage setup needed
✅ Free tier: 25GB/month
✅ Images auto-optimized
✅ Instant global CDN
