import React, { useState } from 'react';
import BreakdownChart from './BreakdownChart';
import { saveCarbonLog } from '../../../services/carbon.service.js';

export default function CarbonResult({ result, formData, onReset }) {
  if (!result || !formData) return null;

  const { totalKgCO2, breakdown, isAboveLimit } = result;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(null);

  const handleSave = async (overwrite = false) => {
    setIsSaving(true);
    try {
      await saveCarbonLog({
        date: new Date().toISOString(),
        totalKgCO2,
        breakdown,
        month: formData.month,
        year: formData.year,
        formData,
      }, overwrite);
      
      setIsSaved(true); 
      setConfirmOverwrite(null);
    } catch (error) {
       if (error.status === 409 && error.data?.existingLog) {
           setConfirmOverwrite({ existingKgCO2: error.data.existingLog.totalKgCO2 });
       } else {
           alert('Failed to save carbon log.');
           console.error(error);
       }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="carbon-result">

      <div className={`score-badge ${isAboveLimit ? 'above' : 'below'}`}>
        <h2>{totalKgCO2} kg CO₂</h2>
        <p>
          {isAboveLimit
            ? '⚠️ Above India\'s sustainable monthly limit (165 kg)'
            : '✅ Within sustainable range'}
        </p>
      </div>

      <BreakdownChart breakdown={breakdown} />

      <div className="breakdown-list">
        {Object.entries(breakdown).map(([key, val]) => (
          <div key={key} className="breakdown-item">
            <span>{key}</span>
            <span>{val.toFixed(3)} kg CO₂</span>
          </div>
        ))}
      </div>

      <button className={`save-btn${isSaved ? ' saved' : ''}`} onClick={() => handleSave(false)} disabled={isSaving || isSaved}>
        {isSaving ? 'Saving…' : isSaved ? '✅ Saved to your trend' : '💾 Save to my Monthly Trend'}
      </button>

      {confirmOverwrite && (
        <div className="overwrite-box">
          <p className="overwrite-msg">
            You already logged <strong>{confirmOverwrite.existingKgCO2} kg CO₂</strong> for {formData.month}/{formData.year}.
            Overwrite with <strong>{totalKgCO2} kg CO₂</strong>?
          </p>
          <div className="overwrite-actions">
            <button className="overwrite-cancel" onClick={() => setConfirmOverwrite(null)}>Cancel</button>
            <button className="overwrite-confirm" onClick={() => handleSave(true)}>Overwrite</button>
          </div>
        </div>
      )}

      <button onClick={onReset} className="reset-btn" style={{marginTop: '24px', width: '100%'}}>
        Log Another Month
      </button>

    </div>
  );
}
