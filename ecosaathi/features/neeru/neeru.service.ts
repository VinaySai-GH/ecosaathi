// Neeru API service — all network calls for this feature live here
// Components NEVER call APIs directly; they use this file.

import { API_BASE_URL } from '../../shared/constants';
import type { NeeruLogResponse, NeeruHistoryResponse } from './neeru.types';

const USE_MOCK = true; // flip to false when backend is ready
import { MOCK_NEERU_LOG_RESPONSE, MOCK_NEERU_HISTORY } from './neeru.mock';

interface LogPayload {
    month: number;
    year: number;
    city: string;
    kl_used: number;
}

export async function submitWaterLog(payload: LogPayload): Promise<NeeruLogResponse> {
    if (USE_MOCK) return MOCK_NEERU_LOG_RESPONSE;

    try {
        const res = await fetch(`${API_BASE_URL}/api/neeru/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as NeeruLogResponse;
    } catch (err: unknown) {
        throw new Error(`submitWaterLog failed: ${(err as Error).message}`);
    }
}

export async function fetchWaterHistory(): Promise<NeeruHistoryResponse> {
    if (USE_MOCK) return MOCK_NEERU_HISTORY;

    try {
        const res = await fetch(`${API_BASE_URL}/api/neeru/history`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as NeeruHistoryResponse;
    } catch (err: unknown) {
        throw new Error(`fetchWaterHistory failed: ${(err as Error).message}`);
    }
}
