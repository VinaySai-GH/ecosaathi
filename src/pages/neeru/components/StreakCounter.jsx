import React from 'react';

export default function StreakCounter({ userHistory = [] }) {
  // Calculate streak (consecutive months logged)
  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < userHistory.length; i++) {
    const log = userHistory[i];
    const logMonth = log.month;
    const logYear = log.year;

    // Check if consecutive with current date
    if (logMonth === currentDate.getMonth() + 1 && logYear === currentDate.getFullYear()) {
      streak++;
      currentDate.setMonth(currentDate.getMonth() - 1);
    } else {
      break;
    }
  }

  const streakEmoji = streak >= 3 ? '🔥' : streak >= 1 ? '⭐' : '🌱';
  const streakMessage = streak === 0
    ? 'Start logging today!'
    : streak === 1
    ? 'Nice start! Keep it going!'
    : streak === 2
    ? 'Building momentum!'
    : `Amazing consistency! ${streak} months strong!`;

  return (
    <div style={{
      padding: 24,
      background: 'linear-gradient(135deg, rgba(110,224,127,0.1), rgba(100,200,110,0.05))',
      borderRadius: 16,
      textAlign: 'center',
      borderLeft: '4px solid var(--accent)'
    }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{streakEmoji}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', marginBottom: 4 }}>
        {streak} month{streak !== 1 ? 's' : ''}
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
        {streakMessage}
      </div>
    </div>
  );
}
