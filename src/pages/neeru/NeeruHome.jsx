import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../constants/theme.js';
import { CITIES, DEFAULT_CITY } from '../../data/cities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import './neeru.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function NeeruHome() {
  const now = new Date();
  const [kl, setKl] = useState('');
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY.label);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [monthDropOpen, setMonthDropOpen] = useState(false);
  const [error, setError] = useState('');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleCalculate(e) {
    e.preventDefault();
    const parsed = parseFloat(kl);
    if (!kl || isNaN(parsed) || parsed <= 0) { setError('Please enter a valid water usage amount.'); return; }
    if (parsed > 500) { setError('That seems too high. Double-check your bill (max 500 KL).'); return; }
    setError('');
    navigate('/neeru/result', { state: { kl: parsed, cityLabel: selectedCity, month: selectedMonth + 1, year: selectedYear } });
  }

  return (
    <div className="neeru-page">
      <div className="page-scroll">
        <div className="neeru-header">
          <div className="neeru-header-top">
            <span className="neeru-eyebrow">NEERU</span>
            <button className="logout-btn" onClick={signOut}>Logout</button>
          </div>
          <h1 className="neeru-title">How much water<br />did you use?</h1>
          <p className="neeru-subtitle">Enter your monthly household usage from your water bill.</p>
        </div>

        <form onSubmit={handleCalculate}>
          <div className="neeru-section">
            <label className="neeru-label">Water used this month</label>
            <div className="kl-row">
              <input type="number" placeholder="e.g. 8.5" value={kl} min="0" step="0.1"
                onChange={(e) => { setKl(e.target.value); setError(''); }} className="kl-input" autoFocus />
              <div className="unit-badge"><span className="unit-text">KL</span></div>
            </div>
            <p className="neeru-hint">1 KL = 1000 litres. Check your bill for "units consumed" or "kl used".</p>
            {error && <p className="neeru-error">{error}</p>}
          </div>

          <div className="neeru-section">
            <label className="neeru-label">Billing month</label>
            <button type="button" className="dropdown-btn" onClick={() => { setMonthDropOpen(o => !o); setCityDropOpen(false); }}>
              <span>{MONTHS[selectedMonth]}, {selectedYear}</span>
              <span className="chevron">{monthDropOpen ? '▲' : '▼'}</span>
            </button>
            {monthDropOpen && (
              <div className="drop-list">
                {MONTHS.map((m, i) => (
                  <button type="button" key={m} className={`drop-item${i === selectedMonth ? ' active' : ''}`}
                    onClick={() => { setSelectedMonth(i); setMonthDropOpen(false); }}>{m}</button>
                ))}
              </div>
            )}
          </div>

          <div className="neeru-section">
            <label className="neeru-label">Your city</label>
            <button type="button" className="dropdown-btn" onClick={() => { setCityDropOpen(o => !o); setMonthDropOpen(false); }}>
              <span>{selectedCity}</span>
              <span className="chevron">{cityDropOpen ? '▲' : '▼'}</span>
            </button>
            {cityDropOpen && (
              <div className="drop-list">
                {CITIES.map((c) => (
                  <button type="button" key={c.label} className={`drop-item${c.label === selectedCity ? ' active' : ''}`}
                    onClick={() => { setSelectedCity(c.label); setCityDropOpen(false); }}>
                    {c.label} <span className="drop-state">· {c.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="button" className="scan-btn" disabled>
            <span>📷</span><span>Scan bill instead (coming soon)</span>
          </button>
          <button type="submit" className="cta-btn">See My Impact  →</button>
        </form>
      </div>
    </div>
  );
}
