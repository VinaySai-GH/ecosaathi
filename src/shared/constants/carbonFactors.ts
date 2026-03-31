export const CARBON_FACTORS = {
  // Electricity
  electricity_kwh: 0.82,

  // Transport
  // Assuming short urban trips for students, standardizing flight to 1000km approx
  bike_km: 0.05,
  car_km: 0.18,
  bus_km: 0.08,
  train_km: 0.04,
  flight_yearly_kg: 150, // (1000km * 0.15 kg/km)

  // Cooking
  lpg_cylinders: 42,

  // Food
  diet_veg: 100,      // kg per month
  diet_non_veg: 200,  // kg per month
  chicken_meal: 2,    // kg per meal
  mutton_meal: 6,     // kg per meal
  milk_litre: 1.5,    // kg per litre

  // Waste
  waste_kg: 0.5,
  compost_reduction: 0.30, // 30% reduction multiplier
  recycle_reduction: 0.20, // 20% reduction multiplier

  // Shopping
  shirt: 5,
  jeans: 20,
  clothes_avg: 12.5, // average of shirt and jeans
  online_order: 2,
  electronic_device: 70,
  plastic_bottle: 0.1,

  // Water
  water_1000l: 0.5,
  
  // Base water usage assumptions in litres
  shower_litres: 50,
  washing_machine_litres: 50, // per load

  // Offset
  tree_yearly_absorption: 21
};

export const ECO_SCORE_RANGES = [
  { max: 150, minScore: 90, maxScore: 100, label: 'Low', emoji: '🌱', color: '#10B981' },
  { max: 300, minScore: 70, maxScore: 89, label: 'Medium', emoji: '⚠️', color: '#F59E0B' },
  { max: 600, minScore: 40, maxScore: 69, label: 'High', emoji: '🔥', color: '#EF4444' },
  { max: Infinity, minScore: 0, maxScore: 39, label: 'Critical', emoji: '💀', color: '#7F1D1D' }
];

export const calculateEcoScore = (monthlyCarbonKg: number): number => {
  const range = ECO_SCORE_RANGES.find(r => monthlyCarbonKg <= r.max);
  if (!range) return 0;
  
  // Interpolate score within the range
  // Lower carbon = higher score in the band.
  let bandSpread = range.maxScore - range.minScore;
  let carbonSpread = range.max === Infinity ? 400 : (range.max - (range === ECO_SCORE_RANGES[0] ? 0 : ECO_SCORE_RANGES[ECO_SCORE_RANGES.indexOf(range) - 1].max));
  let carbonOffset = monthlyCarbonKg - (range === ECO_SCORE_RANGES[0] ? 0 : ECO_SCORE_RANGES[ECO_SCORE_RANGES.indexOf(range) - 1].max);
  if (carbonOffset < 0) carbonOffset = 0;
  
  let percentage = 1 - Math.min(Math.max(carbonOffset / carbonSpread, 0), 1);
  return Math.round(range.minScore + (bandSpread * percentage));
};
