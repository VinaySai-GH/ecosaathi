import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TABS = [
  { path: '/',             label: 'Neeru',         emoji: '💧' },
  { path: '/greenspot',    label: 'Green Spot',    emoji: '🗺️' },
  { path: '/raatkahisaab', label: 'Raat Ka Hisaab',emoji: '🌙' },
  { path: '/ecopulse',     label: 'Eco Pulse',     emoji: '🏆' },
];

export default function TabLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/neeru');
    return location.pathname === path;
  };

  return (
    <div className="page">
      {/* Page content */}
      <div style={{ paddingBottom: '64px' }}>
        <Outlet />
      </div>

      {/* Bottom tab bar */}
      <nav className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab.path}
            className={`tab-item${isActive(tab.path) ? ' active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
