import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post, Category } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PostCard } from '../../components/PostCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';

export const CategoryPostsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryAndPosts = React.useCallback(async () => {
    try {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:users(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq('category_id', categoryData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      const transformedPosts = postsData?.map(post => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag) || []
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndPosts();
    }
  }, [slug, fetchCategoryAndPosts]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <SEO
        title={`${category?.name || 'Category'} - Inkwell`}
        description={category?.description || ''}
      />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-4 font-montserrat">
          {category?.name}
        </h1>
        {category?.description && (
          <p className="text-lg text-secondary mb-8 font-sf-pro">{category.description}</p>
        )}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-secondary font-sf-pro">No posts in this category yet.</p>
        )}
      </main>
      <Footer />
    </>
  );
};
