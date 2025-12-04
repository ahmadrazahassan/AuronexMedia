import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post, Tag } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PostCard } from '../../components/PostCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';

export const TagPostsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tag, setTag] = useState<Tag | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTagAndPosts = React.useCallback(async () => {
    try {
      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .eq('slug', slug)
        .single();

      if (tagError) throw tagError;
      setTag(tagData);

      const { data: postTagsData, error: postTagsError } = await supabase
        .from('post_tags')
        .select(`
          post:posts(
            *,
            category:categories(*),
            author:users(*),
            tags:post_tags(tag:tags(*))
          )
        `)
        .eq('tag_id', tagData.id);

      if (postTagsError) throw postTagsError;

      const postsData = postTagsData
        ?.map((pt: any) => pt.post)
        .filter((post: any) => post.status === 'published');

      const transformedPosts = postsData?.map((post: any) => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag) || []
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching tag posts:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchTagAndPosts();
    }
  }, [slug, fetchTagAndPosts]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <SEO title={`${tag?.name || 'Tag'} - Inkwell`} />
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-primary mb-8 font-montserrat">
          #{tag?.name}
        </h1>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-secondary font-sf-pro">No posts with this tag yet.</p>
        )}
      </main>
      <Footer />
    </>
  );
};
