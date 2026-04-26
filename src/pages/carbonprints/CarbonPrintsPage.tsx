import React, { useState, useEffect } from 'react';
import QuestionnaireFlow from './components/QuestionnaireFlow';
import DashboardStats from './components/DashboardStats';
import { getCarbonHistory, saveCarbonLog } from '../../services/carbonprints.service';
import { CarbonCalculationResult, CarbonLog } from './carbonprints.types';
import { CARBON_FACTORS } from '../../shared/constants/carbonFactors';
import { ArrowLeft } from 'lucide-react';
import './carbonprints.css';

export default function CarbonPrintsPage() {
  const [history, setHistory] = useState<CarbonLog[]>([]);
  const [currentResult, setCurrentResult] = useState<CarbonCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unsavedFormData, setUnsavedFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // viewMode handles full page orchestration
  const [viewMode, setViewMode] = useState<'dashboard' | 'wizard' | 'history' | 'dashboard-preview'>('dashboard');

  useEffect(() => {
    loadHistory();
  }, []);

  const buildBreakdownFromLog = (l: CarbonLog) => {
    return {
      electricity: l.electricity_units * CARBON_FACTORS.electricity_kwh,
      transport: (l.transport_bike_km * CARBON_FACTORS.bike_km) + 
                 (l.transport_car_km * CARBON_FACTORS.car_km) + 
                 (l.transport_bus_km * CARBON_FACTORS.bus_km) + 
                 (l.transport_train_km * CARBON_FACTORS.train_km) + 
                 ((l.flights / 12) * CARBON_FACTORS.flight_yearly_kg),
      cooking: l.lpg_cylinders * CARBON_FACTORS.lpg_cylinders,
      food: (l.food_type === 'non-veg' ? CARBON_FACTORS.diet_non_veg : CARBON_FACTORS.diet_veg) +
            (l.chicken_meals * 4.33 * CARBON_FACTORS.chicken_meal) +
            (l.mutton_meals * 4.33 * CARBON_FACTORS.mutton_meal) +
            (l.milk_litres * 30.4 * CARBON_FACTORS.milk_litre),
      waste: (l.waste_kg * 4.33 * CARBON_FACTORS.waste_kg) * (l.composting ? 0.7 : 1) * (l.recycling ? 0.8 : 1),
      shopping: (l.clothes * CARBON_FACTORS.clothes_avg) +
                (l.online_orders * CARBON_FACTORS.online_order) +
                ((l.electronics / 12) * CARBON_FACTORS.electronic_device) +
                (l.plastic_bottles * 4.33 * CARBON_FACTORS.plastic_bottle),
      water: (l.water_litres / 1000) * CARBON_FACTORS.water_1000l
    };
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const { logs } = await getCarbonHistory();
      setHistory(logs);
      
      if (logs.length === 0) {
        setViewMode('wizard');
      } else {
        const latest = logs[0]; 
        setCurrentResult({
          log: latest,
          categoryBreakdown: buildBreakdownFromLog(latest)
        });
        setViewMode('dashboard');
      }
    } catch (error) {
      console.error('Failed to load carbon history', error);
      setViewMode('wizard');
    }
    setIsLoading(false);
  };

  const handleCompleteWizard = (result: CarbonCalculationResult, formData: any) => {
    if (!result.categoryBreakdown) {
       result.categoryBreakdown = buildBreakdownFromLog(result.log);
    }
    
    setCurrentResult(result);
    setUnsavedFormData(formData);
    setViewMode('dashboard-preview');
  };

  const handleSavePreview = async () => {
    if (!unsavedFormData) return;
    setIsSaving(true);
    try {
      await saveCarbonLog(unsavedFormData);
      setUnsavedFormData(null);
      await loadHistory(); // Puts viewMode back to 'dashboard' if success
    } catch (e) {
      console.error(e);
      alert('Failed to save log');
    }
    setIsSaving(false);
  };

  const viewHistoryItem = (log: CarbonLog) => {
    setCurrentResult({ log, categoryBreakdown: buildBreakdownFromLog(log) });
    setViewMode('dashboard');
  };

  if (isLoading) {
    return (
      <div className="carbon-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#10B981', fontSize: '1.2rem' }}>Loading your footprint...</p>
      </div>
    );
  }

  return (
    <div className="carbon-container">
      {viewMode === 'wizard' && (
        <QuestionnaireFlow 
          onComplete={handleCompleteWizard} 
          onCancel={history.length > 0 ? () => setViewMode('dashboard') : undefined} 
        />
      )}

      {viewMode === 'dashboard-preview' && currentResult && (
        <DashboardStats 
          data={currentResult} 
          history={history} 
          onRecalculate={() => setViewMode('wizard')}
          onViewHistory={() => setViewMode('history')}
          isPreview={true}
          isSaving={isSaving}
          onSaveLog={handleSavePreview}
          onCancelPreview={() => history.length > 0 ? loadHistory() : setViewMode('wizard')}
        />
      )}

      {viewMode === 'dashboard' && currentResult && (
        <DashboardStats 
          data={currentResult} 
          history={history} 
          onRecalculate={() => setViewMode('wizard')}
          onViewHistory={() => setViewMode('history')}
        />
      )}

      {viewMode === 'history' && (
        <div className="wizard-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
             <button onClick={() => setViewMode('dashboard')} className="btn-secondary" style={{ padding: '8px 16px' }}>
                <ArrowLeft size={18} /> Back
             </button>
             <h2 className="carbon-title" style={{ margin: 0 }}>All Your Logs</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.length === 0 && <p style={{ color: '#94a3b8' }}>No history found.</p>}
            {history.map(h => (
              <div 
                key={h._id || h.month.toString() + h.year.toString()}
                onClick={() => viewHistoryItem(h)} 
                className="history-item"
                style={{ 
                  background: '#1a3626', borderRadius: '16px', padding: '20px 24px', 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                  border: '1px solid transparent', transition: 'border 0.2s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#10B981')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                 <div>
                    <div className="history-date" style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc' }}>
                      {new Date(0, h.month-1).toLocaleString('en', { month: 'long' })} {h.year}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                      Eco Score: {h.eco_score}/100
                    </div>
                 </div>
                 <div className="history-value" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10B981' }}>
                    {h.monthly_carbon} kg CO₂
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
