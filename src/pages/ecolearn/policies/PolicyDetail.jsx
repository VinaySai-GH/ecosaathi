import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicyById, POLICIES } from './data/policies.js';
import '../ecolearn.css';

export default function PolicyDetail() {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const policy = getPolicyById(policyId);

  if (!policy) {
    return (
      <div className="el-page">
        <p className="el-error">Policy not found.</p>
        <button className="el-back-btn" onClick={() => navigate('/ecolearn/policies')}>← Back</button>
      </div>
    );
  }

  const related = policy.relatedPolicies
    .map(id => POLICIES.find(p => p.id === id))
    .filter(Boolean);

  return (
    <div className="el-page">
      <button className="el-back-btn" onClick={() => navigate('/ecolearn/policies')}>
        ← All Policies
      </button>

      <div className="el-policy-detail-header">
        <div className="el-policy-detail-meta">
          <span className="el-policy-category-tag">{policy.category}</span>
          <span className="el-policy-year large">{policy.year}</span>
          {policy.everydayImpact && <span className="el-everyday-tag">Everyday Impact</span>}
        </div>
        <h1 className="el-policy-detail-title">{policy.name}</h1>
        <p className="el-policy-detail-authority">Authority: {policy.authority}</p>
        <p className="el-policy-summary-large">{policy.summary}</p>
      </div>

      <div className="el-policy-detail-body">
        <section className="el-policy-section">
          <h2 className="el-policy-section-title">What Is It?</h2>
          {policy.explanation.split('\n\n').map((para, i) => (
            <p key={i} className="el-lesson-para">{para.trim()}</p>
          ))}
        </section>

        <section className="el-policy-section">
          <h2 className="el-policy-section-title">Why This Matters to You</h2>
          {policy.whyItMatters.split('\n\n').map((para, i) => (
            <p key={i} className="el-lesson-para">{para.trim()}</p>
          ))}
        </section>

        <section className="el-policy-section">
          <h2 className="el-policy-section-title">Key Points</h2>
          <ul className="el-key-points">
            {policy.keyPoints.map((pt, i) => (
              <li key={i} className="el-key-point">
                <span className="el-key-point-dot">▪</span> {pt}
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="el-policy-section">
            <h2 className="el-policy-section-title">Related Policies</h2>
            <div className="el-related-policies">
              {related.map(rel => (
                <button
                  key={rel.id}
                  className="el-related-policy-chip"
                  onClick={() => navigate(`/ecolearn/policies/${rel.id}`)}
                >
                  {rel.name} ({rel.year})
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
