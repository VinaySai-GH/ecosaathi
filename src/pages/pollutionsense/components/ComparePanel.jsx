import React from 'react';

export default function ComparePanel({ locationA, locationB, onClose }) {
  if (!locationA || !locationB) return null;

  const scoreA = locationA.scoreData?.score || 0;
  const scoreB = locationB.scoreData?.score || 0;

  // Simple extraction of factors from the penalties arrays
  const getFactorA = (label) => locationA.scoreData?.penalties.find(p => p.label === label)?.desc || 'Unknown';
  const getFactorB = (label) => locationB.scoreData?.penalties.find(p => p.label === label)?.desc || 'Unknown';
  const getBonusA = (label) => locationA.scoreData?.bonuses.find(p => p.label === label)?.desc || 'None';
  const getBonusB = (label) => locationB.scoreData?.bonuses.find(p => p.label === label)?.desc || 'None';

  const rowData = [
    { label: 'Safety Score', valA: `${Math.round(scoreA)}/100`, valB: `${Math.round(scoreB)}/100`, isBetter: scoreA > scoreB ? 'A' : scoreB > scoreA ? 'B' : 'none' },
    { label: 'Air Quality', valA: getFactorA('Air Quality'), valB: getFactorB('Air Quality'), isBetter: 'none' },
    { label: 'Nearest Industry', valA: getFactorA('Industry'), valB: getFactorB('Industry'), isBetter: 'none' },
    { label: 'Highway Distance', valA: getFactorA('Highway'), valB: getFactorB('Highway'), isBetter: 'none' },
    { label: 'Wind Corridor', valA: getFactorA('Wind Corridor'), valB: getFactorB('Wind Corridor'), isBetter: 'none' },
    { label: 'Green Spaces', valA: getBonusA('Green Spaces'), valB: getBonusB('Green Spaces'), isBetter: 'none' },
    { label: 'Risk Zones', valA: getFactorA('Risk Zones'), valB: getFactorB('Risk Zones'), isBetter: 'none' },
  ];

  return (
    <div className="compare-panel anim-enter">
      <button className="close-btn" style={{top: 8, right: 8}} onClick={onClose}>✕</button>
      <h2>Compare Two Locations</h2>
      
      <table className="compare-table">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Location A</th>
            <th>Location B</th>
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, i) => (
            <tr key={i}>
              <td className="row-label">{row.label}</td>
              <td className={row.isBetter === 'A' ? 'better' : row.isBetter === 'B' ? 'worse' : ''}>
                {row.valA}
              </td>
              <td className={row.isBetter === 'B' ? 'better' : row.isBetter === 'A' ? 'worse' : ''}>
                {row.valB}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
