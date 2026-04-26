import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getModuleById } from './data/modules.js';
import { apiFetch } from '../../../api/client.js';
import '../ecolearn.css';

export default function QuizPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const mod = getModuleById(moduleId);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!mod) {
    return (
      <div className="el-page">
        <p className="el-error">Module not found.</p>
        <button className="el-back-btn" onClick={() => navigate('/ecolearn/lessons')}>← Back</button>
      </div>
    );
  }

  const questions = mod.quiz;
  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleSelect = (idx) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setShowFeedback(true);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (isLast) {
      setSubmitting(true);
      try {
        const res = await apiFetch('/ecolearn/quiz/submit', {
          method: 'POST',
          body: JSON.stringify({ moduleId, answers: newAnswers }),
        });
        setResult(res);
      } catch {
        setResult({ score: newAnswers.filter((a, i) => a === questions[i].correctIndex).length, total: 5, pointsEarned: 0 });
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowFeedback(false);
    }
  };

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <div className="el-page">
        <div className="el-quiz-result">
          <div className="el-quiz-result-icon">{pct >= 60 ? '🎉' : '📚'}</div>
          <h2 className="el-quiz-result-title">
            {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep Learning!'}
          </h2>
          <div className="el-quiz-score-circle" style={{ '--mod-color': mod.color }}>
            <span className="el-quiz-score-num">{result.score}</span>
            <span className="el-quiz-score-denom">/{result.total}</span>
          </div>
          <p className="el-quiz-result-pct">{pct}% correct</p>
          {result.pointsEarned > 0 && (
            <div className="el-quiz-points-badge">
              +{result.pointsEarned} Eco Pulse Points Earned! 🌿
            </div>
          )}
          {result.pointsEarned === 0 && (
            <p className="el-quiz-points-note">You already earned points for this module earlier.</p>
          )}
          <div className="el-quiz-result-actions">
            <button className="el-lesson-nav-btn secondary" onClick={() => navigate('/ecolearn/lessons')}>
              All Modules
            </button>
            <button
              className="el-lesson-nav-btn primary"
              style={{ background: mod.color }}
              onClick={() => navigate(`/ecolearn/lessons/${moduleId}/${mod.lessons[0].id}`)}
            >
              Review Lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = showFeedback && selected === q.correctIndex;

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate(`/ecolearn/lessons/${moduleId}/${mod.lessons[mod.lessons.length - 1].id}`)}>
        ← Back to Lessons
      </button>

      <div className="el-lesson-breadcrumb">
        <span style={{ color: mod.color }}>{mod.icon} {mod.title}</span>
        <span> / Quiz</span>
      </div>

      <div className="el-lesson-progress-bar">
        <div
          className="el-lesson-progress-fill"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: mod.color }}
        />
      </div>

      <div className="el-quiz-card">
        <div className="el-quiz-counter">Question {currentQ + 1} of {questions.length}</div>
        <h2 className="el-quiz-question">{q.question}</h2>

        <div className="el-quiz-options">
          {q.options.map((opt, idx) => {
            let cls = 'el-quiz-option';
            if (showFeedback) {
              if (idx === q.correctIndex) cls += ' correct';
              else if (idx === selected) cls += ' wrong';
            } else if (idx === selected) {
              cls += ' selected';
            }
            return (
              <button key={idx} className={cls} onClick={() => handleSelect(idx)}>
                <span className="el-quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className={`el-quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            <span>{isCorrect ? '✓ Correct!' : '✗ Incorrect'}</span>
            <p>{q.explanation}</p>
          </div>
        )}

        <div className="el-quiz-actions">
          {!showFeedback ? (
            <button
              className="el-lesson-nav-btn primary"
              style={{ background: mod.color }}
              disabled={selected === null}
              onClick={handleConfirm}
            >
              Confirm Answer
            </button>
          ) : (
            <button
              className="el-lesson-nav-btn primary"
              style={{ background: mod.color }}
              disabled={submitting}
              onClick={handleNext}
            >
              {submitting ? 'Submitting…' : isLast ? 'Finish Quiz' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
