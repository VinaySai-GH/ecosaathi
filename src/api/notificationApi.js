import { apiFetch } from './client';

export const fetchNotifications = async () => {
  return apiFetch('/notifications', { requireAuth: true });
};

export const fetchUnreadCount = async () => {
  return apiFetch('/notifications/unread-count', { requireAuth: true });
};

export const markNotificationsAsRead = async () => {
  return apiFetch('/notifications/read', {
    method: 'PUT',
    requireAuth: true,
  });
};
