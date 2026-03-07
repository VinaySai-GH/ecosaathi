// Green Spot API service

import { API_BASE_URL } from '../../shared/constants';
import type { SpotCategory } from '../../shared/constants';
import type { Spot, SpotListResponse, SpotCreatePayload } from './greenspot.types';
import { MOCK_SPOTS } from './greenspot.mock';

const USE_MOCK = true;

export async function fetchSpots(params?: {
    category?: SpotCategory;
    lat?: number;
    lng?: number;
}): Promise<SpotListResponse> {
    if (USE_MOCK) return MOCK_SPOTS;

    try {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.lat) query.set('lat', String(params.lat));
        if (params?.lng) query.set('lng', String(params.lng));
        const res = await fetch(`${API_BASE_URL}/api/spots?${query}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as SpotListResponse;
    } catch (err: unknown) {
        throw new Error(`fetchSpots failed: ${(err as Error).message}`);
    }
}

export async function addSpot(payload: SpotCreatePayload): Promise<Spot> {
    if (USE_MOCK) return MOCK_SPOTS.spots[0]!;

    try {
        const res = await fetch(`${API_BASE_URL}/api/spots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Spot;
    } catch (err: unknown) {
        throw new Error(`addSpot failed: ${(err as Error).message}`);
    }
}

export async function verifySpot(spotId: string): Promise<Spot> {
    if (USE_MOCK) return MOCK_SPOTS.spots[0]!;

    try {
        const res = await fetch(`${API_BASE_URL}/api/spots/${spotId}/verify`, {
            method: 'POST',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as Spot;
    } catch (err: unknown) {
        throw new Error(`verifySpot failed: ${(err as Error).message}`);
    }
}
