import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Post } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDate } from '../../lib/utils';
import { 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  Search,
  Grid3x3,
  List,
  Calendar,
  ExternalLink,
  Plus,
  CheckSquare,
  Square,
  X
} from 'lucide-react';

export const PostsList: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: Post | null }>({
    isOpen: false,
    post: null,
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Bulk selection state
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [bulkActionModal, setBulkActionModal] = useState<{
    isOpen: boolean;
    action: 'delete' | 'publish' | 'unpublish' | null;
  }>({ isOpen: false, action: null });
  const [bulkProcessing, setBulkProcessing] = useState(false);

  const { addNotification } = useNotificationStore();

  const fetchPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          author:users(*)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      addNotification('error', 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, addNotification]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Clear selection when filter changes
  useEffect(() => {
    setSelectedPosts(new Set());
  }, [filterStatus]);

  const handleDelete = async () => {
    if (!deleteModal.post) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', deleteModal.post.id);

      if (error) throw error;

      addNotification('success', 'Post deleted successfully');
      setDeleteModal({ isOpen: false, post: null });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      addNotification('error', 'Failed to delete post');
    }
  };

  const toggleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === filteredPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(filteredPosts.map(p => p.id)));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkActionModal.action || selectedPosts.size === 0) return;

    setBulkProcessing(true);
    const ids = Array.from(selectedPosts);

    try {
      if (bulkActionModal.action === 'delete') {
        const { error } = await supabase
          .from('posts')
          .delete()
          .in('id', ids);

        if (error) throw error;
        addNotification('success', `${ids.length} post(s) deleted successfully`);
      } else if (bulkActionModal.action === 'publish') {
        const { error } = await supabase
          .from('posts')
          .update({ status: 'published', published_at: new Date().toISOString() })
          .in('id', ids);

        if (error) throw error;
        addNotification('success', `${ids.length} post(s) published successfully`);
      } else if (bulkActionModal.action === 'unpublish') {
        const { error } = await supabase
          .from('posts')
          .update({ status: 'draft', published_at: null })
          .in('id', ids);

        if (error) throw error;
        addNotification('success', `${ids.length} post(s) unpublished successfully`);
      }

      setSelectedPosts(new Set());
      setBulkActionModal({ isOpen: false, action: null });
      fetchPosts();
    } catch (error) {
      console.error('Bulk action error:', error);
      addNotification('error', 'Failed to perform bulk action');
    } finally {
      setBulkProcessing(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  const statusFilters = [
    { value: 'all', label: 'All Posts', count: posts.length },
    { value: 'published', label: 'Published', count: posts.filter(p => p.status === 'published').length },
    { value: 'draft', label: 'Drafts', count: posts.filter(p => p.status === 'draft').length },
    { value: 'scheduled', label: 'Scheduled', count: posts.filter(p => (p.status as string) === 'scheduled').length },
  ];

  const isAllSelected = filteredPosts.length > 0 && selectedPosts.size === filteredPosts.length;

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 font-elms">Admin</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-900 font-elms font-semibold">Posts</span>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[80px] font-black text-gray-900 leading-none font-montserrat-alt tracking-tighter mb-4">
                Posts
              </h1>
              <p className="text-xl text-gray-600 font-elms max-w-2xl">
                Manage and organize all your blog content
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/posts/import')}
                className="px-6 py-3 bg-primary text-white font-elms font-bold hover:bg-noise-dark transition-colors uppercase tracking-wider text-sm"
              >
                Import HTML
              </button>
              <button
                onClick={() => navigate('/admin/posts/new')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-elms font-bold hover:bg-gray-800 transition-colors uppercase tracking-wider text-sm"
              >
                <Plus className="w-5 h-5" strokeWidth={2.5} />
                New Post
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPosts.size > 0 && (
          <div className="bg-gray-900 text-white rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedPosts(new Set())}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="font-elms font-bold">
                {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBulkActionModal({ isOpen: true, action: 'publish' })}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-elms font-bold text-sm transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => setBulkActionModal({ isOpen: true, action: 'unpublish' })}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-elms font-bold text-sm transition-colors"
              >
                Unpublish
              </button>
              <button
                onClick={() => setBulkActionModal({ isOpen: true, action: 'delete' })}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-elms font-bold text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-[48px] p-8 border-2 border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-sm font-elms font-medium focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-2 rounded-2xl">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-200'
                }`}
              >
                <Grid3x3 className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-3 mt-6">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-5 py-3 rounded-2xl font-elms font-bold text-sm transition-all ${
                  filterStatus === filter.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.label} <span className="opacity-60 ml-1">({filter.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Display */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-[48px] p-8 border-2 border-gray-200">
            {/* Select All Header */}
            {filteredPosts.length > 0 && (
              <div className="flex items-center gap-4 pb-4 mb-4 border-b-2 border-gray-100">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-sm font-elms font-bold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-5 h-5 text-primary" strokeWidth={2.5} />
                  ) : (
                    <Square className="w-5 h-5" strokeWidth={2.5} />
                  )}
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            )}

            <div className="space-y-3">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="text-gray-500 mb-8 font-elms text-xl">
                    {searchQuery ? 'No posts match your search.' : 'No posts yet. Create your first post.'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => navigate('/admin/posts/new')}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-elms font-black rounded-2xl hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Create Post
                    </button>
                  )}
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`flex items-center justify-between p-6 hover:bg-gray-50 rounded-3xl transition-all group border-2 ${
                      selectedPosts.has(post.id) ? 'border-primary bg-primary/5' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleSelectPost(post.id)}
                        className="flex-shrink-0"
                      >
                        {selectedPosts.has(post.id) ? (
                          <CheckSquare className="w-5 h-5 text-primary" strokeWidth={2.5} />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 group-hover:text-gray-600" strokeWidth={2.5} />
                        )}
                      </button>

                      <div className={`px-4 py-2 rounded-2xl font-elms font-bold text-xs ${
                        post.status === 'published' ? 'bg-primary/10 text-primary' : 
                        post.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {post.status.toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-gray-900 mb-2 font-montserrat-alt text-xl truncate">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 font-elms font-medium">
                          <span>{post.category?.name || 'Uncategorized'}</span>
                          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.created_at)}
                          </span>
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

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {post.status === 'published' && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                          </a>
                        )}
                        <button
                          onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-elms font-bold hover:bg-gray-800 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ isOpen: true, post });
                          }}
                          className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div 
                key={post.id} 
                className={`bg-white rounded-[32px] overflow-hidden border-2 transition-all group ${
                  selectedPosts.has(post.id) ? 'border-primary' : 'border-gray-200 hover:border-primary'
                }`}
              >
                <div className="relative">
                  {post.cover_image_url && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img 
                        src={post.cover_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  {/* Checkbox overlay */}
                  <button
                    onClick={() => toggleSelectPost(post.id)}
                    className="absolute top-4 left-4 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-md"
                  >
                    {selectedPosts.has(post.id) ? (
                      <CheckSquare className="w-5 h-5 text-primary" strokeWidth={2.5} />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <div className={`inline-block px-3 py-1.5 rounded-xl font-elms font-bold text-xs mb-4 ${
                    post.status === 'published' ? 'bg-primary/10 text-primary' : 
                    post.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {post.status.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 font-montserrat-alt line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-elms mb-4">{post.category?.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-elms font-bold hover:bg-gray-800 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, post })}
                      className="p-2.5 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, post: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 border-2 border-gray-200">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 text-center font-montserrat-alt">Delete post</h3>
              <p className="text-gray-600 mb-8 text-center font-elms">
                Are you sure you want to delete "<strong>{deleteModal.post?.title}</strong>"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, post: null })}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-elms font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-elms font-bold hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bulk Action Modal */}
      {bulkActionModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setBulkActionModal({ isOpen: false, action: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 border-2 border-gray-200">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
                bulkActionModal.action === 'delete' ? 'bg-red-50' :
                bulkActionModal.action === 'publish' ? 'bg-green-50' : 'bg-yellow-50'
              }`}>
                {bulkActionModal.action === 'delete' ? (
                  <Trash2 className="w-8 h-8 text-red-600" strokeWidth={2.5} />
                ) : bulkActionModal.action === 'publish' ? (
                  <CheckSquare className="w-8 h-8 text-green-600" strokeWidth={2.5} />
                ) : (
                  <FileText className="w-8 h-8 text-yellow-600" strokeWidth={2.5} />
                )}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 text-center font-montserrat-alt capitalize">
                {bulkActionModal.action} {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''}
              </h3>
              <p className="text-gray-600 mb-8 text-center font-elms">
                {bulkActionModal.action === 'delete' 
                  ? 'This action cannot be undone. All selected posts will be permanently deleted.'
                  : bulkActionModal.action === 'publish'
                  ? 'All selected posts will be published and visible to the public.'
                  : 'All selected posts will be moved to drafts and hidden from the public.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setBulkActionModal({ isOpen: false, action: null })}
                  disabled={bulkProcessing}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-elms font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAction}
                  disabled={bulkProcessing}
                  className={`flex-1 px-6 py-3 text-white rounded-2xl font-elms font-bold transition-colors disabled:opacity-50 ${
                    bulkActionModal.action === 'delete' ? 'bg-red-600 hover:bg-red-700' :
                    bulkActionModal.action === 'publish' ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                >
                  {bulkProcessing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
