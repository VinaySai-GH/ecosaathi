import { API_BASE_URL } from '../constants/index.js';

/**
 * Shared API client — attaches JWT from localStorage to authenticated requests.
 */
export async function apiFetch(endpoint, options = {}) {
    const { requireAuth = true, headers, ...customOptions } = options;

    const requestHeaders = new Headers(headers);
    requestHeaders.set('Content-Type', 'application/json');

    if (requireAuth) {
        const storedUser = localStorage.getItem('@auth_user');
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            requestHeaders.set('Authorization', `Bearer ${token}`);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...customOptions,
        headers: requestHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.error || 'API Request failed');
        error.data = data;
        error.status = response.status;
        throw error;
    }

    return data;
}
