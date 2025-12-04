import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { formatDate } from '../../lib/utils';
import { downloadSitemap } from '../../lib/sitemap';
import { useNotificationStore } from '../../store/notificationStore';
import { 
  FileText, 
  Eye, 
  MessageSquare, 
  Folder, 
  Tag, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Edit3,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Download
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  const [generatingSitemap, setGeneratingSitemap] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    totalTags: 0,
    totalComments: 0,
    totalViews: 0,
    scheduledPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');

  const fetchDashboardData = React.useCallback(async () => {
    try {
      const [postsRes, categoriesRes, tagsRes, commentsRes] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact' }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('tags').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
      ]);

      const publishedCount = postsRes.data?.filter(p => p.status === 'published').length || 0;
      const draftCount = postsRes.data?.filter(p => p.status === 'draft').length || 0;
      const scheduledCount = postsRes.data?.filter(p => (p.status as string) === 'scheduled').length || 0;
      const totalViews = postsRes.data?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0;

      setStats({
        totalPosts: postsRes.count || 0,
        publishedPosts: publishedCount,
        draftPosts: draftCount,
        scheduledPosts: scheduledCount,
        totalCategories: categoriesRes.count || 0,
        totalTags: tagsRes.count || 0,
        totalComments: commentsRes.count || 0,
        totalViews,
      });

      const { data: recentData } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false })
        .limit(8);

      setRecentPosts(recentData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const publishRate = stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0;
  const avgViews = stats.publishedPosts > 0 ? Math.round(stats.totalViews / stats.publishedPosts) : 0;

  const filteredPosts = recentPosts.filter(post => {
    if (activeTab === 'all') return true;
    return post.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Ultra-Modern Header */}
        <div className="mb-16">
          {/* Top Meta Bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500 font-elms">Admin</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="text-gray-900 font-elms font-semibold">Dashboard</span>
              </div>
              
              {/* Live Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                <div className="relative">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-primary rounded-full absolute top-0 left-0 animate-ping"></div>
                </div>
                <span className="text-xs font-elms font-bold text-gray-900">LIVE</span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-elms font-medium text-gray-700 hover:border-gray-300 transition-colors flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last 30 days
              </button>
              <button 
                onClick={async () => {
                  setGeneratingSitemap(true);
                  try {
                    await downloadSitemap();
                    addNotification('success', 'Sitemap downloaded successfully');
                  } catch (error) {
                    addNotification('error', 'Failed to generate sitemap');
                  } finally {
                    setGeneratingSitemap(false);
                  }
                }}
                disabled={generatingSitemap}
                className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-sm font-elms font-medium text-gray-700 hover:border-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {generatingSitemap ? 'Generating...' : 'Sitemap'}
              </button>
              <button 
                onClick={() => navigate('/admin/posts/new')}
                className="px-5 py-2 bg-gray-900 text-white rounded-2xl text-sm font-elms font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                New Post
              </button>
            </div>
          </div>

          {/* Main Title Section */}
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[80px] font-black text-gray-900 leading-none font-montserrat-alt tracking-tighter mb-4">
                Dashboard
              </h1>
              <p className="text-xl text-gray-600 font-elms max-w-2xl leading-relaxed">
                Real-time analytics and content management overview for your publishing platform
              </p>
            </div>
            
            {/* Quick Stats Badge */}
            <div className="bg-primary rounded-3xl px-8 py-6 text-center">
              <div className="text-5xl font-black text-white font-montserrat-alt mb-1">{publishRate}%</div>
              <div className="text-white/80 text-sm font-elms font-medium">Publish Rate</div>
            </div>
          </div>
        </div>

        {/* Main Stats Grid - Bento Box Style */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Large Featured Card */}
          <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-primary to-primary/80 rounded-[48px] p-12 relative overflow-hidden">
            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                    <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-white/90 text-base font-elms font-semibold mb-1">Total Content</div>
                    <div className="text-white/60 text-sm font-elms">All published & draft posts</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  <TrendingUp className="w-4 h-4 text-white" />
                  <span className="text-white font-black text-base font-montserrat-alt">+{publishRate}%</span>
                </div>
              </div>
              
              <div className="mb-10">
                <div className="text-[140px] font-black text-white leading-none font-montserrat-alt tracking-tighter">
                  {stats.totalPosts}
                </div>
                <div className="text-white/70 text-xl font-elms mt-3 font-medium">Total posts created</div>
              </div>

              {/* Inline Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="text-white/70 text-sm font-elms font-medium">Published</span>
                  </div>
                  <div className="text-5xl font-black text-white font-montserrat-alt">{stats.publishedPosts}</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Edit3 className="w-5 h-5 text-white" />
                    <span className="text-white/70 text-sm font-elms font-medium">Drafts</span>
                  </div>
                  <div className="text-5xl font-black text-white font-montserrat-alt">{stats.draftPosts}</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white/70 text-sm font-elms font-medium">Scheduled</span>
                  </div>
                  <div className="text-5xl font-black text-white font-montserrat-alt">{stats.scheduledPosts}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Stats Stack */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Views Card */}
            <div className="bg-gray-900 rounded-[48px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-20 translate-x-20"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="text-gray-400 text-sm font-elms font-semibold">Total Views</div>
                </div>
                <div className="text-6xl font-black text-white mb-2 font-montserrat-alt">{stats.totalViews.toLocaleString()}</div>
                <div className="text-gray-500 text-sm font-elms">Avg {avgViews} per post</div>
              </div>
            </div>

            {/* Engagement Card */}
            <div className="bg-white rounded-[48px] p-8 border-2 border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
                </div>
                <div className="text-gray-600 text-sm font-elms font-semibold">Comments</div>
              </div>
              <div className="text-6xl font-black text-gray-900 mb-2 font-montserrat-alt">{stats.totalComments}</div>
              <div className="text-gray-500 text-sm font-elms">User engagement</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { icon: Folder, label: 'Categories', value: stats.totalCategories, color: 'bg-blue-50 text-blue-600' },
            { icon: Tag, label: 'Tags', value: stats.totalTags, color: 'bg-purple-50 text-purple-600' },
            { icon: BarChart3, label: 'Avg Views', value: avgViews, color: 'bg-green-50 text-green-600' },
            { icon: TrendingUp, label: 'Growth', value: `${publishRate}%`, color: 'bg-orange-50 text-orange-600' },
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-3xl p-7 border-2 border-gray-200 hover:border-primary transition-all hover:shadow-xl group">
              <div className={`w-12 h-12 ${metric.color} rounded-2xl mb-5 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <metric.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="text-5xl font-black text-gray-900 mb-2 font-montserrat-alt">{metric.value}</div>
              <div className="text-gray-500 text-sm font-elms font-semibold">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[48px] p-10 border-2 border-gray-200 mb-32">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-5xl font-black text-gray-900 font-montserrat-alt mb-3">Recent Activity</h2>
              <p className="text-gray-500 font-elms text-lg">Latest content updates and changes</p>
            </div>
            <Link
              to="/admin/posts"
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-elms font-bold hover:bg-gray-800 transition-colors"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-3 mb-8">
            {[
              { key: 'all', label: 'All Posts', count: recentPosts.length },
              { key: 'published', label: 'Published', count: recentPosts.filter(p => p.status === 'published').length },
              { key: 'draft', label: 'Drafts', count: recentPosts.filter(p => p.status === 'draft').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-5 py-3 rounded-2xl font-elms font-bold text-sm transition-all ${
                  activeTab === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} <span className="opacity-60 ml-1">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-gray-400" strokeWidth={2} />
                </div>
                <p className="text-gray-500 mb-8 font-elms text-xl">No posts yet. Start creating content.</p>
                <button
                  onClick={() => navigate('/admin/posts/new')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-elms font-black rounded-2xl hover:bg-primary/90 transition-colors text-lg"
                >
                  <Edit3 className="w-5 h-5" />
                  Create First Post
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-3xl transition-all group cursor-pointer border-2 border-transparent hover:border-gray-200"
                  onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    {/* Status Badge */}
                    <div className={`px-4 py-2 rounded-2xl font-elms font-bold text-xs ${
                      post.status === 'published' ? 'bg-primary/10 text-primary' : 
                      post.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {post.status.toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-gray-900 mb-2 font-montserrat-alt text-xl truncate group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 font-elms font-medium">
                        <span>{post.category?.name || 'Uncategorized'}</span>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <span>{formatDate(post.created_at)}</span>
                        {post.view_count > 0 && (
                          <>
                            <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.view_count}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-elms font-bold">
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-full shadow-2xl px-4 py-4 border-2 border-gray-200">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/dashboard"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full bg-primary text-white transition-all"
            >
              <BarChart3 className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-black">Dashboard</span>
            </Link>

            <Link
              to="/admin/posts"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <FileText className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-bold">Posts</span>
            </Link>

            <Link
              to="/admin/posts/new"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Edit3 className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-bold">Create</span>
            </Link>

            <Link
              to="/admin/categories"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Folder className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-bold">Categories</span>
            </Link>

            <Link
              to="/admin/comments"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-bold">Comments</span>
            </Link>

            <Link
              to="/admin/contacts"
              className="flex flex-col items-center gap-2 px-6 py-3 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Tag className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-xs font-elms font-bold">Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
