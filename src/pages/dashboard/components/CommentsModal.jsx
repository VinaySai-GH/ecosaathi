import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComment, deletePost, updatePostStatus } from '../../../api/postApi.js';
import './CommentsModal.css';

export default function CommentsModal({ post: initialPost, currentUserId, onClose, onPostUpdated, onPostDeleted }) {
  const [comments, setComments] = useState(initialPost.comments || []);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const meta = {
    news:  { label: 'News',  icon: '📰', color: '#4ade80' },
    event: { label: 'Event', icon: '📅', color: '#60a5fa' },
    issue: { label: 'Issue', icon: '⚠️',  color: '#fb923c' },
  }[initialPost.type] || { label: 'News', icon: '📰', color: '#4ade80' };

  const userInitial = initialPost.user?.name ? initialPost.user.name[0].toUpperCase() : '?';
  const isOwner = (initialPost.user?._id || initialPost.user) === currentUserId;

  // Auto-scroll comments list to bottom when new comments added
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Lock body scroll while modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await addComment(initialPost._id, commentText.trim());
      setComments((prev) => [...prev, res.comment]);
      setCommentText('');
      onPostUpdated?.({ ...initialPost, comments: [...comments, res.comment] });
    } catch (err) {
      console.error('Comment failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationClick = () => {
    const { lat, lng } = initialPost.locationCoords || {};
    if (lat != null && lng != null) {
      onClose();
      navigate(`/greenspot?lat=${lat}&lng=${lng}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(initialPost._id);
      onPostDeleted?.(initialPost._id);
      onClose();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete post');
    }
  };

  const handleStatusUpdate = async () => {
    const newStatus = initialPost.status === 'solved' ? 'persisting' : 'solved';
    try {
      const res = await updatePostStatus(initialPost._id, newStatus);
      onPostUpdated?.(res.post);
    } catch (err) {
      console.error('Status update failed', err);
      alert('Failed to update status');
    }
  };

  const hasCoords = initialPost.locationCoords?.lat != null;

  return (
    <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cm-dialog" role="dialog" aria-modal="true">

        {/* ── CLOSE BUTTON (always top-right) ── */}
        <button className="cm-close-btn" onClick={onClose} aria-label="Close">✕</button>

        {/* ══════════════════════════════════════
            LEFT PANE — Post content (desktop only)
            On mobile this is hidden; we show a compact header instead
            ══════════════════════════════════════ */}
        <div className="cm-post-pane">
          {/* Post image (or placeholder) */}
          <div className="cm-post-image-area">
            {initialPost.image ? (
              <img src={initialPost.image} alt="post" className="cm-post-image" />
            ) : (
              <div className="cm-post-no-image">
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════
            RIGHT PANE — Comments
            ══════════════════════════ */}
        <div className="cm-comments-pane">

          {/* Compact post header (visible in both mobile + desktop right pane) */}
          <div className="cm-post-header">
            <div className="cm-avatar">{userInitial}</div>
            <div className="cm-header-info">
              <span className="cm-username">{initialPost.user?.name || 'EcoSaathi User'}</span>
              {initialPost.locationText && (
                <button
                  className={`cm-location${hasCoords ? ' clickable' : ''}`}
                  onClick={hasCoords ? handleLocationClick : undefined}
                >
                  📍 {initialPost.locationText}
                </button>
              )}
            </div>
            <span className="cm-type-badge" style={{ '--badge-color': meta.color }}>
              {meta.icon} {meta.label}
              {initialPost.type === 'issue' && initialPost.status && (
                <span style={{ marginLeft: 4, opacity: 0.8, textTransform: 'capitalize' }}>
                  • {initialPost.status}
                </span>
              )}
            </span>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="cm-owner-actions" style={{ padding: '8px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button 
                onClick={handleDelete}
                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🗑️ Delete Post
              </button>
              {initialPost.type === 'issue' && (
                <button 
                  onClick={handleStatusUpdate}
                  style={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.5)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {initialPost.status === 'solved' ? 'Mark as Persisting' : 'Mark as Solved'}
                </button>
              )}
            </div>
          )}

          {/* Caption (collapsible on mobile) */}
          {initialPost.caption && (
            <p className="cm-caption">
              <span className="cm-caption-author">{initialPost.user?.name}</span>
              {' '}{initialPost.caption}
            </p>
          )}

          <div className="cm-divider" />

          {/* Comments list */}
          <div className="cm-comments-list">
            {comments.length === 0 && (
              <div className="cm-no-comments">
                <span>💬</span>
                <p>No comments yet.</p>
                <p>Be the first to comment!</p>
              </div>
            )}
            {comments.map((c, idx) => (
              <div key={c._id || idx} className="cm-comment-item">
                <div className="cm-comment-avatar">
                  {c.user?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="cm-comment-body">
                  <span className="cm-comment-author">{c.user?.name || 'User'}</span>
                  <span className="cm-comment-text">{c.text}</span>
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment input */}
          <form className="cm-input-row" onSubmit={handleSubmit}>
            <div className="cm-input-avatar">
              {/* current user initial — fallback to '?' */}
              {typeof currentUserId === 'string' ? currentUserId[0]?.toUpperCase() : '?'}
            </div>
            <input
              ref={inputRef}
              className="cm-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              maxLength={500}
            />
            <button
              type="submit"
              className="cm-post-btn"
              disabled={!commentText.trim() || submitting}
            >
              {submitting ? '…' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
