import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Category, Tag } from '../../types';
import { RichTextEditor } from '../../components/RichTextEditor';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { estimateReadTime, formatDate, generateSlug } from '../../lib/utils';
import { useAutoSave, formatAutoSaveTime } from '../../hooks/useAutoSave';
import { 
  ArrowLeft, 
  Check,
  Type,
  AlignLeft,
  Link2,
  Layers,
  Hash,
  Clock,
  Trash2,
  Eye,
  Save,
  Calendar
} from 'lucide-react';
import { ImageUpload } from '../../components/ImageUpload';

export const PostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();

  // Form state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [publishedAt, setPublishedAt] = useState('');
  
  // Metadata
  const [createdAt, setCreatedAt] = useState('');
  const [viewCount, setViewCount] = useState(0);
  
  // UI state
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeSection, setActiveSection] = useState<string>('title');
  const [deleteModal, setDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [autoSlug, setAutoSlug] = useState(true);
  const [showRecoveryBanner, setShowRecoveryBanner] = useState(false);

  // Auto-save data
  const autoSaveData = useMemo(() => ({
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    categoryId,
    selectedTags,
    status,
    publishedAt,
  }), [title, slug, excerpt, content, coverImageUrl, categoryId, selectedTags, status, publishedAt]);

  const { lastSaved, isSaving, clearSavedData, getSavedData } = useAutoSave({
    key: `post-edit-${id}`,
    data: autoSaveData,
    delay: 5000,
    enabled: hasChanges && !loading,
  });

  // Check for recovered data on mount
  useEffect(() => {
    const savedData = getSavedData();
    if (savedData && !loading) {
      setShowRecoveryBanner(true);
    }
  }, [loading, getSavedData]);

  const handleRecoverData = () => {
    const savedData = getSavedData();
    if (savedData) {
      setTitle(savedData.title || '');
      setSlug(savedData.slug || '');
      setExcerpt(savedData.excerpt || '');
      setContent(savedData.content || '');
      setCoverImageUrl(savedData.coverImageUrl || '');
      setCategoryId(savedData.categoryId || '');
      setSelectedTags(savedData.selectedTags || []);
      setStatus(savedData.status || 'draft');
      setPublishedAt(savedData.publishedAt || '');
      addNotification('success', 'Draft recovered successfully');
    }
    setShowRecoveryBanner(false);
  };

  const handleDismissRecovery = () => {
    clearSavedData();
    setShowRecoveryBanner(false);
  };

  // Track changes
  useEffect(() => {
    if (!loading) {
      setHasChanges(true);
    }
  }, [title, slug, excerpt, content, coverImageUrl, categoryId, selectedTags, status, publishedAt, loading]);

  // Auto-generate slug from title
  useEffect(() => {
    if (autoSlug && title) {
      setSlug(generateSlug(title));
    }
  }, [title, autoSlug]);

  const fetchPostData = React.useCallback(async () => {
    try {
      setLoading(true);

      // Fetch categories, tags, and post data in parallel
      const [categoriesRes, tagsRes, postRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name'),
        supabase
          .from('posts')
          .select(`
            *,
            post_tags(tag_id)
          `)
          .eq('id', id)
          .single()
      ]);

      if (categoriesRes.error) throw categoriesRes.error;
      if (tagsRes.error) throw tagsRes.error;
      if (postRes.error) throw postRes.error;

      // Set categories and tags
      setCategories(categoriesRes.data || []);
      setTags(tagsRes.data || []);

      // Set post data
      if (postRes.data) {
        const post = postRes.data;
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || '');
        setContent(post.content);
        setCoverImageUrl(post.cover_image_url || '');
        setCategoryId(post.category_id || '');
        setStatus(post.status);
        setPublishedAt(
          post.published_at 
            ? new Date(post.published_at).toISOString().slice(0, 16) 
            : ''
        );
        setCreatedAt(post.created_at);
        setViewCount(post.view_count || 0);
        setSelectedTags(post.post_tags?.map((pt: any) => pt.tag_id) || []);
        setAutoSlug(false); // Disable auto-slug for existing posts
        setHasChanges(false);
      }
    } catch (error: any) {
      console.error('Error fetching post:', error);
      addNotification('error', error.message || 'Failed to load post');
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  }, [id, addNotification, navigate]);

  // Load post data on mount
  useEffect(() => {
    if (id) {
      fetchPostData();
    }
  }, [id, fetchPostData]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation
    if (!title.trim()) {
      addNotification('error', 'Title is required');
      return;
    }

    if (!content.trim()) {
      addNotification('error', 'Content is required');
      return;
    }

    if (!categoryId) {
      addNotification('error', 'Please select a category');
      return;
    }

    setSubmitting(true);

    try {
      const readTime = estimateReadTime(content);
      
      // Prepare post data
      const postData: any = {
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        cover_image_url: coverImageUrl.trim() || null,
        category_id: categoryId,
        status,
        estimated_read_time: readTime,
      };

      // Handle publish date
      if (status === 'published') {
        postData.published_at = publishedAt || new Date().toISOString();
      } else if (status === 'scheduled' && publishedAt) {
        postData.published_at = publishedAt;
      } else {
        postData.published_at = null;
      }

      // Update post
      const { error: postError } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id);

      if (postError) throw postError;

      // Update tags - delete existing and insert new ones
      await supabase.from('post_tags').delete().eq('post_id', id);

      if (selectedTags.length > 0) {
        const postTags = selectedTags.map(tagId => ({
          post_id: id,
          tag_id: tagId
        }));

        const { error: tagsError } = await supabase
          .from('post_tags')
          .insert(postTags);

        if (tagsError) throw tagsError;
      }

      addNotification('success', 'Post updated successfully');
      setHasChanges(false);
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error updating post:', error);
      addNotification('error', error.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      addNotification('success', 'Post deleted successfully');
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      addNotification('error', error.message || 'Failed to delete post');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmed) return;
    }
    navigate('/admin/posts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Progress sections
  const sections = [
    { id: 'title', label: 'Title', icon: Type, complete: !!title },
    { id: 'content', label: 'Content', icon: AlignLeft, complete: !!content },
    { id: 'meta', label: 'Metadata', icon: Layers, complete: !!categoryId },
    { id: 'publish', label: 'Publish', icon: Check, complete: false },
  ];

  // Content stats
  const wordCount = content.split(/\s+/).filter(w => w.trim()).length;
  const readTime = estimateReadTime(content);
  const charCount = content.length;

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      {/* Fixed Top Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 z-50">
        <div className="max-w-[1800px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={handleCancel}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Back to posts"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 font-montserrat-alt">
                  Edit Post
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-elms">
                  <span className={`inline-flex items-center gap-1 ${
                    status === 'published' ? 'text-primary' : 
                    status === 'draft' ? 'text-gray-600' : 'text-blue-600'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current"></span>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(createdAt)}
                  </span>
                  {hasChanges && (
                    <>
                      <span>•</span>
                      <span className="text-orange-600 font-bold">Unsaved changes</span>
                    </>
                  )}
                  {lastSaved && !hasChanges && (
                    <>
                      <span>•</span>
                      <span className="text-green-600 font-medium">
                        {isSaving ? 'Saving...' : `Auto-saved ${formatAutoSaveTime(lastSaved)}`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-3">
              {status === 'published' && slug && (
                <a
                  href={`/blog/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-full font-elms font-bold text-sm transition-colors"
                >
                  <Eye className="w-4 h-4" strokeWidth={2.5} />
                  Preview
                </a>
              )}
              <button
                type="button"
                onClick={() => setDeleteModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 text-red-600 hover:bg-red-50 rounded-full font-elms font-bold text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                Delete
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-full font-elms font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={submitting || !hasChanges}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full font-elms font-black text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" strokeWidth={2.5} />
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Recovery Banner */}
      {showRecoveryBanner && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-xl w-full mx-4">
          <div className="bg-blue-50 border-2 border-blue-200 p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-bold text-blue-900">Recovered draft found</p>
              <p className="text-xs text-blue-700">Would you like to restore your unsaved changes?</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDismissRecovery}
                className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleRecoverData}
                className="px-3 py-1.5 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 pb-32">
        <div className="max-w-[1800px] mx-auto px-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Progress Navigation */}
            <aside className="col-span-2" aria-label="Section navigation">
              <nav className="sticky top-32 space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      });
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                      activeSection === section.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-white'
                    }`}
                    aria-current={activeSection === section.id ? 'true' : 'false'}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      section.complete
                        ? 'bg-primary'
                        : activeSection === section.id
                        ? 'bg-white/20'
                        : 'bg-gray-100'
                    }`}>
                      {section.complete ? (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      ) : (
                        <section.icon className={`w-4 h-4 ${
                          activeSection === section.id ? 'text-white' : 'text-gray-600'
                        }`} strokeWidth={2.5} />
                      )}
                    </div>
                    <span className="text-sm font-bold font-elms">{section.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Center - Main Editor */}
            <article className="col-span-7">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Title Section */}
                <section id="title" className="bg-white rounded-[40px] p-12 border-2 border-gray-200">
                  <header className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                      <Type className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 font-montserrat-alt">
                        Post Title
                      </h2>
                      <p className="text-sm text-gray-500 font-elms">
                        Give your post a compelling title
                      </p>
                    </div>
                  </header>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your post title..."
                    required
                    aria-label="Post title"
                    className="w-full text-5xl font-black text-gray-900 placeholder-gray-300 bg-transparent border-0 focus:outline-none font-montserrat-alt leading-tight"
                  />
                </section>

                {/* Slug */}
                <section className="bg-white rounded-[40px] p-8 border-2 border-gray-200">
                  <header className="flex items-center gap-3 mb-4">
                    <Link2 className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    <h3 className="text-sm font-black text-gray-700 font-elms uppercase tracking-wider">
                      URL Slug
                    </h3>
                  </header>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-elms text-sm">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        setAutoSlug(false);
                      }}
                      placeholder="auto-generated-slug"
                      aria-label="URL slug"
                      className="flex-1 text-gray-900 bg-transparent border-0 focus:outline-none font-elms font-bold text-lg"
                    />
                  </div>
                </section>

                {/* Excerpt */}
                <section className="bg-white rounded-[40px] p-8 border-2 border-gray-200">
                  <header className="flex items-center gap-3 mb-4">
                    <AlignLeft className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
                    <h3 className="text-sm font-black text-gray-700 font-elms uppercase tracking-wider">
                      Excerpt
                    </h3>
                  </header>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Write a brief summary..."
                    rows={3}
                    aria-label="Post excerpt"
                    className="w-full text-gray-700 bg-transparent border-0 focus:outline-none font-elms text-lg resize-none"
                  />
                </section>

                {/* Cover Image */}
                <ImageUpload
                  value={coverImageUrl}
                  onChange={setCoverImageUrl}
                  label="Cover Image"
                />

                {/* Content Editor - Modern Enhanced Version */}
                <section id="content" className="bg-white rounded-[40px] p-8 border-2 border-gray-200 shadow-sm">
                  {/* Header with Mode Toggle */}
                  <header className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                        <AlignLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 font-montserrat-alt">
                          Content Editor
                        </h3>
                        <p className="text-xs text-gray-500 font-elms">
                          {editorMode === 'visual' ? 'Rich text editing with formatting' : 'Raw HTML editing mode'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Editor Mode Toggle */}
                    <div className="flex gap-2 bg-gray-100 p-1.5 rounded-xl shadow-inner">
                      <button
                        type="button"
                        onClick={() => setEditorMode('visual')}
                        className={`px-5 py-2.5 rounded-lg text-xs font-black font-elms transition-all ${
                          editorMode === 'visual'
                            ? 'bg-white text-primary shadow-md scale-105'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        aria-pressed={editorMode === 'visual'}
                      >
                        <span className="flex items-center gap-2">
                          <Type className="w-3.5 h-3.5" strokeWidth={2.5} />
                          Visual
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorMode('html')}
                        className={`px-5 py-2.5 rounded-lg text-xs font-black font-elms transition-all ${
                          editorMode === 'html'
                            ? 'bg-white text-primary shadow-md scale-105'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        aria-pressed={editorMode === 'html'}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono">&lt;/&gt;</span>
                          HTML
                        </span>
                      </button>
                    </div>
                  </header>

                  {/* Editor Content */}
                  <div className="relative">
                    {editorMode === 'visual' ? (
                      <div className="border-2 border-gray-200 rounded-3xl overflow-hidden bg-white hover:border-primary/30 transition-colors">
                        <RichTextEditor content={content} onChange={setContent} />
                      </div>
                    ) : (
                      <div className="relative border-2 border-gray-200 rounded-3xl overflow-hidden bg-gray-50 hover:border-primary/30 transition-colors">
                        {/* HTML Editor Header */}
                        <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span className="text-xs font-mono text-gray-400 font-bold">
                              index.html
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                            <span>Lines: {content.split('\n').length}</span>
                            <span>•</span>
                            <span>UTF-8</span>
                          </div>
                        </div>
                        
                        {/* HTML Textarea */}
                        <div className="relative">
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="<!-- Start writing your HTML content here -->\n<p>Your content goes here...</p>"
                            className="w-full h-[600px] p-6 font-mono text-sm text-gray-900 bg-gray-50 focus:outline-none focus:bg-white transition-colors resize-none leading-relaxed"
                            spellCheck={false}
                            aria-label="HTML content editor"
                            style={{ 
                              tabSize: 2,
                              lineHeight: '1.6'
                            }}
                          />
                          
                          {/* Character Counter */}
                          {content && (
                            <div className="absolute bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
                              {content.length} chars
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Tips */}
                  {!content && (
                    <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlignLeft className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-blue-900 font-elms mb-1">
                            Writing Tips
                          </h4>
                          <ul className="text-xs text-blue-700 font-elms space-y-1">
                            <li>• Use headings to structure your content</li>
                            <li>• Add images to make your post more engaging</li>
                            <li>• Keep paragraphs short and scannable</li>
                            <li>• Switch to HTML mode for advanced formatting</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              </form>
            </article>

            {/* Right Sidebar - Metadata */}
            <aside className="col-span-3" aria-label="Post metadata">
              <div id="meta" className="sticky top-32 space-y-6">
                {/* Status */}
                <section id="publish" className="bg-white rounded-[32px] p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-black text-gray-900 mb-4 font-montserrat-alt">
                    Status
                  </h3>
                  <div className="space-y-2" role="radiogroup" aria-label="Post status">
                    {[
                      { value: 'draft', label: 'Draft' },
                      { value: 'published', label: 'Published' },
                      { value: 'scheduled', label: 'Scheduled' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setStatus(option.value as any)}
                        role="radio"
                        aria-checked={status === option.value}
                        className={`w-full px-4 py-3 rounded-2xl font-elms font-bold text-sm transition-all ${
                          status === option.value
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Publish Date */}
                {(status === 'published' || status === 'scheduled') && (
                  <section className="bg-white rounded-[32px] p-6 border-2 border-gray-200">
                    <header className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                      <h3 className="text-sm font-black text-gray-700 font-elms uppercase tracking-wider">
                        Publish Date
                      </h3>
                    </header>
                    <input
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(e) => setPublishedAt(e.target.value)}
                      aria-label="Publish date and time"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-elms font-medium focus:outline-none focus:border-primary transition-colors"
                    />
                  </section>
                )}

                {/* Category */}
                <section className="bg-white rounded-[32px] p-6 border-2 border-gray-200">
                  <header className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    <h3 className="text-sm font-black text-gray-700 font-elms uppercase tracking-wider">
                      Category
                    </h3>
                  </header>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    aria-label="Post category"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-elms font-bold focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </section>

                {/* Tags */}
                <section className="bg-white rounded-[32px] p-6 border-2 border-gray-200">
                  <header className="flex items-center gap-2 mb-4">
                    <Hash className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    <h3 className="text-sm font-black text-gray-700 font-elms uppercase tracking-wider">
                      Tags
                    </h3>
                  </header>
                  <div className="flex flex-wrap gap-2" role="group" aria-label="Post tags">
                    {tags.map(tag => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleTagToggle(tag.id)}
                        aria-pressed={selectedTags.includes(tag.id)}
                        className={`px-3 py-2 rounded-xl font-elms font-bold text-xs transition-all ${
                          selectedTags.includes(tag.id)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Quick Stats */}
                <section className="bg-gradient-to-br from-primary to-primary/80 rounded-[32px] p-6 text-white">
                  <h3 className="text-sm font-black mb-4 font-elms uppercase tracking-wider opacity-80">
                    Quick Stats
                  </h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-elms opacity-80">Words</dt>
                      <dd className="text-2xl font-black font-montserrat-alt">{wordCount}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-elms opacity-80">Read Time</dt>
                      <dd className="text-2xl font-black font-montserrat-alt">{readTime} min</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-elms opacity-80">Characters</dt>
                      <dd className="text-2xl font-black font-montserrat-alt">{charCount}</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-elms opacity-80">Views</dt>
                      <dd className="text-2xl font-black font-montserrat-alt">{viewCount}</dd>
                    </div>
                  </dl>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setDeleteModal(false)}
            role="presentation"
            aria-hidden="true"
          />
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="delete-modal-title"
          >
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 border-2 border-gray-200">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-600" strokeWidth={2.5} />
              </div>
              <h3 
                id="delete-modal-title" 
                className="text-3xl font-black text-gray-900 mb-3 text-center font-montserrat-alt"
              >
                Delete Post?
              </h3>
              <p className="text-gray-600 mb-8 text-center font-elms">
                Are you sure you want to delete "{title}"? This action cannot be undone and all associated data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(false)}
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
    </div>
  );
};
