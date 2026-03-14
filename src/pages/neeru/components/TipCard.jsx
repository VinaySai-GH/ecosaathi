import React from 'react';
import './components.css';

export default function TipCard({ tip, index }) {
  return (
    <div className="tip-card">
      <div className="tip-index">{index + 1}</div>
      <span className="tip-icon">{tip.icon}</span>
      <p className="tip-text">{tip.text}</p>
    </div>
  );
}
