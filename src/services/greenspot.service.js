import { apiFetch } from '../api/client.js';

export const getSpots = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.lat) params.append('lat', filters.lat);
    if (filters.lng) params.append('lng', filters.lng);
    if (filters.q) params.append('q', filters.q);

    const queryString = params.toString();
    const endpoint = `/spots${queryString ? `?${queryString}` : ''}`;
    const response = await apiFetch(endpoint);
    return response;
};

export const createSpot = async (spotData) => {
    const response = await apiFetch('/spots', {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify(spotData),
    });
    return response;
};

export const verifySpot = async (spotId) => {
    const response = await apiFetch(`/spots/${spotId}/verify`, {
        method: 'POST',
        requireAuth: true,
    });
    return response;
};

export const getDistanceMatrix = async (origins, destinations, apiKey) => {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins.lat},${origins.lng}&destinations=${destinations.map((d) => `${d.lat},${d.lng}`).join('|')}&mode=walking&key=${apiKey}`;
    const response = await fetch(url);
    return response.json();
};
