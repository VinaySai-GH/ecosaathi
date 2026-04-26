import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULES } from './data/modules.js';
import { apiFetch } from '../../../api/client.js';
import '../ecolearn.css';

function getModuleStatus(moduleId, progressList) {
  const prog = progressList.find(p => p.moduleId === moduleId);
  if (!prog) return 'not-started';
  if (prog.quizScore !== null && prog.quizScore !== undefined) return 'completed';
  if (prog.lessonsCompleted && prog.lessonsCompleted.length > 0) return 'in-progress';
  return 'not-started';
}

const STATUS_LABELS = {
  'not-started': { label: 'Not Started', class: 'status-not-started' },
  'in-progress':  { label: 'In Progress', class: 'status-in-progress' },
  'completed':    { label: 'Completed ✓', class: 'status-completed' },
};

export default function LessonsHome() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/ecolearn/progress')
      .then(data => setProgress(data.progress || []))
      .catch(() => setProgress([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate('/ecolearn')}>← Back to EcoLearn</button>
      <div className="el-page-header">
        <h1 className="el-page-title">Lessons & Quizzes</h1>
        <p className="el-page-subtitle">
          Six topic modules covering India's biggest environmental challenges.
          Complete each module to earn Eco Pulse points.
        </p>
      </div>

      {loading ? (
        <div className="el-loading">Loading your progress…</div>
      ) : (
        <div className="el-modules-grid">
          {MODULES.map(mod => {
            const status = getModuleStatus(mod.id, progress);
            const { label, class: cls } = STATUS_LABELS[status];
            const prog = progress.find(p => p.moduleId === mod.id);
            const lessonsCount = prog?.lessonsCompleted?.length ?? 0;

            return (
              <div
                key={mod.id}
                className={`el-module-card ${status === 'completed' ? 'completed' : ''}`}
                style={{ '--mod-color': mod.color }}
                onClick={() => navigate(`/ecolearn/lessons/${mod.id}/${mod.lessons[0].id}`)}
              >
                <div className="el-module-icon">{mod.icon}</div>
                <div className="el-module-info">
                  <h3 className="el-module-title">{mod.title}</h3>
                  <p className="el-module-desc">{mod.description}</p>
                  <div className="el-module-meta">
                    <span className={`el-status-badge ${cls}`}>{label}</span>
                    <span className="el-module-progress">{lessonsCount}/{mod.lessons.length} lessons</span>
                    <span className="el-module-points">+{mod.pointsReward} pts</span>
                  </div>
                </div>
                {status === 'completed' && prog?.quizScore !== null && (
                  <div className="el-module-score">
                    Quiz: {prog.quizScore}/5
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
