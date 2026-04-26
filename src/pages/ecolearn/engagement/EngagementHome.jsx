import React from 'react';
import { useNavigate } from 'react-router-dom';
import './engagement.css';

const PLATFORMS = [
  {
    name: 'Swachh Bharat Mission Urban',
    description: 'Official portal by Ministry of Housing and Urban Affairs for civic cleanliness and sanitation.',
    link: 'https://sbmurban.org/',
    icon: '🏙️'
  },
  {
    name: 'National Air Quality Index (AQI)',
    description: 'Provides real-time updates and forecasts on the National Air Quality Index published by CPCB.',
    link: 'https://app.cpcbccr.com/AQI_India/',
    icon: '💨'
  },
  {
    name: 'Jhatkaa.org',
    description: 'A platform to launch and participate in campaigns demanding climate action and policy changes.',
    link: 'https://jhatkaa.org/',
    icon: '📣'
  },
  {
    name: 'MyGov India',
    description: 'The national citizen engagement platform. Participate in environment-related pledges, discussions, and tasks.',
    link: 'https://www.mygov.in/',
    icon: '🇮🇳'
  }
];

const AUTHORITIES = [
  {
    title: 'National Green Tribunal (NGT)',
    emails: ['registrar-ngt@nic.in', 'publicgrievance-ngt@gov.in'],
    description: 'For grievances and queries related to environmental protection and conservation of forests.'
  },
  {
    title: 'Central Pollution Control Board (CPCB)',
    emails: ['cpcb@nic.in'],
    description: 'Foremost statutory organization providing technical services regarding pollution control.'
  },
  {
    title: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    emails: ['mefcc@gov.in', 'secy-moef@nic.in'],
    description: 'Nodal agency in the government structure for planning, promoting, co-ordinating environmental programs.'
  }
];

export default function EngagementHome() {
  const navigate = useNavigate();

  return (
    <div className="ecolearn-engagement">
      <div className="engagement-header">
        <button className="back-btn" onClick={() => navigate('/ecolearn')}>
          ← Back to EcoLearn
        </button>
        <h1 className="engagement-title">Civic Engagement & Action</h1>
        <p className="engagement-subtitle">
          Turn awareness into real-world impact. Connect directly with Indian authorities and key platforms.
        </p>
      </div>

      <div className="engagement-content">
        <section className="engagement-section">
          <h2>📱 Key Platforms & Apps</h2>
          <div className="platforms-grid">
            {PLATFORMS.map((platform, idx) => (
              <a 
                href={platform.link} 
                target="_blank" 
                rel="noreferrer" 
                className="platform-card" 
                key={idx}
              >
                <div className="platform-icon">{platform.icon}</div>
                <div>
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="engagement-section">
          <h2>✉️ Important Authorities</h2>
          <div className="authorities-grid">
            {AUTHORITIES.map((auth, idx) => (
              <div className="authority-card" key={idx}>
                <h3>{auth.title}</h3>
                <p>{auth.description}</p>
                <div className="authority-emails">
                  {auth.emails.map(email => (
                    <a href={`mailto:${email}`} className="email-chip" key={email}>
                      {email}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
