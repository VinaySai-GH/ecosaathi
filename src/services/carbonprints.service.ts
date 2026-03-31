import { apiFetch } from '../api/client';
import { CarbonFormState, CarbonCalculationResult, CarbonLog } from '../pages/carbonprints/carbonprints.types';
import { mockCalculationResult, mockCarbonLogs } from '../pages/carbonprints/carbonprints.mock';

const USE_MOCK = false; // Disabled mock to hit live backend

export async function saveCarbonLog(logData: CarbonFormState & { month: number, year: number }): Promise<CarbonCalculationResult> {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(mockCalculationResult), 800));
    }
    const response = await apiFetch('/carbon/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    });
    return response as CarbonCalculationResult;
}

export async function calculateCarbonLogPreview(logData: CarbonFormState & { month: number, year: number }): Promise<CarbonCalculationResult> {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(mockCalculationResult), 800));
    }
    const response = await apiFetch('/carbon/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
    });
    return response as CarbonCalculationResult;
}

export async function getCarbonHistory(): Promise<{ logs: CarbonLog[] }> {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve({ logs: mockCarbonLogs }), 500));
    }
    const response = await apiFetch('/carbon/history');
    return response as { logs: CarbonLog[] };
}
