import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Colors } from '../../constants/theme.js';
import { CITIES, DEFAULT_CITY } from '../../data/cities.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiFetch } from '../../api/client.js';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import OCRCamera from './OCRCamera.jsx';
import PDFUploadModal from './PDFUploadModal.jsx';
import './neeru.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function NeeruHome() {
  const now = new Date();
  const [kl, setKl] = useState('');
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY.label);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear] = useState(now.getFullYear());
  const [cityDropOpen, setCityDropOpen] = useState(false);
  const [monthDropOpen, setMonthDropOpen] = useState(false);
  const [error, setError] = useState('');
  const [showOCR, setShowOCR] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [extractionFeedback, setExtractionFeedback] = useState('');
  const [pdfBillText, setPdfBillText] = useState(null);
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
    // Haptic feedback on successful save (Android/iOS)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); // Vibrate: 100ms on, 50ms off, 100ms on
    }
    navigate('/neeru/result', { state: { kl: parsed, cityLabel: selectedCity, month: selectedMonth + 1, year: selectedYear, billText: pdfBillText } });
  }

  // Keyboard shortcut: Cmd/Ctrl+Enter to submit
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const submitBtn = e.currentTarget.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  };

  const handleOCRExtracted = (extractedKL) => {
    // Auto-fill the KL field with extracted value
    setKl(extractedKL.toFixed(2));
    setError('');
    setShowOCR(false);
    setExtractionFeedback(`✅ Got ${extractedKL.toFixed(2)} KL from your bill!`);
    // Clear feedback after 3 seconds
    setTimeout(() => setExtractionFeedback(''), 3000);
  };

  const handleOCRCancel = () => {
    setShowOCR(false);
  };

  const handlePDFExtracted = (extractedKL, billText) => {
    setKl(extractedKL.toFixed(2));
    setPdfBillText(billText);
    setError('');
    setShowPDF(false);
    setExtractionFeedback(`✅ Got ${extractedKL.toFixed(2)} KL from your PDF!`);
    setTimeout(() => setExtractionFeedback(''), 3000);
  };

  const handlePDFCancel = () => {
    setShowPDF(false);
  };

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
            <p className="neeru-subtitle">Enter your monthly household usage from your water bill.</p>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={200}>
          {activeTab === 'log' && (
            <form onSubmit={handleCalculate} onKeyDown={handleKeyDown} role="form" aria-label="Water usage entry form">
              <div className="neeru-section">
                <label htmlFor="kl-input" className="neeru-label">Water used this month</label>
                <div className="kl-row">
                  <input id="kl-input" type="number" placeholder="e.g. 8.5" value={kl} min="0" step="0.1"
                    onChange={(e) => { setKl(e.target.value); setError(''); }} className="kl-input" autoFocus aria-label="Enter water usage in kiloliters" aria-invalid={error ? 'true' : 'false'} />
                  <div className="unit-badge" aria-hidden="true"><span className="unit-text">KL</span></div>
                </div>
                <p className="neeru-hint">1 KL = 1000 litres. Check your bill for "units consumed" or "kl used".</p>
                {error && <p className="neeru-error" role="alert" aria-live="polite">{error}</p>}
              </div>

              <div className="form-row">
                <div className="neeru-section">
                  <label htmlFor="month-dropdown" className="neeru-label">Billing month</label>
                  <button id="month-dropdown" type="button" className="dropdown-btn" onClick={() => { setMonthDropOpen(o => !o); setCityDropOpen(false); }} aria-expanded={monthDropOpen} aria-label="Select billing month">
                    <span>{MONTHS[selectedMonth]}, {selectedYear}</span>
                    <span className="chevron" aria-hidden="true">{monthDropOpen ? '▲' : '▼'}</span>
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
                  <label htmlFor="city-dropdown" className="neeru-label">Your city</label>
                  <button id="city-dropdown" type="button" className="dropdown-btn" onClick={() => { setCityDropOpen(o => !o); setMonthDropOpen(false); }} aria-expanded={cityDropOpen} aria-label="Select your city">
                    <span>{selectedCity}</span>
                    <span className="chevron" aria-hidden="true">{cityDropOpen ? '▲' : '▼'}</span>
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
              </div>

              <button type="button" className="scan-btn" onClick={() => setShowOCR(true)} aria-label="Open camera to scan water bill">
                <span aria-hidden="true">📷</span><span>Scan bill</span>
              </button>
              <button type="button" className="scan-btn" onClick={() => setShowPDF(true)} aria-label="Upload PDF water bill">
                <span aria-hidden="true">📄</span><span>Upload PDF</span>
              </button>
              {extractionFeedback && (
                <div className="extraction-feedback" role="status" aria-live="polite" aria-atomic="true">
                  {extractionFeedback}
                </div>
              )}
              <button type="submit" className="cta-btn" aria-label="Submit water usage and see personalized impact analysis">See My Impact  →</button>
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

      {showOCR && (
        <OCRCamera
          onExtractedKL={handleOCRExtracted}
          onCancel={handleOCRCancel}
        />
      )}

      {showPDF && (
        <PDFUploadModal
          onExtracted={handlePDFExtracted}
          onClose={handlePDFCancel}
        />
      )}
    </div>
  );
}
