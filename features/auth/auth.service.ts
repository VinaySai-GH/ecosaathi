import { apiFetch } from '../../shared/api/client';
import type { User } from '../../shared/types';

export interface AuthResponse {
    _id: string;
    name: string;
    phone: string;
    password: string;
    points: number;
    token: string;
}

export const loginUser = async (phone: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ phone, password }),
    });
};

export const registerUser = async (name: string, phone: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        requireAuth: false,
        body: JSON.stringify({ name, phone, password }),
    });
};
