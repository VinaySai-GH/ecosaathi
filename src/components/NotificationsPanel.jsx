import React, { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsAsRead } from '../api/notificationApi';
import AnimatedCard from './animations/AnimatedCard.jsx';
import './NotificationsPanel.css';

export default function NotificationsPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const { notifications } = await fetchNotifications();
        setNotifications(notifications);
        // Mark as read after a short delay
        if (notifications.some(n => !n.read)) {
          setTimeout(async () => {
            await markNotificationsAsRead();
            document.dispatchEvent(new Event('notificationsRead'));
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen]);

  return (
    <div className={`notifications-panel ${isOpen ? 'open' : ''}`}>
      <div className="np-header">
        <h2>Notifications</h2>
        <button className="np-close-btn" onClick={onClose} aria-label="Close notifications">✕</button>
      </div>

      <div className="np-body">
        {loading ? (
          <div className="np-loading">Loading alerts...</div>
        ) : notifications.length === 0 ? (
          <div className="np-empty">
            <span className="np-empty-icon">📭</span>
            <p>No new notifications</p>
          </div>
        ) : (
          <div className="np-list">
            {notifications.map((notif, index) => (
              <AnimatedCard key={notif._id} delay={index * 0.05}>
                <div className={`np-item ${notif.read ? 'read' : 'unread'}`}>
                  <p className="np-message">{notif.message}</p>
                  <div className="np-meta">
                    <span className="np-time">
                      {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    {notif.link && (
                      <a href={notif.link} target="_blank" rel="noopener noreferrer" className="np-link">
                        View
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
