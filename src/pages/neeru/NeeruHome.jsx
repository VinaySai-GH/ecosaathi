import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../constants/theme.js';
import { CITIES, DEFAULT_CITY } from '../../data/cities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiFetch } from '../../api/client.js';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
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

  // History State
  const [activeTab, setActiveTab] = useState('log'); // 'log' or 'history'
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await apiFetch('/neeru/history', { requireAuth: true });
      setHistoryLogs(res.logs || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

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
        <AnimatedCard delay={0}>
          <div className="neeru-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="neeru-header-top">
                  <span className="neeru-eyebrow">NEERU</span>
                </div>
                <h1 className="neeru-title">How much water<br />did you use?</h1>
              </div>
              <button 
                onClick={() => setActiveTab(activeTab === 'log' ? 'history' : 'log')}
                style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  color: '#fff', 
                  padding: '8px 16px', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  fontSize: '14px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                {activeTab === 'log' ? '📜 My History' : '💧 Log Water'}
              </button>
            </div>
            <p className="neeru-subtitle">Track your monthly household usage.</p>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
        {activeTab === 'log' && (
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

            <button type="submit" className="cta-btn">Calculate Impact  →</button>
          </form>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {loadingHistory ? (
              <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}><div className="spinner"></div></div>
            ) : historyLogs.length === 0 ? (
              <p style={{ color: '#aaa', textAlign: 'center', marginTop: '20px' }}>No logs found yet. Start logging your water!</p>
            ) : (
              historyLogs.map(log => (
                <div key={log._id} style={{ background: '#11221c', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #25D366' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '18px' }}>{MONTHS[log.month - 1]} {log.year}</h4>
                      <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>📍 {log.city} • Recorded {new Date(log.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#25D366', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>{log.kl_used}</p>
                      <p style={{ color: '#888', margin: 0, fontSize: '12px', textTransform: 'uppercase' }}>Kiloliters</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </AnimatedCard>

      </div>
    </div>
  );
}
