import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Tag } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { generateSlug } from '../../lib/utils';

export const TagsList: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; tag: Tag | null }>({ isOpen: false, tag: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tag: Tag | null }>({ isOpen: false, tag: null });
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addNotification } = useNotificationStore();

  const fetchTags = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
      addNotification('error', 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    if (name && !editModal.tag) {
      setSlug(generateSlug(name));
    }
  }, [name, editModal.tag]);

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setEditModal({ isOpen: true, tag: null });
  };

  const openEditModal = (tag: Tag) => {
    setName(tag.name);
    setSlug(tag.slug);
    setEditModal({ isOpen: true, tag });
  };

  const handleSubmit = async () => {
    if (!name || !slug) {
      addNotification('error', 'Name and slug are required');
      return;
    }

    setSubmitting(true);

    try {
      const tagData = { name, slug };

      if (editModal.tag) {
        const { error } = await supabase
          .from('tags')
          .update(tagData)
          .eq('id', editModal.tag.id);
        if (error) throw error;
        addNotification('success', 'Tag updated');
      } else {
        const { error } = await supabase
          .from('tags')
          .insert([tagData]);
        if (error) throw error;
        addNotification('success', 'Tag created');
      }

      setEditModal({ isOpen: false, tag: null });
      fetchTags();
    } catch (error: any) {
      console.error('Error saving tag:', error);
      addNotification('error', error.message || 'Failed to save tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.tag) return;

    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', deleteModal.tag.id);

      if (error) throw error;

      addNotification('success', 'Tag deleted');
      setDeleteModal({ isOpen: false, tag: null });
      fetchTags();
    } catch (error) {
      console.error('Error deleting tag:', error);
      addNotification('error', 'Failed to delete tag');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tags</h1>
          <p className="text-sm text-gray-600">Label and categorize your posts</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Create tag
        </button>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {tags.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500 mb-4">No tags yet. Create your first tag to get started.</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create tag
            </button>
          </div>
        ) : (
          tags.map((tag) => (
            <div 
              key={tag.id} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">{tag.name}</h3>
                <code className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded truncate block">
                  {tag.slug}
                </code>
              </div>
              <div className="flex gap-1.5 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(tag)}
                  className="flex-1 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, tag })}
                  className="flex-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {editModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setEditModal({ isOpen: false, tag: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editModal.tag ? 'Edit tag' : 'Create tag'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="JavaScript"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="javascript"
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setEditModal({ isOpen: false, tag: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editModal.tag ? 'Update' : 'Create'}
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
            onClick={() => setDeleteModal({ isOpen: false, tag: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete tag</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{deleteModal.tag?.name}</strong>"?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, tag: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete tag
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
