import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../../api/client.js';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import './ecosandhya.css';

const CATEGORY_EMOJI = {
  food: '🍽️',
  water: '💧',
  transport: '🚌',
  waste: '♻️',
  nature: '🌿',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ── Helpers ─────────────────────────────────────────────────────────────────

function getTodayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Returns { hours, minutes, seconds } until the target HH:mm today/tomorrow */
function getCountdown(preferredTime, forceTomorrow = false) {
  const now = new Date();
  const [h, m] = (preferredTime || '21:00').split(':').map(Number);

  const target = new Date();
  target.setHours(h, m, 0, 0);

  // If target already passed today OR we want tomorrow's countdown
  if (target <= now || forceTomorrow) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target - now;
  return {
    hours:   Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total:   diff,
  };
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StreakCalendar({ history = [] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isAnswered = history[i] || false;
    const isToday = i === 6;
    return { label: DAYS[d.getDay()], isAnswered, isToday };
  });

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      padding: '16px 0 4px',
    }}>
      {days.map((d, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            background: d.isAnswered
              ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
              : 'rgba(255,255,255,0.05)',
            border: d.isToday ? '2px solid #a78bfa' : '2px solid transparent',
            boxShadow: d.isAnswered ? '0 0 10px rgba(124,58,237,0.4)' : 'none',
            transition: 'all 0.2s',
          }}>
            {d.isAnswered ? '✓' : ''}
          </div>
          <div style={{
            fontSize: '10px',
            color: d.isToday ? '#a78bfa' : '#6b7280',
            marginTop: '4px',
            fontWeight: d.isToday ? '700' : '400',
          }}>
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function CountdownTimer({ preferredTime, forceTomorrow }) {
  const [time, setTime] = useState(getCountdown(preferredTime, forceTomorrow));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCountdown(preferredTime, forceTomorrow));
    }, 1000);
    return () => clearInterval(interval);
  }, [preferredTime, forceTomorrow]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="es-countdown">
      <p className="es-countdown-label">
        {forceTomorrow ? '📅 Next reflection tomorrow' : '⏰ Next set of questions in'}
      </p>
      <div className="es-countdown-timer">
        <div className="es-countdown-block">
          <span className="es-countdown-num">{pad(time.hours)}</span>
          <span className="es-countdown-unit">hrs</span>
        </div>
        <span className="es-countdown-sep">:</span>
        <div className="es-countdown-block">
          <span className="es-countdown-num">{pad(time.minutes)}</span>
          <span className="es-countdown-unit">min</span>
        </div>
        <span className="es-countdown-sep">:</span>
        <div className="es-countdown-block">
          <span className="es-countdown-num">{pad(time.seconds)}</span>
          <span className="es-countdown-unit">sec</span>
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ quote }) {
  if (!quote) return null;
  return (
    <div className="es-quote-card">
      <span className="es-quote-icon">💡</span>
      <p className="es-quote-text">"{quote.text}"</p>
      <p className="es-quote-author">— {quote.author}</p>
    </div>
  );
}

