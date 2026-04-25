import React, { useState, useEffect } from 'react';
import { fetchNotifications, markNotificationsAsRead } from '../../api/notificationApi';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import './notifications.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { notifications } = await fetchNotifications();
        setNotifications(notifications);
        // Mark as read after a short delay
        if (notifications.some(n => !n.read)) {
          setTimeout(markNotificationsAsRead, 2000);
        }
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <p>Stay updated with your eco-impact and civic reports</p>
      </div>

      {loading ? (
        <div className="notifications-loading">Loading alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="notifications-empty">
          <span className="empty-icon">📭</span>
          <h3>No notifications yet</h3>
          <p>We'll notify you when there's something important.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <AnimatedCard key={notif._id} delay={index * 0.05}>
              <div className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                <div className="notification-content">
                  <p className="notification-message">{notif.message}</p>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                {notif.link && (
                  <a 
                    href={notif.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="notification-link-btn"
                  >
                    View Link
                  </a>
                )}
              </div>
            </AnimatedCard>
          ))}
        </div>
      )}
    </div>
  );
}
