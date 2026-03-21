import { apiFetch } from '../api/client.js';

export const submitWaterLog = async (kl_used, month, year, city, overwrite = false) => {
    return apiFetch('/neeru/log', { method: 'POST', body: JSON.stringify({ kl_used, month, year, city, overwrite }) });
};

export const fetchWaterHistory = async () => {
    return apiFetch('/neeru/history');
};

export const getUserHistory = async () => {
    try {
        const response = await apiFetch('/neeru/history');
        return response?.logs || [];
    } catch (err) {
        console.error('Error fetching user history:', err);
        return [];
    }
};