function QuestionCard({ question, index, selectedAnswer, onSelect, disabled }) {
  const emoji = CATEGORY_EMOJI[question.category] || '🌍';
  const answers = [
    { key: 'Y',   label: '👍 Yes',  cls: 'yes' },
    { key: 'N',   label: '👎 No',   cls: 'no' },
    { key: 'Hmm', label: '🤔 Hmm',  cls: 'hmm' },
  ];

  return (
    <div className={`es-question-card ${selectedAnswer ? 'answered' : ''}`}>
      <div className="es-q-header">
        <span className="es-q-badge">{emoji} {question.category}</span>
        <span className="es-q-number">Q{index + 1} of 3</span>
      </div>
      <p className="es-q-text">{question.text}</p>
      <div className="es-answer-row">
        {answers.map(({ key, label, cls }) => (
          <button
            key={key}
            className={`es-answer-btn ${cls} ${selectedAnswer === key ? 'selected' : ''}`}
            onClick={() => onSelect(index, key)}
            disabled={disabled}
            aria-pressed={selectedAnswer === key}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function EcoSandhya() {
  const [loading, setLoading]         = useState(true);
  const [questions, setQuestions]     = useState([]);
  const [streak, setStreak]           = useState(0);
  const [preferredTime, setPreferred] = useState('21:00');
  const [history, setHistory]         = useState([]);
  const [quote, setQuote]             = useState(null);
  const [alreadyAnswered, setAlready] = useState(false);
  const [selections, setSelections]   = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const [submitResult, setResult]     = useState(null);
  const [error, setError]             = useState('');
  const [toast, setToast]             = useState({ show: false, msg: '' });

  const showToast = useCallback((msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/bot/today', { requireAuth: true });
        setQuestions(data.questions || []);
        setStreak(data.streak || 0);
        setAlready(data.alreadyAnswered);
        setPreferred(data.preferredTime || '21:00');
        setHistory(data.last7Days || []);
        setQuote(data.quote || null);
      } catch (err) {
        setError('Could not load today\'s questions. Is the server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (questionIndex, answer) => {
    if (alreadyAnswered || submitting) return;
    setSelections(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const allAnswered = questions.length > 0 &&
    questions.every((_, i) => selections[i] !== undefined);

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const question_ids = questions.map(q => q.id);
      const answers      = questions.map((_, i) => selections[i]);
      const res = await apiFetch('/bot/answer', {
        requireAuth: true,
        method: 'POST',
        body: JSON.stringify({ question_ids, answers }),
      });
      setResult(res);
      setAlready(true);
      setStreak(res.streak);
      
      // Update local history for today
      setHistory(prev => {
        const next = [...prev];
        next[6] = true;
        return next;
      });
      const milestone = res.milestone === '30_day_streak'
        ? '🎉 30-day streak! +50 bonus points!'
        : `🔥 Streak: ${res.streak} days! +${res.pointsAwarded} pts`;
      showToast(milestone);
    } catch (err) {
      if (err.status === 409) {
        setAlready(true);
        showToast('Already answered today! Come back tomorrow.');
      } else {
        setError(err.message || 'Something went wrong. Try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeChange = async (e) => {
    const newTime = e.target.value;
    setPreferred(newTime);
    try {
      await apiFetch('/bot/register', {
        requireAuth: true,
        method: 'POST',
        body: JSON.stringify({ preferred_time: newTime }),
      });
      showToast(newTime === 'Off' ? 'Bot messages turned off.' : `Reminder set for ${newTime}`);
    } catch (err) {
      showToast('Failed to update preference.');
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="es-loading">
        <div className="spinner" />
        <span>Loading tonight's questions…</span>
      </div>
    );
  }

  return (
    <div className="es-page">

      {/* Hero */}
      <AnimatedCard delay={0}>
        <div className="es-hero">
          <span className="es-moon">🌙</span>
          <h1 className="es-title">EcoSandhya</h1>
          <p className="es-subtitle">3 questions · every night · track your eco habits</p>
        </div>
      </AnimatedCard>

      {/* Stats row */}
      <AnimatedCard delay={80}>
        <div className="es-stats-row">
          <div className="es-stat-card">
            <p className="es-stat-label">🔥 Streak</p>
            <p className="es-stat-value">
              {streak} <span className="es-stat-unit">days</span>
            </p>
          </div>
          <div className="es-stat-card">
            <p className="es-stat-label">⚙️ Bot Settings</p>
            {preferredTime === 'Off' ? (
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ color: '#ef4444', fontSize: '14px', flex: 1 }}>Turned Off</span>
                <button
                  onClick={() => handleTimeChange({ target: { value: '21:00' } })}
                  style={{ padding: '6px 12px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                >
                  Turn On
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="time"
                  value={preferredTime}
                  onChange={handleTimeChange}
                  className="es-time-select"
                  style={{ flex: 1, margin: 0 }}
                />
                <button
                  onClick={() => handleTimeChange({ target: { value: 'Off' } })}
                  style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                  title="Turn off nightly messages"
                >
                  Stop
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 7-day streak calendar */}
        <StreakCalendar history={history} />
      </AnimatedCard>

      {/* Date banner */}
      <AnimatedCard delay={160}>
        <div className="es-date-banner">
          🌙 &nbsp;{getTodayLabel()}'s reflection
        </div>
      </AnimatedCard>

      {/* Questions or Already-answered */}
      {alreadyAnswered ? (
        <>
          <AnimatedCard delay={240}>
            <div className="es-done-banner">
              <span className="es-done-icon">🌟</span>
              <h2 className="es-done-title">
                {submitResult ? "Tonight's reflection done!" : "Already reflected today!"}
              </h2>
              <p className="es-done-sub">
                {submitResult
                  ? `You earned +${submitResult.pointsAwarded} points. Your streak is now ${submitResult.streak} days.`
                  : "You've already answered today's questions. Great job staying consistent!"}
              </p>
              <div className="es-done-streak">
                🔥 {streak}-day streak — come back tomorrow!
              </div>
            </div>
          </AnimatedCard>

          {/* Motivational Quote */}
          <AnimatedCard delay={320}>
            <QuoteCard quote={quote} />
          </AnimatedCard>

          {/* Countdown to next session */}
          <AnimatedCard delay={400}>
            <CountdownTimer preferredTime={preferredTime} forceTomorrow={true} />
          </AnimatedCard>
        </>
      ) : (
        <>
          <div className="es-whatsapp-prompt" style={{ textAlign: 'center', marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📱</span>
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>Time to reflect!</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.5' }}>
              We've moved the daily reflection exclusively to WhatsApp to make it even easier for you. 
              <br/><br/>
              Wait for your scheduled message, or text <strong>"hello"</strong> to the bot right now to get today's questions!
            </p>
          </div>
        </>
      )}

      {/* Toast */}
      <div className={`es-toast ${toast.show ? 'show' : ''}`}>
        {toast.msg}
      </div>

    </div>
  );
}
