import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme.js';
import { getSpots, verifySpot, getCities } from '../../services/greenspot.service.js';
import { getAQI, getAQIQuality, getAQIRecommendation } from '../../services/aqi.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AddSpotModal from './AddSpotModal.jsx';
import { TIRUPATI_INDUSTRIES } from '../pollutionsense/data/industries.js';
import { TIRUPATI_RISK_ZONES } from '../pollutionsense/data/riskZones.js';
import { VIJAYAWADA_INDUSTRIAL_ZONES } from '../pollutionsense/data/vijayawadaIndustrialZones.js';
import { VIJAYAWADA_TRAFFIC_ZONES } from '../pollutionsense/data/vijayawadaTrafficZones.js';
import './greenspot.css';
import './overlay-styles.css';

const CITY_COORDS = {
    'Tirupati': { lat: 13.6288, lng: 79.4192 },
    'Vijayawada': { lat: 16.5062, lng: 80.6480 }
};

const CATEGORIES = [
    { id: 'all', label: 'All', icon: '📍', color: Colors.accent },
    { id: 'ewaste', label: 'E-Waste', icon: '⚡', color: '#ffd700' },
    { id: 'composting', label: 'Composting', icon: '🌱', color: '#8b4513' },
    { id: 'organic', label: 'Organic', icon: '🥬', color: '#90ee90' },
    { id: 'nature', label: 'Nature', icon: '🌲', color: '#228b22' },
    { id: 'park', label: 'Parks', icon: '🌳', color: '#32cd32' },
    { id: 'nursery', label: 'Nurseries', icon: '🌿', color: '#98fb98' },
    { id: 'zerowaste', label: 'Zero Waste', icon: '♻️', color: '#87ceeb' },
    { id: 'refill', label: 'Refill', icon: '💧', color: '#4169e1' },
    { id: 'industry', label: 'Industries', icon: '🏭', color: '#ff6347' },
    { id: 'risk', label: 'Risk Zones', icon: '⚠️', color: '#ffb703' },
    { id: 'traffic', label: 'Traffic', icon: '🛣️', color: '#ef4444' },
];

const CATEGORY_COLORS = {
    ewaste: '#ffd700',
    composting: '#8b4513',
    organic: '#90ee90',
    nature: '#228b22',
    park: '#32cd32',
    nursery: '#98fb98',
    zerowaste: '#87ceeb',
    refill: '#4169e1',
    industry: '#ff6347',
    risk: '#ffb703',
    traffic: '#ef4444',
};

const CATEGORY_ICONS = {
    ewaste: '⚡',
    composting: '🌱',
    organic: '🥬',
    nature: '🌲',
    park: '🌳',
    nursery: '🌿',
    zerowaste: '♻️',
    refill: '💧',
    industry: '🏭',
    risk: '⚠️',
    traffic: '🛣️',
    default: '📍',
};


function toSearchText(value) {
    return String(value ?? '').toLowerCase().trim();
}

function buildIndustryItems(city = 'Tirupati') {
    const industriesData = city === 'Vijayawada' ? VIJAYAWADA_INDUSTRIAL_ZONES : TIRUPATI_INDUSTRIES;
    
    if (city === 'Vijayawada') {
        return industriesData.map((ind, idx) => ({
            _id: `industry-${idx}`,
            name: ind.name,
            category: 'industry',
            lat: ind.lat,
            lng: ind.lng,
            address: `${ind.type} - ${ind.locality}`,
            opening_hours: '',
            cost: '',
            tips: [
                `Category: ${ind.pollutionCategory}`,
                `Industries: ${ind.industries}`,
                `Area: ${ind.area} acres`,
                `Concerns: ${ind.concerns.join(', ')}`,
            ],
            verified_by: [],
            __overlay: { 
                kind: 'industry', 
                category: ind.pollutionCategory, 
                type: ind.type,
                buffer_km: ind.pollutionCategory === 'Red' ? 2 : 1, // Add default buffers
                riskLevel: ind.pollutionCategory === 'Red' ? 'high' : 'medium'
            },
        }));
    }
    
    // Tirupati industries
    return industriesData.map((ind, idx) => ({
        _id: `industry-${idx}`,
        name: ind.name,
        category: 'industry',
        lat: ind.lat,
        lng: ind.lng,
        address: `Type: ${ind.type}`,
        opening_hours: '',
        cost: '',
        tips: [
            `Risk: ${ind.riskLevel}`,
            `Pollutants: ${ind.pollutants?.join(', ') ?? 'N/A'}`,
            `Safety buffer: ${ind.buffer_km}km`,
        ],
        verified_by: [],
        __overlay: { kind: 'industry', buffer_km: ind.buffer_km, riskLevel: ind.riskLevel, pollutants: ind.pollutants, type: ind.type },
    }));
}

