-- =====================================================
-- SIMPLE STORAGE POLICY FIX
-- Copy and paste this in Supabase SQL Editor and click RUN
-- =====================================================

-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Allow anyone (authenticated or not) to upload to blog-images
-- This is the simplest approach for a blog platform
CREATE POLICY "Anyone can upload to blog-images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view blog-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow anyone to update images
CREATE POLICY "Anyone can update blog-images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- Allow anyone to delete images
CREATE POLICY "Anyone can delete blog-images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-images');

-- Verify policies were created
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%blog-images%';
