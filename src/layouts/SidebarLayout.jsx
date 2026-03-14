import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './layout.css';

const SIDEBAR_LINKS = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/neeru', label: 'Neeru', icon: '💧' },
  { path: '/greenspot', label: 'Green Spot', icon: '🗺️' },
  { path: '/raatkahisaab', label: 'Raat Ka Hisaab', icon: '🌙' },
  { path: '/ecopulse', label: 'Eco Pulse', icon: '🏆' },
];

export default function SidebarLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        <div className="nav-right">
          <div className="user-profile" title={user?.name || 'User'}>
            <span className="profile-initial">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
          </div>
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
            <button className="logout-btn-nav" onClick={signOut}>
              <span className="sidebar-icon">🚪</span>
              <span className="sidebar-label">Logout</span>
            </button>
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
        </main>
      </div>
    </div>
  );
}
