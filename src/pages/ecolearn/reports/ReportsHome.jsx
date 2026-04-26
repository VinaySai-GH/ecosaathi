import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { apiFetch } from '../../../api/client.js';
import { useAuth } from '../../../context/AuthContext';
import '../ecolearn.css';

// Fix Leaflet default icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLORS = {
  'Air Pollution':    '#94a3b8',
  'Water Pollution':  '#3b82f6',
  'Illegal Dumping':  '#f97316',
  'Open Burning':     '#ef4444',
  'Noise Pollution':  '#a855f7',
  'Deforestation':    '#22c55e',
};

const SEVERITY_LABELS = { Low: '🟡', Medium: '🟠', High: '🔴' };

function makeColorIcon(color) {
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.5)"></div>`,
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

export default function ReportsHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(null);

  const fetchReports = () => {
    setLoading(true);
    apiFetch('/ecoreport')
      .then(d => setReports(d.reports || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleUpvote = async (reportId) => {
    setUpvoting(reportId);
    try {
      const res = await apiFetch(`/ecoreport/${reportId}/upvote`, { method: 'PUT' });
      setReports(prev => prev.map(r =>
        r._id === reportId
          ? { ...r, upvotes: res.upvotes, status: res.status }
          : r
      ));
    } catch (e) {
      alert(e.message || 'Could not upvote. You may have already voted.');
    } finally {
      setUpvoting(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await apiFetch(`/ecoreport/${reportId}`, { method: 'DELETE' });
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (e) {
      alert(e.message || 'Could not delete report.');
    }
  };

  const TIRUPATI = [13.6288, 79.4192];

  return (
    <div className="el-page el-reports-page">
      <div className="el-reports-topbar">
        <button className="el-back-btn" onClick={() => navigate('/ecolearn')}>← Back to EcoLearn</button>
        <button className="el-report-new-btn" onClick={() => navigate('/ecolearn/reports/new')}>
          + Report Issue
        </button>
      </div>

      <div className="el-page-header">
        <h1 className="el-page-title">Civic Engagement — EcoReport</h1>
        <p className="el-page-subtitle">
          Report, track, and upvote environmental issues in your area. Reports reaching 10 upvotes become Community Verified ✓.
        </p>
      </div>

      <div className="el-type-legend">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="el-legend-item">
            <span className="el-legend-dot" style={{ background: color }} />
            {type}
          </span>
        ))}
      </div>

      <div className="el-reports-layout">
        {/* MAP */}
        <div className="el-map-container">
          <MapContainer center={TIRUPATI} zoom={13} className="el-leaflet-map">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {reports.map(r => (
              <Marker
                key={r._id}
                position={[r.location.lat, r.location.lng]}
                icon={makeColorIcon(TYPE_COLORS[r.type] || '#888')}
              >
                <Popup>
                  <div className="el-map-popup">
                    <span className="el-popup-type" style={{ color: TYPE_COLORS[r.type] }}>{r.type}</span>
                    <strong>{r.title}</strong>
                    <p>{r.description}</p>
                    <span>👍 {r.upvotes} upvotes &nbsp; {SEVERITY_LABELS[r.severity]} {r.severity}</span>
                    {r.status === 'community_verified' && <span className="el-verified-badge">Community Verified ✓</span>}
                    {user && (r.userId?._id === user._id || r.userId === user._id) && (
                      <button className="el-report-delete-btn" onClick={() => handleDelete(r._id)}>
                        Delete My Report
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* LIST */}
        <div className="el-reports-list">
          {loading && <div className="el-loading">Loading reports…</div>}
          {!loading && reports.length === 0 && (
            <div className="el-empty">No reports yet. Be the first to report an issue!</div>
          )}
          {reports.map(r => (
            <div key={r._id} className="el-report-card">
              <div className="el-report-card-top">
                <span className="el-report-type-dot" style={{ background: TYPE_COLORS[r.type] }} />
                <span className="el-report-type">{r.type}</span>
                <span className="el-report-severity">{SEVERITY_LABELS[r.severity]} {r.severity}</span>
                {r.status === 'community_verified' && (
                  <span className="el-verified-badge small">✓ Verified</span>
                )}
              </div>
              <h4 className="el-report-title">{r.title}</h4>
              <p className="el-report-desc">{r.description}</p>
              {r.location.address && (
                <p className="el-report-address">📍 {r.location.address}</p>
              )}
              <div className="el-report-card-footer">
                <span className="el-report-by">
                  by {r.userId?.name || 'Anonymous'}
                </span>
                <button
                  className="el-upvote-btn"
                  disabled={upvoting === r._id}
                  onClick={() => handleUpvote(r._id)}
                >
                  👍 {r.upvotes}
                </button>
                {user && (r.userId?._id === user._id || r.userId === user._id) && (
                  <button className="el-report-delete-btn-list" onClick={() => handleDelete(r._id)}>
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
