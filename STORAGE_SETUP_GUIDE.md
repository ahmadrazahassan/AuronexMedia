# Supabase Storage Setup Guide

## Fix: "new row violates row-level security policy" Error

This error occurs because Supabase Storage doesn't have the proper bucket and policies set up.

---

## Quick Fix (5 Minutes)

### Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Click **Storage** in the left sidebar
3. Click **"New bucket"** button
4. Enter these details:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ **YES** (Check this!)
   - **File size limit:** 5MB (optional)
   - **Allowed MIME types:** Leave empty or add: `image/*`
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

1. In Supabase Dashboard, go to **Storage**
2. Click on the **"blog-images"** bucket
3. Click **"Policies"** tab at the top
4. Click **"New Policy"**

#### Create 4 Policies:

**Policy 1: Upload Images (INSERT)**
```
Policy name: Authenticated users can upload images
Allowed operation: INSERT
Target roles: authenticated
WITH CHECK expression: bucket_id = 'blog-images'
```

**Policy 2: View Images (SELECT)**
```
Policy name: Public can view images
Allowed operation: SELECT
Target roles: public
USING expression: bucket_id = 'blog-images'
```

**Policy 3: Update Images (UPDATE)**
```
Policy name: Authenticated users can update images
Allowed operation: UPDATE
Target roles: authenticated
USING expression: bucket_id = 'blog-images'
WITH CHECK expression: bucket_id = 'blog-images'
```

**Policy 4: Delete Images (DELETE)**
```
Policy name: Authenticated users can delete images
Allowed operation: DELETE
Target roles: authenticated
USING expression: bucket_id = 'blog-images'
```

### Step 3: Alternative - Use SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Copy and paste the content from `supabase-storage-setup.sql`
4. Click **"Run"**

---

## Verify Setup

### Test in Supabase Dashboard

1. Go to **Storage** > **blog-images**
2. Try uploading a test image manually
3. If successful, your policies are working!

### Test in Your App

1. Log in to your admin panel
2. Go to **Create New Post** or **Edit Post**
3. Try uploading an image
4. Should work without errors now!

---

## Troubleshooting

### Error: "Bucket already exists"
- The bucket is already created, skip Step 1
- Go directly to Step 2 (policies)

### Error: "Policy already exists"
- Drop the existing policy first:
```sql
DROP POLICY IF EXISTS "policy_name" ON storage.objects;
```
- Then create the new one

### Images still not uploading?

**Check 1: Is bucket public?**
1. Go to Storage > blog-images
2. Click Settings (gear icon)
3. Ensure "Public bucket" is checked

**Check 2: Are you logged in?**
- You must be logged in to upload
- Check browser console for auth errors

**Check 3: File size**
- Default limit is 50MB
- Your code limits to 5MB
- Check if file is within limits

**Check 4: CORS**
- Supabase handles CORS automatically
- If issues, check Supabase project settings

---

## Security Notes

### Current Setup (Recommended)
- ✅ Anyone can VIEW images (public bucket)
- ✅ Only authenticated users can UPLOAD
- ✅ Only authenticated users can DELETE
- ✅ This is perfect for a blog platform

### Alternative: Private Bucket
If you want images to be private:
1. Uncheck "Public bucket"
2. Update SELECT policy to `authenticated` instead of `public`
3. Generate signed URLs for viewing

---

## File Structure

After setup, your images will be stored as:
```
blog-images/
  ├── abc123-1704123456789.jpg
  ├── def456-1704123456790.png
  └── ghi789-1704123456791.webp
```

Public URL format:
```
https://[project-id].supabase.co/storage/v1/object/public/blog-images/[filename]
```

---

## Quick Commands

### View all storage policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

### Delete all image policies
```sql
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
```

### Check bucket settings
```sql
SELECT * FROM storage.buckets WHERE name = 'blog-images';
```

---

## Success Checklist

- [ ] Created `blog-images` bucket
- [ ] Set bucket to PUBLIC
- [ ] Created INSERT policy for authenticated users
- [ ] Created SELECT policy for public
- [ ] Created UPDATE policy for authenticated users
- [ ] Created DELETE policy for authenticated users
- [ ] Tested upload in Supabase Dashboard
- [ ] Tested upload in your app
- [ ] Images display correctly on frontend

---

## Need Help?

If you're still having issues:

1. **Check Supabase logs:**
   - Dashboard > Logs > Storage logs

2. **Check browser console:**
   - F12 > Console tab
   - Look for detailed error messages

3. **Verify authentication:**
   - Make sure you're logged in
   - Check: `supabase.auth.getUser()`

4. **Test with Supabase CLI:**
```bash
supabase storage ls blog-images
```

---

**After completing these steps, image uploads will work perfectly!**
