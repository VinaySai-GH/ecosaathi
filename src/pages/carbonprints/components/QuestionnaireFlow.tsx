import React, { useState, useEffect } from 'react';
import { CARBON_FACTORS } from '../../../shared/constants/carbonFactors';
import { CarbonFormState } from '../carbonprints.types';
import { calculateCarbonLogPreview } from '../../../services/carbonprints.service';
import { Calendar, Zap, Car, Flame, Apple, Trash2, ShoppingBag, Droplets, ArrowRight, ArrowLeft } from 'lucide-react';

const SECTIONS = [
  { id: 'general', title: 'Log Details', icon: <Calendar /> },
  { id: 'electricity', title: 'Power & Electricity', icon: <Zap /> },
  { id: 'transport', title: 'Daily Commute', icon: <Car /> },
  { id: 'cooking', title: 'Cooking Habits', icon: <Flame /> },
  { id: 'food', title: 'Food Profile', icon: <Apple /> },
  { id: 'waste', title: 'Waste Management', icon: <Trash2 /> },
  { id: 'shopping', title: 'Shopping footprint', icon: <ShoppingBag /> },
  { id: 'water', title: 'Water Footprint', icon: <Droplets /> }
];

const INITIAL_STATE: CarbonFormState & { month: number; year: number; grid_area: string } = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  grid_area: 'urban',
  // Electricity
  electricity_units: 50, acHoursDaily: 0, fansCount: 0, ledCount: 0, geyserMinutesDaily: 0,
  // Transport
  transport_bike_km: 0, transport_car_km: 0, transport_bus_km: 0, transport_train_km: 0, flights: 0,
  // Cooking
  lpg_cylinders: 1, inductionHoursDaily: 0,
  // Food
  food_type: 'veg', chicken_meals: 0, mutton_meals: 0, milk_litres: 0.5, waste_kg: 5,
  // Waste
  composting: false, recycling: false,
  // Shopping
  clothes: 0, online_orders: 0, electronics: 0, plastic_bottles: 0,
  // Water
  water_litres: 1000, showersDaily: 1, washingMachineWeekly: 1, roLitresDaily: 10
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function QuestionnaireFlow({ onComplete, onCancel }: { onComplete: (result: any, formData: any) => void, onCancel?: () => void }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [liveCarbon, setLiveCarbon] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Carbon Calculation
  useEffect(() => {
    let emissions = 0;
    emissions += formData.electricity_units * CARBON_FACTORS.electricity_kwh;
    // Add grid modifier artificially for gamification if non-urban? This is frontend live calculation only.
    if(formData.grid_area === 'rural') emissions *= 0.9;
    else if(formData.grid_area === 'industrial') emissions *= 1.2;

    emissions += formData.transport_bike_km * CARBON_FACTORS.bike_km;
    emissions += formData.transport_car_km * CARBON_FACTORS.car_km;
    emissions += formData.transport_bus_km * CARBON_FACTORS.bus_km;
    emissions += formData.transport_train_km * CARBON_FACTORS.train_km;
    emissions += (formData.flights / 12) * CARBON_FACTORS.flight_yearly_kg;
    emissions += formData.lpg_cylinders * CARBON_FACTORS.lpg_cylinders;
    emissions += formData.food_type === 'non-veg' ? CARBON_FACTORS.diet_non_veg : CARBON_FACTORS.diet_veg;
    emissions += formData.chicken_meals * 4.33 * CARBON_FACTORS.chicken_meal;
    emissions += formData.mutton_meals * 4.33 * CARBON_FACTORS.mutton_meal;
    emissions += formData.milk_litres * 30.4 * CARBON_FACTORS.milk_litre;
    
    let waste = formData.waste_kg * 4.33 * CARBON_FACTORS.waste_kg;
    if (formData.composting) waste *= (1 - CARBON_FACTORS.compost_reduction);
    if (formData.recycling) waste *= (1 - CARBON_FACTORS.recycle_reduction);
    emissions += waste;
    
    emissions += formData.clothes * CARBON_FACTORS.clothes_avg;
    emissions += formData.online_orders * CARBON_FACTORS.online_order;
    emissions += (formData.electronics / 12) * CARBON_FACTORS.electronic_device;
    emissions += formData.plastic_bottles * 4.33 * CARBON_FACTORS.plastic_bottle;
    
    let waterL = formData.water_litres;
    if (waterL === 1000) { 
        waterL = (formData.showersDaily * CARBON_FACTORS.shower_litres * 30.4) + 
                 (formData.washingMachineWeekly * CARBON_FACTORS.washing_machine_litres * 4.33) + 
                 (formData.roLitresDaily * 30.4);
    }
    emissions += (waterL / 1000) * CARBON_FACTORS.water_1000l;

    setLiveCarbon(Math.round(emissions));
  }, [formData]);

  const h = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
        const result = await calculateCarbonLogPreview(formData);
        onComplete(result, formData);
    } catch (e) {
        console.error(e);
        alert("Failed to calculate carbon log");
    }
    setIsSubmitting(false);
  };

  const Section = SECTIONS[step];

  return (
    <div className="wizard-card">
      <div className="wizard-progress">
        {SECTIONS.map((sec, i) => (
          <div key={sec.id} className={`progress-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`} />
        ))}
      </div>

      <div className="carbon-header" style={{ marginBottom: '16px' }}>
        <h2 className="carbon-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {Section.icon} {Section.title}
        </h2>
        
        {step > 0 && (
          <div className={`live-counter ${liveCarbon > 400 ? 'high' : ''}`}>
            <span>Live CO₂</span>
            <span className="live-value">{liveCarbon} kg</span>
            {liveCarbon < 150 ? '🌱' : liveCarbon > 400 ? '🔥' : '⚠️'}
          </div>
        )}
      </div>

      <p style={{ color: '#94a3b8', marginBottom: '32px' }}>Step {step + 1} of {SECTIONS.length}</p>

      {/* GENERAL LOG DETAILS */}
      {step === 0 && (
        <>
          <label className="question-label">Which Month & Year are you logging for?</label>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <select 
              className="radio-btn" 
              value={formData.month} 
              onChange={e => h('month', parseInt(e.target.value))}
              style={{ flex: 2, background: '#1a3626', color: '#fff', padding: '12px' }}
            >
              {MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
            </select>
            <input 
              type="number" 
              className="radio-btn"
              value={formData.year}
              onChange={e => h('year', parseInt(e.target.value))}
              style={{ flex: 1, background: '#1a3626', color: '#fff', padding: '12px' }}
            />
          </div>

          <label className="question-label">Select your grid supply area type:</label>
          <div className="radio-group" style={{ flexWrap: 'wrap' }}>
            <button className={`radio-btn ${formData.grid_area === 'urban' ? 'selected' : ''}`} onClick={() => h('grid_area', 'urban')}>Urban</button>
            <button className={`radio-btn ${formData.grid_area === 'rural' ? 'selected' : ''}`} onClick={() => h('grid_area', 'rural')}>Rural</button>
            <button className={`radio-btn ${formData.grid_area === 'industrial' ? 'selected' : ''}`} onClick={() => h('grid_area', 'industrial')}>Industrial Config</button>
          </div>
        </>
      )}

      {/* ELECTRICITY */}
      {step === 1 && (
        <div className="slider-wrapper">
          <label className="question-label">Basic Monthly Electricity (Units/kWh): <b>{formData.electricity_units}</b></label>
          <input type="range" className="custom-slider" min="0" max="1000" step="10" value={formData.electricity_units} onChange={e => h('electricity_units', Number(e.target.value))} />
          
          <div className="eco-tip">💡 Tip: LED bulbs use 75% less energy than incandescent ones.</div>
        </div>
      )}

      {/* TRANSPORT */}
      {step === 2 && (
        <>
          <div className="slider-wrapper">
            <label className="question-label">Bike travel (km/month): <b>{formData.transport_bike_km}</b></label>
            <input type="range" className="custom-slider" min="0" max="1000" step="10" value={formData.transport_bike_km} onChange={e => h('transport_bike_km', Number(e.target.value))} />
          </div>
          <div className="slider-wrapper">
            <label className="question-label">Car travel (km/month): <b>{formData.transport_car_km}</b></label>
            <input type="range" className="custom-slider" min="0" max="2000" step="20" value={formData.transport_car_km} onChange={e => h('transport_car_km', Number(e.target.value))} />
          </div>
          <div className="slider-wrapper">
            <label className="question-label">Flights (per year): <b>{formData.flights}</b></label>
            <input type="range" className="custom-slider" min="0" max="20" step="1" value={formData.flights} onChange={e => h('flights', Number(e.target.value))} />
          </div>
        </>
      )}

      {/* COOKING */}
      {step === 3 && (
        <div className="slider-wrapper">
          <label className="question-label">LPG Cylinders used (per month): <b>{formData.lpg_cylinders}</b></label>
          <input type="range" className="custom-slider" min="0" max="5" step="0.5" value={formData.lpg_cylinders} onChange={e => h('lpg_cylinders', Number(e.target.value))} />
        </div>
      )}

      {/* FOOD */}
      {step === 4 && (
        <>
          <label className="question-label">Diet Preference:</label>
          <div className="radio-group">
            <button className={`radio-btn ${formData.food_type === 'veg' ? 'selected' : ''}`} onClick={() => h('food_type', 'veg')}>Vegetarian</button>
            <button className={`radio-btn ${formData.food_type === 'non-veg' ? 'selected' : ''}`} onClick={() => h('food_type', 'non-veg')}>Non-Vegetarian</button>
          </div>
          {formData.food_type === 'non-veg' && (
            <div className="slider-wrapper">
              <label className="question-label">Chicken/Meat meals (per week): <b>{formData.chicken_meals + formData.mutton_meals}</b></label>
              <input type="range" className="custom-slider" min="0" max="14" step="1" value={formData.chicken_meals} onChange={e => h('chicken_meals', Number(e.target.value))} />
            </div>
          )}
        </>
      )}

      {/* WASTE */}
      {step === 5 && (
        <>
           <div className="slider-wrapper">
            <label className="question-label">Garbage Output (kg/week): <b>{formData.waste_kg}</b></label>
            <input type="range" className="custom-slider" min="0" max="50" step="1" value={formData.waste_kg} onChange={e => h('waste_kg', Number(e.target.value))} />
          </div>
          <label className="question-label">Do you segregate & compost wet waste?</label>
          <div className="radio-group">
            <button className={`radio-btn ${formData.composting ? 'selected' : ''}`} onClick={() => h('composting', true)}>Yes</button>
            <button className={`radio-btn ${!formData.composting ? 'selected' : ''}`} onClick={() => h('composting', false)}>No</button>
          </div>
        </>
      )}

      {/* SHOPPING */}
      {step === 6 && (
        <>
           <div className="slider-wrapper">
            <label className="question-label">New Clothes bought (per month): <b>{formData.clothes}</b></label>
            <input type="range" className="custom-slider" min="0" max="15" step="1" value={formData.clothes} onChange={e => h('clothes', Number(e.target.value))} />
          </div>
           <div className="slider-wrapper">
            <label className="question-label">Online Shopping Orders (per month): <b>{formData.online_orders}</b></label>
            <input type="range" className="custom-slider" min="0" max="20" step="1" value={formData.online_orders} onChange={e => h('online_orders', Number(e.target.value))} />
          </div>
        </>
      )}

      {/* WATER */}
      {step === 7 && (
        <>
           <div className="slider-wrapper">
            <label className="question-label">Average Showers (per day): <b>{formData.showersDaily}</b></label>
            <input type="range" className="custom-slider" min="0" max="5" step="1" value={formData.showersDaily} onChange={e => h('showersDaily', Number(e.target.value))} />
          </div>
          <div className="slider-wrapper">
            <label className="question-label">RO Purifier Waste (litres/day): <b>{formData.roLitresDaily}</b></label>
            <input type="range" className="custom-slider" min="0" max="50" step="2" value={formData.roLitresDaily} onChange={e => h('roLitresDaily', Number(e.target.value))} />
          </div>
        </>
      )}

      <div className="nav-buttons">
        {onCancel && step === 0 && <button className="btn-secondary" onClick={onCancel}>Cancel</button>}
        {step > 0 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}><ArrowLeft size={18}/> Back</button>}
        
        {step < SECTIONS.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep(s => s + 1)}>Next <ArrowRight size={18}/></button>
        ) : (
          <button className="btn-primary" style={{ background: '#0ea5e9' }} onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? 'Calculating...' : 'See My Footprint!'}
          </button>
        )}
      </div>
    </div>
  );
}
