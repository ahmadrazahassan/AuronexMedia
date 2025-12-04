import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post, Comment } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { TagChip } from '../../components/TagChip';
import { PostCard } from '../../components/PostCard';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';
import { formatDate, extractHeadings } from '../../lib/utils';
import { useNotificationStore } from '../../store/notificationStore';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{ id: string; text: string; level: number }[]>([]);
  
  // Comment form
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const { addNotification } = useNotificationStore();

  const fetchPost = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:users(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      const transformedPost = {
        ...data,
        tags: data.tags?.map((pt: any) => pt.tag) || []
      };

      setPost(transformedPost);

      // Increment view count
      await supabase
        .from('posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      // Fetch related posts
      if (data.category_id) {
        const { data: related } = await supabase
          .from('posts')
          .select(`
            *,
            category:categories(*),
            author:users(*),
            tags:post_tags(tag:tags(*))
          `)
          .eq('category_id', data.category_id)
          .eq('status', 'published')
          .neq('id', data.id)
          .limit(3);

        if (related) {
          const transformedRelated = related.map(post => ({
            ...post,
            tags: post.tags?.map((pt: any) => pt.tag) || []
          }));
          setRelatedPosts(transformedRelated);
        }
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', data.id)
        .order('created_at', { ascending: false });

      if (commentsData) {
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug, fetchPost]);

  useEffect(() => {
    if (post?.content) {
      const headings = extractHeadings(post.content);
      setToc(headings);
    }
  }, [post?.content]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post || !commentName || !commentEmail || !commentContent) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    setSubmittingComment(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: post.id,
            name: commentName,
            email: commentEmail,
            content: commentContent,
          },
        ]);

      if (error) throw error;

      addNotification('success', 'Comment submitted successfully!');
      setCommentName('');
      setCommentEmail('');
      setCommentContent('');
      
      // Refresh comments
      fetchPost();
    } catch (error) {
      console.error('Error submitting comment:', error);
      addNotification('error', 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const shareUrl = window.location.href;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4 font-montserrat">Post Not Found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} - Inkwell`}
        description={post.excerpt || ''}
        image={post.cover_image_url}
        type="article"
      />
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Header */}
        <header className="mb-8">
          {post.category && (
            <Link
              to={`/categories/${post.category.slug}`}
              className="text-sm font-sf-pro text-secondary hover:text-primary transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-primary mt-4 mb-4 font-montserrat">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-secondary font-sf-pro">
            <span>{post.author?.name}</span>
            <span>•</span>
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {post.estimated_read_time && (
              <>
                <span>•</span>
                <span>{post.estimated_read_time} min read</span>
              </>
            )}
            <span>•</span>
            <span>{post.view_count} views</span>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-auto rounded-card mb-8"
          />
        )}

        {/* Table of Contents */}
        {toc.length > 0 && (
          <div className="bg-gray-50 rounded-card p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-primary mb-4 font-montserrat">Table of Contents</h2>
            <ul className="space-y-2">
              {toc.map((heading, index) => (
                <li key={index} style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}>
                  <a href={`#${heading.id}`} className="text-secondary hover:text-primary transition-colors font-sf-pro">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Post Content */}
        <div className="blog-content mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 pb-8 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TagChip key={tag.id} name={tag.name} slug={tag.slug} />
              ))}
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="mb-12 pb-8 border-b border-gray-200">
          <h3 className="text-xl font-bold text-primary mb-4 font-montserrat">Share this article</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-primary rounded-button hover:bg-gray-200 transition-colors font-sf-pro"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-100 text-primary rounded-button hover:bg-gray-200 transition-colors font-sf-pro"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-primary mb-6 font-montserrat">
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="bg-gray-50 rounded-card p-6 mb-8">
            <h4 className="text-lg font-bold text-primary mb-4 font-montserrat">Leave a Comment</h4>
            <div className="space-y-4">
              <Input
                label="Name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name"
                fullWidth
                required
              />
              <Input
                label="Email"
                type="email"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                placeholder="your@email.com"
                fullWidth
                required
              />
              <Textarea
                label="Comment"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                fullWidth
                required
              />
              <Button type="submit" loading={submittingComment}>
                Post Comment
              </Button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-card p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-primary font-sf-pro">{comment.name}</span>
                  <span className="text-sm text-secondary font-sf-pro">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-secondary font-sf-pro">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-primary mb-8 font-montserrat">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
};
