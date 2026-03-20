import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';
import './layout.css';

const SIDEBAR_LINKS = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/neeru', label: 'Neeru', icon: '💧' },
  { path: '/carbon', label: 'Carbon Footprint', icon: '🌱' },
  { path: '/greenspot', label: 'Eco Atlas', icon: '🗺️' },
  { path: '/raatkahisaab', label: 'Raat Ka Hisaab', icon: '🌙' },
  { path: '/ecopulse', label: 'Eco Pulse', icon: '🏆' },
];

export default function SidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper to determine active link
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  return (
    <div className="layout-root">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="nav-left">
          <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            ☰
          </button>
          <div className="brand-logo" onClick={() => handleNavClick('/')}>
            <span className="brand-icon">🌿</span>
            <span className="brand-text">EcoSaathi</span>
          </div>
        </div>
        <div className="nav-right" style={{ position: 'relative' }}>
          <div 
            className="user-profile" 
            title={user?.name ? `${user.name}'s Profile` : 'User Profile'}
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ cursor: 'pointer', border: '2px solid transparent', transition: 'border 0.2s', '&:hover': { border: '2px solid #4CAF50' } }}
          >
            <span className="profile-initial">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
          </div>

          {profileOpen && (
            <div className="profile-dropdown" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px', width: '200px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 1000 }}>
              <div style={{ marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                <strong style={{ color: 'var(--text)' }}>{user?.name || 'User'}</strong>
                <div style={{ color: 'var(--textMuted)', fontSize: '12px' }}>{user?.phone || 'No phone'}</div>
              </div>
              <button 
                onClick={() => { setProfileOpen(false); handleNavClick('/profile'); }}
                style={{ width: '100%', padding: '8px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', borderRadius: '6px', transition: '0.2s', fontWeight: 'bold' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--card)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >✏️ Edit Profile</button>
              <button 
                onClick={signOut}
                style={{ width: '100%', padding: '8px', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', borderRadius: '6px', marginTop: '4px', fontWeight: 'bold' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--dangerDim)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >🚪 Logout</button>
            </div>
          )}
        </div>
      </header>

      <div className="layout-body">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {SIDEBAR_LINKS.map((link) => (
              <button
                key={link.path}
                className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => handleNavClick(link.path)}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent)', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>{user?.name || 'User'}</span>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-container">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
