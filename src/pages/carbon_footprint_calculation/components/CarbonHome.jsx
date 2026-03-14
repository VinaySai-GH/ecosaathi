import { useState } from 'react';
import CarbonForm from './CarbonForm';
import CarbonResult from './CarbonResult';
import './carbon.css';

export default function CarbonHome() {
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleResult = (calculatedResult, submittedFormData) => {
    setResult(calculatedResult);
    setFormData(submittedFormData);
  };

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
            formData={formData}
            onReset={() => { setResult(null); setFormData(null); }}
          />
      }
    </div>
  );
}
