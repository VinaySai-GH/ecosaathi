import React from 'react';
import { Colors } from '../../../constants/theme.js';
import './components.css';

const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

export default function ShareCard({ kl, cityLabel, month, year, equivalency, benchmarkKl, status }) {
  const isOver = status === 'over';
  return (
    <div className="share-card-root" style={{ background: Colors.bg }}>
      <p className="sc-title">My EcoSaathi Water Report</p>
      <p className="sc-subtitle">{MONTHS[month]} {year} · {cityLabel}</p>
      <div className="sc-usage" style={{ background: Colors.surface, borderColor: Colors.border }}>
        <span className="sc-kl" style={{ color: isOver ? Colors.danger : Colors.accent }}>{kl} KL</span>
        <span className="sc-label">TOTAL USED</span>
      </div>
      <div className="sc-eq">
        <span className="sc-eq-icon">{equivalency ? equivalency.icon : '💧'}</span>
        <p className="sc-eq-text">That is equivalent to {equivalency ? equivalency.title.toLowerCase() : 'a lot of water'}!</p>
      </div>
      <p className="sc-branding">🌿 EcoSaathi</p>
    </div>
  );
}
