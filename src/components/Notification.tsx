import React from 'react';
import { useNotificationStore } from '../store/notificationStore';

export const Notification: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const bgColor = {
          success: 'bg-green-500',
          error: 'bg-red-500',
          info: 'bg-blue-500',
        }[notification.type];
        
        return (
          <div
            key={notification.id}
            className={`${bgColor} text-white px-6 py-4 rounded-card shadow-lg flex items-center justify-between min-w-[300px] animate-slide-in`}
          >
            <span className="font-sf-pro">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
};
