-- =====================================================
-- SUPABASE STORAGE SETUP FOR IMAGE UPLOADS
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Step 1: Create the storage bucket (if not exists)
-- Note: You can also create this in the Supabase Dashboard > Storage
-- Go to Storage > Create a new bucket > Name: "blog-images" > Public: YES

-- Step 2: Set up Storage Policies for the blog-images bucket

-- Policy 1: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
);

-- Policy 2: Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'blog-images'
);

-- Policy 3: Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
)
WITH CHECK (
  bucket_id = 'blog-images'
);

-- Policy 4: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%images%';

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Make sure you've created the 'blog-images' bucket first
-- 2. Set the bucket to PUBLIC in the Supabase Dashboard
-- 3. If you get errors, drop existing policies first:
--    DROP POLICY IF EXISTS "policy_name" ON storage.objects;
-- =====================================================
