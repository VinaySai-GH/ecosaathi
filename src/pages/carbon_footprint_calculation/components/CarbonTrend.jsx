import React, { useEffect, useState } from 'react';
import { getCarbonHistory } from '../../../services/carbon.service.js';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function CarbonTrend({ onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const history = await getCarbonHistory();
        // Sort by year then month
        const sorted = history.sort((a, b) => {
           if (a.year !== b.year) return a.year - b.year;
           return a.month - b.month;
        });

        const formatted = sorted.map(log => ({
            name: `${new Date(2000, log.month - 1).toLocaleString('default', { month: 'short' })} ${log.year.toString().slice(-2)}`,
            co2: log.totalKgCO2
        }));

        setData(formatted);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="carbon-trend" style={{ background: 'var(--glass-bg)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
      <button onClick={onBack} style={{ background: 'transparent', color: 'var(--text-muted)', marginBottom: '16px', fontSize: '16px' }}>
        ← Back to Calculator
      </button>
      
      <h2 style={{ marginBottom: '8px' }}>Your Carbon Journey</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Track your monthly CO₂ emissions over time.</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>Loading trends...</div>
      ) : data.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-dim)' }}>
           No logs found. Calculate and save your footprint to see trends!
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <Tooltip 
                contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--accent)' }}
              />
              <Area type="monotone" dataKey="co2" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorCo2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
