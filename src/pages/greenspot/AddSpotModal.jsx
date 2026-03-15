import React, { useState, useEffect, useRef } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme.js';
import { createSpot } from '../../services/greenspot.service.js';
import './greenspot.css';

const CATEGORIES = [
    { id: 'ewaste', label: 'E-Waste', icon: '⚡' },
    { id: 'composting', label: 'Composting', icon: '🌱' },
    { id: 'organic', label: 'Organic Store', icon: '🥬' },
    { id: 'nature', label: 'Nature Spot', icon: '🌲' },
    { id: 'park', label: 'Park', icon: '🌳' },
    { id: 'nursery', label: 'Nursery', icon: '🌿' },
    { id: 'zerowaste', label: 'Zero-Waste Store', icon: '♻️' },
    { id: 'refill', label: 'Refill Station', icon: '💧' },
];

export default function AddSpotModal({ onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [address, setAddress] = useState('');
    const [tip, setTip] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [cost, setCost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const autocompleteRef = useRef(null);
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        if (!googleMapsApiKey || !window.google) return;

        const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'in' },
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                setAddress(place.formatted_address || place.name);
            }
        });

        return () => {
            if (autocomplete) {
            }
        };
    }, [googleMapsApiKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !category || !address.trim()) {
            setError('Please fill in name, category, and address.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Geocode address to get lat/lng
            const geocoder = new window.google.maps.Geocoder();
            const geocodeResult = await new Promise((resolve, reject) => {
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        resolve(results[0]);
                    } else {
                        reject(new Error('Could not geocode address'));
                    }
                });
            });

            const location = geocodeResult.geometry.location;
            const spotData = {
                name: name.trim(),
                category,
                address: address.trim(),
                lat: location.lat(),
                lng: location.lng(),
                tip: tip.trim() || undefined,
                opening_hours: openingHours.trim() || undefined,
                cost: cost.trim() || undefined,
                google_place_id: geocodeResult.place_id || undefined,
            };

            await createSpot(spotData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to create spot:', err);
            setError(err.message || 'Failed to add spot. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="greenspot-modal-overlay" onClick={onClose}>
            <div className="greenspot-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Add a New Spot</h2>
                <p style={{ color: Colors.textMuted, marginBottom: 24 }}>Help others discover eco-friendly places in Tirupati</p>

                <form onSubmit={handleSubmit}>
                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Spot Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Eco Finix Compost"
                            className="greenspot-form-input"
                            required
                        />
                    </div>

                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Category *</label>
                        <div className="greenspot-category-grid">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`greenspot-category-option ${category === cat.id ? 'active' : ''}`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Address *</label>
                        <input
                            ref={autocompleteRef}
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Start typing address..."
                            className="greenspot-form-input"
                            required
                        />
                    </div>

                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Opening Hours (optional)</label>
                        <input
                            type="text"
                            value={openingHours}
                            onChange={(e) => setOpeningHours(e.target.value)}
                            placeholder="e.g., Mon-Sat 9AM-6PM"
                            className="greenspot-form-input"
                        />
                    </div>

                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Cost (optional)</label>
                        <input
                            type="text"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            placeholder="e.g., Free or ₹50"
                            className="greenspot-form-input"
                        />
                    </div>

                    <div className="greenspot-form-group">
                        <label className="greenspot-form-label">Tip for visitors (optional)</label>
                        <textarea
                            value={tip}
                            onChange={(e) => setTip(e.target.value)}
                            placeholder="e.g., Bring your own bag"
                            className="greenspot-form-textarea"
                            rows="3"
                        />
                    </div>

                    {error && (
                        <div className="greenspot-form-error" style={{ color: Colors.danger, marginBottom: 16 }}>
                            {error}
                        </div>
                    )}

                    <div className="greenspot-form-actions">
                        <button type="button" onClick={onClose} className="greenspot-form-cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="greenspot-form-submit-btn">
                            {isSubmitting ? 'Adding...' : 'Add Spot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
