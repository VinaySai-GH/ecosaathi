import React, { useState, useEffect } from 'react';

const STARS = ['✦', '✧', '⋆', '·', '✦'];

export default function InsightCard({ insight, isNew, generatedAt, onDismiss }) {
  const [visible, setVisible]   = useState(false);
  const [closing, setClosing]   = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Spawn sparkle positions once
  useEffect(() => {
    setSparkles(
      STARS.map((s, i) => ({
        sym: s,
        top:  `${8 + i * 14}%`,
        left: `${85 + (i % 2 === 0 ? 2 : -2)}%`,
        delay: `${i * 0.3}s`,
      }))
    );
  }, []);

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(() => onDismiss?.(), 350);
  };

  const dateLabel = generatedAt
    ? new Date(generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '';

  return (
    <div style={{
      ...styles.wrapper,
      opacity:    visible && !closing ? 1 : 0,
      transform:  visible && !closing ? 'translateY(0)' : 'translateY(-12px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    }}>
      {/* Glow orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Sparkles */}
      {sparkles.map((sp, i) => (
        <span key={i} style={{ ...styles.sparkle, top: sp.top, left: sp.left, animationDelay: sp.delay }}>
          {sp.sym}
        </span>
      ))}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.aiIcon}>🤖🌱</span>
          <span style={styles.aiLabel}>EcoSaathi AI</span>
          {isNew && <span style={styles.newBadge}>New ✨</span>}
        </div>
        <div style={styles.headerRight}>
          {dateLabel && <span style={styles.dateLabel}>{dateLabel}</span>}
          <button style={styles.closeBtn} onClick={handleDismiss} aria-label="Dismiss insight">✕</button>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Insight text */}
      <p style={styles.insightText}>{insight}</p>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.footerText}>🌿 Powered by your real data</span>
        <button style={styles.dismissBtn} onClick={handleDismiss}>Got it</button>
      </div>

      <style>{`
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1);   opacity: 0.5; }
          50%       { transform: translateY(-6px) scale(1.3); opacity: 1; }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1);   opacity: 0.25; }
          50%       { transform: scale(1.15); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  wrapper: {
    position:     'relative',
    overflow:     'hidden',
    background:   'linear-gradient(135deg, #0f0c29, #1a1040, #130f2a)',
    border:       '1px solid rgba(167,139,250,0.3)',
    borderRadius: '20px',
    padding:      '20px 22px 16px',
    marginBottom: '24px',
    boxShadow:    '0 8px 40px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
  },
  orb1: {
    position:     'absolute',
    width:        '160px',
    height:       '160px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)',
    top:          '-60px',
    right:        '-40px',
    animation:    'orbPulse 4s ease-in-out infinite',
    pointerEvents:'none',
  },
  orb2: {
    position:     'absolute',
    width:        '120px',
    height:       '120px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
    bottom:       '-40px',
    left:         '-30px',
    animation:    'orbPulse 5s ease-in-out infinite 1s',
    pointerEvents:'none',
  },
  sparkle: {
    position:   'absolute',
    color:      '#c4b5fd',
    fontSize:   '14px',
    animation:  'sparkleFloat 3s ease-in-out infinite',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  header: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   '12px',
  },
  headerLeft: {
    display:    'flex',
    alignItems: 'center',
    gap:        '8px',
  },
  aiIcon: {
    fontSize: '18px',
    marginRight: '4px',
    display: 'inline-block',
    animation: 'orbPulse 2s ease-in-out infinite',
  },
  aiLabel: {
    color:      '#c4b5fd',
    fontWeight: '700',
    fontSize:   '13px',
    letterSpacing: '0.3px',
  },
  newBadge: {
    background:   'rgba(167,139,250,0.15)',
    border:       '1px solid rgba(167,139,250,0.35)',
    borderRadius: '20px',
    padding:      '2px 8px',
    color:        '#a78bfa',
    fontSize:     '11px',
    fontWeight:   '700',
  },
  headerRight: {
    display:    'flex',
    alignItems: 'center',
    gap:        '10px',
  },
  dateLabel: {
    color:    '#6b7280',
    fontSize: '12px',
  },
  closeBtn: {
    background: 'transparent',
    border:     'none',
    color:      '#6b7280',
    fontSize:   '16px',
    cursor:     'pointer',
    padding:    '0 2px',
    lineHeight: '1',
    transition: 'color 0.2s',
  },
  divider: {
    height:     '1px',
    background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)',
    marginBottom: '14px',
  },
  insightText: {
    color:      '#e5e7eb',
    fontSize:   '15px',
    lineHeight: '1.7',
    margin:     '0 0 16px',
    fontStyle:  'italic',
    position:   'relative',
    zIndex:     1,
  },
  footer: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  footerText: {
    color:    '#6b7280',
    fontSize: '12px',
  },
  dismissBtn: {
    background:   'rgba(167,139,250,0.12)',
    border:       '1px solid rgba(167,139,250,0.25)',
    borderRadius: '20px',
    color:        '#a78bfa',
    fontSize:     '12px',
    fontWeight:   '700',
    padding:      '5px 14px',
    cursor:       'pointer',
    transition:   'background 0.2s',
  },
};
