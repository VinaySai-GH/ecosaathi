// Neeru mock — fake API responses for local dev / frontend-first build

import type { NeeruLogResponse, NeeruHistoryResponse } from './neeru.types';

export const MOCK_NEERU_LOG_RESPONSE: NeeruLogResponse = {
    log: {
        _id: 'mock-log-001',
        userId: 'mock-user-001',
        month: 3,
        year: 2026,
        city: 'Tirupati',
        kl_used: 8.5,
        createdAt: new Date().toISOString(),
    },
    equivalencies: [
        { label: 'Farming families supplied for a month', value: '0.7' },
        { label: 'Days of drinking water for one person', value: '2833' },
        { label: '% of an Olympic swimming pool', value: '0.34%' },
    ],
};

export const MOCK_NEERU_HISTORY: NeeruHistoryResponse = {
    logs: [
        { _id: 'log-5', userId: 'mock-user-001', month: 10, year: 2025, city: 'Tirupati', kl_used: 11.2, createdAt: '' },
        { _id: 'log-4', userId: 'mock-user-001', month: 11, year: 2025, city: 'Tirupati', kl_used: 10.5, createdAt: '' },
        { _id: 'log-3', userId: 'mock-user-001', month: 12, year: 2025, city: 'Tirupati', kl_used: 9.8, createdAt: '' },
        { _id: 'log-2', userId: 'mock-user-001', month: 1, year: 2026, city: 'Tirupati', kl_used: 9.1, createdAt: '' },
        { _id: 'log-1', userId: 'mock-user-001', month: 2, year: 2026, city: 'Tirupati', kl_used: 8.8, createdAt: '' },
        { _id: 'log-0', userId: 'mock-user-001', month: 3, year: 2026, city: 'Tirupati', kl_used: 8.5, createdAt: '' },
    ],
};
