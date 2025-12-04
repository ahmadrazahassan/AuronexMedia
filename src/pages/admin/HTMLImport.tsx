import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Category, Tag } from '../../types';
import { useNotificationStore } from '../../store/notificationStore';
import { useAuthStore } from '../../store/authStore';
import { generateSlug } from '../../lib/utils';
import { parseHTMLFile, ParsedArticle } from '../../lib/htmlParser';
import { ArrowLeft } from 'lucide-react';

export const HTMLImport: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState<ParsedArticle | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [publishing, setPublishing] = useState(false);

  // Editable fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');

  const [previewMode, setPreviewMode] = useState<'visual' | 'html'>('visual');

  React.useEffect(() => {
    fetchCategoriesAndTags();
  }, []);

  const fetchCategoriesAndTags = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('tags').select('*').order('name'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (tagsRes.data) setTags(tagsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileSelect = useCallback(
    async (selectedFile: File) => {
      if (!selectedFile.name.endsWith('.html') && !selectedFile.name.endsWith('.htm')) {
        addNotification('error', 'Please select an HTML file');
        return;
      }
      setParsing(true);

      try {
        const htmlContent = await selectedFile.text();
        const parsedData = parseHTMLFile(htmlContent);

        setParsed(parsedData);
        setTitle(parsedData.title);
        setSlug(generateSlug(parsedData.title));
        setExcerpt(parsedData.excerpt);
        setContent(parsedData.content);

        // Set cover image if available
        if (parsedData.images.length > 0) {
          setCoverImageUrl(parsedData.images[0]);
        }

        // Auto-select category
        const matchedCategory = categories.find(
          cat => cat.slug === parsedData.suggestedCategory
        );
        if (matchedCategory) {
          setCategoryId(matchedCategory.id);
        }

        // Auto-select tags
        const matchedTags = tags
          .filter(tag => parsedData.suggestedTags.includes(tag.slug))
          .map(tag => tag.id);
        setSelectedTags(matchedTags);

        addNotification('success', 'HTML parsed successfully! Review and publish.');
      } catch (error: any) {
        console.error('Error parsing HTML:', error);
        addNotification('error', 'Failed to parse HTML file');
      } finally {
        setParsing(false);
      }
    },
    [categories, tags, addNotification]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handlePublish = async () => {
    if (!title || !content || !categoryId) {
      addNotification('error', 'Please fill in all required fields');
      return;
    }

    if (!user) {
      addNotification('error', 'You must be logged in');
      return;
    }

    setPublishing(true);

    try {
      const postData: any = {
        title,
        slug,
        excerpt,
        content,
        cover_image_url: coverImageUrl || null,
        category_id: categoryId,
        author_id: user.id,
        status,
        estimated_read_time: parsed?.estimatedReadTime || 5,
      };

      if (status === 'published') {
        postData.published_at = new Date().toISOString();
      }

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

      if (postError) throw postError;

      if (selectedTags.length > 0) {
        const postTags = selectedTags.map(tagId => ({
          post_id: post.id,
          tag_id: tagId,
        }));

        const { error: tagsError } = await supabase.from('post_tags').insert(postTags);

        if (tagsError) throw tagsError;
      }

      addNotification('success', `Article ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      navigate('/admin/posts');
    } catch (error: any) {
      console.error('Error publishing:', error);
      addNotification('error', error.message || 'Failed to publish article');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Fixed Top Bar - Modern Rounded */}
      <div className="fixed top-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200 z-50">
        <div className="max-w-[1800px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/admin/posts')}
                className="w-11 h-11 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-primary hover:to-primary text-white rounded-2xl transition-all flex items-center justify-center shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <div>
                <h1 className="text-2xl font-black text-dark font-montserrat tracking-tight">
                  HTML Import Studio
                </h1>
                <p className="text-xs font-semibold text-gray-500 font-sf-pro mt-0.5">
                  Transform HTML into beautiful articles
                </p>
              </div>
            </div>

            {parsed && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setParsed(null);
                    setTitle('');
                    setContent('');
                    setExcerpt('');
                    setCoverImageUrl('');
                    setCategoryId('');
                    setSelectedTags([]);
                  }}
                  className="px-6 py-2.5 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all font-sf-pro font-bold text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary to-green-600 text-white hover:shadow-lg transition-all font-sf-pro font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {publishing ? 'Publishing...' : status === 'published' ? 'Publish Article' : 'Save Draft'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 pb-32">
        <div className="max-w-[1400px] mx-auto px-8">
          {!parsed ? (
            // Upload Zone - Modern Rounded
            <div className="max-w-5xl mx-auto">
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="relative bg-white rounded-3xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-all text-center group cursor-pointer overflow-hidden shadow-sm hover:shadow-xl"
              >
                <input
                  type="file"
                  accept=".html,.htm"
                  multiple
                  onChange={e => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) handleFileSelect(selectedFile);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={parsing}
                />

                {/* Gradient Top Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-green-500 to-primary rounded-t-3xl"></div>

                {parsing ? (
                  <div className="p-32 space-y-10">
                    <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center relative animate-pulse shadow-2xl">
                      <div className="absolute inset-0 rounded-3xl border-4 border-white/30"></div>
                      <div className="text-white font-black text-5xl font-montserrat">AI</div>
                    </div>
                    <div>
                      <h3 className="text-5xl font-black text-dark font-montserrat mb-4 tracking-tight">
                        Processing HTML
                      </h3>
                      <p className="text-gray-500 font-sf-pro text-lg">
                        Extracting content, analyzing structure, and generating metadata
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-32 space-y-12">
                    <div className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 group-hover:from-primary group-hover:to-green-600 flex items-center justify-center transition-all shadow-xl group-hover:shadow-2xl group-hover:scale-105">
                      <div className="text-white font-black text-7xl font-montserrat">H</div>
                    </div>

                    <div>
                      <h3 className="text-6xl font-black text-dark font-montserrat mb-6 tracking-tight leading-none">
                        Drop HTML Files
                      </h3>
                      <p className="text-gray-500 font-sf-pro text-xl mb-4">
                        or click to browse your computer
                      </p>
                      <p className="text-gray-400 font-sf-pro text-sm">
                        Supports .html and .htm • Multiple files supported
                      </p>
                    </div>

                    {/* Features Grid - Modern Cards */}
                    <div className="grid grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
                      {[
                        { num: '01', label: 'Smart Extraction', desc: 'Intelligent content parsing' },
                        { num: '02', label: 'Auto Categorization', desc: 'AI-powered classification' },
                        { num: '03', label: 'Instant Publishing', desc: 'One-click workflow' },
                      ].map((feature, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all">
                          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center mb-4 shadow-md">
                            <span className="text-white font-black text-xl font-montserrat">{feature.num}</span>
                          </div>
                          <div className="text-sm font-black text-dark font-sf-pro mb-2">
                            {feature.label}
                          </div>
                          <div className="text-xs text-gray-500 font-sf-pro">{feature.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gradient Bottom Bar */}
                <div className="h-1.5 bg-gradient-to-r from-primary via-green-500 to-primary rounded-b-3xl"></div>
              </div>

              {/* Info Cards - Modern Rounded */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-black text-lg font-montserrat">i</span>
                    </div>
                    <h4 className="text-2xl font-black text-dark font-montserrat pt-2">
                      Extraction Scope
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-700 font-sf-pro space-y-3 pl-4">
                    {[
                      'Article title and headings',
                      'Main content (cleaned & formatted)',
                      'Images and media assets',
                      'Meta descriptions & author data',
                      'Suggested category & tags'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 p-10 shadow-sm hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white font-black text-lg font-montserrat">AI</span>
                    </div>
                    <h4 className="text-2xl font-black text-dark font-montserrat pt-2">
                      Intelligent Features
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-700 font-sf-pro space-y-3 pl-4">
                    {[
                      'Smart content cleaning algorithm',
                      'Automatic category detection',
                      'Intelligent tag recommendations',
                      'SEO-optimized excerpt generation',
                      'Automatic read time calculation'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Preview & Edit Zone
            <div className="grid grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="col-span-8 space-y-8">
                {/* Success Banner */}
                <div className="bg-white border-4 border-primary relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-2 bg-noise-dark"></div>
                  
                  <div className="p-10 flex items-center gap-8">
                    <div className="w-20 h-20 bg-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-12 h-12 border-4 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-black text-dark font-montserrat mb-2 tracking-tight">
                        EXTRACTION COMPLETE
                      </h3>
                      <div className="flex items-center gap-6 text-sm font-sf-pro text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary"></div>
                          <span className="font-bold uppercase tracking-wider">{parsed!.wordCount} Words</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-noise-dark"></div>
                          <span className="font-bold uppercase tracking-wider">{parsed!.estimatedReadTime} Min Read</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary"></div>
                          <span className="font-bold uppercase tracking-wider">{parsed!.images.length} Images</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-black text-primary font-montserrat leading-none">
                        {Math.round((Math.min(parsed!.wordCount, 2000) / 2000) * 100)}
                      </div>
                      <div className="text-xs text-gray-600 font-sf-pro uppercase tracking-wider mt-1">Quality Index</div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="bg-white border-4 border-dark p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-noise-dark flex items-center justify-center">
                      <span className="text-white font-black text-sm font-montserrat">T</span>
                    </div>
                    <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                      Article Title
                    </label>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full text-5xl font-black text-dark placeholder-gray-300 bg-transparent border-0 focus:outline-none font-montserrat leading-tight tracking-tight"
                    placeholder="Enter title..."
                  />
                </div>

                {/* Slug */}
                <div className="bg-white border-4 border-dark p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center">
                      <span className="text-white font-black text-xs font-montserrat">URL</span>
                    </div>
                    <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                      Permalink
                    </label>
                  </div>
                  <div className="flex items-center gap-2 border-l-2 border-primary pl-4">
                    <span className="text-gray-400 font-sf-pro text-sm font-bold">/blog/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={e => setSlug(e.target.value)}
                      className="flex-1 text-gray-900 bg-transparent border-0 focus:outline-none font-sf-pro font-bold text-lg"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-white border-4 border-dark p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-noise-dark flex items-center justify-center">
                        <span className="text-white font-black text-xs font-montserrat">EX</span>
                      </div>
                      <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                        Excerpt
                      </label>
                    </div>
                    <span className="text-xs text-gray-500 font-sf-pro uppercase tracking-wider">AI Generated</span>
                  </div>
                  <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full text-gray-700 bg-transparent border-0 focus:outline-none font-sf-pro text-lg resize-none leading-relaxed"
                    placeholder="Brief summary..."
                  />
                </div>

                {/* Cover Image */}
                {coverImageUrl && (
                  <div className="bg-white border-4 border-dark p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary flex items-center justify-center">
                          <span className="text-white font-black text-xs font-montserrat">IMG</span>
                        </div>
                        <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                          Cover Image
                        </label>
                      </div>
                      <span className="text-xs text-gray-500 font-sf-pro uppercase tracking-wider">Auto-detected</span>
                    </div>
                    <div className="border-4 border-gray-200 overflow-hidden mb-4">
                      <img src={coverImageUrl} alt="Cover" className="w-full h-80 object-cover" />
                    </div>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={e => setCoverImageUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-dark focus:border-primary font-sf-pro font-medium focus:outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* Content Preview */}
                <div className="bg-white border-4 border-dark">
                  {/* Header */}
                  <div className="flex items-center justify-between p-8 border-b-2 border-dark">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-noise-dark flex items-center justify-center">
                        <span className="text-white font-black text-xs font-montserrat">C</span>
                      </div>
                      <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                        Article Content
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewMode('visual')}
                        className={`px-6 py-2 text-xs font-black font-sf-pro uppercase tracking-wider transition-all ${
                          previewMode === 'visual'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Visual
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewMode('html')}
                        className={`px-6 py-2 text-xs font-black font-sf-pro uppercase tracking-wider transition-all ${
                          previewMode === 'html'
                            ? 'bg-noise-dark text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        HTML
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8">
                    {previewMode === 'visual' ? (
                      <div
                        className="blog-content"
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    ) : (
                      <div className="bg-gray-50 border-2 border-dark">
                        <div className="bg-noise-dark px-4 py-2 flex items-center justify-between border-b-2 border-dark">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500"></div>
                            <div className="w-3 h-3 bg-yellow-500"></div>
                            <div className="w-3 h-3 bg-green-500"></div>
                          </div>
                          <span className="text-xs font-mono text-white font-bold">
                            article.html
                          </span>
                        </div>
                        <textarea
                          value={content}
                          onChange={e => setContent(e.target.value)}
                          className="w-full h-[600px] p-6 font-mono text-sm text-gray-900 bg-gray-50 focus:outline-none resize-none leading-relaxed"
                          spellCheck={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-4 space-y-8">
                {/* Status */}
                <div className="bg-white border-4 border-dark sticky top-32">
                  <div className="bg-noise-dark p-6 border-b-2 border-dark">
                    <h3 className="text-xl font-black text-white font-montserrat tracking-tight">
                      PUBLISH SETTINGS
                    </h3>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      {[
                        { value: 'draft', label: 'Save as Draft' },
                        { value: 'published', label: 'Publish Now' },
                      ].map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setStatus(option.value as any)}
                          className={`w-full px-6 py-4 font-sf-pro font-bold text-sm uppercase tracking-wider transition-all ${
                            status === option.value
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>

                    {/* Category */}
                    <div className="pt-6 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                          Category
                        </label>
                        <span className="text-xs text-gray-500 font-sf-pro uppercase tracking-wider">AI Suggested</span>
                      </div>
                      <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-dark focus:border-primary font-sf-pro font-bold focus:outline-none transition-colors"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                            {parsed!.suggestedCategory === cat.slug && ' ★'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="pt-6 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-black text-dark font-sf-pro uppercase tracking-[0.2em]">
                          Tags
                        </label>
                        <span className="text-xs text-gray-500 font-sf-pro uppercase tracking-wider">AI Suggested</span>
                      </div>
                      <div className="flex flex-wrap gap-2 max-h-80 overflow-y-auto">
                        {tags.map(tag => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() =>
                              setSelectedTags(prev =>
                                prev.includes(tag.id)
                                  ? prev.filter(id => id !== tag.id)
                                  : [...prev, tag.id]
                              )
                            }
                            className={`px-4 py-2 font-sf-pro font-bold text-xs uppercase tracking-wider transition-all ${
                              selectedTags.includes(tag.id)
                                ? 'bg-primary text-white'
                                : parsed!.suggestedTags.includes(tag.slug)
                                ? 'bg-white border-2 border-primary text-primary'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {tag.name}
                            {parsed!.suggestedTags.includes(tag.slug) && ' ★'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="pt-6 border-t-2 border-dark">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-600 font-sf-pro uppercase tracking-wider">Words</span>
                          <span className="text-2xl font-black text-dark font-montserrat">{parsed!.wordCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-600 font-sf-pro uppercase tracking-wider">Read Time</span>
                          <span className="text-2xl font-black text-dark font-montserrat">{parsed!.estimatedReadTime}m</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-gray-600 font-sf-pro uppercase tracking-wider">Images</span>
                          <span className="text-2xl font-black text-dark font-montserrat">{parsed!.images.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
