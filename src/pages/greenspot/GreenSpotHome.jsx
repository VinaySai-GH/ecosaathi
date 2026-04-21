import React, { useState, useEffect, useRef } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme.js';
import { getSpots, verifySpot } from '../../services/greenspot.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AddSpotModal from './AddSpotModal.jsx';
import CityEcoScoreBanner from './components/CityEcoScoreBanner.jsx';
import { TIRUPATI_INDUSTRIES } from '../pollutionsense/data/industries.js';
import { TIRUPATI_RISK_ZONES } from '../pollutionsense/data/riskZones.js';
import './greenspot.css';

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

// Mock traffic/highway segments borrowed from PollutionSense (was drawn as polylines)
const TRAFFIC_LINES = [
    // NH-40 Segment
    [
        { lat: 13.62, lng: 79.35 },
        { lat: 13.62, lng: 79.48 },
    ],
    // Tirumala Road
    [
        { lat: 13.65, lng: 79.4 },
        { lat: 13.68, lng: 79.38 },
    ],
];

function toSearchText(value) {
    return String(value ?? '').toLowerCase().trim();
}

function buildIndustryItems() {
    return TIRUPATI_INDUSTRIES.map((ind, idx) => ({
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

function buildRiskZoneItems() {
    return TIRUPATI_RISK_ZONES.map((zone, idx) => {
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
    const [selectedSpot, setSelectedSpot] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [industryBuffers, setIndustryBuffers] = useState([]);
    const [riskOverlays, setRiskOverlays] = useState([]);
    const [trafficOverlays, setTrafficOverlays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const mapRef = useRef(null);
    const { user } = useAuth();
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

    // Fetch spots
    useEffect(() => {
        if (userLocation) {
            loadSpots();
        }
    }, [userLocation, selectedCategory, searchQuery]);

    // Update markers/overlays when filtered items change
    useEffect(() => {
        if (map) updateMarkers();
    }, [map, filteredSpots, selectedCategory]);

    const initMap = () => {
        if (!window.google || !mapRef.current) return;

        const defaultCenter = userLocation || { lat: 13.6288, lng: 79.4192 };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            // Use default Google Maps style for best road/label quality
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
        });

        setMap(mapInstance);
        setIsLoading(false);
    };

    const loadSpots = async () => {
        try {
            const filters = {
                lat: userLocation?.lat,
                lng: userLocation?.lng,
            };
            if (selectedCategory !== 'all') filters.category = selectedCategory;
            if (searchQuery) filters.q = searchQuery;

            const response = await getSpots(filters);

            const baseSpots = response.spots || [];
            const industries = buildIndustryItems();
            const riskZones = buildRiskZoneItems();

            // For search + filter UX, we treat industries as additional "spots"
            const allItems = [...baseSpots, ...industries, ...riskZones];

            const q = toSearchText(searchQuery);
            const filtered = allItems.filter((item) => {
                const matchesCategory =
                    selectedCategory === 'all' ||
                    item.category === selectedCategory ||
                    selectedCategory === 'traffic';

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
    };

    const updateMarkers = () => {
        // Clear existing markers + overlays
        markers.forEach((marker) => marker.setMap(null));
        industryBuffers.forEach((c) => c.setMap(null));
        riskOverlays.forEach((o) => o.setMap(null));
        trafficOverlays.forEach((o) => o.setMap(null));

        const newIndustryBuffers = [];
        const newMarkers = [];

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

            newMarkers.push(marker);

            // Industry buffer circle overlay (if this marker is an industry item)
            if (spot.category === 'industry' && spot.__overlay?.buffer_km) {
                const circle = new window.google.maps.Circle({
                    strokeColor: spot.__overlay.riskLevel === 'high' ? '#ff3b30' : '#f59e0b',
                    strokeOpacity: 0.7,
                    strokeWeight: 1,
                    fillColor: spot.__overlay.riskLevel === 'high' ? '#ff3b30' : '#f59e0b',
                    fillOpacity: spot.__overlay.riskLevel === 'high' ? 0.15 : 0.1,
                    map,
                    center: { lat: spot.lat, lng: spot.lng },
                    radius: spot.__overlay.buffer_km * 1000,
                });
                newIndustryBuffers.push(circle);
            }
        });

        // Risk zones and traffic overlays are shown when "all" or their respective filter is selected
        const shouldShowRisk = selectedCategory === 'all' || selectedCategory === 'risk';
        const shouldShowTraffic = selectedCategory === 'all' || selectedCategory === 'traffic';

        const newRiskOverlays = [];
        if (shouldShowRisk) {
            // Draw zone shapes
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
                    newRiskOverlays.push(polygon);
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
                    newRiskOverlays.push(circle);
                }

            });
        }

        const newTrafficOverlays = [];
        if (shouldShowTraffic) {
            TRAFFIC_LINES.forEach((line) => {
                const polyline = new window.google.maps.Polyline({
                    path: line,
                    geodesic: true,
                    strokeColor: CATEGORY_COLORS.traffic,
                    strokeOpacity: 0.35,
                    strokeWeight: 8,
                    map,
                });
                newTrafficOverlays.push(polyline);
            });
        }

        setMarkers(newMarkers);
        setIndustryBuffers(newIndustryBuffers);
        setRiskOverlays(newRiskOverlays);
        setTrafficOverlays(newTrafficOverlays);

        // Fit bounds to show all markers
        if (newMarkers.length > 0 && map) {
            const bounds = new window.google.maps.LatLngBounds();
            newMarkers.forEach((marker) => bounds.extend(marker.getPosition()));
            map.fitBounds(bounds);
        }
    };

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
            <div style={{ padding: Spacing.md, paddingTop: 0 }}>
                <CityEcoScoreBanner />
            </div>

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
                            {selectedSpot.verified_by && selectedSpot.verified_by.length >= 1 ? (
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
                />
            )}
        </div>
    );
}
