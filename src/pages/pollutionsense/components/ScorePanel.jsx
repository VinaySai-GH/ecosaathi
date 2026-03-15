import React from 'react';

export default function ScorePanel({ scoreData, locationName, onClose }) {
  if (!scoreData) return null;

  const { score, penalties, bonuses } = scoreData;

  let badgeClass = 'hazardous';
  let badgeText = 'Hazardous';
  let recommendation = '🚫 Avoid. Serious health risks from pollution exposure.';
  
  if (score >= 75) {
    badgeClass = 'good';
    badgeText = 'Good';
    recommendation = '✅ This area is suitable for residential living.';
  } else if (score >= 50) {
    badgeClass = 'moderate';
    badgeText = 'Moderate';
    recommendation = '⚠️ Acceptable with awareness. Check specific concerns below.';
  } else if (score >= 25) {
    badgeClass = 'poor';
    badgeText = 'Poor';
    recommendation = '❌ Not recommended for families with children or elderly.';
  }

  return (
    <div className="score-panel anim-enter">
      <button className="close-btn" onClick={onClose}>✕</button>
      
      <div className="score-header">
        <div className={`score-circle ${badgeClass}`}>
          <span className="score-num">{Math.round(score)}</span>
          <span className="score-max">/100</span>
        </div>
        <div>
          <h2 className="score-title">Zone Safety Score</h2>
          <span className={`score-badge ${badgeClass}`}>{badgeText}</span>
        </div>
      </div>

      <p className="score-location">📍 {locationName || 'Fetching location...'}</p>
      
      <div className="score-recommendation">
        {recommendation}
      </div>

      <div className="score-breakdown">
        <h3>Factor Breakdown</h3>
        <div className="factor-list">
          {[...penalties, ...bonuses].map((factor, i) => (
            <div key={i} className="factor-item">
              <div className="factor-left">
                <span className="factor-icon">{factor.icon}</span>
                <div>
                  <div className="factor-label">{factor.label}</div>
                  <div className="factor-desc">{factor.desc}</div>
                </div>
              </div>
              <div className={`factor-pts ${String(factor.pts).startsWith('+') ? 'positive' : factor.pts === 0 ? 'neutral' : 'negative'}`}>
                {factor.pts > 0 ? `+${factor.pts}` : factor.pts} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
