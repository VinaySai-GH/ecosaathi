// Green Spot feature types

import type { SpotCategory } from '../../shared/constants';

export interface Spot {
    _id: string;
    name: string;
    category: SpotCategory;
    lat: number;
    lng: number;
    address: string;
    tips: string[];
    photos: string[];
    verified_by: string[];
    added_by: string;
    createdAt: string;
}

export interface SpotListResponse {
    spots: Spot[];
}

export interface SpotCreatePayload {
    name: string;
    category: SpotCategory;
    lat: number;
    lng: number;
    address: string;
}
