// Raat Ka Hisaab API service

import { API_BASE_URL } from '../../shared/constants';
import type { BotRegisterPayload } from './rkt.types';

const USE_MOCK = true;

export async function registerForBot(payload: BotRegisterPayload): Promise<{ success: boolean }> {
    if (USE_MOCK) return { success: true };

    try {
        const res = await fetch(`${API_BASE_URL}/api/bot/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as { success: boolean };
    } catch (err: unknown) {
        throw new Error(`registerForBot failed: ${(err as Error).message}`);
    }
}
