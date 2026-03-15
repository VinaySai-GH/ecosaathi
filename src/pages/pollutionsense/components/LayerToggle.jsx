import React from 'react';

export default function LayerToggle({ layers, onChange }) {
  return (
    <div className="layer-toggles">
      {Object.entries(layers).map(([key, active]) => {
        const labels = {
          showAQI: "🌬️ AQI Heatmap",
          showIndustry: "🏭 Industries",
          showHighway: "🛣️ Traffic Zones",
          showWind: "💨 Wind Season",
          showGreen: "🌳 Green Spaces",
          showRisk: "⚠️ Risk Zones"
        };
        
        return (
          <button 
            key={key} 
            className={`toggle-btn ${active ? 'active' : ''}`}
            onClick={() => onChange({ ...layers, [key]: !active })}
          >
            {labels[key]}
          </button>
        );
      })}
    </div>
  );
}
