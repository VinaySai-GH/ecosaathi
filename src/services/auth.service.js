import { apiFetch } from '../api/client.js';

export const loginUser = async (phone, password) =>
    apiFetch('/auth/login', { method: 'POST', requireAuth: false, body: JSON.stringify({ phone, password }) });

export const registerUser = async (name, phone, password, city) =>
    apiFetch('/auth/register', { method: 'POST', requireAuth: false, body: JSON.stringify({ name, phone, password, city }) });

export const updateProfile = async (name, password, city, bio) =>
    apiFetch('/auth/profile', { method: 'PUT', requireAuth: true, body: JSON.stringify({ name, password, city, bio }) });

export const getCities = async () =>
    apiFetch('/auth/cities', { method: 'GET', requireAuth: false });

export const getProfileStats = async () =>
    apiFetch('/auth/stats', { method: 'GET', requireAuth: true });
