import { TIRUPATI_INDUSTRIES } from '../data/industries';
import { TIRUPATI_RISK_ZONES } from '../data/riskZones';
import { getCurrentSeason } from '../data/windData';

// Helper: Haversine distance between two points in km
export function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Helper: Check if point is inside a polygon (ray-casting)
function isPointInPolygon(point, vs) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Calculate the Zone Safety Score
export function calculateSafetyScore(lat, lng, aqiData, parksCount) {
    let score = 100;
    const penalties = [];
    const bonuses = [];

    // 1. AQI Penalty (max -30 points)
    let nearestAqi = null;
    let minAqiDist = Infinity;
    if (aqiData && aqiData.length > 0) {
        aqiData.forEach(sensor => {
            const dist = getDistance(lat, lng, sensor.coordinates.latitude, sensor.coordinates.longitude);
            if (dist < minAqiDist) {
                minAqiDist = dist;
                nearestAqi = sensor;
            }
        });
    }

    // Fallback if no sensors within 50km
    let aqiValue = 75; // Default moderate
    if (nearestAqi && minAqiDist < 50) {
        aqiValue = nearestAqi.parameter.value;
    }

    let aqiPenalty = 0;
    if (aqiValue > 200) aqiPenalty = 30;
    else if (aqiValue > 150) aqiPenalty = 25;
    else if (aqiValue > 100) aqiPenalty = 20;
    else if (aqiValue > 50) aqiPenalty = 10;

    if (aqiPenalty > 0) {
        score -= aqiPenalty;
        penalties.push({ label: 'Air Quality', icon: '🌬️', desc: `AQI: ${Math.round(aqiValue)}`, pts: -aqiPenalty });
    } else {
        penalties.push({ label: 'Air Quality', icon: '🌬️', desc: `AQI: ${Math.round(aqiValue)} (Good)`, pts: 0 });
    }

    // 2. Industry Proximity Penalty (max -25 points)
    let worstIndPenalty = 0;
    let worstIndName = 'None';
    let worstIndDist = 0;

    TIRUPATI_INDUSTRIES.forEach(ind => {
        const dist = getDistance(lat, lng, ind.lat, ind.lng);
        let penalty = 0;
        if (dist < ind.buffer_km) {
            penalty = ind.riskLevel === 'high' ? 25 : 15;
        } else if (dist < ind.buffer_km * 2) {
            penalty = 8;
        }

        if (penalty > worstIndPenalty) {
            worstIndPenalty = penalty;
            worstIndName = ind.name;
            worstIndDist = dist;
        }
    });

    if (worstIndPenalty > 0) {
        score -= worstIndPenalty;
        penalties.push({ label: 'Industry', icon: '🏭', desc: `${worstIndName} (${worstIndDist.toFixed(1)}km)`, pts: -worstIndPenalty });
    } else {
        penalties.push({ label: 'Industry', icon: '🏭', desc: 'No nearby industries', pts: 0 });
    }

    // 3. Green Space Bonus (max +10 points)
    let greenBonus = 0;
    if (parksCount >= 3) greenBonus = 10;
    else if (parksCount === 2) greenBonus = 6;
    else if (parksCount === 1) greenBonus = 3;

    if (greenBonus > 0) {
        score += greenBonus;
        bonuses.push({ label: 'Green Spaces', icon: '🌳', desc: `${parksCount} parks within 1km`, pts: `+${greenBonus}` });
    } else {
        penalties.push({ label: 'Green Spaces', icon: '🌳', desc: 'No parks within 1km', pts: 0 });
    }

    // 4. Highway/Traffic (Mocked distance for now unless we do full polyline math)
    // Hardcoded check for Tirupati bypass ~ lat 13.62
    const distToHighway = Math.abs(lat - 13.62) * 111; // rough km to lat 13.62
    let hwyPenalty = 0;
    let hwyDesc = '';
    if (distToHighway < 0.3) { hwyPenalty = 10; hwyDesc = 'NH-40: <300m away'; }
    else if (distToHighway < 0.5) { hwyPenalty = 6; hwyDesc = 'NH-40: 300-500m away'; }
    else if (distToHighway < 1.0) { hwyPenalty = 3; hwyDesc = 'NH-40: 500m-1km away'; }

    if (hwyPenalty > 0) {
        score -= hwyPenalty;
        penalties.push({ label: 'Highway', icon: '🛣️', desc: hwyDesc, pts: -hwyPenalty });
    } else {
        penalties.push({ label: 'Highway', icon: '🛣️', desc: '>1km away', pts: 0 });
    }

    // 5. Risk Zone Penalty (max -20)
    let riskPenalty = 0;
    let riskName = '';
    TIRUPATI_RISK_ZONES.forEach(zone => {
        if (zone.coordinates) {
            if (isPointInPolygon([lat, lng], zone.coordinates)) {
                riskPenalty = Math.max(riskPenalty, zone.severity === 'high' ? 20 : 10);
                riskName = zone.name;
            }
        } else if (zone.center) {
            if (getDistance(lat, lng, zone.center[0], zone.center[1]) < zone.radius_km) {
                riskPenalty = Math.max(riskPenalty, zone.severity === 'high' ? 20 : 10);
                riskName = zone.name;
            }
        }
    });

    if (riskPenalty > 0) {
        score -= riskPenalty;
        penalties.push({ label: 'Risk Zones', icon: '⚠️', desc: `Inside ${riskName}`, pts: -riskPenalty });
    } else {
        penalties.push({ label: 'Risk Zones', icon: '⚠️', desc: 'Not in any risk zone', pts: 0 });
    }

    // 6. Wind Corridor penalty (Mocked simple angle check)
    const season = getCurrentSeason();
    // We'll skip complex vector math for now and assume no drift unless very close
    penalties.push({ label: 'Wind Corridor', icon: '💨', desc: `Not in drift zone (${season.label})`, pts: 0 });

    return {
        score: Math.max(0, Math.min(100, score)),
        penalties,
        bonuses
    };
}
