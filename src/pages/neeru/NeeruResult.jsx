import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Colors } from '../../constants/theme.js';
import EquivalencyCard from './components/EquivalencyCard.jsx';
import BenchmarkBar from './components/BenchmarkBar.jsx';
import TipCard from './components/TipCard.jsx';
import ShareCard from './components/ShareCard.jsx';
import InsightCard from './components/InsightCard.jsx';
import BillAnalysisCard from './components/BillAnalysisCard.jsx';
import TrendChart from './components/TrendChart.jsx';
import StreakCounter from './components/StreakCounter.jsx';
import InsightCarousel from './InsightCarousel.jsx';
import { pickEquivalencies } from '../../data/equivalencies.js';
import { findCity, getBenchmarkStatus } from '../../data/cities.js';
import { pickTips } from '../../data/tips.js';
import { submitWaterLog, getUserHistory } from '../../services/neeru.service.js';
import './neeru.css';

const MONTH_NAMES = ['','January','February','March','April','May','June','July','August','September','October','November','December'];

export default function NeeruResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { kl, cityLabel, month, year, billText } = location.state || {};
  const city = findCity(cityLabel);
  const status = getBenchmarkStatus(kl, city);
  const equivalencies = pickEquivalencies(kl);
  const tips = pickTips(status, city.isWaterStressed, cityLabel);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const shareRef = useRef(null);

  // Fetch user history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getUserHistory();
        setUserHistory(history || []);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  const isOver = status === 'over';
  const statusEmoji = isOver ? '⚠️' : '✅';
  const statusMsg = isOver
    ? `You used ${(kl - city.benchmark_kl).toFixed(1)} KL more than ${cityLabel}'s guideline`
    : `You're ${(city.benchmark_kl - kl).toFixed(1)} KL under ${cityLabel}'s guideline`;

  const handleShare = useCallback(async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareRef.current, { backgroundColor: Colors.bg });
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'ecosaathi.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'My EcoSaathi Water Report', files: [file] });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'ecosaathi-water-report.png'; a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) { console.error('Share failed', err); }
  }, [kl, cityLabel, month, year, status]);

  const handleSave = useCallback(async (overwrite = false) => {
    setIsSaving(true);
    try {
      await submitWaterLog(kl, month, year, cityLabel, overwrite);
      setIsSaved(true); setConfirmOverwrite(null);
    } catch (error) {
      if (error.status === 409 && error.data?.exists) {
        setConfirmOverwrite({ existingKl: error.data.existingKl });
      } else { alert(error.message || 'Could not save water log.'); }
    } finally { setIsSaving(false); }
  }, [kl, month, year, cityLabel]);

  if (!kl || !cityLabel) return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <p style={{ color: 'var(--text-muted)' }}>No data to display.</p>
      <button className="cta-btn" onClick={() => navigate('/')} style={{ marginTop: 24, maxWidth: 200 }}>← Go Back</button>
    </div>
  );

  return (
    <div className="neeru-page">
      <div className="result-topbar">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <span className="result-topbar-title">Your Impact</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="page-scroll">
        <div className={`hero-card anim-enter${isOver ? ' over' : ''}`}>
          <span className="hero-month">{MONTH_NAMES[month]} {year}</span>
          <div className="hero-row">
            <span className="hero-kl" style={{ color: isOver ? Colors.danger : Colors.accent }}>{kl}</span>
            <span className="hero-unit">KL</span>
          </div>
          <span className="hero-city">{cityLabel}</span>
          <div className="status-pill" style={{ background: isOver ? Colors.dangerDim : Colors.successDim }}>
            <span style={{ color: isOver ? Colors.danger : Colors.accent }}>{statusEmoji} {statusMsg}</span>
          </div>
        </div>

        <h3 className="section-heading">What does this actually mean?</h3>
        
        {/* Insight Carousel with equivalencies, insight card, and tips */}
        <InsightCarousel slides={[
          ...equivalencies.map(eq => <EquivalencyCard key={eq.id} equivalency={eq} kl={kl} />),
          ...(billText ? [<BillAnalysisCard key="bill" kl={kl} billText={billText} city={city} previousKL={userHistory[0]?.kl_used} />] : []),
          <InsightCard
            kl={kl}
            city={city}
            status={status}
            prevKl={userHistory[0]?.kl_used}
            hostelAvg={null}
          />,
          ...tips.map(tip => <TipCard key={tip.id} tip={tip} />)
        ]} />

        <h3 className="section-heading">vs. {cityLabel}</h3>
        <BenchmarkBar kl={kl} city={city} />

        <h3 className="section-heading">Your Streak</h3>
        <StreakCounter userHistory={userHistory} />

        {!isLoadingHistory && userHistory.length > 0 && (
          <>
            <h3 className="section-heading">Last 3 Months</h3>
            <TrendChart history={userHistory} />
          </>
        )}

        <button className={`save-btn${isSaved ? ' saved' : ''}`} onClick={() => handleSave(false)} disabled={isSaving || isSaved}>
          {isSaving ? 'Saving…' : isSaved ? '✅ Saved to your trend' : '💾 Save to my Monthly Trend'}
        </button>

        {confirmOverwrite && (
          <div className="overwrite-box">
            <p className="overwrite-msg">
              You already logged <strong>{confirmOverwrite.existingKl} KL</strong> for {MONTH_NAMES[month]} {year}.
              Overwrite with <strong>{kl} KL</strong>?
            </p>
            <div className="overwrite-actions">
              <button className="overwrite-cancel" onClick={() => setConfirmOverwrite(null)}>Cancel</button>
              <button className="overwrite-confirm" onClick={() => handleSave(true)}>Overwrite</button>
            </div>
          </div>
        )}

        <button className="share-btn" onClick={handleShare}>
          <span style={{ fontSize: 26 }}>📤</span>
          <div>
            <div className="share-btn-title">Share My Water Report</div>
            <div className="share-btn-sub">WhatsApp, Instagram &amp; more</div>
          </div>
        </button>
      </div>

      <div ref={shareRef} style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <ShareCard kl={kl} cityLabel={cityLabel} month={month} year={year}
          equivalency={equivalencies[0]} benchmarkKl={city.benchmark_kl} status={status} />
      </div>
    </div>
  );
}
