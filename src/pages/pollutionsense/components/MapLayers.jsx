import React from 'react';
import { Circle, Popup, Marker, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';

import { TIRUPATI_INDUSTRIES } from '../data/industries';
import { TIRUPATI_RISK_ZONES } from '../data/riskZones';
import { getCurrentSeason } from '../data/windData';

// Custom icons based on industry type
const getIcon = (type) => {
  const emoji = {
    'thermal_power': '⚡',
    'sugar_factory': '🏭',
    'industrial_estate': '🏭',
    'waste_facility': '🔥',
    'airport': '✈️'
  }[type] || '🏭';

  return L.divIcon({
    html: `<div style="font-size: 24px;">${emoji}</div>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const HIGHWAY_COORDS = [
  [[13.6200, 79.3500], [13.6200, 79.4800]], // Mock NH-40 Segment
  [[13.6500, 79.4000], [13.6800, 79.3800]], // Mock Tirumala Road
];

export default function MapLayers({ 
  showAQI, showIndustry, showHighway, showWind, showGreen, showRisk,
  aqiData, parksData 
}) {
  const season = getCurrentSeason();

  return (
    <>
      {/* 1. AQI Layer */}
      {showAQI && aqiData && aqiData.map((sensor, idx) => {
        const val = sensor.parameter.value;
        const color = val > 200 ? '#8b0000' : val > 150 ? '#ff0000' : val > 100 ? '#ffa500' : val > 50 ? '#ffff00' : '#008000';
        return (
          <Circle
            key={`aqi-${idx}`}
            center={[sensor.coordinates.latitude, sensor.coordinates.longitude]}
            radius={800}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.5 }}
          >
            <Popup>
              <strong>{sensor.location}</strong><br/>
              AQI: {Math.round(val)}<br/>
              Last updated: {new Date(sensor.date.utc).toLocaleString()}
            </Popup>
          </Circle>
        );
      })}

      {/* 2. Industry Layer */}
      {showIndustry && TIRUPATI_INDUSTRIES.map((ind, idx) => (
        <React.Fragment key={`ind-${idx}`}>
          <Marker position={[ind.lat, ind.lng]} icon={getIcon(ind.type)}>
            <Popup>
              <strong>{ind.name}</strong><br/>
              Type: {ind.type}<br/>
              Risk: <span style={{color: ind.riskLevel==='high'?'red':'orange'}}>{ind.riskLevel.toUpperCase()}</span><br/>
              Pollutants: {ind.pollutants.join(', ')}<br/>
              <em>Safety Buffer: {ind.buffer_km}km</em>
            </Popup>
          </Marker>
          <Circle
            center={[ind.lat, ind.lng]}
            radius={ind.buffer_km * 1000}
            pathOptions={{ 
              color: ind.riskLevel === 'high' ? 'red' : 'orange', 
              fillColor: ind.riskLevel === 'high' ? 'red' : 'orange', 
              fillOpacity: ind.riskLevel === 'high' ? 0.3 : 0.2,
              weight: 1
            }}
          />
        </React.Fragment>
      ))}

      {/* 3. Highway Layer */}
      {showHighway && HIGHWAY_COORDS.map((line, idx) => (
        <Polyline 
          key={`hwy-${idx}`}
          positions={line}
          pathOptions={{ color: 'red', weight: 8, opacity: 0.3 }}
        />
      ))}

      {/* 4. Green Spaces Layer (Using mock circles if overpass API not fetched yet) */}
      {showGreen && parksData && parksData.map((park, idx) => (
        <Circle
          key={`park-${idx}`}
          center={[park.lat, park.lon]}
          radius={300}
          pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.4, weight: 1 }}
        />
      ))}

      {/* 5. Risk Zones Layer */}
      {showRisk && TIRUPATI_RISK_ZONES.map((zone, idx) => {
        const color = zone.type === 'flood' ? 'blue' : zone.type === 'noise_crowd' ? 'purple' : zone.type === 'construction' ? 'yellow' : 'red';
        if (zone.coordinates) {
          return (
            <Polygon 
              key={`risk-${idx}`}
              positions={zone.coordinates}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
            >
              <Popup><strong>{zone.name}</strong><br/>{zone.description}</Popup>
            </Polygon>
          );
        } else {
          return (
            <Circle 
              key={`risk-${idx}`}
              center={zone.center}
              radius={zone.radius_km * 1000}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
            >
              <Popup><strong>{zone.name}</strong><br/>{zone.description}</Popup>
            </Circle>
          );
        }
      })}
    </>
  );
}
