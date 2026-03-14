import React, { useEffect, useState } from 'react';
import { Colors } from '../../../constants/theme.js';
import './components.css';

export default function BenchmarkBar({ kl, city }) {
  const [filled, setFilled] = useState(false);
  const isOver = kl > city.benchmark_kl;
  const isAt   = kl === city.benchmark_kl;
  const userPct  = Math.min((kl / (city.benchmark_kl * 2)) * 100, 100);
  const statusColor = isOver ? Colors.danger : Colors.accent;
  const statusLabel = isOver ? 'Above recommended' : isAt ? 'Right at limit' : 'Under recommended ✓';
  const diffKl = Math.abs(kl - city.benchmark_kl).toFixed(1);
  const diffMsg = isOver ? `${diffKl} KL over ${city.label}'s monthly guideline`
    : isAt ? `Exactly at ${city.label}'s monthly guideline`
    : `${diffKl} KL under ${city.label}'s monthly guideline`;

  useEffect(() => { const t = setTimeout(() => setFilled(true), 400); return () => clearTimeout(t); }, []);

  return (
    <div className="benchmark-wrapper">
      <span className="benchmark-section-label">City Benchmark</span>
      <div className="benchmark-numbers">
        <div>
          <span className="num-label">You used</span>
          <span className="num-value" style={{ color: statusColor }}>{kl} KL</span>
        </div>
        <div className="num-divider" />
        <div style={{ textAlign: 'right' }}>
          <span className="num-label">{city.label} guideline</span>
          <span className="num-value">{city.benchmark_kl} KL</span>
        </div>
      </div>
      <div className="bench-track">
        <div className="bench-fill" style={{ width: filled ? `${userPct}%` : '0%', backgroundColor: statusColor, transition: 'width 0.8s ease' }} />
        <div className="bench-marker" style={{ left: '50%' }}>
          <div className="bench-marker-line" />
          <span className="bench-marker-label">guideline</span>
        </div>
      </div>
      <div className="bench-pill" style={{ background: isOver ? Colors.dangerDim : Colors.successDim }}>
        <span style={{ color: statusColor }}>{statusLabel} — {diffMsg}</span>
      </div>
      {city.isWaterStressed && <p className="bench-stress-note">⚠️ {city.label} is a water-stressed city. Every litre matters.</p>}
    </div>
  );
}
