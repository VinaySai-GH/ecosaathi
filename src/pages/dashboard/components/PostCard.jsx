import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toggleLike } from '../../../api/postApi.js';
import CommentsModal from './CommentsModal.jsx';
import './PostCard.css';

const TYPE_META = {
  news:  { label: 'News',  icon: '📰', color: '#4ade80' },
  event: { label: 'Event', icon: '📅', color: '#60a5fa' },
  issue: { label: 'Issue', icon: '⚠️',  color: '#fb923c' },
};

export default function PostCard({ post: initialPost, currentUserId, onUserClick }) {
  const [post, setPost] = useState(initialPost);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const navigate = useNavigate();

  const meta = TYPE_META[post.type] || TYPE_META.news;
  const liked = post.likes?.some((id) => (id?._id || id)?.toString() === currentUserId?.toString());
  const userInitial = post.user?.name ? post.user.name[0].toUpperCase() : '?';
  const hasCoords = post.locationCoords?.lat != null && post.locationCoords?.lng != null;

  const handleLike = async () => {
    try {
      const res = await toggleLike(post._id);
      setPost((prev) => ({
        ...prev,
        likes: res.liked
          ? [...(prev.likes || []), currentUserId]
          : (prev.likes || []).filter((id) => (id?._id || id)?.toString() !== currentUserId?.toString()),
      }));
    } catch (e) {
      console.error('Like failed', e);
    }
  };

  const handleLocationClick = () => {
    if (hasCoords) {
      navigate(`/greenspot?lat=${post.locationCoords.lat}&lng=${post.locationCoords.lng}`);
    }
  };

  return (
    <>
      <article className="post-card">
        {/* ── HEADER ── */}
        <div className="post-header">
          <div 
            className="post-avatar clickable-avatar" 
            onClick={() => onUserClick && onUserClick(post.user?._id)}
            style={onUserClick ? { cursor: 'pointer' } : {}}
          >
            {userInitial}
          </div>
          <div className="post-header-info">
            <span 
              className="post-username clickable-username"
              onClick={() => onUserClick && onUserClick(post.user?._id)}
              style={onUserClick ? { cursor: 'pointer' } : {}}
            >
              {post.user?.name || 'EcoSaathi User'}
            </span>
            {post.locationText && (
              <button
                className={`post-location${hasCoords ? ' clickable' : ''}`}
                onClick={hasCoords ? handleLocationClick : undefined}
                title={hasCoords ? 'Open in Eco Atlas' : undefined}
              >
                📍 {post.locationText}
              </button>
            )}
          </div>
          <span className="post-type-badge" style={{ '--badge-color': meta.color }}>
            {meta.icon} {meta.label}
            {post.type === 'issue' && post.status && (
              <span style={{ marginLeft: 4, opacity: 0.8, textTransform: 'capitalize' }}>
                • {post.status}
              </span>
            )}
            {post.isGrievance && (
              <span className="grievance-tag">Grievance Reported</span>
            )}
          </span>
        </div>

        {/* ── IMAGE ── */}
        {post.image && (
          <div className="post-image-wrapper">
            <img src={post.image} alt="post" className="post-image" />
          </div>
        )}

        {/* ── ACTION BAR ── */}
        <div className="post-actions">
          <button
            className={`post-action-btn like-btn${liked ? ' liked' : ''}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24" className="action-icon" fill={liked ? '#ef4444' : 'none'} stroke={liked ? '#ef4444' : 'currentColor'}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </button>
          <button
            className="post-action-btn comment-btn"
            onClick={() => setCommentsOpen(true)}
            aria-label="Comment"
          >
            <svg viewBox="0 0 24 24" className="action-icon" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>

        {/* ── LIKES COUNT ── */}
        {post.likes?.length > 0 && (
          <div className="post-likes-count">
            {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
          </div>
        )}

        {/* ── CAPTION ── */}
        {post.caption && (
          <div className="post-caption-area">
            <span className="post-username caption-author">{post.user?.name}</span>
            <span className={`post-caption${captionExpanded ? ' expanded' : ''}`}>
              {post.caption}
            </span>
            {post.caption.length > 120 && (
              <button className="caption-toggle" onClick={() => setCaptionExpanded((v) => !v)}>
                {captionExpanded ? 'less' : 'more'}
              </button>
            )}
          </div>
        )}

        {/* ── COMMENT COUNT TRIGGER ── */}
        {post.comments?.length > 0 && (
          <button className="view-comments-trigger" onClick={() => setCommentsOpen(true)}>
            View all {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </button>
        )}

        {/* ── TIMESTAMP ── */}
        <div className="post-timestamp">
          {new Date(post.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </div>
      </article>

      {/* ── COMMENTS MODAL ── */}
      {commentsOpen && (
        <CommentsModal
          post={post}
          currentUserId={currentUserId}
          onClose={() => setCommentsOpen(false)}
          onPostUpdated={(updated) => setPost(updated)}
        />
      )}
    </>
  );
}
