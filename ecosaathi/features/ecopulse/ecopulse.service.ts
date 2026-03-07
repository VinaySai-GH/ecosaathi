// Eco Pulse API service

import { API_BASE_URL } from '../../shared/constants';
import type { LeaderboardResponse, MyRankResponse } from './ecopulse.types';
import { MOCK_LEADERBOARD, MOCK_MY_RANK } from './ecopulse.mock';

const USE_MOCK = true;

export async function fetchLeaderboard(month?: number): Promise<LeaderboardResponse> {
    if (USE_MOCK) return MOCK_LEADERBOARD;

    try {
        const query = month ? `?month=${month}` : '';
        const res = await fetch(`${API_BASE_URL}/api/leaderboard${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as LeaderboardResponse;
    } catch (err: unknown) {
        throw new Error(`fetchLeaderboard failed: ${(err as Error).message}`);
    }
}

export async function fetchMyRank(): Promise<MyRankResponse> {
    if (USE_MOCK) return MOCK_MY_RANK;

    try {
        const res = await fetch(`${API_BASE_URL}/api/leaderboard/me`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as MyRankResponse;
    } catch (err: unknown) {
        throw new Error(`fetchMyRank failed: ${(err as Error).message}`);
    }
}
