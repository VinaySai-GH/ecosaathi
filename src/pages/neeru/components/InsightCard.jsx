import React from 'react';

export default function InsightCard({ kl, city, status, prevKl, hostelAvg }) {
  // Calculate % change
  const percentChange = prevKl ? ((kl - prevKl) / prevKl * 100).toFixed(0) : null;
  const isIncrease = percentChange > 0;
  const benchmarkDiff = kl - city.benchmark_kl;
  const benchmarkPercent = (benchmarkDiff / city.benchmark_kl * 100).toFixed(0);

  // Generate insight based on status
  let insight = '';
  let emoji = '💡';

  if (status === 'over') {
    if (isIncrease) {
      insight = `Usage jumped ${isIncrease ? '+' : ''}${percentChange}% from last month. Summer heat or AC running all day? Try setting AC timers to 2-3 hours daily.`;
      emoji = '⚠️';
    } else {
      insight = `You're ${Math.abs(benchmarkPercent)}% above city benchmark. Consider reducing shower time and fixing any leaks in toilets.`;
      emoji = '🚰';
    }
  } else {
    if (isIncrease && percentChange > 10) {
      insight = `Nice control! Even though usage increased ${percentChange}%, you're still ${Math.abs(benchmarkPercent)}% under the city average.`;
      emoji = '✨';
    } else {
      insight = `Great job conserving water! You're ${Math.abs(benchmarkPercent)}% below city average. Keep up sustainable practices!`;
      emoji = '🌱';
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 36 }}>{emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>AI Insight</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>
        {insight}
      </div>

      {/* Comparison badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {prevKl && (
          <div style={{
            padding: '6px 12px',
            background: `rgba(${isIncrease ? '244,67,54' : '76,175,80'}, 0.1)`,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: isIncrease ? '#f44336' : '#4caf50'
          }}>
            {isIncrease ? '↑' : '↓'} {Math.abs(percentChange)}% vs last month
          </div>
        )}
        <div style={{
          padding: '6px 12px',
          background: `rgba(${benchmarkDiff > 0 ? '244,67,54' : '76,175,80'}, 0.1)`,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: benchmarkDiff > 0 ? '#f44336' : '#4caf50'
        }}>
          {benchmarkDiff > 0 ? '+' : ''}{benchmarkDiff.toFixed(1)}KL vs city avg
        </div>
      </div>
    </div>
  );
}
