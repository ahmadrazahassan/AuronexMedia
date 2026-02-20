import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { formatDate } from '../lib/utils';

interface PopularPostsProps {
  posts: Post[];
}

export const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  // Don't render if no posts
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24">
      {/* Most Popular Section */}
      <div className="bg-white/90 backdrop-blur-sm border-4 border-dark relative mb-8 shadow-xl">
        {/* Header */}
        <div className="bg-noise-dark text-white px-6 py-4 relative">
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-dark font-black text-xs">01</span>
          </div>
          <h3 className="font-black font-sf-pro text-sm tracking-[0.2em] uppercase">
            Most Popular
          </h3>
        </div>

        {/* Posts List */}
        <div className="divide-y-2 divide-gray-200">
          {posts.slice(0, Math.min(6, posts.length)).map((post, index) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex gap-4 p-4 hover:bg-gray-50 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden border-2 border-dark">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Number Badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary flex items-center justify-center">
                  <span className="text-dark font-black text-xs">{index + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-2">
                <h4 className="font-bold font-sf-pro text-sm text-dark line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500 font-sf-pro">
                  {formatDate(post.published_at || post.created_at)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="absolute -bottom-px left-0 w-24 h-1 bg-primary"></div>
      </div>

      {/* Random Posts Section */}
      {posts.length > 6 && (
        <div className="bg-white/90 backdrop-blur-sm border-4 border-dark relative shadow-xl">
          {/* Header */}
          <div className="bg-noise-dark text-white px-6 py-4 relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-dark flex items-center justify-center">
              <span className="text-white font-black text-xs">02</span>
            </div>
            <h3 className="font-black font-sf-pro text-sm tracking-[0.2em] uppercase">
              Random Posts
            </h3>
          </div>

          {/* Random Posts List */}
          <div className="divide-y-2 divide-gray-200">
            {posts.slice(6, Math.min(10, posts.length)).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block p-4 hover:bg-gray-50 transition-all"
            >
              <h4 className="font-bold font-sf-pro text-sm text-dark line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h4>
              <p className="text-xs text-gray-500 font-sf-pro mt-2">
                {formatDate(post.published_at || post.created_at)}
              </p>
            </Link>
          ))}
        </div>

        {/* Bottom Accent */}
        <div className="absolute -bottom-px right-0 w-16 h-1 bg-primary"></div>
      </div>
      )}
    </div>
  );
};
