import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SearchResult {
  type: 'post' | 'category' | 'tag';
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const searchTerm = `%${searchQuery.toLowerCase()}%`;

      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        supabase
          .from('posts')
          .select('id, title, slug, excerpt')
          .eq('status', 'published')
          .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
          .limit(5),
        supabase
          .from('categories')
          .select('id, name, slug')
          .ilike('name', searchTerm)
          .limit(3),
        supabase
          .from('tags')
          .select('id, name, slug')
          .ilike('name', searchTerm)
          .limit(3),
      ]);

      const searchResults: SearchResult[] = [];

      if (postsRes.data) {
        postsRes.data.forEach((post) => {
          searchResults.push({
            type: 'post',
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || undefined,
          });
        });
      }

      if (categoriesRes.data) {
        categoriesRes.data.forEach((cat) => {
          searchResults.push({
            type: 'category',
            id: cat.id,
            title: cat.name,
            slug: cat.slug,
          });
        });
      }

      if (tagsRes.data) {
        tagsRes.data.forEach((tag) => {
          searchResults.push({
            type: 'tag',
            id: tag.id,
            title: tag.name,
            slug: tag.slug,
          });
        });
      }

      setResults(searchResults);
      setSelectedIndex(0);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, search]);

  const handleSelect = useCallback((result: SearchResult) => {
    let path = '';
    switch (result.type) {
      case 'post':
        path = `/blog/${result.slug}`;
        break;
      case 'category':
        path = `/categories/${result.slug}`;
        break;
      case 'tag':
        path = `/tags/${result.slug}`;
        break;
    }
    navigate(path);
    onClose();
    setQuery('');
    setResults([]);
  }, [navigate, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-20 px-4">
        <div className="bg-white border-2 border-gray-200 shadow-2xl">
          <div className="flex items-center border-b-2 border-gray-200 px-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts, categories, tags..."
              className="flex-1 px-4 py-4 text-lg focus:outline-none"
            />
            <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-200">
              ESC
            </kbd>
          </div>

          {loading && (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  className={`w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <span
                    className={`px-2 py-1 text-xs font-bold uppercase ${
                      result.type === 'post'
                        ? 'bg-gray-900 text-white'
                        : result.type === 'category'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {result.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{result.title}</div>
                    {result.excerpt && (
                      <div className="text-sm text-gray-500 truncate">{result.excerpt}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">Enter</kbd>
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
