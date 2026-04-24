import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { apiFetch } from '../../api/client.js';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import UserProfilePanel from '../dashboard/components/UserProfilePanel.jsx';

export default function EcoPulseHome() {
  const { user } = useAuth();
  const [boardData, setBoardData] = useState({ entries: [], topUsers: [] });
  const [myData, setMyData] = useState({ rank: 0, points: 0, city_score: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'cities'
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Public leaderboard — no auth needed
      const boardRes = await apiFetch('/leaderboard', { requireAuth: false });
      setBoardData(boardRes);
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    }

    try {
      // Personal stats — auth required, but failure is non-fatal
      const myRes = await apiFetch('/leaderboard/me', { requireAuth: true });
      setMyData(myRes);
    } catch (err) {
      console.warn('Could not load personal leaderboard stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Find user's global ranking
  const myGlobalRank = boardData.topUsers.findIndex(u => u._id === user._id) + 1;
  const rankDisplay = myGlobalRank > 0 ? `#${myGlobalRank}` : 'Unranked';

  return (
    <div style={styles.container}>
      <AnimatedCard delay={0}>
        <div style={styles.heroSection}>
          <div style={styles.heroIcon}>🏆</div>
          <h1 style={styles.heroTitle}>Eco Pulse Leaderboard</h1>
          <p style={styles.heroSubtitle}>Live tracking of campus sustainability champions</p>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={100}>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>My Points</p>
            <p style={styles.statValue}>{myData.points}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Global Rank</p>
            <p style={styles.statValue}>{rankDisplay}</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>City Average</p>
            <p style={styles.statValue}>{(myData.city_score ?? 0).toFixed(1)}</p>
          </div>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={200}>
        <div style={styles.toggleRow}>
          <button 
            style={activeTab === 'users' ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab('users')}
          >
            Top Users
          </button>
          <button 
            style={activeTab === 'cities' ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTab('cities')}
          >
            City Rankings
          </button>
        </div>

        <div style={styles.listContainer}>
        {activeTab === 'users' && (
          <div style={styles.list}>
            {boardData.topUsers.map((u, i) => (
              <div 
                key={u._id} 
                style={{ 
                  ...styles.listItem, 
                  ...(u._id === user._id ? styles.highlightItem : {}),
                  cursor: 'pointer' 
                }}
                onClick={() => setSelectedUserId(u._id)}
              >
                <div style={styles.rankBox}>{i + 1}</div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{u.name} {u._id === user._id && '(You)'}</p>
                  <p style={styles.userHostel}>{u.city || 'No City'}</p>
                </div>
                <div style={styles.pointsBox}>{u.points} pts</div>
              </div>
            ))}
            {boardData.topUsers.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No users have earned points yet.</p>}
          </div>
        )}

        {activeTab === 'cities' && (
          <div style={styles.list}>
            {boardData.entries.map((h, i) => (
              <div key={h.city || 'unknown'} style={styles.listItem}>
                <div style={styles.rankBox}>{i + 1}</div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{h.city || 'No City specified'}</p>
                  <p style={styles.userHostel}>{h.member_count} members</p>
                </div>
                <div style={styles.pointsBox}>{h.avg_score.toFixed(1)} <span style={{fontSize: 12}}>avg</span></div>
              </div>
            ))}
             {boardData.entries.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No cities are ranked yet.</p>}
          </div>
        )}
        </div>
      </AnimatedCard>

      {/* User Profile Panel */}
      {selectedUserId && (
        <UserProfilePanel
          userId={selectedUserId}
          currentUserId={user?._id || user?.id}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'system-ui, sans-serif'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  heroIcon: {
    fontSize: '64px',
    marginBottom: '10px'
  },
  heroTitle: {
    color: '#fff',
    margin: 0,
    fontSize: '28px'
  },
  heroSubtitle: {
    color: '#aaa',
    marginTop: '8px'
  },
  statsRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '30px'
  },
  statCard: {
    flex: 1,
    background: 'linear-gradient(145deg, #11221c, #0d1a15)',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  statLabel: {
    color: '#888',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 10px 0'
  },
  statValue: {
    color: '#25D366',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0
  },
  toggleRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    background: '#1a1a1a',
    padding: '5px',
    borderRadius: '12px'
  },
  tabActive: {
    flex: 1,
    background: '#25D366',
    color: '#000',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  },
  tabInactive: {
    flex: 1,
    background: 'transparent',
    color: '#888',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  },
  listContainer: {
    background: '#11221c',
    borderRadius: '16px',
    padding: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    background: '#1a2b25',
    padding: '15px',
    borderRadius: '12px',
    transition: 'transform 0.2s'
  },
  highlightItem: {
    border: '1px solid #25D366',
    boxShadow: '0 0 10px rgba(37,211,102,0.2)'
  },
  rankBox: {
    width: '40px',
    height: '40px',
    background: '#2a3b35',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    marginRight: '15px'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    color: '#fff',
    margin: '0 0 4px 0',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  userHostel: {
    color: '#888',
    margin: 0,
    fontSize: '13px'
  },
  pointsBox: {
    color: '#25D366',
    fontWeight: 'bold',
    fontSize: '18px'
  }
};
