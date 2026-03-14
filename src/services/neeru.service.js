import { apiFetch } from '../api/client.js';

const USE_MOCK = false;
const MOCK_RESPONSE = {
    log: { _id: 'mock1', userId: 'u1', month: 3, year: 2026, city: 'Tirupati', kl_used: 10, createdAt: new Date().toISOString() },
    equivalencies: [],
};

export const submitWaterLog = async (kl_used, month, year, city, overwrite = false) => {
    if (USE_MOCK) return new Promise((r) => setTimeout(() => r(MOCK_RESPONSE), 800));
    return apiFetch('/neeru/log', { method: 'POST', body: JSON.stringify({ kl_used, month, year, city, overwrite }) });
};

export const fetchWaterHistory = async () => {
    if (USE_MOCK) return new Promise((r) => setTimeout(() => r({ logs: [] }), 500));
    return apiFetch('/neeru/history');
};
