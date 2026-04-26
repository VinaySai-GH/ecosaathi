import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getModuleById, getLessonById } from './data/modules.js';
import { apiFetch } from '../../../api/client.js';
import '../ecolearn.css';

function ContentBlock({ block }) {
  if (block.type === 'paragraph') {
    return <p className="el-lesson-para">{block.text}</p>;
  }
  if (block.type === 'callout') {
    return (
      <div className="el-callout">
        <span className="el-callout-label">{block.label}</span>
        <span className="el-callout-text">{block.text}</span>
      </div>
    );
  }
  if (block.type === 'fact') {
    return (
      <div className="el-fact-card">
        <span className="el-fact-icon">💡</span>
        <span className="el-fact-text">{block.text}</span>
      </div>
    );
  }
  return null;
}

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [marked, setMarked] = useState(false);

  const mod = getModuleById(moduleId);
  const lesson = getLessonById(moduleId, lessonId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!marked && mod && lesson) {
      apiFetch('/ecolearn/progress', {
        method: 'POST',
        body: JSON.stringify({ moduleId, lessonId }),
      }).catch(() => {});
      setMarked(true);
    }
  }, [moduleId, lessonId]);

  if (!mod || !lesson) {
    return (
      <div className="el-page">
        <p className="el-error">Module or lesson not found.</p>
        <button className="el-back-btn" onClick={() => navigate('/ecolearn/lessons')}>← Back</button>
      </div>
    );
  }

  const lessonIndex = mod.lessons.findIndex(l => l.id === lessonId);
  const nextLesson = mod.lessons[lessonIndex + 1];
  const isLastLesson = lessonIndex === mod.lessons.length - 1;

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate('/ecolearn/lessons')}>
        ← All Modules
      </button>

      <div className="el-lesson-breadcrumb">
        <span style={{ color: mod.color }}>{mod.icon} {mod.title}</span>
        <span> / Lesson {lessonIndex + 1} of {mod.lessons.length}</span>
      </div>

      <div className="el-lesson-progress-bar">
        <div
          className="el-lesson-progress-fill"
          style={{ width: `${((lessonIndex + 1) / mod.lessons.length) * 100}%`, background: mod.color }}
        />
      </div>

      <h1 className="el-lesson-title">{lesson.title}</h1>

      <div className="el-lesson-content">
        {lesson.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}
      </div>

      <div className="el-lesson-nav">
        {lessonIndex > 0 && (
          <button
            className="el-lesson-nav-btn secondary"
            onClick={() => navigate(`/ecolearn/lessons/${moduleId}/${mod.lessons[lessonIndex - 1].id}`)}
          >
            ← Previous
          </button>
        )}

        {!isLastLesson ? (
          <button
            className="el-lesson-nav-btn primary"
            style={{ background: mod.color }}
            onClick={() => navigate(`/ecolearn/lessons/${moduleId}/${nextLesson.id}`)}
          >
            Next Lesson →
          </button>
        ) : (
          <button
            className="el-lesson-nav-btn primary"
            style={{ background: mod.color }}
            onClick={() => navigate(`/ecolearn/lessons/${moduleId}/quiz`)}
          >
            Take the Quiz →
          </button>
        )}
      </div>
    </div>
  );
}
