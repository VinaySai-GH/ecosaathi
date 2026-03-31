const mongoose = require('mongoose');

const carbonLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  
  electricity_units: { type: Number, default: 0 },
  transport_bike_km: { type: Number, default: 0 },
  transport_car_km: { type: Number, default: 0 },
  transport_bus_km: { type: Number, default: 0 },
  transport_train_km: { type: Number, default: 0 },
  flights: { type: Number, default: 0 },
  lpg_cylinders: { type: Number, default: 0 },
  food_type: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
  chicken_meals: { type: Number, default: 0 },
  mutton_meals: { type: Number, default: 0 },
  milk_litres: { type: Number, default: 0 },
  waste_kg: { type: Number, default: 0 },
  composting: { type: Boolean, default: false },
  recycling: { type: Boolean, default: false },
  clothes: { type: Number, default: 0 },
  online_orders: { type: Number, default: 0 },
  electronics: { type: Number, default: 0 },
  plastic_bottles: { type: Number, default: 0 },
  water_litres: { type: Number, default: 0 },
  
  monthly_carbon: { type: Number, required: true },
  yearly_carbon: { type: Number, required: true },
  trees_needed: { type: Number, required: true },
  eco_score: { type: Number, required: true }
}, { timestamps: true });

carbonLogSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('CarbonLog', carbonLogSchema);
