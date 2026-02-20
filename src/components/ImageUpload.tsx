import React, { useState, useRef } from 'react';
import { Upload, Link2, X } from 'lucide-react';
import { uploadImage } from '../lib/storage';
import { useNotificationStore } from '../store/notificationStore';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label = 'Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotificationStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      addNotification('error', 'Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addNotification('error', 'Image size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImage(file);
      onChange(imageUrl);
      addNotification('success', 'Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Show helpful error message
      let errorMessage = 'Failed to upload image';
      
      if (error.message?.includes('bucket')) {
        errorMessage = 'Storage bucket not set up. Please use URL mode or contact admin.';
      } else if (error.message?.includes('permissions') || error.message?.includes('security')) {
        errorMessage = 'Storage permissions error. Please use URL mode or contact admin.';
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Upload timeout. Please try a smaller image or use URL mode.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addNotification('error', errorMessage);
      
      // Auto-switch to URL mode on storage errors
      if (error.message?.includes('bucket') || error.message?.includes('permissions')) {
        setMode('url');
        addNotification('info', 'Switched to URL mode. You can paste an image URL instead.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Create a fake event to reuse handleFileSelect
    const fakeEvent = {
      target: { files: [file] }
    } as any;
    
    await handleFileSelect(fakeEvent);
  };

  return (
    <div className="bg-white border-4 border-dark p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-white font-black text-xs font-montserrat">IMG</span>
          </div>
          <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
            {label}
          </label>
        </div>
        
        {/* Mode Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-4 py-2 text-xs font-black font-sf-pro uppercase tracking-wider transition-all ${
              mode === 'url'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-4 py-2 text-xs font-black font-sf-pro uppercase tracking-wider transition-all ${
              mode === 'upload'
                ? 'bg-noise-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {/* Content */}
      {mode === 'url' ? (
        /* URL Input */
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
            <span className="text-xs text-gray-600 font-sf-pro uppercase tracking-wider">
              Paste Image URL
            </span>
          </div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-dark focus:border-primary font-sf-pro font-medium focus:outline-none transition-colors"
          />
        </div>
      ) : (
        /* File Upload */
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-gray-300 hover:border-primary transition-all cursor-pointer p-12 text-center"
          >
            {uploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary flex items-center justify-center animate-pulse">
                  <Upload className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-gray-600 font-sf-pro uppercase tracking-wider">
                  Uploading...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-noise-dark flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark font-sf-pro uppercase tracking-wider mb-2">
                    Drop image or click to browse
                  </p>
                  <p className="text-xs text-gray-500 font-sf-pro uppercase tracking-wider">
                    Max 5MB • JPG, PNG, GIF, WebP
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview */}
      {value && !uploading && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-600 font-sf-pro uppercase tracking-wider">
              Preview
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>
          <div className="border-4 border-gray-200 overflow-hidden">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-80 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
