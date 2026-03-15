import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

import LayerToggle from './components/LayerToggle';
import MapLayers from './components/MapLayers';
import ScorePanel from './components/ScorePanel';
import ComparePanel from './components/ComparePanel';
import ReportModal from './components/ReportModal';
import { calculateSafetyScore } from './utils/scoreCalculator';
import './pollutionsense.css';

const TIRUPATI_CENTER = [13.6288, 79.4192];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const purpleIcon = L.divIcon({
  html: `<div style="font-size: 24px;">📍</div>`,
  className: 'custom-div-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 30]
});

function LocationClickWatcher({ onLocationSelect }) {
  useMapEvents({ click(e) { onLocationSelect(e.latlng.lat, e.latlng.lng); } });
  return null;
}

export default function PollutionSenseHome() {
  const [layers, setLayers] = useState({
    showAQI: true, showIndustry: true, showHighway: true,
    showWind: false, showGreen: true, showRisk: false
  });

  const [aqiData, setAqiData] = useState([]);
  const [parksData, setParksData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  
  // App Modes
  const [activeMode, setActiveMode] = useState('explore'); // explore | compare | report
  
  // Single location (Explore)
  const [selectedLocation, setSelectedLocation] = useState(null); // { lat, lng }
  const [scoreData, setScoreData] = useState(null);
  const [locationName, setLocationName] = useState('');

  // Compare mode
  const [compareA, setCompareA] = useState(null); // { lat, lng, scoreData }
  const [compareB, setCompareB] = useState(null); // { lat, lng, scoreData }

  useEffect(() => {
    fetchAQI();
    fetchParks();
    fetchReports();
  }, []);

  async function fetchAQI() {
    try {
      const res = await axios.get(`${API_URL}/pollutionsense/aqi?city=Tirupati`);
      if (res.data?.results) setAqiData(res.data.results);
    } catch (err) { console.error('Failed to fetch AQI', err); }
  }

  async function fetchReports() {
    try {
      const res = await axios.get(`${API_URL}/pollutionsense/reports`);
      if (res.data) setReportsData(res.data);
    } catch (err) { console.error('Failed to fetch reports', err); }
  }

  async function fetchParks() {
    try {
      const query = `[out:json];(node["leisure"="park"](13.55,79.35,13.75,79.60);way["leisure"="park"](13.55,79.35,13.75,79.60););out center;`;
      const res = await axios.post('https://overpass-api.de/api/interpreter', query, { headers: { 'Content-Type': 'text/plain' } });
      if (res.data?.elements) {
        setParksData(res.data.elements.map(el => ({ lat: el.lat || el.center?.lat, lon: el.lon || el.center?.lon })));
      }
    } catch (err) { console.error('Failed OSM overpass', err); }
  }

  const handleLocationSelect = async (lat, lng) => {
    const result = calculateSafetyScore(lat, lng, aqiData, parksData.length);
    
    if (activeMode === 'compare') {
      if (!compareA) {
        setCompareA({ lat, lng, scoreData: result });
      } else if (!compareB) {
        setCompareB({ lat, lng, scoreData: result });
      } else {
        // Reset and start over
        setCompareA({ lat, lng, scoreData: result });
        setCompareB(null);
      }
    } else {
      // Explore Mode (and we use this for report modal default coords too)
      setSelectedLocation({ lat, lng });
      setScoreData(result);
      setLocationName('Fetching location...');
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        setLocationName(res.data?.display_name || 'Unknown Location');
      } catch (err) {
        setLocationName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    }
  };

  const handleUpvote = async (reportId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/pollutionsense/reports/${reportId}/upvote`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
    } catch(err) { alert('You have already upvoted or are not logged in!'); }
  };

  const startCompare = () => { setActiveMode('compare'); setCompareA(null); setCompareB(null); setScoreData(null); };
  const exitCompare = () => { setActiveMode('explore'); setCompareA(null); setCompareB(null); };

  return (
    <div className="pollutionsense-page">
      <div className="ps-overlay-top">
        <LayerToggle layers={layers} onChange={setLayers} />
      </div>

      <div className="ps-overlay-buttons">
        {activeMode === 'compare' ? (
          <button className="ps-action-btn danger" onClick={exitCompare}>Cancel Compare</button>
        ) : (
          <button className="ps-action-btn" onClick={startCompare}>Compare Two Locations</button>
        )}
        <button className="ps-action-btn primary" onClick={() => setActiveMode('report')}>Report an Issue</button>
      </div>

      {activeMode === 'compare' && (!compareA || !compareB) && (
        <div className="compare-instruction-toast">
          Drop pin {!compareA ? '1' : '2'} on the map...
        </div>
      )}

      <div className="map-container-wrapper">
        <MapContainer center={TIRUPATI_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          <MapLayers {...layers} aqiData={aqiData} parksData={parksData} />
          <LocationClickWatcher onLocationSelect={handleLocationSelect} />
          
          {/* Explore Marker */}
          {activeMode !== 'compare' && selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
          
          {/* Compare Markers */}
          {activeMode === 'compare' && compareA && <Marker position={[compareA.lat, compareA.lng]}><Popup>Location A</Popup></Marker>}
          {activeMode === 'compare' && compareB && <Marker position={[compareB.lat, compareB.lng]}><Popup>Location B</Popup></Marker>}

          {/* User Reports */}
          {reportsData.map(rep => (
            <Marker key={rep._id} position={[rep.location.lat, rep.location.lng]} icon={purpleIcon}>
              <Popup>
                <strong>{rep.issueType}</strong>
                <p style={{margin: '4px 0'}}>{rep.description}</p>
                <button onClick={() => handleUpvote(rep._id)} className="upvote-btn">👍 Upvote ({rep.upvotes})</button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {activeMode === 'explore' && scoreData && (
        <div className="ps-overlay-right">
          <ScorePanel scoreData={scoreData} locationName={locationName} onClose={() => setScoreData(null)} />
        </div>
      )}

      {activeMode === 'compare' && compareA && compareB && (
        <div className="ps-overlay-right wide">
          <ComparePanel locationA={compareA} locationB={compareB} onClose={exitCompare} />
        </div>
      )}

      {activeMode === 'report' && (
        <ReportModal 
          location={selectedLocation || { lat: 13.6288, lng: 79.4192 }} 
          onClose={() => setActiveMode('explore')}
          onSubmitted={() => { setActiveMode('explore'); fetchReports(); }} 
        />
      )}
    </div>
  );
}
