# Image Upload System

## Professional Image Management for AuronexMedia

---

## Features

### Dual Upload Methods

**1. URL Input**
- Paste any image URL directly
- Instant preview
- No file size limits
- Works with external CDNs

**2. File Upload**
- Drag & drop interface
- Click to browse
- Automatic upload to Supabase Storage
- 5MB file size limit
- Supports: JPG, PNG, GIF, WebP

---

## Usage

### In Post Creation/Editing

The ImageUpload component appears in:
- `/admin/posts/new` - Create new post
- `/admin/posts/:id/edit` - Edit existing post
- `/admin/posts/import` - HTML import

### Toggle Between Modes

**URL Mode:**
```
1. Click "URL" button
2. Paste image URL
3. Preview appears automatically
```

**Upload Mode:**
```
1. Click "Upload" button
2. Drag & drop image OR click to browse
3. Image uploads automatically
4. URL is saved to database
```

---

## Technical Details

### File Upload Process

```
User selects file
    ↓
Validate file type (image/*)
    ↓
Validate file size (< 5MB)
    ↓
Generate unique filename
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Update form field
    ↓
Display preview
```

### Storage Configuration

**Bucket:** `blog-images`
**Path:** `{random}-{timestamp}.{ext}`
**Cache:** 3600 seconds
**Public:** Yes

---

## Image Preview

- Automatic preview for both URL and upload
- 320px height (80 in Tailwind)
- Object-fit: cover
- 4px border
- Error handling with fallback

---

## Error Handling

**Invalid File Type:**
- Shows error notification
- Prevents upload

**File Too Large:**
- Shows error notification
- Prevents upload

**Invalid URL:**
- Shows placeholder image
- Allows correction

**Upload Failure:**
- Shows error notification
- Allows retry

---

## Supabase Storage Setup

### Create Storage Bucket

```sql
-- In Supabase Dashboard > Storage
-- Create new bucket: blog-images
-- Set to Public
```

### Storage Policies

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow public read access
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images');
```

---

## Component API

### ImageUpload Props

```typescript
interface ImageUploadProps {
  value: string;           // Current image URL
  onChange: (url: string) => void;  // Callback when URL changes
  label?: string;          // Optional label (default: "Image")
}
```

### Usage Example

```tsx
import { ImageUpload } from '../../components/ImageUpload';

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('');

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      label="Cover Image"
    />
  );
}
```

---

## Best Practices

### Image Optimization

**Before Upload:**
- Resize images to max 1920px width
- Compress to reduce file size
- Use WebP format when possible

**Recommended Dimensions:**
- Cover images: 1200x630px (social media)
- Content images: 800-1200px width
- Thumbnails: 400x300px

### File Naming

System automatically generates unique names:
```
{random-string}-{timestamp}.{extension}
```

Example: `a7b3c9d-1704123456789.jpg`

---

## Troubleshooting

### Upload Not Working

**Check:**
1. Supabase storage bucket exists
2. Storage policies are configured
3. User is authenticated
4. File size is under 5MB
5. File type is valid image

### Preview Not Showing

**Check:**
1. URL is valid and accessible
2. Image format is supported
3. CORS is configured on external URLs
4. Network connection is stable

### Slow Uploads

**Solutions:**
1. Compress images before upload
2. Use smaller file sizes
3. Check internet connection
4. Consider using CDN for large files

---

## Future Enhancements

### Planned Features

- [ ] Image cropping tool
- [ ] Multiple image upload
- [ ] Image gallery browser
- [ ] Automatic image optimization
- [ ] Alt text editor
- [ ] Image metadata editor
- [ ] Bulk image management
- [ ] Image search functionality

---

## Security

### File Validation

- Type checking (image/* only)
- Size limits (5MB max)
- Filename sanitization
- Unique naming prevents conflicts

### Storage Security

- Row Level Security enabled
- Authenticated uploads only
- Public read access
- Secure deletion

---

## Performance

### Upload Speed

- Average: 1-3 seconds for 1MB image
- Depends on internet connection
- Supabase CDN for fast delivery

### Storage Limits

- Supabase Free: 1GB storage
- Supabase Pro: 100GB storage
- Unlimited bandwidth

---

Built for AuronexMedia
