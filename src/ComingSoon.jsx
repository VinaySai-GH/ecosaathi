import React from 'react';

export default function ComingSoon({ title, icon }) {
  return (
    <div className="coming-soon">
      <span className="cs-icon">{icon}</span>
      <h2>{title}</h2>
      <p>Coming soon</p>
    </div>
  );
}