function buildRiskZoneItems(city = 'Tirupati') {
    const riskZonesData = city === 'Vijayawada' ? [] : TIRUPATI_RISK_ZONES;
    
    return riskZonesData.map((zone, idx) => {
        const center = getRiskZoneCenter(zone);
        return {
            _id: `risk-${idx}`,
            name: zone.name,
            category: 'risk',
            lat: center.lat,
            lng: center.lng,
            address: zone.description || '',
            opening_hours: '',
            cost: '',
            tips: [
                zone.type ? `Type: ${zone.type}` : '',
                zone.severity ? `Severity: ${zone.severity}` : '',
            ].filter(Boolean),
            verified_by: [],
            __overlay: { kind: 'risk', zone },
        };
    });
}

function buildTrafficZoneItems(city = 'Tirupati') {
    const trafficZonesData = city === 'Vijayawada' ? VIJAYAWADA_TRAFFIC_ZONES : [];
    
    return trafficZonesData.map((zone, idx) => ({
        _id: `traffic-${idx}`,
        name: zone.name,
        category: 'traffic',
        lat: zone.lat,
        lng: zone.lng,
        address: `${zone.type} - ${zone.locality}`,
        opening_hours: zone.peakHours,
        cost: '',
        tips: [
            `Vehicles/day: ${zone.dailyVehicleCount}`,
            `Severity: ${zone.severity}`,
            `Air Quality: ${zone.airQuality}`,
            `Noise: ${zone.noiseLevel}`,
        ],
        verified_by: [],
        __overlay: { kind: 'traffic', severity: zone.severity, type: zone.type },
    }));
}

function getRiskZoneCenter(zone) {
    if (zone.center) return { lat: zone.center[0], lng: zone.center[1] };
    if (zone.coordinates?.length) {
        const points = zone.coordinates;
        const sum = points.reduce(
            (acc, p) => ({ lat: acc.lat + p[0], lng: acc.lng + p[1] }),
            { lat: 0, lng: 0 }
        );
        return { lat: sum.lat / points.length, lng: sum.lng / points.length };
    }
    return { lat: 13.6288, lng: 79.4192 };
}

