import BreakdownChart from './BreakdownChart';

export default function CarbonResult({ result, onReset }) {
  if (!result) return null;

  const { totalKgCO2, breakdown, isAboveLimit } = result;

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

      <button onClick={onReset} className="reset-btn">
        Log Another Day
      </button>

    </div>
  );
}