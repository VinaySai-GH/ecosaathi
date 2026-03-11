import { API_BASE_URL } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FetchOptions extends RequestInit {
    requireAuth?: boolean;
}

/**
 * A shared API client that automatically attaches the JWT token
 * to requests that require authentication.
 */
export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { requireAuth = true, headers, ...customOptions } = options;

    const requestHeaders = new Headers(headers as HeadersInit);
    requestHeaders.set('Content-Type', 'application/json');

    if (requireAuth) {
        const storedUser = await AsyncStorage.getItem('@auth_user');
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
        // Attach the full data object to the error so the UI can read `error.data.exists`
        const error: any = new Error(data.error || 'API Request failed');
        error.data = data;
        error.status = response.status;
        throw error;
    }

    return data as T;
}