export default function GreenSpotHome() {
    const [spots, setSpots] = useState([]);
    const [filteredSpots, setFilteredSpots] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('Tirupati');
    const [cities, setCities] = useState(['Tirupati', 'Vijayawada']);
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [selectedSpotAQI, setSelectedSpotAQI] = useState(null);
    const [isAQILoading, setIsAQILoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const markersRef = useRef([]);
    const industryBuffersRef = useRef([]);
    const riskOverlaysRef = useRef([]);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef(null);
    const { user } = useAuth();
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const loadSpots = useCallback(async () => {
        try {
            const filters = {
                lat: userLocation?.lat,
                lng: userLocation?.lng,
                city: selectedCity,
            };
            if (selectedCategory !== 'all') filters.category = selectedCategory;
            if (searchQuery) filters.q = searchQuery;

            const response = await getSpots(filters);

            const baseSpots = (response.spots || []).filter(s => !s.city || s.city === selectedCity);
            
            // Build overlay items strictly for the selected city only
            const industries = buildIndustryItems(selectedCity);
            const riskZones = buildRiskZoneItems(selectedCity);
            const trafficZones = buildTrafficZoneItems(selectedCity);

            // Combine: real DB spots + city-specific overlay items
            const allItems = [...baseSpots, ...industries, ...riskZones, ...trafficZones];

            const q = toSearchText(searchQuery);
            const filtered = allItems.filter((item) => {
                // For DB spots, trust the backend city filter already applied
                // For overlay items, they are already city-specific (built above)
                const matchesCategory =
                    selectedCategory === 'all' ||
                    item.category === selectedCategory;

                if (!matchesCategory) return false;
                if (!q) return true;

                const haystack = [
                    item.name,
                    item.address,
                    item.category,
                    ...(Array.isArray(item.tips) ? item.tips : []),
                ]
                    .map(toSearchText)
                    .join(' ');

                return haystack.includes(q);
            });

            setSpots(allItems);
            setFilteredSpots(filtered);
        } catch (error) {
            console.error('Failed to load spots:', error);
        }
    }, [selectedCity, selectedCategory, searchQuery, userLocation]);

    const updateMarkers = useCallback(() => {
        if (!map) return;
        
        // Clear existing markers + overlays using Refs
        markersRef.current.forEach((marker) => marker.setMap(null));
        industryBuffersRef.current.forEach((c) => c.setMap(null));
        riskOverlaysRef.current.forEach((o) => o.setMap(null));

        markersRef.current = [];
        industryBuffersRef.current = [];
        riskOverlaysRef.current = [];


        // Visibility flags for layers
        const shouldShowRisk = selectedCategory === 'risk';
        const shouldShowTraffic = selectedCategory === 'traffic';
        const shouldShowIndustry = selectedCategory === 'industry';

        filteredSpots.forEach((spot) => {
            const category = spot.category;
            const emoji = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
            const categoryColor = CATEGORY_COLORS[category] || Colors.accent;
            const isVerified = spot.verified_by && spot.verified_by.length >= 2;

            const marker = new window.google.maps.Marker({
                position: { lat: spot.lat, lng: spot.lng },
                map: map,
                title: spot.name,
                label: {
                    text: emoji,
                    fontSize: '20px',
                },
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: isVerified ? 10 : 8,
                    fillColor: categoryColor,
                    fillOpacity: isVerified ? 1 : 0.9,
                    strokeColor: Colors.bg,
                    strokeWeight: 2,
                },
            });

            marker.addListener('click', () => {
                setSelectedSpot(spot);
                map.setCenter({ lat: spot.lat, lng: spot.lng });
                map.setZoom(16);
            });

            markersRef.current.push(marker);

            // Industry buffer circle overlay
            if (shouldShowIndustry && spot.category === 'industry') {
                const buffer = spot.__overlay?.buffer_km || 1;
                const risk = spot.__overlay?.riskLevel || 'medium';
                
                const circle = new window.google.maps.Circle({
                    strokeColor: risk === 'high' ? '#ff3b30' : '#f59e0b',
                    strokeOpacity: 0.7,
                    strokeWeight: 1,
                    fillColor: risk === 'high' ? '#ff3b30' : '#f59e0b',
                    fillOpacity: risk === 'high' ? 0.15 : 0.1,
                    map,
                    center: { lat: spot.lat, lng: spot.lng },
                    radius: buffer * 1000,
                });
                industryBuffersRef.current.push(circle);
            }
        });


        if (shouldShowRisk && selectedCity === 'Tirupati') {
            // Draw Tirupati zone shapes
            TIRUPATI_RISK_ZONES.forEach((zone) => {
                const color =
                    zone.type === 'flood'
                        ? '#3b82f6'
                        : zone.type === 'noise_crowd'
                          ? '#a855f7'
                          : zone.type === 'construction'
                            ? '#facc15'
                            : '#ef4444';

                if (zone.coordinates?.length) {
                    const polygon = new window.google.maps.Polygon({
                        paths: zone.coordinates.map((p) => ({ lat: p[0], lng: p[1] })),
                        strokeColor: color,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: color,
                        fillOpacity: 0.18,
                        map,
                    });
                    riskOverlaysRef.current.push(polygon);
                } else if (zone.center && zone.radius_km) {
                    const circle = new window.google.maps.Circle({
                        strokeColor: color,
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: color,
                        fillOpacity: 0.15,
                        map,
                        center: { lat: zone.center[0], lng: zone.center[1] },
                        radius: zone.radius_km * 1000,
                    });
                    riskOverlaysRef.current.push(circle);
                }

            });
        }

        // Fit bounds to show all markers
        if (markersRef.current.length > 0 && map) {
            const bounds = new window.google.maps.LatLngBounds();
            markersRef.current.forEach((marker) => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds);
        }
    }, [map, filteredSpots, selectedCategory, selectedCity]);

    const initMap = useCallback(() => {
        if (!window.google || !mapRef.current) return;

        const defaultCenter = userLocation || { lat: 13.6288, lng: 79.4192 };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: window.google.maps.ControlPosition.BOTTOM_RIGHT
            }
        });

        mapInstance.addListener('click', async (e) => {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            const customSpot = {
                _id: 'custom-location',
                name: 'Selected Location',
                category: 'all',
                lat: lat,
                lng: lng,
                address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
                tips: ['Click markers for spot details'],
                verified_by: [],
                isCustom: true
            };
            
            setSelectedSpot(customSpot);
            mapInstance.panTo({ lat, lng });
        });

        setMap(mapInstance);
        setIsLoading(false);
    }, [userLocation]);

    // Load Google Maps script
    useEffect(() => {
        if (!googleMapsApiKey) {
            console.error('VITE_GOOGLE_MAPS_API_KEY not set in .env');
            setIsLoading(false);
            return;
        }

        if (window.google && window.google.maps) {
            initMap();
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
            initMap();
        };
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [googleMapsApiKey]);

    // Load available cities (only Tirupati and Vijayawada)
    useEffect(() => {
        // Only show Tirupati and Vijayawada for this feature
        const supportedCities = ['Tirupati', 'Vijayawada'];
        setCities(supportedCities);
        
        // Ensure selectedCity is one of the supported cities
        if (!supportedCities.includes(selectedCity)) {
            setSelectedCity('Tirupati');
        }
    }, []);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                () => {
                    // Default to Tirupati if geolocation fails
                    setUserLocation({ lat: 13.6288, lng: 79.4192 });
                }
            );
        } else {
            setUserLocation({ lat: 13.6288, lng: 79.4192 });
        }
    }, []);

    // Load spots when city/category/search changes (NOT when map changes)
    useEffect(() => {
        if (userLocation) {
            loadSpots();
        }
    }, [loadSpots, userLocation]);

    // Pan map to the selected city when city changes
    useEffect(() => {
        if (map && CITY_COORDS[selectedCity]) {
            map.panTo(CITY_COORDS[selectedCity]);
            map.setZoom(13);
        }
    }, [selectedCity, map]);

    // Update markers/overlays when filtered items change
    useEffect(() => {
        updateMarkers();
    }, [updateMarkers]);

    // Fetch AQI data when a spot is selected
    useEffect(() => {
        if (!selectedSpot) {
            setSelectedSpotAQI(null);
            return;
        }

        const fetchAQI = async () => {
            setIsAQILoading(true);
            try {
                const aqi = await getAQI(selectedSpot.lat, selectedSpot.lng);
                setSelectedSpotAQI(aqi);
            } catch (error) {
                console.error('Failed to fetch AQI:', error);
                setSelectedSpotAQI(null);
            } finally {
                setIsAQILoading(false);
            }
        };

        fetchAQI();
    }, [selectedSpot]);




    const handleVerify = async (spotId) => {
        try {
            await verifySpot(spotId);
            loadSpots();
            if (selectedSpot && selectedSpot._id === spotId) {
                const updated = spots.find((s) => s._id === spotId);
                if (updated) setSelectedSpot(updated);
            }
        } catch (error) {
            console.error('Failed to verify spot:', error);
            alert('Failed to verify spot. Please try again.');
        }
    };

    const openInGoogleMaps = () => {
        if (!selectedSpot) return;
        const origin = userLocation || { lat: 13.6288, lng: 79.4192 };
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${selectedSpot.lat},${selectedSpot.lng}&travelmode=driving`;
        window.open(url, '_blank');
    };

    const formatDistance = (distance) => {
        if (distance < 1) return `${Math.round(distance * 1000)}m`;
        return `${distance.toFixed(1)}km`;
    };

    return (
        <div className="greenspot-container">
            {isLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.overlay, zIndex: 2000 }}>
                    <div style={{ color: Colors.text }}>Loading map...</div>
                </div>
            )}
            {/* City Eco Score Banner */}

            {/* Search Bar */}
            <div className="greenspot-search-bar">
                <input
                    type="text"
                    placeholder="Search for spots..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="greenspot-search-input"
                />
            </div>

            {/* City Selector */}
            <div className="greenspot-city-selector">
                <label htmlFor="city-select" className="greenspot-city-label">📍 City:</label>
                <select
                    id="city-select"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="greenspot-city-select"
                >
                    {cities.map((city) => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category Filter Strip */}
            <div className="greenspot-filter-strip">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`greenspot-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                        style={{
                            backgroundColor: selectedCategory === cat.id ? cat.color : Colors.surface,
                            color: selectedCategory === cat.id ? Colors.bg : Colors.text,
                        }}
                    >
                        <span className="filter-icon">{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Map Container */}
            <div ref={mapRef} className="greenspot-map" />

            {/* Selected Spot Overlay */}
            {selectedSpot && (
                <div className="greenspot-spot-overlay">
                    <button className="greenspot-close-btn" onClick={() => setSelectedSpot(null)}>
                        ×
                    </button>
                    <div className="greenspot-spot-header">
                        <h3>{selectedSpot.name}</h3>
                        <span className="greenspot-category-badge" style={{ backgroundColor: CATEGORY_COLORS[selectedSpot.category] || Colors.accent }}>
                            {CATEGORIES.find((c) => c.id === selectedSpot.category)?.label || selectedSpot.category}
                        </span>
                    </div>
                    <div className="greenspot-spot-details">
                        <p className="greenspot-address">📍 {selectedSpot.address}</p>
                        {selectedSpot.distance && (
                            <p className="greenspot-distance">📏 {formatDistance(selectedSpot.distance)} away</p>
                        )}
                        
                        {/* AQI Display */}
                        {isAQILoading ? (
                            <div className="greenspot-aqi-loading">
                                🌫️ Fetching real-time AQI...
                            </div>
                        ) : selectedSpotAQI ? (
                            <div className={`greenspot-aqi-tooltip ${selectedSpotAQI.quality.severity}`} style={{ marginTop: Spacing.sm, marginBottom: Spacing.sm }}>
                                <div className="greenspot-aqi-value" style={{ color: selectedSpotAQI.quality.color }}>
                                    🌫️ UAQI: {selectedSpotAQI.aqi}
                                    {selectedSpotAQI.aqiScale && (
                                        <span style={{ fontSize: '10px', color: '#888', marginLeft: 6, fontWeight: 400 }}>
                                            ({selectedSpotAQI.aqiScale})
                                        </span>
                                    )}
                                </div>
                                <div className="greenspot-aqi-quality" style={{ color: selectedSpotAQI.quality.color }}>
                                    {selectedSpotAQI.quality.label}
                                </div>
                                {selectedSpotAQI.pm25 !== null && (
                                    <div className="greenspot-aqi-details">
                                        <div className="greenspot-aqi-details-item">
                                            <strong>PM2.5:</strong>
                                            <span>{selectedSpotAQI.pm25.toFixed(1)} µg/m³</span>
                                        </div>
                                    </div>
                                )}
                                {selectedSpotAQI.pm10 !== null && (
                                    <div className="greenspot-aqi-details">
                                        <div className="greenspot-aqi-details-item">
                                            <strong>PM10:</strong>
                                            <span>{selectedSpotAQI.pm10.toFixed(1)} µg/m³</span>
                                        </div>
                                    </div>
                                )}
                                <p style={{ marginTop: Spacing.xs, fontSize: '11px', color: '#666' }}>
                                    {getAQIRecommendation(selectedSpotAQI.quality.severity)}
                                </p>
                                <p style={{ marginTop: 2, fontSize: '10px', color: '#999', textAlign: 'right' }}>
                                    Source: {selectedSpotAQI.source || 'Live API'}
                                </p>
                            </div>
                        ) : (
                            <div className="greenspot-aqi-unavailable">
                                🌫️ AQI data not available for this point.
                            </div>
                        )}
                        
                        {selectedSpot.opening_hours && (
                            <p className="greenspot-hours">🕐 {selectedSpot.opening_hours}</p>
                        )}
                        {selectedSpot.cost && <p className="greenspot-cost">💰 {selectedSpot.cost}</p>}
                        {selectedSpot.tips && selectedSpot.tips.length > 0 && (
                            <div className="greenspot-tips">
                                <strong>💡 Tips:</strong>
                                <ul>
                                    {selectedSpot.tips.map((tip, idx) => (
                                        <li key={idx}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="greenspot-verify-section">
                            {selectedSpot.isCustom ? (
                                <p style={{ fontSize: '12px', color: Colors.textMuted }}>
                                    This is a custom location. Click on specific markers to see community-added spots.
                                </p>
                            ) : selectedSpot.verified_by && selectedSpot.verified_by.length >= 1 ? (
                                <span className="greenspot-verified-badge">✅ Verified by community</span>
                            ) : (
                                <button onClick={() => handleVerify(selectedSpot._id)} className="greenspot-verify-btn">
                                    ✓ Verify this spot
                                </button>
                            )}
                        </div>

                        <div className="greenspot-verify-section" style={{ marginTop: Spacing.md }}>
                            <p style={{ color: Colors.textMuted, marginBottom: Spacing.sm }}>Open directions</p>
                            <button
                                className="greenspot-verify-btn"
                                style={{ backgroundColor: Colors.accentDim }}
                                onClick={openInGoogleMaps}
                            >
                                Open in Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Spot Button */}
            <button className="greenspot-add-btn" onClick={() => setShowAddModal(true)}>
                + Add Spot
            </button>

            {/* Add Spot Modal */}
            {showAddModal && (
                <AddSpotModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        loadSpots();
                        setShowAddModal(false);
                    }}
                    cities={cities}
                    defaultCity={selectedCity}
                />
            )}
        </div>
    );
}
