import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { formatDate } from '../lib/utils';
import { TagChip } from './TagChip';
import { Card } from './Card';
import { OptimizedImage } from './OptimizedImage';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Card hover className="h-full flex flex-col">
      {post.cover_image_url && (
        <Link to={`/blog/${post.slug}`} className="block -mt-6 -mx-6 mb-4">
          <OptimizedImage
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-48 rounded-t-card"
            placeholder="blur"
          />
        </Link>
      )}
      <div className="flex-1 flex flex-col">
        <div className="mb-3">
          {post.category && (
            <Link
              to={`/categories/${post.category.slug}`}
              className="text-sm font-sf-pro text-secondary hover:text-primary transition-colors"
            >
              {post.category.name}
            </Link>
          )}
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-primary font-montserrat mb-2 hover:opacity-70 transition-opacity">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="text-secondary font-sf-pro mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-secondary font-sf-pro mb-3">
            <span>{formatDate(post.published_at || post.created_at)}</span>
            {post.estimated_read_time && (
              <span>{post.estimated_read_time} min read</span>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <TagChip key={tag.id} name={tag.name} slug={tag.slug} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
