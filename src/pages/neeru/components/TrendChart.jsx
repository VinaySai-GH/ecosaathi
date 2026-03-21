import React from 'react';

export default function TrendChart({ history = [] }) {
  // Get last 3 months of data
  const last3Months = history.slice(0, 3).reverse();

  if (last3Months.length === 0) {
    return (
      <div style={{
        padding: 24,
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: 14
      }}>
        📊 No trend data yet. Log more months to see patterns!
      </div>
    );
  }

  // Find min/max for scaling
  const values = last3Months.map(m => m.kl_used);
  const maxValue = Math.max(...values, 100);
  const minValue = 0;
  const range = maxValue - minValue || 1;

  // Month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const labels = last3Months.map(m => months[m.month - 1]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 180, gap: 12 }}>
        {last3Months.map((month, i) => {
          const height = ((month.kl_used - minValue) / range) * 140 + 20; // 20px min height
          const percent = ((last3Months[i]?.kl_used || 0) - (last3Months[i + 1]?.kl_used || last3Months[i]?.kl_used)) / (last3Months[i + 1]?.kl_used || 1) * 100;
          const trend = i === 0 ? null : percent > 5 ? '📈' : percent < -5 ? '📉' : '→';

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)' }}>
                {month.kl_used}KL
              </div>
              <div style={{
                width: '100%',
                height: height,
                background: `linear-gradient(180deg, var(--accent), rgba(110,224,127,0.3))`,
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(110,224,127,0.2)'
              }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                {labels[i]}
              </div>
              {trend && <div style={{ fontSize: 14 }}>{trend}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
