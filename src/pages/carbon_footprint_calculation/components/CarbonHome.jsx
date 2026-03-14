import { useState } from 'react';
import CarbonForm from './CarbonForm';
import CarbonResult from './CarbonResult';
import { saveCarbonLog } from '../../../services/carbon.service.js';
import './carbon.css';

export default function CarbonHome() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmOverwrite, setConfirmOverwrite] = useState(null);

  const handleResult = async (calculatedResult, formData) => {
    setResult(calculatedResult);

    try {
      setLoading(true);
      await saveCarbonLog({
        date: new Date().toISOString(),
        totalKgCO2: calculatedResult.totalKgCO2,
        breakdown: calculatedResult.breakdown,
        month: formData.month,
        year: formData.year,
        formData,
      });
    } catch (err) {
      if (err.status === 409) {
         setConfirmOverwrite({ calculatedResult, formData });
      } else {
         console.error('Failed to save log:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const executeOverwrite = async () => {
    const { calculatedResult, formData } = confirmOverwrite;
    try {
      setLoading(true);
      await saveCarbonLog({
        date: new Date().toISOString(),
        totalKgCO2: calculatedResult.totalKgCO2,
        breakdown: calculatedResult.breakdown,
        month: formData.month,
        year: formData.year,
        formData,
      }, true); // overwrite flag
      
      setConfirmOverwrite(null);
    } catch (err) {
       console.error('Failed to overwrite log:', err);
    } finally {
      setLoading(false);
    }
  };

  if (confirmOverwrite) {
    return (
      <div className="carbon-home">
        <div className="form-section anim-enter text-center">
          <h2>⚠️ Log Already Exists</h2>
          <p style={{ marginTop: '16px', marginBottom: '24px', color: 'var(--textMuted)' }}>
            You have already logged your carbon footprint for <strong>{confirmOverwrite.formData.month}/{confirmOverwrite.formData.year}</strong>. Do you want to overwrite it with this new calculation?
          </p>
          <div className="flex gap-md">
            <button className="reset-btn w-full" onClick={() => setConfirmOverwrite(null)}>Cancel</button>
            <button className="submit-btn w-full" style={{ marginTop: 0 }} onClick={executeOverwrite}>Overwrite</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carbon-home">
      <h1>🌱 Carbon Footprint Calculator</h1>
      <p className="subtitle">
        Based on Indian emission factors (ARAI 2009 · IPCC 2007)
      </p>

      {!result
        ? <CarbonForm onResult={handleResult} />
        : <CarbonResult
            result={result}
            onReset={() => setResult(null)}
          />
      }

      {loading && <p className="saving">Saving your log...</p>}
    </div>
  );
}