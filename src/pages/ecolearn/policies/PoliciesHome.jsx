import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { POLICIES, POLICY_CATEGORIES } from './data/policies.js';
import '../ecolearn.css';

export default function PoliciesHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = POLICIES.filter(p => {
    const matchCat = activeTab === 'All' || p.category === activeTab || p.category === 'All';
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const CATEGORY_ICONS = { All: '🌍', Air: '💨', Water: '💧', Waste: '♻️', Energy: '☀️', Forest: '🌲' };

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate('/ecolearn')}>← Back to EcoLearn</button>

      <div className="el-page-header">
        <h1 className="el-page-title">Indian Eco Policies</h1>
        <p className="el-page-subtitle">
          India's key environmental laws and government schemes — explained in plain language.
        </p>
      </div>

      <input
        className="el-policy-search"
        type="text"
        placeholder="Search policies…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="el-policy-tabs">
        {POLICY_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`el-policy-tab ${activeTab === cat ? 'active' : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      <div className="el-policies-list">
        {filtered.length === 0 && (
          <p className="el-empty">No policies match your search.</p>
        )}
        {filtered.map(policy => (
          <div
            key={policy.id}
            className="el-policy-card"
            onClick={() => navigate(`/ecolearn/policies/${policy.id}`)}
          >
            <div className="el-policy-card-left">
              <span className="el-policy-category-tag">{policy.category}</span>
              <h3 className="el-policy-name">{policy.name}</h3>
              <p className="el-policy-summary">{policy.summary}</p>
            </div>
            <div className="el-policy-card-right">
              <span className="el-policy-year">{policy.year}</span>
              {policy.everydayImpact && (
                <span className="el-everyday-tag">Everyday Impact</span>
              )}
              <span className="el-policy-arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
