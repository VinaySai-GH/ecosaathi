import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

export default function ReportModal({ location, onClose, onSubmitted }) {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState('Other');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using existing local API setup
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/pollutionsense/report`, {
        issueType,
        description,
        location: {
          lat: location.lat,
          lng: location.lng
          // Address could be passed here if reverse geocoded
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsSubmitting(false);
      onSubmitted();
    } catch (error) {
      console.error('Failed to submit report', error);
      setIsSubmitting(false);
      alert('Failed to submit report. Ensure you are logged in.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="ps-modal anim-enter">
        <div className="modal-header">
          <h2>Report an Issue</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Issue Type</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
              <option value="New construction started">New construction started</option>
              <option value="Factory smell / smoke reported">Factory smell / smoke reported</option>
              <option value="Flooding / waterlogging">Flooding / waterlogging</option>
              <option value="Unusually bad air quality today">Unusually bad air quality today</option>
              <option value="Noise complaint">Noise complaint</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description (Max 200 chars)</label>
            <textarea 
              rows={4}
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue briefly..."
              required
            />
          </div>

          <div className="form-group help-text">
            📍 Location autofilled: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
