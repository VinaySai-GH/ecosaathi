import React, { useState, useEffect, useRef } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme.js';
import { getSpots, verifySpot, getDistanceMatrix } from '../../services/greenspot.service.js';
import { useAuth } from '../../context/AuthContext.jsx';
import AddSpotModal from './AddSpotModal.jsx';
import './greenspot.css';

const CATEGORIES = [
    { id: 'all', label: 'All', icon: '📍', color: Colors.accent },
    { id: 'ewaste', label: 'E-Waste', icon: '⚡', color: '#ffd700' },
    { id: 'composting', label: 'Composting', icon: '🌱', color: '#8b4513' },
    { id: 'organic', label: 'Organic', icon: '🥬', color: '#90ee90' },
    { id: 'nature', label: 'Nature', icon: '🌲', color: '#228b22' },
    { id: 'park', label: 'Parks', icon: '🌳', color: '#32cd32' },
    { id: 'nursery', label: 'Nurseries', icon: '🌿', color: '#98fb98' },
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
};

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

    // Update markers when filtered spots change
    useEffect(() => {
        if (map && filteredSpots.length > 0) {
            updateMarkers();
        }
    }, [map, filteredSpots]);

    const initMap = () => {
        if (!window.google || !mapRef.current) return;

        const defaultCenter = userLocation || { lat: 13.6288, lng: 79.4192 };

        const mapInstance = new window.google.maps.Map(mapRef.current, {
            center: defaultCenter,
            zoom: 13,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'geometry',
                    stylers: [{ color: '#1a3f2b' }],
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#0a1f14' }],
                },
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                },
            ],
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
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
            setSpots(response.spots || []);
            setFilteredSpots(response.spots || []);
        } catch (error) {
            console.error('Failed to load spots:', error);
        }
    };

    const updateMarkers = () => {
        // Clear existing markers
        markers.forEach((marker) => marker.setMap(null));

        const newMarkers = filteredSpots.map((spot) => {
            const categoryColor = CATEGORY_COLORS[spot.category] || Colors.accent;
            const isVerified = spot.verified_by && spot.verified_by.length >= 2;

            const marker = new window.google.maps.Marker({
                position: { lat: spot.lat, lng: spot.lng },
                map: map,
                title: spot.name,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: categoryColor,
                    fillOpacity: 1,
                    strokeColor: Colors.text,
                    strokeWeight: 2,
                },
            });

            marker.addListener('click', () => {
                setSelectedSpot(spot);
                map.setCenter({ lat: spot.lat, lng: spot.lng });
                map.setZoom(16);
            });

            return marker;
        });

        setMarkers(newMarkers);

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

    const formatDistance = (distance) => {
        if (distance < 1) return `${Math.round(distance * 1000)}m`;
        return `${distance.toFixed(1)}km`;
    };

    if (isLoading) {
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: Colors.bg }}>
                <div style={{ color: Colors.text }}>Loading map...</div>
            </div>
        );
    }

    return (
        <div className="greenspot-container">
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
                            {selectedSpot.verified_by && selectedSpot.verified_by.length >= 2 ? (
                                <span className="greenspot-verified-badge">✅ Verified by community</span>
                            ) : (
                                <button onClick={() => handleVerify(selectedSpot._id)} className="greenspot-verify-btn">
                                    ✓ Verify this spot
                                </button>
                            )}
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
