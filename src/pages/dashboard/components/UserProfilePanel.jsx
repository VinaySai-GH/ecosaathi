import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../../api/userApi.js';
import CommentsModal from './CommentsModal.jsx';
import './UserProfilePanel.css';

export default function UserProfilePanel({ userId, currentUserId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Lock body scroll while open
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchUserProfile(userId);
        if (active) {
          setProfile(data.user);
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load profile');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (userId) loadProfile();
    return () => { active = false; };
  }, [userId]);

  return (
    <div className="upp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="upp-panel">
        {/* Header */}
        <div className="upp-header">
          <button className="upp-close-btn" onClick={onClose} aria-label="Close">←</button>
          <h2 className="upp-title">{profile ? profile.name : 'Profile'}</h2>
          <div style={{ width: 34 }} /> {/* Spacer to center title */}
        </div>

        {/* Content */}
        <div className="upp-content">
          {loading && (
            <div className="upp-loading">
              <div className="spinner" />
            </div>
          )}

          {error && (
            <div className="upp-error">
              <p>{error}</p>
              <button onClick={onClose}>Go Back</button>
            </div>
          )}

          {!loading && !error && profile && (
            <>
              {/* Profile Info */}
              <div className="upp-info-section">
                <div className="upp-avatar">
                  {profile.name ? profile.name[0].toUpperCase() : 'U'}
                </div>
                <h1 className="upp-name">{profile.name}</h1>
                {profile.city && <p className="upp-city">📍 {profile.city}</p>}
                
                <div className="upp-stats">
                  <div className="upp-stat">
                    <span className="upp-stat-val">{posts.length}</span>
                    <span className="upp-stat-lbl">Posts</span>
                  </div>
                  <div className="upp-stat">
                    <span className="upp-stat-val">{profile.points || 0}</span>
                    <span className="upp-stat-lbl">Eco Points</span>
                  </div>
                </div>

                {profile.bio && <p className="upp-bio">{profile.bio}</p>}
              </div>

              <div className="upp-divider" />

              {/* Tabs Section */}
              <div className="upp-tabs">
                <div className="upp-tab active">
                  <svg aria-label="Posts" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24">
                    <rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line>
                    <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line>
                  </svg>
                  <span>POSTS</span>
                </div>
              </div>

              {/* Posts Grid */}
              <div className="upp-posts-section">
                {posts.length === 0 ? (
                  <div className="upp-empty">
                    <span className="upp-empty-icon">📷</span>
                    <p>No posts yet</p>
                  </div>
                ) : (
                  <div className="upp-posts-grid">
                    {posts.map(post => (
                      <div key={post._id} className="upp-grid-item" onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>
                        {post.image ? (
                          <img src={post.image} alt="post" />
                        ) : (
                          <div className="upp-grid-text">
                            <span className="upp-badge" style={{ backgroundColor: post.type === 'news' ? '#4ade80' : post.type === 'event' ? '#60a5fa' : '#fb923c' }}>
                              {post.type}
                            </span>
                            <p>{post.caption || 'No caption'}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedPost && (
        <CommentsModal
          post={selectedPost}
          currentUserId={currentUserId}
          onClose={() => setSelectedPost(null)}
          onPostUpdated={(updated) => {
            setSelectedPost(updated);
            setPosts(posts.map(p => p._id === updated._id ? updated : p));
          }}
          onPostDeleted={(deletedId) => {
            setSelectedPost(null);
            setPosts(posts.filter(p => p._id !== deletedId));
          }}
        />
      )}
    </div>
  );
}
