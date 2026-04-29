import React, { useState, useRef, useEffect } from 'react';
import { apiFetch } from '../../../api/client.js';
import CommentsModal from './CommentsModal.jsx';
import './reels.css';

const POST_TYPES = {
  news: { label: 'News', icon: '📰', color: '#3b82f6' },
  event: { label: 'Event', icon: '📅', color: '#8b5cf6' },
  issue: { label: 'Issue', icon: '⚠️',  color: '#fb923c' },
};

export default function MobileReelsView({ posts, initialIndex, currentUserId, onClose, onPostUpdated }) {
  const containerRef = useRef(null);
  const [commentsOpenFor, setCommentsOpenFor] = useState(null); // store post object to open comments
  const [uiHidden, setUiHidden] = useState(false);
  const [renderList, setRenderList] = useState([...posts, ...posts]); // Duplicate to allow initial circling

  // Local state for likes to ensure immediate feedback
  const [localPosts, setLocalPosts] = useState({});

  useEffect(() => {
    if (containerRef.current) {
      // Scroll to the initial index
      const itemHeight = window.innerHeight;
      containerRef.current.scrollTop = initialIndex * itemHeight;
    }
  }, [initialIndex]);

  const handleScroll = (e) => {
    const el = e.target;
    // If we scroll near the bottom, append another set of posts to keep it circular
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 500) {
      setRenderList(prev => [...prev, ...posts]);
    }
  };

  const toggleLike = async (post, e) => {
    e.stopPropagation();
    const currentPost = localPosts[post._id] || post;
    const isLiked = currentPost.likes.includes(currentUserId);
    
    // Optimistic update
    let newLikes = [...currentPost.likes];
    if (isLiked) {
      newLikes = newLikes.filter(id => id !== currentUserId);
    } else {
      newLikes.push(currentUserId);
    }

    const updatedPost = { ...currentPost, likes: newLikes };
    setLocalPosts(prev => ({ ...prev, [post._id]: updatedPost }));

    try {
      await apiFetch(`/posts/${post._id}/like`, { method: 'POST', requireAuth: true });
      // Notify parent only after success to avoid lag
      if (onPostUpdated) onPostUpdated(updatedPost);
    } catch (err) {
      console.error('Failed to like post:', err);
      // Revert on failure
      setLocalPosts(prev => ({ ...prev, [post._id]: currentPost }));
    }
  };

  return (
    <div className="reels-overlay">
      {/* Back Button */}
      <button className="reels-back-btn" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Scrollable Container */}
      <div className="reels-container" ref={containerRef} onScroll={handleScroll}>
        {renderList.map((post, idx) => {
          const currentPost = localPosts[post._id] || post;
          const isLiked = currentPost.likes.includes(currentUserId);
          const meta = POST_TYPES[currentPost.type] || { label: 'Post', icon: '📝', color: '#94a3b8' };

          // Determine if image exists
          const hasImage = !!currentPost.image;

          return (
            <div key={`${currentPost._id}-${idx}`} className="reel-item">
              
              {/* Background Image Container */}
              <div 
                className="reel-image-container"
                onTouchStart={() => setUiHidden(true)}
                onTouchEnd={() => setUiHidden(false)}
                onMouseDown={() => setUiHidden(true)}
                onMouseUp={() => setUiHidden(false)}
              >
                {hasImage ? (
                  <img src={currentPost.image} alt="post" className="reel-image" />
                ) : (
                  <div className="reel-no-image">
                    <h2>{currentPost.caption}</h2>
                  </div>
                )}
              </div>

              {/* UI Overlay */}
              <div className={`reel-ui-overlay ${uiHidden ? 'hidden' : ''}`}>
                
                {/* Right Side Action Bar */}
                <div className="reel-actions">
                  <button className="reel-action-btn" onClick={(e) => toggleLike(currentPost, e)}>
                    <svg viewBox="0 0 24 24" fill={isLiked ? '#ef4444' : 'none'} stroke={isLiked ? '#ef4444' : 'currentColor'} strokeWidth={isLiked ? 0 : 2}>
                      <path d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                    </svg>
                    <span>{currentPost.likes.length}</span>
                  </button>
                  
                  <button className="reel-action-btn" onClick={() => setCommentsOpenFor(currentPost)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{currentPost.comments.length}</span>
                  </button>
                </div>

                {/* Bottom Info Area */}
                <div className="reel-info-bottom">
                  <div className="reel-user">
                    <div className="reel-avatar">
                      {currentPost.user?.name ? currentPost.user.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="reel-username">{currentPost.user?.name || 'User'}</span>
                  </div>
                  
                  <div className="reel-tags">
                    <span className="reel-badge" style={{ backgroundColor: meta.color + '40', color: meta.color }}>
                      {meta.icon} {meta.label}
                    </span>
                    {currentPost.isGrievance && (
                      <span className="reel-badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                        Grievance
                      </span>
                    )}
                  </div>
                  
                  {hasImage && currentPost.caption && (
                    <div className="reel-caption">
                      <div className={`reel-caption-text ${currentPost.caption.length > 100 ? 'clamped' : ''}`}>
                        {currentPost.caption}
                      </div>
                      {currentPost.caption.length > 100 && (
                        <span 
                          className="reel-see-more" 
                          onClick={(e) => { e.stopPropagation(); setCommentsOpenFor(currentPost); }}
                        >
                          ... more
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sheet Comments Modal */}
      {commentsOpenFor && (
        <CommentsModal
          post={localPosts[commentsOpenFor._id] || commentsOpenFor}
          currentUserId={currentUserId}
          onClose={() => setCommentsOpenFor(null)}
          onPostUpdated={(updated) => {
            setLocalPosts(prev => ({ ...prev, [updated._id]: updated }));
            if (onPostUpdated) onPostUpdated(updated);
          }}
          isBottomSheet={true} // We will pass this to adjust modal styling
        />
      )}
    </div>
  );
}
