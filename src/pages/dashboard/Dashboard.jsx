import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AnimatedCard from '../../components/animations/AnimatedCard.jsx';
import './dashboard.css';

const FEATURES = [
  {
    id: 'carbon',
    path: '/carbon',
    title: 'Carbon Footprint',
    subtitle: 'Daily Indian emission tracker',
    icon: '🌱',
    themeClass: 'theme-carbon',
    instructor: 'Measure daily & monthly CO₂',
  },
  {
    id: 'neeru',
    path: '/neeru',
    title: 'Neeru',
    subtitle: 'Water Usage Tracker',
    icon: '💧',
    themeClass: 'theme-neeru',
    instructor: 'Track your monthly consumption',
  },
  {
    id: 'ecoatlas',
    path: '/greenspot',
    title: 'Eco Atlas',
    subtitle: 'Nature, recycling & eco places',
    icon: '🗺️',
    themeClass: 'theme-greenspot',
    instructor: 'Explore eco-friendly spots & risk zones',
  },
  {
    id: 'raatkahisaab',
    path: '/raatkahisaab',
    title: 'Raat Ka Hisaab',
    subtitle: 'Nightly Reflection',
    icon: '🌙',
    themeClass: 'theme-rkt',
    instructor: 'Daily habits & accountability',
  },
  {
    id: 'ecopulse',
    path: '/ecopulse',
    title: 'Eco Pulse',
    subtitle: 'Campus Leaderboards',
    icon: '🏆',
    instructor: 'See top performing cities',
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container anim-enter">
      <div className="dashboard-header">
        <h1 className="welcome-text">Hello, {user?.name || 'Eco Saathi'} 👋</h1>
        <p className="welcome-subtext">Choose a module to start your journey.</p>
      </div>

      <div className="dashboard-grid">
        {FEATURES.map((feature, index) => (
          <AnimatedCard key={feature.id} delay={index * 100}>
            <div
              className={`feature-card ${feature.themeClass}`}
              onClick={() => navigate(feature.path)}
              style={{ height: '100%' }}
            >
              <div className="card-top-banner">
                <div className="card-header-content">
                  <h2 className="card-title">{feature.title}</h2>
                  <p className="card-subtitle">{feature.subtitle}</p>
                  <p className="card-instructor">{feature.instructor}</p>
                </div>
                <div className="card-icon-avatar">
                  <span className="card-icon">{feature.icon}</span>
                </div>
              </div>
              <div className="card-bottom-content">
                <div className="card-actions">
                  <button className="icon-btn" title="Open feature">🔗</button>
                  <button className="icon-btn" title="View history">📁</button>
                </div>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
