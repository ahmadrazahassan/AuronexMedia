import { useEffect, useRef, useCallback, useState } from 'react';

interface AutoSaveOptions {
  key: string;
  data: any;
  delay?: number;
  enabled?: boolean;
}

interface AutoSaveReturn {
  lastSaved: Date | null;
  isSaving: boolean;
  clearSavedData: () => void;
  getSavedData: () => any | null;
}

export const useAutoSave = ({
  key,
  data,
  delay = 5000,
  enabled = true,
}: AutoSaveOptions): AutoSaveReturn => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>('');

  const save = useCallback(() => {
    const serialized = JSON.stringify(data);
    
    // Only save if data has changed
    if (serialized === previousDataRef.current) {
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(`autosave_${key}`, serialized);
      localStorage.setItem(`autosave_${key}_timestamp`, new Date().toISOString());
      previousDataRef.current = serialized;
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [key, data]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(`autosave_${key}`);
    localStorage.removeItem(`autosave_${key}_timestamp`);
    previousDataRef.current = '';
    setLastSaved(null);
  }, [key]);

  const getSavedData = useCallback((): any | null => {
    try {
      const saved = localStorage.getItem(`autosave_${key}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to retrieve auto-saved data:', error);
    }
    return null;
  }, [key]);

  useEffect(() => {
    if (!enabled) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      save();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  // Check for existing saved data on mount
  useEffect(() => {
    const timestamp = localStorage.getItem(`autosave_${key}_timestamp`);
    if (timestamp) {
      setLastSaved(new Date(timestamp));
    }
  }, [key]);

  return {
    lastSaved,
    isSaving,
    clearSavedData,
    getSavedData,
  };
};

// Helper to format the last saved time
export const formatAutoSaveTime = (date: Date | null): string => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) {
    return 'Just now';
  } else if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};
