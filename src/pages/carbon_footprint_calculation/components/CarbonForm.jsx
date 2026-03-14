import { useState } from 'react';
import { calculateMonthlyFootprint } from '../../../utils/carbonCalc';

const COMMUTE_OPTIONS = [
  { value: 'walk',        label: '🚶 Walk' },
  { value: 'cycle',       label: '🚲 Cycle' },
  { value: 'metro',       label: '🚇 Metro' },
  { value: 'bus_cng',     label: '🚌 Bus (CNG)' },
  { value: 'two_wheeler', label: '🛵 2-Wheeler' },
  { value: 'car_petrol',  label: '🚗 Car (Petrol)' },
  { value: 'car_diesel',  label: '🚗 Car (Diesel)' },
];

export default function CarbonForm({ onResult }) {
  const now = new Date();
  const [form, setForm] = useState({
    month:        now.getMonth() + 1,
    year:         now.getFullYear(),
    commutes:     [{ mode: 'metro', km: 100 }],
    foodDays:     { vegetarian: 20, mixed: 10, red_meat: 0 },
    monthlyBill:  500,
    grid:         'NEWNE',
    purchases:    [],
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCommuteChange = (index, field, value) => {
    const updated = [...form.commutes];
    updated[index][field] = value;
    handleChange('commutes', updated);
  };

  const addCommute = () => {
    handleChange('commutes', [...form.commutes, { mode: 'metro', km: 0 }]);
  };

  const removeCommute = (index) => {
    const updated = form.commutes.filter((_, i) => i !== index);
    handleChange('commutes', updated);
  };

  const handleFoodChange = (diet, value) => {
    handleChange('foodDays', { ...form.foodDays, [diet]: Number(value) });
  };

  const handlePurchaseChange = (size, checked) => {
    const updated = checked 
      ? [...form.purchases, size]
      : form.purchases.filter(p => p !== size);
    handleChange('purchases', updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = calculateMonthlyFootprint(form);
    onResult(result, form);
  };

  return (
    <form onSubmit={handleSubmit} className="carbon-form">

      {/* DATE LOGGED */}
      <div className="form-section">
        <h3>📅 Which month is this for?</h3>
        <select
          value={form.month}
          onChange={e => handleChange('month', Number(e.target.value))}
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={form.year}
          onChange={e => handleChange('year', Number(e.target.value))}
        >
          {[2024, 2025, 2026, 2027].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* COMMUTE */}
      <div className="form-section">
        <h3>🚗 How did you travel this month?</h3>
        {form.commutes.map((commute, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <select
              value={commute.mode}
              onChange={e => handleCommuteChange(index, 'mode', e.target.value)}
              style={{ flex: 2, marginBottom: 0 }}
            >
              {COMMUTE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={commute.km}
              onChange={e => handleCommuteChange(index, 'km', Number(e.target.value))}
              placeholder="km"
              min="0"
              style={{ flex: 1, marginBottom: 0 }}
            />
            {form.commutes.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeCommute(index)}
                style={{ padding: '0 12px', background: 'var(--danger)', color: '#fff', borderRadius: '8px' }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button 
          type="button" 
          onClick={addCommute}
          style={{ padding: '8px 16px', background: 'var(--cardHighlight)', color: 'var(--text)', borderRadius: '8px', fontSize: '14px' }}
        >
          + Add another vehicle
        </button>
      </div>

      {/* FOOD */}
      <div className="form-section">
        <h3>🍽️ What was your diet this month? (Days)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🥗 Vegetarian Days:</span>
            <input 
              type="number" 
              value={form.foodDays.vegetarian} 
              onChange={e => handleFoodChange('vegetarian', e.target.value)}
              min="0" max="31"
              style={{ width: '100px', marginBottom: 0 }}
            />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🍗 Mixed Diet Days:</span>
            <input 
              type="number" 
              value={form.foodDays.mixed} 
              onChange={e => handleFoodChange('mixed', e.target.value)}
              min="0" max="31"
              style={{ width: '100px', marginBottom: 0 }}
            />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🥩 Red Meat Days:</span>
            <input 
              type="number" 
              value={form.foodDays.red_meat} 
              onChange={e => handleFoodChange('red_meat', e.target.value)}
              min="0" max="31"
              style={{ width: '100px', marginBottom: 0 }}
            />
          </label>
        </div>
      </div>

      {/* ELECTRICITY */}
      <div className="form-section">
        <h3>⚡ Monthly electricity bill (₹)</h3>
        <input
          type="number"
          value={form.monthlyBill}
          onChange={e => handleChange('monthlyBill', Number(e.target.value))}
          placeholder="e.g. 800"
          min="0"
        />
        <select
          value={form.grid}
          onChange={e => handleChange('grid', e.target.value)}
        >
          <option value="NEWNE">North/Central India</option>
          <option value="South">South India</option>
        </select>
      </div>

      {/* PURCHASES */}
      <div className="form-section">
        <h3>🛍️ Did you buy anything significant?</h3>
          <label className="radio-label">
            <input
              type="checkbox"
              checked={form.purchases.includes('small')}
              onChange={e => handlePurchaseChange('small', e.target.checked)}
            />
            Small item (clothes, gadget)
          </label>
          <label className="radio-label">
            <input
              type="checkbox"
              checked={form.purchases.includes('large')}
              onChange={e => handlePurchaseChange('large', e.target.checked)}
            />
            Large item (appliance, furniture)
          </label>
      </div>

      <button type="submit" className="submit-btn">
        Calculate My Footprint →
      </button>

    </form>
  );
}