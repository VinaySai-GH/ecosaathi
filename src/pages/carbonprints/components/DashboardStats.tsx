import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CarbonLog, CarbonCalculationResult } from '../carbonprints.types';
import { TreePine, Calendar, History, ArrowLeft } from 'lucide-react';
import Tree3D from './Tree3D';

const PIE_COLORS = ['#10B981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9', '#ec4899'];

interface Props {
  data: CarbonCalculationResult;
  history: CarbonLog[];
  onRecalculate: () => void;
  onViewHistory: () => void;
  isPreview?: boolean;
  isSaving?: boolean;
  onSaveLog?: () => void;
  onCancelPreview?: () => void;
}

export default function DashboardStats({ data, history, onRecalculate, onViewHistory, isPreview, isSaving, onSaveLog, onCancelPreview }: Props) {
  const { log, categoryBreakdown } = data;

  const pieData = useMemo(() => {
    return Object.entries(categoryBreakdown).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round(value as number)
    })).filter(item => item.value > 0);
  }, [categoryBreakdown]);

  const lineData = useMemo(() => {
    return [...history]
      .sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
      .map(l => ({
        month: `${new Date(0, l.month - 1).toLocaleString('en', { month: 'short' })} '${l.year.toString().slice(-2)}`,
        co2: l.monthly_carbon
      }));
  }, [history]);

  const calculateYearlyAverage = () => {
    if (history.length === 0) return log.monthly_carbon;
    const total = history.reduce((sum, item) => sum + item.monthly_carbon, 0);
    return Math.round(total / history.length);
  };
  const yearlyAverage = calculateYearlyAverage();

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return { emoji: '🌱', label: 'Excellent', color: '#10B981' };
    if (score >= 70) return { emoji: '⚠️', label: 'Average', color: '#f59e0b' };
    if (score >= 40) return { emoji: '🔥', label: 'High', color: '#ef4444' };
    return { emoji: '💀', label: 'Critical', color: '#7f1d1d' };
  };

  const scoreInfo = getScoreEmoji(log.eco_score);
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My EcoSaathi Carbon Footprint',
          text: `I generated ${log.monthly_carbon}kg of CO2 this month. My Eco Score is ${log.eco_score}/100! Check yours out on EcoSaathi! 🌱`,
        });
      } else {
        alert('Share not supported in this browser! Copying text to clipboard...');
        navigator.clipboard.writeText(`My EcoSaathi Carbon Footprint: ${log.monthly_carbon}kg CO2! Eco Score: ${log.eco_score}/100 🌱`);
      }
    } catch (e) {
      console.log('Share error', e);
    }
  };
  
  const getTipsForCategory = (category: string) => {
    const tipsMap: Record<string, string[]> = {
      electricity: [
        "Switching 5 incandescent bulbs to LEDs could save you 10 kg CO₂ monthly.",
        "Unplug appliances when not in use to avoid phantom energy drain.",
        "Given your AC usage, setting it to 24°C instead of 18°C can reduce energy consumption by up to 25%."
      ],
      transport: [
        "Your transport emissions are a significant chunk. Try taking the bus or carpooling 2 days a week.",
        "Switching one short car trip to a bike ride each week can drastically lower your footprint.",
        "Ensure your vehicle tires are properly inflated to improve fuel efficiency."
      ],
      food: [
        "A meat-heavy diet has a massive footprint. Try a 'Meatless Monday' to cut down.",
        "Eating locally sourced, seasonal produce reduces transport-related food emissions.",
        "Dairy production is carbon-intensive; consider trying plant-based milk alternatives."
      ],
      waste: [
        "Segregating wet waste for composting can reduce landfill methane emissions by up to 30%.",
        "Avoid single-use plastics and carry a reusable bag.",
        "Ensure recyclable items are clean before tossing them in the recycling bin."
      ],
      shopping: [
        "Fast fashion has a huge impact. Try thrift shopping or buying higher-quality clothes that last longer.",
        "Consolidate online orders to reduce the carbon cost of shipping packages.",
        "Repair electronics instead of replacing them immediately."
      ],
      water: [
        "Pumping and treating water requires immense electricity. Save water to save carbon.",
        "Collect RO waste water and use it for washing floors or watering plants.",
        "Taking 5-minute showers instead of 10-minute ones halves your hot water energy use."
      ],
      cooking: [
        "Use lids on pots while cooking to retain heat and save LPG gas.",
        "Soaking lentils and rice before cooking reduces cooking time and gas usage.",
        "Ensure your stove burners are clean so they burn blue (efficiently) instead of yellow."
      ]
    };
    return tipsMap[category.toLowerCase()] || tipsMap['electricity'];
  };

  const highestCategory = [...pieData].sort((a, b) => b.value - a.value)[0]?.name || 'Electricity';
  const personalizedTips = getTipsForCategory(highestCategory);

  return (
    <div className="wizard-card" style={{ padding: '0' }}>
      {/* HEADER SECTION */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #1e3f2d', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="carbon-title">Your Carbon Footprint</h2>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '1.1rem' }}>
            {new Date(0, log.month - 1).toLocaleString('en', { month: 'long' })} {log.year} &nbsp; | &nbsp; 
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>Yearly Avg: {yearlyAverage} kg/mo</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {isPreview ? (
            <>
              <button className="btn-secondary" onClick={onCancelPreview} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={18} /> Back to Dashboard
              </button>
              <button className="btn-primary" onClick={onSaveLog} disabled={isSaving} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1 }}>
                <span>💾</span> {isSaving ? 'Saving...' : 'Save to my Logs'}
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={onRecalculate} style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} /> Calculate My Footprints
              </button>
              <button className="btn-secondary" onClick={onViewHistory} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <History size={18} /> View History
              </button>
            </>
          )}
        </div>
      </div>

      {/* STATS SECTION */}
      <div style={{ padding: '32px' }}>
        <div className="dash-grid">
          <div className="stat-card">
            <span style={{ fontSize: '3rem' }}>☁️</span>
            <div className="stat-value">{log.monthly_carbon} kg</div>
            <div className="stat-label">Total CO₂ this month</div>
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '12px', borderTop: '1px solid #1e3f2d', paddingTop: '12px' }}>
              Indian Average ≈ 250 kg/month
              <br/>
              <span style={{ color: log.monthly_carbon > 250 ? '#ef4444' : '#10B981' }}>
                {log.monthly_carbon > 250 ? 'You are above average' : 'You are below average!'}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <span style={{ fontSize: '3rem' }}>{scoreInfo.emoji}</span>
            <div className="stat-value" style={{ color: scoreInfo.color }}>{log.eco_score}/100</div>
            <div className="stat-label">Carbon Score ({scoreInfo.label})</div>
          </div>

          <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
            <TreePine size={48} color="#10B981" />
            <div className="stat-value">{log.trees_needed}</div>
            <div className="stat-label">Trees needed to offset yearly emission ({log.yearly_carbon} kg)</div>
          </div>
        </div>

        {/* VISUALIZATIONS SECTION */}
        <div className="dash-grid">
          <div className="chart-card">
            <h3 className="chart-title">Emissions Breakdown</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#112a1d', borderColor: '#1e3f2d', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Monthly Trend Graph</h3>
            <div style={{ width: '100%', height: 260 }}>
              {history.length > 0 ? (
                <ResponsiveContainer>
                  <LineChart data={lineData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#112a1d', borderColor: '#1e3f2d', color: '#fff' }} />
                    <Line type="monotone" dataKey="co2" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  Log more months to see your trend!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ORIGINAL TREE DIAGRAM */}
        <div className="chart-card" style={{ marginBottom: '32px' }}>
          <h3 className="chart-title" style={{ textAlign: 'center' }}>🌳 Footprint Tree Visualization</h3>
          <Tree3D isAboveLimit={log.monthly_carbon > 250} />
          <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
            If your emissions are above the Indian average (250kg), the tree begins to wilt!
          </p>
        </div>

        {/* DYNAMIC TIPS SECTION */}
        <div className="eco-tip" style={{ flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ margin: 0, color: '#f8fafc', fontWeight: 600, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Top Tips to reduce your <span style={{ color: '#10B981', textDecoration: 'underline' }}>{highestCategory}</span> footprint
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {personalizedTips.map((tip, idx) => (
              <p key={idx} style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#3b82f6' }}>•</span> {tip}
              </p>
            ))}
          </div>
        </div>

        {/* SHARE BOTTOM ROW */}
        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 42px', fontSize: '1.2rem', borderColor: '#10B981', color: '#10B981' }}>
            <span>📤</span> Share My Footprint
          </button>
        </div>
      </div>
    </div>
  );
}
