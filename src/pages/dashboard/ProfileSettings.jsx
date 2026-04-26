import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { updateProfile, getCities, getProfileStats } from '../../services/auth.service.js';
import { fetchUserProfile } from '../../api/userApi.js';
import CommentsModal from './components/CommentsModal.jsx';
import './profile.css';
import './components/UserProfilePanel.css'; // Reuse grid classes

export default function ProfileSettings() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [password, setPassword] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  // Stats & Posts state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // For viewing post in CommentsModal

  // Form feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Panel toggle: view vs edit
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    getCities()
      .then(res => setAllCities(res.cities || []))
      .catch(err => console.error(err));

    getProfileStats()
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setStatsLoading(false));

    if (user?._id) {
      fetchUserProfile(user._id)
        .then(data => setPosts(data.posts || []))
        .catch(err => console.error(err));
    }

    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      const formattedCity = city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase();
      const updatedUser = await updateProfile(name, password || undefined, formattedCity, bio.trim());
      signIn(updatedUser);
      setMessage('Profile updated!');
      setPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mask phone: show last 5 digits only
  const maskPhone = (phone) => {
    if (!phone) return '';
    const str = String(phone);
    return `+91 ${'•'.repeat(Math.max(0, str.length - 5))} ${str.slice(-5)}`;
  };

  const statItems = [
    { label: 'Posts', value: posts.length },
    { label: 'Eco Score', value: statsLoading ? '—' : (stats?.ecoScore ?? 0) },
    { label: 'Water Logs', value: statsLoading ? '—' : (stats?.waterLogs ?? 0) },
    { label: 'Carbon Logs', value: statsLoading ? '—' : (stats?.carbonLogs ?? 0) },
    { label: 'Spots Added', value: statsLoading ? '—' : (stats?.spotsAdded ?? 0) },
  ];

  return (
    <div className="profile-page anim-enter">
      <div className="profile-layout-split">

        {/* Left/Top Column */}
        <div className="profile-main-col" style={{ padding: '0 16px' }}>
          <div className="profile-hero-inner">
            
            {/* Top row: Avatar + Primary Stats */}
            <div className="profile-top-section">
              {/* Avatar */}
              <div className="profile-avatar-wrap">
                <div className="profile-avatar-ring">
                  <div className="profile-avatar-inner">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </div>
              </div>

              {/* Primary Stats (Posts & Eco Score) */}
              <div className="profile-primary-stats">
                <div className="profile-stat-ig">
                  <span className="profile-stat-val-ig">{posts.length}</span>
                  <span className="profile-stat-lbl-ig">posts</span>
                </div>
                <div className="profile-stat-ig">
                  <span className="profile-stat-val-ig">{statsLoading ? '—' : (stats?.ecoScore ?? 0)}</span>
                  <span className="profile-stat-lbl-ig">eco score</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="profile-hero-info">
              <div className="profile-name-row">
                <h1 className="profile-username">{user?.name || 'User'}</h1>
                <span className="profile-badge">🌿</span>
              </div>
              <p className="profile-meta">
                {maskPhone(user?.phone)}
                {user?.city && <> &nbsp;•&nbsp; <span className="profile-city">{user.city}</span></>}
              </p>
              {user?.bio && <p className="profile-bio">{user.bio}</p>}

              {/* Action buttons */}
              <div className="profile-action-row">
                <button
                  className="profile-action-btn primary"
                  onClick={() => setEditOpen(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="profile-action-btn"
                  onClick={() => navigate('/')}
                >
                  Home
                </button>
              </div>

              {/* Secondary Stats */}
              <div className="profile-secondary-stats">
                <div className="profile-stat-sec">
                  <span className="profile-stat-val-sec">{statsLoading ? '—' : (stats?.waterLogs ?? 0)}</span>
                  <span className="profile-stat-lbl-sec">water logs</span>
                </div>
                <div className="profile-stat-sec">
                  <span className="profile-stat-val-sec">{statsLoading ? '—' : (stats?.carbonLogs ?? 0)}</span>
                  <span className="profile-stat-lbl-sec">carbon logs</span>
                </div>
                <div className="profile-stat-sec">
                  <span className="profile-stat-val-sec">{statsLoading ? '—' : (stats?.spotsAdded ?? 0)}</span>
                  <span className="profile-stat-lbl-sec">spots added</span>
                </div>
              </div>
            </div>

          </div>

        </div> {/* End left/top column */}

        {/* ── Edit Form (Hovering Modal) ── */}
        {editOpen && (
          <div className="profile-edit-modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
            <div className="profile-edit-modal anim-enter">
              <div className="profile-edit-header">
                <h3 className="profile-edit-title">Edit Profile</h3>
                <button className="profile-edit-close" onClick={() => setEditOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleUpdate} className="profile-form">

                <div className="pf-group">
                  <span className="pf-icon">📱</span>
                  <div className="pf-field">
                    <label className="pf-label">Phone (cannot change)</label>
                    <input type="text" value={user?.phone || ''} disabled className="pf-input pf-input-disabled" />
                  </div>
                </div>
                <hr className="pf-divider" />

                <div className="pf-group">
                  <span className="pf-icon">👤</span>
                  <div className="pf-field">
                    <label className="pf-label">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pf-input"
                      required
                    />
                  </div>
                </div>
                <hr className="pf-divider" />

                <div className="pf-group">
                  <span className="pf-icon">🏢</span>
                  <div className="pf-field" ref={suggestionRef} style={{ position: 'relative' }}>
                    <label className="pf-label">City (Eco Pulse Leaderboard)</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); setShowSuggestions(true); }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="e.g. Tirupati"
                      className="pf-input"
                    />
                    {showSuggestions && city && allCities.filter(c => c.toLowerCase().includes(city.toLowerCase()) && c.toLowerCase() !== city.toLowerCase()).length > 0 && (
                      <ul className="pf-suggestions">
                        {allCities
                          .filter(c => c.toLowerCase().includes(city.toLowerCase()) && c.toLowerCase() !== city.toLowerCase())
                          .map((c, i) => (
                            <li key={i} className="pf-suggestion-item" onClick={() => { setCity(c); setShowSuggestions(false); }}>
                              {c}
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>
                <hr className="pf-divider" />

                <div className="pf-group">
                  <span className="pf-icon">📝</span>
                  <div className="pf-field">
                    <label className="pf-label">Bio (Caption in profile)</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="pf-input"
                      rows="3"
                      maxLength="160"
                      style={{ resize: 'none' }}
                    />
                  </div>
                </div>
                <hr className="pf-divider" />

                <div className="pf-group">
                  <span className="pf-icon">🔒</span>
                  <div className="pf-field">
                    <label className="pf-label">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="pf-input"
                    />
                  </div>
                </div>

                <div className="pf-actions">
                  {error && <p className="pf-error">{error}</p>}
                  {message && <p className="pf-success">{message}</p>}
                  <div className="pf-action-buttons">
                    <button type="button" className="pf-cancel-btn" onClick={() => setEditOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="pf-save-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

      </div> {/* End .profile-layout-split */}

      {/* ── Posts Section (Instagram-style grid) ── */}
      <div className="profile-posts-wrapper anim-enter">
        <div className="upp-divider" style={{ margin: '30px 0 0' }} />
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
      </div>

      {selectedPost && (
        <CommentsModal
          post={selectedPost}
          currentUserId={user?._id || user?.id}
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
