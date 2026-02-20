import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Comment } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDate } from '../../lib/utils';

type CommentWithPost = Comment & { post?: { title: string; slug: string } };

export const CommentsList: React.FC = () => {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; comment: CommentWithPost | null }>({ isOpen: false, comment: null });

  const { addNotification } = useNotificationStore();

  const fetchComments = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          post:posts(title, slug)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      addNotification('error', 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleDelete = async () => {
    if (!deleteModal.comment) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', deleteModal.comment.id);

      if (error) throw error;

      addNotification('success', 'Comment deleted');
      setDeleteModal({ isOpen: false, comment: null });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      addNotification('error', 'Failed to delete comment');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Comments</h1>
        <p className="text-sm text-gray-600">Manage user comments on your posts</p>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">No comments yet.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{comment.name}</h3>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{comment.email}</span>
                  </div>
                  {comment.post && (
                    <a
                      href={`/blog/${comment.post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-600 hover:text-primary transition-colors"
                    >
                      On: {comment.post.title}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, comment })}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setDeleteModal({ isOpen: false, comment: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete comment</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this comment from <strong>{deleteModal.comment?.name}</strong>?
              </p>
              {deleteModal.comment && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                  <p className="text-sm text-gray-700 italic">
                    "{deleteModal.comment.content}"
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, comment: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete comment
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
