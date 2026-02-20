import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ContactMessage } from '../../types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useNotificationStore } from '../../store/notificationStore';
import { formatDate } from '../../lib/utils';

export const ContactsList: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState<{ isOpen: boolean; message: ContactMessage | null }>({ isOpen: false, message: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; message: ContactMessage | null }>({ isOpen: false, message: null });
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { addNotification } = useNotificationStore();

  const fetchMessages = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      addNotification('error', 'Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const toggleReadStatus = async (message: ContactMessage) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: !message.is_read })
        .eq('id', message.id);

      if (error) throw error;

      addNotification('success', `Marked as ${!message.is_read ? 'read' : 'unread'}`);
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
      addNotification('error', 'Failed to update message');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.message) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', deleteModal.message.id);

      if (error) throw error;

      addNotification('success', 'Message deleted');
      setDeleteModal({ isOpen: false, message: null });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      addNotification('error', 'Failed to delete message');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.is_read;
    if (filter === 'read') return msg.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Messages</h1>
          <p className="text-sm text-gray-600">Contact form submissions from your visitors</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
            {unreadCount} unread
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All' },
          { value: 'unread', label: 'Unread' },
          { value: 'read', label: 'Read' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as any)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              filter === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-sm text-gray-500">
              {filter === 'all' ? 'No contact messages yet.' : `No ${filter} messages.`}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div 
              key={message.id} 
              className={`bg-white rounded-lg border p-5 hover:border-gray-300 hover:shadow-sm transition-all ${
                !message.is_read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{message.name}</h3>
                    {!message.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        New
                      </span>
                    )}
                  </div>
                  <a 
                    href={`mailto:${message.email}`} 
                    className="text-xs text-gray-600 hover:text-primary transition-colors"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{formatDate(message.created_at)}</span>
                  <button
                    onClick={() => setViewModal({ isOpen: true, message })}
                    className="text-sm text-gray-900 hover:text-primary transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleReadStatus(message)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {message.is_read ? 'Unread' : 'Read'}
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, message })}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100">
                <p className="text-sm text-gray-700 line-clamp-2">{message.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewModal.isOpen && viewModal.message && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setViewModal({ isOpen: false, message: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact message</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider">
                      From
                    </label>
                    <p className="text-sm text-gray-900 font-medium">{viewModal.message.name}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider">
                      Email
                    </label>
                    <a 
                      href={`mailto:${viewModal.message.email}`} 
                      className="text-sm text-gray-900 hover:text-primary transition-colors"
                    >
                      {viewModal.message.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wider">
                    Date
                  </label>
                  <p className="text-sm text-gray-600">{formatDate(viewModal.message.created_at)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
                    Message
                  </label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                      {viewModal.message.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setViewModal({ isOpen: false, message: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
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
            onClick={() => setDeleteModal({ isOpen: false, message: null })}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete message</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete the message from <strong>{deleteModal.message?.name}</strong>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, message: null })}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete message
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
