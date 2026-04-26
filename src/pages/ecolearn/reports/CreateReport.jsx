import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiFetch } from '../../../api/client.js';
import '../ecolearn.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ISSUE_TYPES = ['Air Pollution', 'Water Pollution', 'Illegal Dumping', 'Open Burning', 'Noise Pollution', 'Deforestation'];
const SEVERITIES = ['Low', 'Medium', 'High'];
const TIRUPATI = [13.6288, 79.4192];

function MapPicker({ position, setPosition }) {
  useMapEvents({
    click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
  });
  return position ? <Marker position={position} /> : null;
}

export default function CreateReport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'Air Pollution',
    title: '',
    description: '',
    severity: 'Medium',
    address: '',
  });
  const [position, setPosition] = useState(null);
  const [photoB64, setPhotoB64] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => setError('Could not detect location. Click on the map to pick one.')
    );
  };

  useEffect(() => { detectLocation(); }, []);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoB64(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!position) { setError('Please pick a location on the map or detect automatically.'); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }

    setSubmitting(true);
    try {
      await apiFetch('/ecoreport', {
        method: 'POST',
        body: JSON.stringify({
          type: form.type,
          title: form.title.trim(),
          description: form.description.trim(),
          severity: form.severity,
          location: { lat: position[0], lng: position[1], address: form.address.trim() },
          photoUrl: photoB64 || null,
        }),
      });
      navigate('/ecolearn/reports');
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate('/ecolearn/reports')}>← Back to Reports</button>

      <div className="el-page-header">
        <h1 className="el-page-title">Report an Environmental Issue</h1>
        <p className="el-page-subtitle">
          Reporting earns you +10 Eco Pulse points. Reports with 10+ upvotes become Community Verified (+5 more pts).
        </p>
      </div>

      <form className="el-create-form" onSubmit={handleSubmit}>
        <div className="el-form-row">
          <label className="el-form-label">Issue Type</label>
          <div className="el-type-selector">
            {ISSUE_TYPES.map(t => (
              <button
                type="button"
                key={t}
                className={`el-type-btn ${form.type === t ? 'active' : ''}`}
                onClick={() => setForm(f => ({ ...f, type: t }))}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="el-form-row">
          <label className="el-form-label">Title *</label>
          <input
            className="el-form-input"
            type="text"
            maxLength={120}
            placeholder="Brief title describing the issue"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
        </div>

        <div className="el-form-row">
          <label className="el-form-label">Description *</label>
          <textarea
            className="el-form-textarea"
            maxLength={1000}
            rows={4}
            placeholder="Describe what you observed, when, and how severe it appears"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        <div className="el-form-row">
          <label className="el-form-label">Severity</label>
          <div className="el-severity-selector">
            {SEVERITIES.map(s => (
              <button
                type="button"
                key={s}
                className={`el-severity-btn ${form.severity === s ? 'active' : ''} sev-${s.toLowerCase()}`}
                onClick={() => setForm(f => ({ ...f, severity: s }))}
              >
                {s === 'Low' ? '🟡' : s === 'Medium' ? '🟠' : '🔴'} {s}
              </button>
            ))}
          </div>
        </div>

        <div className="el-form-row">
          <label className="el-form-label">Location</label>
          <input
            className="el-form-input"
            type="text"
            placeholder="Address or landmark (optional)"
            value={form.address}
            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
          />
          <button type="button" className="el-detect-btn" onClick={detectLocation}>
            📍 Detect My Location
          </button>
          {position && (
            <p className="el-coords-note">
              Pinned at {position[0].toFixed(5)}, {position[1].toFixed(5)} (or click map to reposition)
            </p>
          )}
          <div className="el-create-map-wrapper">
            <MapContainer center={position || TIRUPATI} zoom={14} className="el-leaflet-map create">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <MapPicker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>

        <div className="el-form-row">
          <label className="el-form-label">Photo (optional)</label>
          <input
            className="el-form-file"
            type="file"
            accept="image/*"
            onChange={handlePhoto}
          />
          {photoB64 && <img src={photoB64} alt="preview" className="el-photo-preview" />}
        </div>

        {error && <div className="el-form-error">{error}</div>}

        <button
          type="submit"
          className="el-lesson-nav-btn primary"
          style={{ background: '#f97316' }}
          disabled={submitting}
        >
          {submitting ? 'Submitting…' : 'Submit Report (+10 pts)'}
        </button>
      </form>
    </div>
  );
}
