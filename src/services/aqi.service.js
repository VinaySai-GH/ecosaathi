const AQI_PROXY_URL = '/api/pollution/live-aqi';

// Cache AQI data to avoid excessive API calls
const aqiCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

/**
 * Get AQI data for a location in India
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<{aqi: number, quality: string, pm25: number, pm10: number, no2: number, o3: number, co: number, so2: number}>}
 */
export async function getAQI(lat, lng) {
    try {
        const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
        
        // Check cache first
        const cached = aqiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }

        // Use backend proxy to avoid CORS issues
        try {
            const response = await fetch(`${AQI_PROXY_URL}?lat=${lat}&lng=${lng}`);
            if (response.ok) {
                const data = await response.json();
                const aqiData = {
                    aqi: data.aqi,
                    quality: getAQIQuality(data.aqi),  // UAQI: higher = better
                    pm25: data.pm25,
                    pm10: data.pm10,
                    dominantPollutant: data.dominantPollutant,
                    source: data.source || 'Live API',
                    aqiScale: data.aqiScale || null,
                    station: data.source || 'Regional Station'
                };
                aqiCache.set(cacheKey, { data: aqiData, timestamp: Date.now() });
                return aqiData;
            } else {
                console.warn('AQI Proxy failed:', response.statusText);
            }
        } catch (err) {
            console.error('AQI Proxy network error:', err);
        }

        return null;
    } catch (error) {
        console.error('Failed to fetch AQI:', error.message);
        return null;
    }
}

/**
 * Get AQI quality label for UAQI scale (0-100, HIGHER = BETTER air quality)
 * Google's Universal AQI: 100 = Excellent, 0 = Very Poor
 */
export function getAQIQuality(aqi) {
    if (aqi === null || aqi === undefined) return { label: 'Unknown', color: '#999', severity: 'unknown' };
    
    // UAQI: higher is BETTER (opposite of Indian AQI)
    if (aqi >= 80) {
        return { label: 'Excellent', color: '#2ecc71', severity: 'good' };
    } else if (aqi >= 60) {
        return { label: 'Good', color: '#27ae60', severity: 'satisfactory' };
    } else if (aqi >= 40) {
        return { label: 'Moderate', color: '#f39c12', severity: 'moderate' };
    } else if (aqi >= 20) {
        return { label: 'Poor', color: '#e74c3c', severity: 'poor' };
    } else {
        return { label: 'Very Poor', color: '#8b0000', severity: 'very_poor' };
    }
}

/**
 * Get AQI recommendation
 * @param {string} severity - AQI severity level
 * @returns {string} Recommendation text
 */
export function getAQIRecommendation(severity) {
    const recommendations = {
        good: '✅ Air quality is good. Great for outdoor activities!',
        satisfactory: '🟡 Air quality is moderate. Sensitive groups should take care.',
        moderate: '🟠 Air quality is poor. Limit prolonged outdoor exposure.',
        poor: '🔴 Air quality is poor. Avoid outdoor activities. Wear a mask.',
        very_poor: '🚫 Air quality is very poor. Stay indoors. Keep windows closed.',
        unknown: 'AQI data unavailable for this location.',
    };
    return recommendations[severity] || recommendations.unknown;
}

/**
 * Get nearby AQI monitoring stations
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Array>} List of nearby stations
 */
export async function getNearbyAQIStations(lat, lng) {
    try {
        const url = `${WAQI_BASE_URL}/map/bounds/?latlng=${lat - 0.5},${lng - 0.5},${lat + 0.5},${lng + 0.5}&token=${WAQI_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch nearby stations:', error.message);
        return [];
    }
}

export default {
    getAQI,
    getAQIQuality,
    getAQIRecommendation,
    getNearbyAQIStations,
};
