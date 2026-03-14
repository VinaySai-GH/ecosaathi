import { apiFetch } from '../api/client.js';

export const loginUser = async (phone, password) =>
    apiFetch('/auth/login', { method: 'POST', requireAuth: false, body: JSON.stringify({ phone, password }) });

export const registerUser = async (name, phone, password) =>
    apiFetch('/auth/register', { method: 'POST', requireAuth: false, body: JSON.stringify({ name, phone, password }) });
