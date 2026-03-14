import { apiFetch } from '../api/client.js';

export async function saveCarbonLog(logData, overwrite = false) {
    // logData should contain { date, totalKgCO2, breakdown, formData, month, year }
    const response = await apiFetch(`/carbon/log${overwrite ? '?overwrite=true' : ''}`, {
        method: 'POST',
        body: JSON.stringify(logData)
    });
    return response;
}

export async function getCarbonHistory() {
    // History usually doesn't need userId explicitly if we use JWT in apiFetch
    const response = await apiFetch('/carbon/history');
    return response;
}
