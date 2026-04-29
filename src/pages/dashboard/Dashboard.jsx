import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import InsightCard from '../../components/InsightCard.jsx';
import { apiFetch } from '../../api/client.js';
import { fetchPosts } from '../../api/postApi.js';
import PostCard from './components/PostCard.jsx';
import CreatePostModal from './components/CreatePostModal.jsx';
import UserProfilePanel from './components/UserProfilePanel.jsx';
import MobileReelsView from './components/MobileReelsView.jsx';
import './dashboard.css';

const FAB_OPTIONS = [
  { type: 'news',  label: 'Post News',  icon: '📰' },
  { type: 'event', label: 'Post Event', icon: '📅' },
  { type: 'issue', label: 'Report Issue', icon: '⚠️' },
];

let cachedPosts = null;
let cachedPage = 1;
// You can also add cachedHasMore if infinite scroll is implemented later.

export default function Dashboard() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const routerLocation = useLocation();

  // AI Insight State
  const [insight,   setInsight]   = useState(null);
  const [insightNew, setInsightNew] = useState(false);
  const [insightDate, setInsightDate] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [insightLoading, setInsightLoading] = useState(true);

  useEffect(() => {
    setInsightLoading(true);
    apiFetch('/insights/eco', { requireAuth: true })
      .then(res => {
        if (res.insight) {
          setInsight(res.insight);
          setInsightNew(res.isNew);
          setInsightDate(res.generatedAt);
        }
      })
      .catch(err => console.warn('[Insight] Could not load insight:', err.message))
      .finally(() => setInsightLoading(false));
  }, []);
  const [posts, setPosts] = useState(cachedPosts || []);
  const [loading, setLoading] = useState(cachedPosts === null);
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'news' | 'event' | 'issue'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [reelsIndex, setReelsIndex] = useState(null);

  // Pull-to-refresh state
  const [pullY, setPullY] = useState(0);
  const pullStartY = useRef(null);
  const feedRef = useRef(null);
  const PULL_THRESHOLD = 80;

  const loadPosts = useCallback(async (isRefresh = false) => {
    // If not refreshing and we already have cached posts, skip fetching
    if (!isRefresh && cachedPosts !== null) {
      setPosts(cachedPosts);
      setLoading(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetchPosts(1);
      const newPosts = res.posts || [];
      setPosts(newPosts);
      cachedPosts = newPosts; // update cache
      cachedPage = 1;
    } catch (err) {
      console.error('Failed to load posts', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Reload whenever user navigates back to this page
  useEffect(() => {
    if (routerLocation.pathname === '/') {
      loadPosts(false);
    }
  }, [routerLocation.pathname, loadPosts]);

  // Pull-to-refresh (touch)
  const handleTouchStart = (e) => {
    if (feedRef.current?.scrollTop === 0) {
      pullStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (pullStartY.current == null) return;
    const delta = e.touches[0].clientY - pullStartY.current;
    if (delta > 0 && feedRef.current?.scrollTop === 0) {
      setPullY(Math.min(delta * 0.4, PULL_THRESHOLD));
    }
  };

  const handleTouchEnd = () => {
    if (pullY >= PULL_THRESHOLD) {
      loadPosts(true);
    }
    setPullY(0);
    pullStartY.current = null;
  };

  const openModal = (type) => {
    setModalType(type);
    setFabOpen(false);
  };

  const handlePostCreated = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    cachedPosts = updated;
  };

  return (
    <div className="feed-page">
      {/* Pull-to-refresh indicator */}
      {(pullY > 10 || refreshing) && (
        <div className="ptr-indicator" style={{ height: refreshing ? 48 : pullY }}>
          <span className={`ptr-spinner${refreshing ? ' spinning' : ''}`}>⟳</span>
          {!refreshing && pullY < PULL_THRESHOLD && <span className="ptr-text">Pull to refresh</span>}
          {!refreshing && pullY >= PULL_THRESHOLD && <span className="ptr-text">Release to refresh</span>}
          {refreshing && <span className="ptr-text">Refreshing...</span>}
        </div>
      )}

      {/* Layout Wrapper for Desktop Two-Column */}
      <div className="dashboard-layout">
        
        {/* Left Column: Main Feed */}
        <div
          className="feed-container dashboard-main-feed"
          ref={feedRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="feed-header">
            <h1 className="feed-title">Local Network</h1>
            <p className="feed-subtitle">News, events & issues from your community</p>
          </div>

          {loading && (
            <div className="feed-loading">
              {[1,2,3].map((i) => (
                <div key={i} className="post-skeleton">
                  <div className="sk-header">
                    <div className="sk-avatar" />
                    <div className="sk-lines">
                      <div className="sk-line sk-line-short" />
                      <div className="sk-line sk-line-xshort" />
                    </div>
                  </div>
                  <div className="sk-image" />
                  <div className="sk-line" />
                  <div className="sk-line sk-line-short" />
                </div>
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="feed-empty">
              <span className="feed-empty-icon">🌿</span>
              <h3>No posts yet</h3>
              <p>Be the first to share something with your community!</p>
            </div>
          )}

          <div className="feed-list">
            {posts.map((post, index) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id || user?.id}
                onUserClick={(id) => id && setSelectedUserId(id)}
                onImageClick={() => {
                  if (window.innerWidth <= 768) {
                    setReelsIndex(index);
                    return true;
                  } else {
                    return false;
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Sidebar (Desktop only or stacked on Mobile) */}
        <div className="dashboard-right-sidebar">
          {insightLoading && (
            <div className="insight-loading-skeleton">
              <div className="skeleton-glow" />
              <p>🤖 Generating your eco-insight...</p>
            </div>
          )}
          
          {insight && !dismissed && (
            <div className="insight-sidebar-wrapper">
              <InsightCard
                insight={insight}
                isNew={insightNew}
                generatedAt={insightDate}
                onDismiss={() => setDismissed(true)}
              />
            </div>
          )}
        </div>
        
      </div>

      {/* FAB */}
      <div className="fab-area">
        {fabOpen && (
          <div className="fab-dropdown">
            {FAB_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                className="fab-option"
                onClick={() => openModal(opt.type)}
              >
                <span className="fab-option-icon">{opt.icon}</span>
                <span className="fab-option-label">{opt.label}</span>
              </button>
            ))}
          </div>
        )}
        <button
          className={`fab-btn${fabOpen ? ' open' : ''}`}
          onClick={() => setFabOpen((v) => !v)}
          aria-label="Create post"
        >
          <span className="fab-plus">+</span>
        </button>
      </div>

      {/* Backdrop for FAB dropdown */}
      {fabOpen && (
        <div className="fab-backdrop" onClick={() => setFabOpen(false)} />
      )}

      {/* Create Post Modal */}
      {modalType && (
        <CreatePostModal
          initialType={modalType}
          onClose={() => setModalType(null)}
          onCreated={handlePostCreated}
        />
      )}

      {/* User Profile Panel */}
      {selectedUserId && (
        <UserProfilePanel
          userId={selectedUserId}
          currentUserId={user?._id || user?.id}
          onClose={() => setSelectedUserId(null)}
        />
      )}
      {/* Mobile Reels Viewer */}
      {reelsIndex !== null && (
        <MobileReelsView
          posts={posts}
          initialIndex={reelsIndex}
          currentUserId={user?._id || user?.id}
          onClose={() => setReelsIndex(null)}
          onPostUpdated={(updatedPost) => {
             const newPosts = posts.map(p => p._id === updatedPost._id ? updatedPost : p);
             setPosts(newPosts);
             cachedPosts = newPosts;
          }}
        />
      )}

    </div>
  );
}

