import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ecolearn.css';

const CARDS = [
  {
    icon: '📚',
    title: 'Lessons & Quizzes',
    description:
      'Learn about air quality, carbon footprint, waste management, water conservation, biodiversity, and climate change through short lessons. Test your knowledge with quizzes and earn Eco Pulse points for every module you complete.',
    button: 'Start Learning →',
    route: '/ecolearn/lessons',
    accent: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    icon: '🏛️',
    title: 'Indian Eco Policies',
    description:
      "Understand India's key environmental laws and government schemes explained in plain language. Learn how policies like the Environment Protection Act, Swachh Bharat Mission, and BS6 norms directly affect your daily life.",
    button: 'Explore Policies →',
    route: '/ecolearn/policies',
    accent: '#3b82f6',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    icon: '🤝',
    title: 'Civic Engagement & Action',
    description:
      'Your central repository for real-world environmental education. Discover direct links to civic engagement platforms, apps, and learning resources to turn awareness into action.',
    button: 'Explore Resources →',
    route: '/ecolearn/engagement',
    accent: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
  },
];

export default function EcoLearnHome() {
  const navigate = useNavigate();

  return (
    <div className="el-home">
      <div className="el-home-header">
        <h1 className="el-home-title">EcoLearn</h1>
        <p className="el-home-subtitle">
          Learn, engage, and stay informed about the environment
        </p>
      </div>

      <div className="el-home-cards">
        {CARDS.map((card) => (
          <div
            key={card.route}
            className="el-hub-card"
            style={{ '--card-accent': card.accent, '--card-bg': card.bg }}
            onClick={() => navigate(card.route)}
          >
            <div className="el-hub-card-icon">{card.icon}</div>
            <h2 className="el-hub-card-title">{card.title}</h2>
            <p className="el-hub-card-desc">{card.description}</p>
            <button className="el-hub-card-btn">{card.button}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
