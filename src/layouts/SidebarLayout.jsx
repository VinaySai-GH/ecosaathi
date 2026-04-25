import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Footer from '../components/Footer.jsx';
import NotificationBell from '../components/NotificationBell.jsx';
import NotificationsPanel from '../components/NotificationsPanel.jsx';
import './layout.css';

const SIDEBAR_LINKS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/neeru', label: 'Neeru', icon: '💧' },
  { path: '/carbon', label: 'Carbon Footprint', icon: '🌱' },
  { path: '/greenspot', label: 'Eco Atlas', icon: '🗺️' },
  { path: '/raatkahisaab', label: 'Raat Ka Hisaab', icon: '🌙' },
  { path: '/ecopulse', label: 'Eco Pulse', icon: '🏆' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

export default function SidebarLayout() {
  // Mobile: hamburger-controlled
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Desktop: hover-controlled expansion
  const [isExpanded, setIsExpanded] = useState(false);
  // Desktop Notifications Panel
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleNotificationClick = () => {
    if (window.innerWidth <= 768) {
      navigate('/notifications');
    } else {
      setIsNotificationsOpen(!isNotificationsOpen);
    }
  };

  return (
    <div className="layout-root">
      {/* Notifications Panel (Desktop) */}
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />

      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="nav-left">
          {/* Hamburger: only visible on mobile */}
          <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            ☰
          </button>
          <div className="brand-logo" onClick={() => handleNavClick('/')}>
            <span className="brand-icon">🌿</span>
            <span className="brand-text">EcoSaathi</span>
          </div>
        </div>
        <div className="nav-right">
          <NotificationBell onClick={handleNotificationClick} />
          {/* Avatar — navigates to /profile on click */}
          <div
            className="user-profile"
            title={user?.name ? `${user.name}'s Profile` : 'Profile'}
            onClick={() => handleNavClick('/profile')}
          >
            <span className="profile-initial">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
          </div>
        </div>
      </header>

      <div className="layout-body">
        {/* Desktop Sidebar — hover to expand */}
        <aside
          className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isSidebarOpen ? 'open' : ''}`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <nav className="sidebar-nav">
            {SIDEBAR_LINKS.map((link) => (
              <button
                key={link.path}
                className={`sidebar-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => handleNavClick(link.path)}
                title={link.label}
              >
                <span className="sidebar-icon">{link.icon}</span>
                <span className="sidebar-label">{link.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button
              className="sidebar-link logout-sidebar-btn"
              onClick={signOut}
              title="Logout"
            >
              <span className="sidebar-icon">🚪</span>
              <span className="sidebar-label">Logout</span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        {/* Main Content */}
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
