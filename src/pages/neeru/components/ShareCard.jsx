import React from 'react';
import { Colors } from '../../../constants/theme.js';
import './components.css';

const MONTHS = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

export default function ShareCard({ kl, cityLabel, month, year, equivalency, benchmarkKl, status }) {
  const isOver = status === 'over';
  const diff = Math.abs(kl - benchmarkKl).toFixed(1);
  const statusLine = isOver
    ? `⚠️ ${diff} KL above ${cityLabel}'s guideline`
    : `✅ ${diff} KL under ${cityLabel}'s guideline`;

  return (
    <div className="share-card-root">
      <div className="sc-gradient-overlay">
        {/* Brand header */}
        <div className="sc-brand-row">
          <span className="sc-brand-icon">🌿</span>
          <span className="sc-brand-name">EcoSaathi</span>
          <span className="sc-brand-tag">NEERU</span>
        </div>

        <div className="sc-divider" />

        <p className="sc-meta">
          {MONTHS[month]} {year} · {cityLabel}
        </p>

        <div className="sc-kl-row">
          <span className="sc-kl-number" style={{ color: isOver ? Colors.danger : Colors.accent }}>
            {kl}
          </span>
          <span className="sc-kl-unit"> KL</span>
        </div>
        <p className="sc-kl-label">water used this month</p>

        {/* Equivalency Card */}
        <div className="sc-eq-box">
          <span className="sc-eq-icon">{equivalency ? equivalency.icon : '💧'}</span>
          <p className="sc-eq-text">
            {equivalency ? equivalency.compute(kl) : `That is equivalent to a lot of water!`}
          </p>
        </div>

        {/* Status Pill */}
        <div className="sc-status-pill" style={{ backgroundColor: isOver ? Colors.dangerDim : Colors.successDim }}>
          <span className="sc-status-text" style={{ color: isOver ? Colors.danger : Colors.accent }}>
            {statusLine}
          </span>
        </div>

        <p className="sc-footer-cta">Track your water impact → EcoSaathi</p>
      </div>
    </div>
  );
}
