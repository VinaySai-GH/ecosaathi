import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUnreadCount } from '../api/notificationApi';
import './NotificationBell.css';

export default function NotificationBell({ onClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const { count } = await fetchUnreadCount();
        setUnreadCount(count);
      } catch (err) {
        console.warn('[Notifications] Could not fetch unread count');
      }
    };

    loadCount();
    // Poll every minute for new notifications
    const interval = setInterval(loadCount, 60000);

    const handleRead = () => setUnreadCount(0);
    document.addEventListener('notificationsRead', handleRead);

    return () => {
      clearInterval(interval);
      document.removeEventListener('notificationsRead', handleRead);
    };
  }, []);

  return (
    <div 
      className="notification-bell-container" 
      onClick={onClick}
      title="Notifications"
    >
      <span className="bell-icon">🔔</span>
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
}
