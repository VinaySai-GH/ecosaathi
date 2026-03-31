const calculateCarbonFromInputs = (inputs) => {
    let emissions = {
        electricity: 0,
        transport: 0,
        cooking: 0,
        food: 0,
        waste: 0,
        shopping: 0,
        water: 0
    };

    // --- Electricity ---
    // 1 kWh = 0.82 kg CO2
    emissions.electricity = (inputs.electricity_units || 0) * 0.82;

    // --- Transport ---
    emissions.transport += (inputs.transport_bike_km || 0) * 0.05;
    emissions.transport += (inputs.transport_car_km || 0) * 0.18;
    emissions.transport += (inputs.transport_bus_km || 0) * 0.08;
    emissions.transport += (inputs.transport_train_km || 0) * 0.04;
    // flights per year -> per month: (flights / 12) * (1000km * 0.15) assuming 1000km per flight
    emissions.transport += ((inputs.flights || 0) / 12) * 150;

    // --- Cooking ---
    // 1 LPG cylinder = 42 kg CO2
    emissions.cooking += (inputs.lpg_cylinders || 0) * 42;

    // --- Food ---
    // Veg diet = 100 kg/month, Non-veg = 200 kg/month
    emissions.food += (inputs.food_type === 'non-veg') ? 200 : 100;
    // Meal multiplier (assumes inputs are per week, but prompt says "meals per week". 
    // Wait, prompt: "chicken_meals", "mutton_meals" per week. Month = * 4.33
    const weeksPerMonth = 4.33;
    emissions.food += (inputs.chicken_meals || 0) * weeksPerMonth * 2;
    emissions.food += (inputs.mutton_meals || 0) * weeksPerMonth * 6;
    // Milk litres per day -> per month = * 30.4
    const daysPerMonth = 30.4;
    emissions.food += (inputs.milk_litres || 0) * daysPerMonth * 1.5;

    // --- Waste ---
    // Garbage per week -> per month
    let wasteBase = (inputs.waste_kg || 0) * weeksPerMonth * 0.5;
    if (inputs.composting) wasteBase *= 0.70; // reduce by 30%
    if (inputs.recycling) wasteBase *= 0.80; // reduce by 20%
    emissions.waste += wasteBase;

    // --- Shopping ---
    // Clothes per month (avg 12.5 kg)
    emissions.shopping += (inputs.clothes || 0) * 12.5;
    // Online orders per month
    emissions.shopping += (inputs.online_orders || 0) * 2;
    // Electronics per year -> per month
    emissions.shopping += ((inputs.electronics || 0) / 12) * 70;
    // Plastic bottles per week -> per month
    emissions.shopping += (inputs.plastic_bottles || 0) * weeksPerMonth * 0.1;

    // --- Water ---
    // inputs.water_litres is total monthly (or we calc from showers but if passed directly as litres)
    emissions.water += ((inputs.water_litres || 0) / 1000) * 0.5;

    // Round all to 2 decimal places
    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;
    Object.keys(emissions).forEach(k => emissions[k] = round2(emissions[k]));

    const monthly_carbon = round2(Object.values(emissions).reduce((acc, val) => acc + val, 0));
    const yearly_carbon = round2(monthly_carbon * 12);
    const trees_needed = Math.ceil(yearly_carbon / 21);

    // Eco Score
    let eco_score = 0;
    if (monthly_carbon < 150) {
        // Range 0 - 150 -> Score 90-100
        eco_score = 100 - (monthly_carbon / 150) * 10;
    } else if (monthly_carbon >= 150 && monthly_carbon <= 300) {
        // Range 150 - 300 -> Score 70-89
        const spread = (monthly_carbon - 150) / 150;
        eco_score = 89 - (spread * 19);
    } else if (monthly_carbon > 300 && monthly_carbon <= 600) {
        // Range 300 - 600 -> Score 40-69
        const spread = (monthly_carbon - 300) / 300;
        eco_score = 69 - (spread * 29);
    } else {
        // > 600 -> Score 0-39
        const overflow = Math.min(monthly_carbon - 600, 400) / 400; // Cap at 1000 for zero
        eco_score = 39 - (overflow * 39);
    }
    eco_score = Math.max(0, Math.round(eco_score));

    return {
        emissionsBreakdown: emissions,
        monthly_carbon,
        yearly_carbon,
        trees_needed,
        eco_score
    };
};

module.exports = { calculateCarbonFromInputs };
