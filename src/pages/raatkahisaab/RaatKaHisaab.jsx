import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../../api/client.js';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import './raatkahisaab.css';

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

// ── Sub-components ───────────────────────────────────────────────────────────

function StreakCalendar({ streak }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const isAnswered = i >= 7 - Math.min(streak, 7);
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

function QuestionCard({ question, index, selectedAnswer, onSelect, disabled }) {
  const emoji = CATEGORY_EMOJI[question.category] || '🌍';
  const answers = [
    { key: 'Y',   label: '👍 Yes',  cls: 'yes' },
    { key: 'N',   label: '👎 No',   cls: 'no' },
    { key: 'Hmm', label: '🤔 Hmm',  cls: 'hmm' },
  ];

  return (
    <div className={`rkh-question-card ${selectedAnswer ? 'answered' : ''}`}>
      <div className="rkh-q-header">
        <span className="rkh-q-badge">{emoji} {question.category}</span>
        <span className="rkh-q-number">Q{index + 1} of 3</span>
      </div>
      <p className="rkh-q-text">{question.text}</p>
      <div className="rkh-answer-row">
        {answers.map(({ key, label, cls }) => (
          <button
            key={key}
            className={`rkh-answer-btn ${cls} ${selectedAnswer === key ? 'selected' : ''}`}
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

export default function RaatKaHisaab() {
  const [loading, setLoading]         = useState(true);
  const [questions, setQuestions]     = useState([]);
  const [streak, setStreak]           = useState(0);
  const [alreadyAnswered, setAlready] = useState(false);
  const [selections, setSelections]   = useState({}); // { 0: 'Y', 1: 'N', 2: 'Hmm' }
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

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="rkh-loading">
        <div className="spinner" />
        <span>Loading tonight's questions…</span>
      </div>
    );
  }

  return (
    <div className="rkh-page">

      {/* Hero */}
      <AnimatedCard delay={0}>
        <div className="rkh-hero">
          <span className="rkh-moon">🌙</span>
          <h1 className="rkh-title">Raat Ka Hisaab</h1>
          <p className="rkh-subtitle">3 questions · every night · track your eco habits</p>
        </div>
      </AnimatedCard>

      {/* Stats row */}
      <AnimatedCard delay={80}>
        <div className="rkh-stats-row">
          <div className="rkh-stat-card">
            <p className="rkh-stat-label">🔥 Streak</p>
            <p className="rkh-stat-value">
              {streak} <span className="rkh-stat-unit">days</span>
            </p>
          </div>
          <div className="rkh-stat-card">
            <p className="rkh-stat-label">✅ Status</p>
            <p className="rkh-stat-value" style={{ fontSize: '18px', paddingTop: '5px' }}>
              {alreadyAnswered ? 'Done today!' : 'Pending'}
            </p>
          </div>
        </div>

        {/* 7-day streak calendar */}
        <StreakCalendar streak={streak} />
      </AnimatedCard>

      {/* Date banner */}
      <AnimatedCard delay={160}>
        <div className="rkh-date-banner">
          🌙 &nbsp;{getTodayLabel()}'s reflection
        </div>
      </AnimatedCard>

      {/* Questions or Already-answered */}
      {alreadyAnswered ? (
        <AnimatedCard delay={240}>
          <div className="rkh-done-banner">
            <span className="rkh-done-icon">🌟</span>
            <h2 className="rkh-done-title">
              {submitResult ? "Tonight's reflection done!" : "Already reflected today!"}
            </h2>
            <p className="rkh-done-sub">
              {submitResult
                ? `You earned +${submitResult.pointsAwarded} points. Your streak is now ${submitResult.streak} days.`
                : "You've already answered today's questions. Great job staying consistent!"}
            </p>
            <div className="rkh-done-streak">
              🔥 {streak}-day streak — come back tomorrow!
            </div>
          </div>
        </AnimatedCard>
      ) : (
        <>
          <div className="rkh-questions-section">
            {questions.map((q, i) => (
              <AnimatedCard key={q.id} delay={240 + i * 100}>
                <QuestionCard
                  question={q}
                  index={i}
                  selectedAnswer={selections[i]}
                  onSelect={handleSelect}
                  disabled={submitting}
                />
              </AnimatedCard>
            ))}
          </div>

          {error && <p className="rkh-error">{error}</p>}

          <AnimatedCard delay={560}>
            <button
              className="rkh-submit-btn"
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting
                ? '⏳ Saving…'
                : allAnswered
                  ? '✨ Submit Reflection'
                  : `Answer all 3 questions (${Object.keys(selections).length}/3)`}
            </button>
          </AnimatedCard>
        </>
      )}

      {/* Toast */}
      <div className={`rkh-toast ${toast.show ? 'show' : ''}`}>
        {toast.msg}
      </div>

    </div>
  );
}
