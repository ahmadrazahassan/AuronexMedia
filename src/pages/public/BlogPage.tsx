import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Post, Category, Tag } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PostCard } from '../../components/PostCard';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:users(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq('status', 'published');

      if (selectedCategory) {
        query = query.eq('category_id', selectedCategory);
      }

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('published_at', { ascending: false });
      } else if (sortBy === 'oldest') {
        query = query.order('published_at', { ascending: true });
      } else if (sortBy === 'popular') {
        query = query.order('view_count', { ascending: false });
      }

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;

      let transformedPosts = postsData?.map(post => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag) || []
      })) || [];

      // Filter by tag if selected
      if (selectedTag) {
        transformedPosts = transformedPosts.filter(post =>
          post.tags.some((tag: Tag) => tag.id === selectedTag)
        );
      }

      // Filter by search query
      if (searchQuery) {
        transformedPosts = transformedPosts.filter(post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setPosts(transformedPosts);

      // Fetch categories and tags
      const [categoriesRes, tagsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name')
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (tagsRes.data) setTags(tagsRes.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedTag, sortBy, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    fetchData();
  };

  const paginatedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <>
      <SEO
        title="Blog - Inkwell"
        description="Read our latest articles and stories on Inkwell."
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8 font-montserrat">
          All Articles
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-card border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-card font-sf-pro focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border-2 border-gray-300 rounded-card font-sf-pro focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 border-2 border-gray-300 rounded-card font-sf-pro focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          {/* Tag Filter */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1 text-sm rounded-button transition-colors ${
                  !selectedTag
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-secondary hover:bg-gray-200'
                }`}
              >
                All Tags
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedTag(tag.id)}
                  className={`px-3 py-1 text-sm rounded-button transition-colors ${
                    selectedTag === tag.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 font-sf-pro text-secondary">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-secondary font-sf-pro text-lg">
              No articles found. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};
