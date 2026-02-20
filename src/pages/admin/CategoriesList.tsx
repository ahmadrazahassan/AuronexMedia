import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { generateSlug } from '../../lib/utils';
import { Folder, Plus, Edit3, Trash2, FileText } from 'lucide-react';

export const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; category: Category | null }>({ isOpen: false, category: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category: Category | null }>({ isOpen: false, category: null });
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addNotification } = useNotificationStore();

  const fetchCategories = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      const categoriesWithCounts = await Promise.all(
        (data || []).map(async (category) => {
          const { count } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);
          return { ...category, post_count: count || 0 };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      addNotification('error', 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (name && !editModal.category) {
      setSlug(generateSlug(name));
    }
  }, [name, editModal.category]);

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setEditModal({ isOpen: true, category: null });
  };

  const openEditModal = (category: Category) => {
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || '');
    setEditModal({ isOpen: true, category });
  };

  const handleSubmit = async () => {
    if (!name || !slug) {
      addNotification('error', 'Name and slug are required');
      return;
    }

    setSubmitting(true);

    try {
      const categoryData = { name, slug, description: description || null };

      if (editModal.category) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editModal.category.id);
        if (error) throw error;
        addNotification('success', 'Category updated');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);
        if (error) throw error;
        addNotification('success', 'Category created');
      }

      setEditModal({ isOpen: false, category: null });
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      addNotification('error', error.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.category) return;

    if ((deleteModal.category as any).post_count > 0) {
      addNotification('error', 'Cannot delete category with existing posts');
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deleteModal.category.id);

      if (error) throw error;

      addNotification('success', 'Category deleted');
      setDeleteModal({ isOpen: false, category: null });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      addNotification('error', 'Failed to delete category');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <div className="max-w-[1600px] mx-auto px-8 py-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 font-elms">Admin</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-900 font-elms font-semibold">Categories</span>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[80px] font-black text-gray-900 leading-none font-montserrat-alt tracking-tighter mb-4">
                Categories
              </h1>
              <p className="text-xl text-gray-600 font-elms max-w-2xl">
                Organize your content into meaningful categories
              </p>
            </div>
            
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-elms font-bold hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              New Category
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full bg-white rounded-[48px] p-16 text-center border-2 border-gray-200">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Folder className="w-12 h-12 text-gray-400" strokeWidth={2} />
              </div>
              <p className="text-gray-500 mb-8 font-elms text-xl">No categories yet. Create your first category.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-elms font-black rounded-2xl hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Category
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <div 
                key={category.id} 
                className="bg-white rounded-[32px] p-8 border-2 border-gray-200 hover:border-primary transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-7 h-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                    <FileText className="w-4 h-4 text-gray-600" strokeWidth={2.5} />
                    <span className="text-sm font-black text-gray-900 font-montserrat-alt">
                      {(category as any).post_count}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-2 font-montserrat-alt">
                  {category.name}
                </h3>
                <code className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl font-elms font-medium inline-block mb-4">
                  {category.slug}
                </code>
                
                {category.description && (
                  <p className="text-sm text-gray-600 mb-6 font-elms line-clamp-2">
                    {category.description}
                  </p>
                )}
                
                <div className="flex gap-2 pt-4 border-t-2 border-gray-100">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-elms font-bold hover:bg-gray-800 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, category })}
                    className="p-2.5 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {editModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setEditModal({ isOpen: false, category: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full p-8 border-2 border-gray-200">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Folder className="w-8 h-8 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-6 text-center font-montserrat-alt">
                {editModal.category ? 'Edit category' : 'Create category'}
              </h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 font-elms">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Technology"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-elms font-medium focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 font-elms">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="technology"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-elms font-medium focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 font-elms">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl font-elms font-medium focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setEditModal({ isOpen: false, category: null })}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-elms font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-2xl font-elms font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editModal.category ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, category: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 border-2 border-gray-200">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-red-600" strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3 text-center font-montserrat-alt">Delete category</h3>
              <p className="text-gray-600 mb-4 text-center font-elms">
                Are you sure you want to delete "<strong>{deleteModal.category?.name}</strong>"?
              </p>
              {(deleteModal.category as any)?.post_count > 0 && (
                <p className="text-sm text-red-600 mb-6 bg-red-50 p-4 rounded-2xl text-center font-elms font-medium">
                  This category has {(deleteModal.category as any).post_count} post(s) and cannot be deleted.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, category: null })}
                  className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-elms font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={(deleteModal.category as any)?.post_count > 0}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-2xl font-elms font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
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
