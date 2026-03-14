import React from 'react';
import './components.css';

export default function EquivalencyCard({ equivalency, kl, index }) {
  return (
    <div className="eq-card anim-enter" style={{ animationDelay: `${index * 150}ms` }}>
      <div className="eq-icon-bubble"><span className="eq-icon">{equivalency.icon}</span></div>
      <span className="eq-title">{equivalency.title}</span>
      <p className="eq-headline">{equivalency.compute(kl)}</p>
      <p className="eq-subtitle">{equivalency.subtitle}</p>
      <div className="eq-source-tag"><span className="eq-source-text">Source: {equivalency.source}</span></div>
    </div>
  );
}
