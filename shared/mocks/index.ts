// Shared mock data for local development
// Feature-specific mocks live in feature.mock.ts files

import type { User } from '../types';

export const MOCK_USER: User = {
    _id: 'mock-user-001',
    name: 'Vinay Sai',
    phone: '9999999999',
    hostel: 'Nilgiri',
    points: 0,
    createdAt: new Date().toISOString(),
};

export const MOCK_TOKEN = 'mock-jwt-token-for-dev';
