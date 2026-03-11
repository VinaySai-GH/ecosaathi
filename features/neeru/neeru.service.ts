import { apiFetch } from '../../shared/api/client';
import { MOCK_NEERU_LOG_RESPONSE, MOCK_NEERU_HISTORY } from './neeru.mock';
import type { Equivalency } from './data/equivalencies';

// TURNED OFF MOCKS - Now uses the real backend!
const USE_MOCK = false;

export interface WaterLogRequest {
    month: number;
    year: number;
    city: string;
    kl_used: number;
}

export interface WaterLogResponse {
    log: {
        _id: string;
        userId: string;
        month: number;
        year: number;
        city: string;
        kl_used: number;
        createdAt: string;
    };
    equivalencies: Equivalency[];
}

export const submitWaterLog = async (
    kl_used: number,
    month: number,
    year: number,
    city: string,
    overwrite: boolean = false
): Promise<WaterLogResponse> => {
    if (USE_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_NEERU_LOG_RESPONSE as any);
            }, 800);
        });
    }

    return apiFetch<WaterLogResponse>('/neeru/log', {
        method: 'POST',
        body: JSON.stringify({ kl_used, month, year, city, overwrite }),
    });
};

export const fetchWaterHistory = async (): Promise<any> => {
    if (USE_MOCK) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_NEERU_HISTORY);
            }, 500);
        });
    }

    return apiFetch<any>('/neeru/history');
};
