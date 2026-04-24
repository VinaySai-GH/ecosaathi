import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { createPost } from '../../../api/postApi.js';
import './CreatePostModal.css';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const POST_TYPES = [
  { id: 'news',  label: 'News',  icon: '📰', desc: 'Share a local eco-story' },
  { id: 'event', label: 'Event', icon: '📅', desc: 'Promote an upcoming event' },
  { id: 'issue', label: 'Issue', icon: '⚠️', desc: 'Report an environmental issue' },
];

function MapClickHandler({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng) });
  return null;
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();
    return data.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

async function geocodeSearch(query) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
  );
  return res.json();
}

export default function CreatePostModal({ initialType, onClose, onCreated }) {
  const [step, setStep] = useState('form'); // 'form' | 'location'
  const [type] = useState(initialType || 'news');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);     // base64 data-URL
  const [imagePreview, setImagePreview] = useState(null);
  const [locationText, setLocationText] = useState('');
  const [locationCoords, setLocationCoords] = useState({ lat: null, lng: null });
  const [mapCenter, setMapCenter] = useState([17.0005, 79.5199]); // IIT Tirupati default
  const [markerPos, setMarkerPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const typeMeta = POST_TYPES.find((t) => t.id === type);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePickOnMap = useCallback(async (latlng) => {
    const { lat, lng } = latlng;
    setMarkerPos([lat, lng]);
    setLocationCoords({ lat, lng });
    const text = await reverseGeocode(lat, lng);
    setLocationText(text);
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMapCenter([lat, lng]);
        setMarkerPos([lat, lng]);
        setLocationCoords({ lat, lng });
        const text = await reverseGeocode(lat, lng);
        setLocationText(text);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await geocodeSearch(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectResult = async (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setMapCenter([lat, lng]);
    setMarkerPos([lat, lng]);
    setLocationCoords({ lat, lng });
    const text = result.display_name?.split(',').slice(0, 3).join(', ') || result.display_name;
    setLocationText(text);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = async () => {
    if (!caption.trim() && !image) {
      setError('Please add a caption or an image.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await createPost({ type, caption, image, locationText, locationCoords });
      onCreated(res.post);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to post. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cpm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cpm-modal">
        {/* Header */}
        <div className="cpm-header">
          <span className="cpm-type-icon">{typeMeta?.icon}</span>
          <h2 className="cpm-title">New {typeMeta?.label}</h2>
          <button className="cpm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step === 'form' && (
          <div className="cpm-body">
            {/* Image upload */}
            <div
              className="cpm-image-drop"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="cpm-image-preview" />
              ) : (
                <div className="cpm-image-placeholder">
                  <span className="cpm-upload-icon">🖼️</span>
                  <span>Add a photo (optional)</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            {imagePreview && (
              <button className="cpm-remove-img" onClick={() => { setImage(null); setImagePreview(null); }}>
                Remove photo
              </button>
            )}

            {/* Caption */}
            <textarea
              className="cpm-caption"
              placeholder={`Write a caption for your ${typeMeta?.label?.toLowerCase()}...`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={2000}
              rows={4}
            />
            <div className="cpm-char-count">{caption.length}/2000</div>

            {/* Location row */}
            <div className="cpm-location-row">
              <span className="cpm-location-display">
                {locationText ? `📍 ${locationText}` : '📍 No location set'}
              </span>
              <button className="cpm-set-location-btn" onClick={() => setStep('location')}>
                {locationText ? 'Change' : 'Set Location'}
              </button>
            </div>

            {error && <p className="cpm-error">{error}</p>}

            <button
              className="cpm-submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Posting...' : `Share ${typeMeta?.label}`}
            </button>
          </div>
        )}

        {step === 'location' && (
          <div className="cpm-body cpm-location-step">
            {/* Search bar */}
            <div className="cpm-search-row">
              <input
                className="cpm-search-input"
                placeholder="Search a place..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="cpm-search-btn" onClick={handleSearch} disabled={searching}>
                {searching ? '…' : '🔍'}
              </button>
              <button className="cpm-gps-btn" onClick={handleCurrentLocation} disabled={locating} title="Use current location">
                {locating ? '…' : '🎯'}
              </button>
            </div>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <ul className="cpm-search-results">
                {searchResults.map((r) => (
                  <li key={r.place_id} onClick={() => handleSelectResult(r)}>
                    {r.display_name}
                  </li>
                ))}
              </ul>
            )}

            {/* Map */}
            <div className="cpm-map-wrapper">
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="cpm-map"
                key={mapCenter.join(',')}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler onPick={handlePickOnMap} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
              <p className="cpm-map-hint">Tap on the map to pin your location</p>
            </div>

            {locationText && (
              <p className="cpm-picked-location">📍 {locationText}</p>
            )}

            <div className="cpm-location-actions">
              <button className="cpm-back-btn" onClick={() => setStep('form')}>
                ← Back
              </button>
              <button
                className="cpm-confirm-location-btn"
                disabled={!locationText}
                onClick={() => setStep('form')}
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
