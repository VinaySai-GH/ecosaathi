import { CarbonLog, CarbonCalculationResult } from './carbonprints.types';

const mockUserId = 'user_abc123';

export const mockCarbonLogs: CarbonLog[] = [
  {
    _id: 'log_001',
    userId: mockUserId,
    month: 1, // Jan
    year: 2026,
    electricity_units: 120,
    transport_bike_km: 100,
    transport_car_km: 50,
    transport_bus_km: 20,
    transport_train_km: 0,
    flights: 0,
    lpg_cylinders: 1,
    food_type: 'non-veg',
    chicken_meals: 4,
    mutton_meals: 1,
    milk_litres: 30,
    waste_kg: 10,
    composting: false,
    recycling: true,
    clothes: 2,
    online_orders: 5,
    electronics: 1,
    plastic_bottles: 15,
    water_litres: 2000,
    monthly_carbon: 320.5,
    yearly_carbon: 3846,
    trees_needed: 183,
    eco_score: 65,
    createdAt: new Date('2026-01-25T10:00:00Z').toISOString()
  },
  {
    _id: 'log_002',
    userId: mockUserId,
    month: 2, // Feb
    year: 2026,
    electricity_units: 100,
    transport_bike_km: 150,
    transport_car_km: 10,
    transport_bus_km: 40,
    transport_train_km: 200,
    flights: 0,
    lpg_cylinders: 1,
    food_type: 'veg',
    chicken_meals: 0,
    mutton_meals: 0,
    milk_litres: 25,
    waste_kg: 8,
    composting: true,
    recycling: true,
    clothes: 1,
    online_orders: 2,
    electronics: 0,
    plastic_bottles: 5,
    water_litres: 1500,
    monthly_carbon: 145.2,
    yearly_carbon: 1742.4,
    trees_needed: 83,
    eco_score: 92,
    createdAt: new Date('2026-02-25T10:00:00Z').toISOString()
  }
];

export const mockCalculationResult: CarbonCalculationResult = {
  log: mockCarbonLogs[1],
  categoryBreakdown: {
    electricity: 82,   // 100 * 0.82
    transport: 20.5,   // (150*0.05) + (10*0.18) + (40*0.08) + (200*0.04)
    cooking: 42,       // 1 * 42
    food: 137.5,       // 100 (veg) + 25 * 1.5 (milk)
    waste: 2,          // 8 * 0.5 * 0.5 (composting & recycling applied)
    shopping: 17.5,    // 1(12.5) + 2(2) + 5(0.1)
    water: 0.75        // 1500 * (0.5/1000)
  }
};
