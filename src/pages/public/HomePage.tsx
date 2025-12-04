import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post, Category } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { PostCard } from '../../components/PostCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { SEO } from '../../components/SEO';
import { PopularPosts } from '../../components/PopularPosts';
import { formatDate } from '../../lib/utils';

export const HomePage: React.FC = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = React.useCallback(async () => {
    try {
      // Fetch featured posts (latest 6 published posts)
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:users(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (postsError) throw postsError;

      // Transform tags from nested structure
      const transformedPosts = postsData?.map(post => ({
        ...post,
        tags: post.tags?.map((pt: any) => pt.tag) || []
      })) || [];

      setFeaturedPosts(transformedPosts);

      // Fetch categories with post counts
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Get post counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'published');

          return { ...category, post_count: count || 0 };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white">
      <Navbar />
      <SEO 
        title="AuronexMedia - Where Ideas Meet Innovation" 
        description="Discover thought-provoking articles on technology, design, development, and digital transformation"
      />

      {/* Hero Section - Bold Minimalist Design */}
      <section className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-white">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{ backgroundImage: 'repeating-linear-pattern(0deg, transparent, transparent 2px, #000 2px, #000 4px)', 
                        backgroundSize: '100px 100px' }}>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-5 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Badge */}
              <div className="inline-flex items-center space-x-3 px-6 py-3 border-2 border-dark">
                <div className="w-2 h-2 bg-noise-dark"></div>
                <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                  Digital Publication
                </span>
                <div className="w-2 h-2 bg-noise-dark"></div>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold font-montserrat text-dark leading-[0.95] tracking-tight">
                  Ideas That
                  <span className="block text-primary mt-4">
                    Shape
                  </span>
                  <span className="block">
                    Tomorrow
                  </span>
                </h1>
                
                <div className="w-24 h-1 bg-primary"></div>
              </div>

              <p className="text-2xl text-gray-700 font-sf-pro leading-relaxed max-w-2xl">
                A modern publication exploring technology, design, and innovation through in-depth articles and expert perspectives.
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-8 py-8 border-t-2 border-b-2 border-dark">
                <div>
                  <div className="text-5xl font-bold text-dark font-montserrat">10K</div>
                  <div className="text-sm text-gray-600 font-sf-pro mt-2 uppercase tracking-wider">Readers</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-dark font-montserrat">500</div>
                  <div className="text-sm text-gray-600 font-sf-pro mt-2 uppercase tracking-wider">Articles</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-dark font-montserrat">50</div>
                  <div className="text-sm text-gray-600 font-sf-pro mt-2 uppercase tracking-wider">Authors</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/blog">
                  <button className="group px-10 py-5 bg-noise-dark text-white font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-primary transition-all duration-300">
                    <span className="flex items-center">
                      Explore Articles
                      <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                </Link>
                <Link to="/categories">
                  <button className="px-10 py-5 border-2 border-dark text-dark font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-noise-dark hover:text-white transition-all duration-300">
                    Browse Topics
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Content - Featured Article Card */}
            {featuredPosts.length > 0 && (
              <div className="lg:col-span-2">
                <Link to={`/blog/${featuredPosts[0].slug}`} className="group block">
                  <div className="relative bg-white border-4 border-dark hover:border-primary transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-96 overflow-hidden bg-gray-100">
                      {featuredPosts[0].cover_image_url ? (
                        <img 
                          src={featuredPosts[0].cover_image_url} 
                          alt={featuredPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                      
                      {/* Badge */}
                      <div className="absolute top-0 right-0">
                        <div className="px-6 py-3 bg-primary text-white">
                          <span className="text-xs font-bold font-sf-pro tracking-wider uppercase">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-4 bg-white">
                      <div className="flex items-center gap-3 text-xs font-sf-pro">
                        <span className="px-3 py-2 bg-noise-dark text-white font-bold tracking-wider uppercase">
                          {featuredPosts[0].category?.name}
                        </span>
                        <span className="text-gray-400">—</span>
                        <span className="text-gray-600 uppercase tracking-wider">
                          {formatDate(featuredPosts[0].published_at || featuredPosts[0].created_at)}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-dark font-montserrat line-clamp-2 leading-tight">
                        {featuredPosts[0].title}
                      </h3>

                      {featuredPosts[0].excerpt && (
                        <p className="text-gray-600 font-sf-pro line-clamp-2 leading-relaxed">
                          {featuredPosts[0].excerpt}
                        </p>
                      )}

                      <div className="pt-4 flex items-center text-primary font-sf-pro font-bold text-sm tracking-wider uppercase">
                        Read More
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-noise-dark"></div>
      </section>

      {/* Featured Posts Section - Bento Grid Layout with Sidebar */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Latest Stories
              </span>
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat">
                Featured Articles
              </h2>
              <Link to="/blog" className="hidden md:flex items-center gap-3 px-6 py-3 border-2 border-dark text-dark hover:bg-noise-dark hover:text-white transition-all font-sf-pro font-bold text-sm tracking-wider uppercase group">
                <span>View All</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content - Featured Posts */}
              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 gap-8">
              {/* Large Featured Card */}
              {featuredPosts[0] && (
              <div>
                <Link to={`/blog/${featuredPosts[0].slug}`} className="group block h-full">
                  <div className="relative h-full min-h-[700px] bg-white border-4 border-dark hover:border-primary transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-3/5 overflow-hidden bg-gray-200">
                      {featuredPosts[0].cover_image_url ? (
                        <img 
                          src={featuredPosts[0].cover_image_url} 
                          alt={featuredPosts[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                      )}
                      
                      {/* Corner Badge */}
                      <div className="absolute bottom-0 left-0 px-6 py-3 bg-primary text-white">
                        <span className="text-xs font-bold font-sf-pro tracking-wider uppercase">
                          Must Read
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="h-2/5 p-10 flex flex-col justify-between bg-white">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-sf-pro">
                          <span className="px-3 py-2 bg-noise-dark text-white font-bold tracking-wider uppercase">
                            {featuredPosts[0].category?.name}
                          </span>
                          <span className="text-gray-400">—</span>
                          <span className="text-gray-600 uppercase tracking-wider">
                            {formatDate(featuredPosts[0].published_at || featuredPosts[0].created_at)}
                          </span>
                        </div>

                        <h3 className="text-4xl font-bold text-dark font-montserrat line-clamp-2 leading-tight">
                          {featuredPosts[0].title}
                        </h3>

                        {featuredPosts[0].excerpt && (
                          <p className="text-gray-600 font-sf-pro line-clamp-2 text-lg">
                            {featuredPosts[0].excerpt}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center text-primary font-sf-pro font-bold text-sm tracking-wider uppercase pt-6">
                        <span>Continue Reading</span>
                        <svg className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              )}

              {/* Additional Featured Posts Grid */}
              {featuredPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.slice(1, Math.min(3, featuredPosts.length)).map((post, index) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`} 
                    className="group block"
                  >
                    <div className="bg-white border-4 border-dark hover:border-primary p-8 transition-all duration-300 h-full">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-sf-pro">
                          <span className="px-3 py-2 bg-noise-dark text-white font-bold tracking-wider uppercase">
                            {post.category?.name}
                          </span>
                          <span className="text-gray-400">—</span>
                          <span className="text-gray-600 uppercase tracking-wider">
                            {formatDate(post.published_at || post.created_at)}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-dark font-montserrat line-clamp-3 leading-tight">
                          {post.title}
                        </h3>

                        {post.excerpt && (
                          <p className="text-gray-600 font-sf-pro line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        <div className="flex items-center text-primary font-sf-pro font-bold text-sm tracking-wider uppercase pt-4">
                          <span>Read More</span>
                          <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              )}
                </div>
              </div>

              {/* Sidebar - Popular Posts */}
              <div className="lg:col-span-4">
                <PopularPosts posts={featuredPosts} />
              </div>
            </div>
          ) : (
            <div className="text-center py-32 bg-white border-4 border-dashed border-gray-300">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-gray-300 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-sf-pro text-lg font-bold uppercase tracking-wider">No featured articles yet</p>
            </div>
          )}

          {/* More Articles Grid */}
          {featuredPosts.length > 4 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(4).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section - Bold Grid */}
      <section className="py-32 bg-white border-t-4 border-dark">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Explore Topics
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat mb-6">
              Browse Categories
            </h2>
            <p className="text-xl text-gray-700 font-sf-pro max-w-2xl leading-relaxed">
              Discover curated content across diverse topics tailored to your interests.
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="group block"
                  >
                    <div className="h-full bg-white border-4 border-dark hover:border-primary transition-all duration-300">
                      {/* Top Accent */}
                      <div className="h-2 bg-noise-dark group-hover:bg-primary transition-colors"></div>
                      
                      <div className="p-8 space-y-6">
                        {/* Icon */}
                        <div className="w-20 h-20 border-4 border-dark bg-noise-dark group-hover:bg-primary transition-all flex items-center justify-center">
                          <span className="text-white font-bold font-montserrat text-3xl">
                            {category.name.charAt(0)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-dark font-montserrat leading-tight">
                            {category.name}
                          </h3>
                          
                          {category.description && (
                            <p className="text-gray-600 font-sf-pro text-sm leading-relaxed line-clamp-3">
                              {category.description}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t-2 border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 border-2 border-dark flex items-center justify-center">
                              <span className="text-dark font-bold font-sf-pro text-sm">
                                {(category as any).post_count || 0}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 font-sf-pro uppercase tracking-wider font-bold">
                              {(category as any).post_count === 1 ? 'Article' : 'Articles'}
                            </span>
                          </div>
                          
                          <svg className="w-6 h-6 text-dark group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View All Categories CTA */}
              <div className="text-center mt-16">
                <Link 
                  to="/categories"
                  className="inline-flex items-center gap-3 px-10 py-5 border-4 border-dark text-dark hover:bg-noise-dark hover:text-white transition-all font-sf-pro font-bold text-sm tracking-wider uppercase group"
                >
                  <span>View All Categories</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trending Topics Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                What's Hot
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-dark font-montserrat">
              Trending Topics
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {['AI & Machine Learning', 'Web Development', 'UI/UX Design', 'Cloud Computing', 'Cybersecurity', 'Data Science', 'Mobile Apps', 'DevOps', 'Blockchain', 'IoT'].map((tag, index) => (
              <Link
                key={tag}
                to={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                className="group px-8 py-4 bg-white border-4 border-dark hover:bg-noise-dark hover:text-white text-dark font-sf-pro font-bold text-sm tracking-wider uppercase transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Bold Split Layout */}
      <section className="py-32 bg-primary border-y-4 border-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Content */}
              <div className="space-y-8 text-white">
                <div className="inline-flex items-center gap-3 px-6 py-3 border-4 border-white">
                  <div className="w-2 h-2 bg-white"></div>
                  <span className="text-xs font-bold font-sf-pro tracking-[0.2em] uppercase">
                    Newsletter
                  </span>
                  <div className="w-2 h-2 bg-white"></div>
                </div>

                <h2 className="text-5xl md:text-6xl font-bold font-montserrat leading-[1.1]">
                  Stay Ahead
                  <span className="block">of the Curve</span>
                </h2>

                <p className="text-2xl font-sf-pro leading-relaxed">
                  Join 10,000+ readers receiving weekly insights on technology, design, and innovation.
                </p>

                {/* Benefits */}
                <div className="space-y-4 pt-6">
                  {['Weekly curated articles', 'Exclusive insights & analysis', 'Cancel anytime, zero spam'].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-4">
                      <div className="w-8 h-8 border-2 border-white flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-sf-pro text-lg font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="pt-8 border-t-2 border-white">
                  <div className="text-5xl font-bold font-montserrat mb-2">10,000+</div>
                  <div className="text-sm font-sf-pro uppercase tracking-wider">Active Subscribers</div>
                </div>
              </div>

              {/* Right Content - Form */}
              <div className="bg-white p-10 border-4 border-dark">
                <form className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-dark font-sf-pro mb-3 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-6 py-4 bg-gray-50 border-4 border-dark focus:border-primary text-dark font-sf-pro text-lg transition-all focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-dark font-sf-pro mb-3 uppercase tracking-wider">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-6 py-4 bg-gray-50 border-4 border-dark focus:border-primary text-dark font-sf-pro text-lg transition-all focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full px-8 py-5 bg-noise-dark text-white font-sf-pro font-bold text-sm tracking-wider uppercase hover:bg-primary transition-all group"
                  >
                    <span className="flex items-center justify-center gap-3">
                      Subscribe Now
                      <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>

                  <p className="text-center text-xs text-gray-600 font-sf-pro pt-2">
                    By subscribing, you agree to our Privacy Policy
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-1 bg-noise-dark"></div>
              <span className="text-xs font-bold text-dark font-sf-pro tracking-[0.2em] uppercase">
                Why Choose Us
              </span>
              <div className="w-12 h-1 bg-noise-dark"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-dark font-montserrat mb-6">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-700 font-sf-pro max-w-2xl mx-auto leading-relaxed">
              We're committed to delivering exceptional content that informs, inspires, and empowers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Expert Authors',
                description: 'Learn from industry professionals and thought leaders with years of real-world experience.'
              },
              {
                number: '02',
                title: 'Fresh Content',
                description: 'New articles published daily covering the latest trends, tools, and innovations.'
              },
              {
                number: '03',
                title: 'Quality First',
                description: 'Every piece is carefully curated, researched, and edited to ensure maximum value.'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-10 bg-white border-4 border-dark hover:border-primary transition-all duration-300"
              >
                {/* Number Badge */}
                <div className="mb-8">
                  <div className="w-20 h-20 border-4 border-dark bg-noise-dark group-hover:bg-primary transition-all flex items-center justify-center">
                    <span className="text-white font-bold font-montserrat text-2xl">
                      {feature.number}
                    </span>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-dark font-montserrat mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 font-sf-pro text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
