import { useState } from 'react';
import CarbonForm from './CarbonForm';
import CarbonResult from './CarbonResult';
import CarbonTrend from './CarbonTrend';
import './carbon.css';

export default function CarbonHome() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showTrend, setShowTrend] = useState(false);

  const handleResult = (calculatedResult, submittedFormData) => {
    setResult(calculatedResult);
    setFormData(submittedFormData);
  };

  if (showTrend) {
    return (
      <div className="carbon-home fade-in">
        <CarbonTrend onBack={() => setShowTrend(false)} />
      </div>
    );
  }

  return (
    <div className="carbon-home fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ margin: 0 }}>🌱 Carbon Footprint</h1>
        <button 
          onClick={() => setShowTrend(true)}
          style={{ 
            background: 'var(--card-highlight)', 
            color: 'var(--text)', 
            padding: '8px 16px', 
            borderRadius: 'var(--radius-full)', 
            border: '1px solid var(--border)',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📈 Monthly Trend
        </button>
      </div>
      <p className="subtitle">
        Based on Indian emission factors (ARAI 2009 · IPCC 2007)
      </p>

      {!result
        ? <CarbonForm onResult={handleResult} />
        : <CarbonResult
            result={result}
            formData={formData}
            onReset={() => { setResult(null); setFormData(null); }}
          />
      }
    </div>
  );
}
