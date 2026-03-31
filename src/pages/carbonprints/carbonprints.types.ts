export interface CarbonFormState {
  // Electricity
  electricity_units: number;
  acHoursDaily: number;
  fansCount: number;
  ledCount: number;
  geyserMinutesDaily: number;

  // Transport
  transport_bike_km: number;
  transport_car_km: number;
  transport_bus_km: number;
  transport_train_km: number;
  flights: number;

  // Cooking
  lpg_cylinders: number;
  inductionHoursDaily: number;

  // Food
  food_type: 'veg' | 'non-veg';
  chicken_meals: number;
  mutton_meals: number;
  milk_litres: number;
  waste_kg: number;

  // Waste
  composting: boolean;
  recycling: boolean;

  // Shopping
  clothes: number;
  online_orders: number;
  electronics: number;
  plastic_bottles: number;

  // Water
  water_litres: number;
  showersDaily: number;
  washingMachineWeekly: number;
  roLitresDaily: number;
}

export interface CarbonLog {
  _id: string;
  userId: string;
  month: number;
  year: number;
  
  // Stored inputs
  electricity_units: number;
  transport_bike_km: number;
  transport_car_km: number;
  transport_bus_km: number;
  transport_train_km: number;
  flights: number;
  lpg_cylinders: number;
  food_type: 'veg' | 'non-veg';
  chicken_meals: number;
  mutton_meals: number;
  milk_litres: number;
  waste_kg: number;
  composting: boolean;
  recycling: boolean;
  clothes: number;
  online_orders: number;
  electronics: number;
  plastic_bottles: number;
  water_litres: number;

  // Calculated results
  monthly_carbon: number;
  yearly_carbon: number;
  trees_needed: number;
  eco_score: number;
  
  createdAt: string;
}

export interface CarbonCalculationResult {
  log: CarbonLog;
  categoryBreakdown: {
    electricity: number;
    transport: number;
    food: number;
    waste: number;
    shopping: number;
    water: number;
    cooking: number;
  };
}
