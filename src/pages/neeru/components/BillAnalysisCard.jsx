import React from 'react';
import { generateBillInsight } from '../../../utils/pdfExtractor.js';

export default function BillAnalysisCard({ kl, billText, city, previousKL }) {
  const analysis = generateBillInsight(kl, billText, city.benchmark_kl, previousKL);

  const trendBadgeColor = analysis.comparison.percentChange
    ? analysis.comparison.percentChange > 0 ? '#f44336' : '#4caf50'
    : 'var(--text-dim)';

  const benchmarkBadgeColor = analysis.comparison.percentAboveBenchmark > 0 ? '#f44336' : '#4caf50';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontSize: 36 }}>{analysis.emoji}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Bill Analysis</div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-dim)' }}>
        {analysis.insight}
      </div>

      {/* Details from bill */}
      {Object.keys(analysis.billDetails).length > 0 && (
        <div style={{
          padding: 12,
          background: 'rgba(110,224,127,0.08)',
          borderRadius: 8,
          fontSize: 12,
          color: 'var(--text-dim)'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>📋 Bill Details</div>
          {analysis.billDetails.meterReading && (
            <div>Meter: {analysis.billDetails.meterReading}</div>
          )}
          {analysis.billDetails.billDate && (
            <div>Date: {analysis.billDetails.billDate}</div>
          )}
          {analysis.billDetails.consumerType && (
            <div>Type: {analysis.billDetails.consumerType}</div>
          )}
        </div>
      )}

      {/* Comparison badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {analysis.comparison.percentChange !== null && (
          <div style={{
            padding: '6px 12px',
            background: `rgba(${analysis.comparison.percentChange > 0 ? '244,67,54' : '76,175,80'}, 0.1)`,
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: trendBadgeColor
          }}>
            {analysis.comparison.percentChange > 0 ? '↑' : '↓'} {Math.abs(analysis.comparison.percentChange)}% vs last month
          </div>
        )}
        <div style={{
          padding: '6px 12px',
          background: `rgba(${analysis.comparison.percentAboveBenchmark > 0 ? '244,67,54' : '76,175,80'}, 0.1)`,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: benchmarkBadgeColor
        }}>
          {analysis.comparison.percentAboveBenchmark > 0 ? '+' : ''}{analysis.comparison.percentAboveBenchmark}% vs avg
        </div>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(100,150,200,0.1)',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text-dim)'
        }}>
          📍 {city.label}: {city.benchmark_kl}KL avg
        </div>
      </div>
    </div>
  );
}
