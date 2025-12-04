import { supabase } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name (default: 'blog-images')
 * @returns The public URL of the uploaded image
 */
export const uploadImage = async (
  file: File,
  bucket: string = 'blog-images'
): Promise<string> => {
  try {
    // Skip bucket check - just try to upload directly
    // The bucket exists, we saw it in the dashboard

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file with timeout
    const uploadPromise = supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    // Add 30 second timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout - please try again')), 30000)
    );

    const { error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

    if (error) {
      // Better error messages
      if (error.message?.includes('row-level security')) {
        throw new Error('Storage permissions not configured. Please run supabase-storage-setup.sql');
      }
      if (error.message?.includes('not found')) {
        throw new Error('Storage bucket not found. Please create "blog-images" bucket.');
      }
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error('Failed to get image URL');
    }

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('Storage not configured')) {
      throw new Error('Storage not configured. Please create "blog-images" bucket in Supabase Dashboard > Storage');
    }
    if (error.message?.includes('permissions')) {
      throw new Error('Storage permissions error. Please run the SQL setup script.');
    }
    
    throw error;
  }
};

/**
 * Delete an image from Supabase Storage
 * @param url - The public URL of the image to delete
 * @param bucket - The storage bucket name (default: 'blog-images')
 */
export const deleteImage = async (
  url: string,
  bucket: string = 'blog-images'
): Promise<void> => {
  try {
    // Extract filename from URL
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Get a list of all images in the bucket
 * @param bucket - The storage bucket name (default: 'blog-images')
 */
export const listImages = async (bucket: string = 'blog-images') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing images:', error);
    throw error;
  }
};
