import EF from '../constants/emissionFactors';

/**
 * Calculate monthly carbon footprint from user activity log
 * @param {Object} log - user's monthly activity inputs
 * @returns {Object} - total kg CO₂ + breakdown by category
 */
export function calculateMonthlyFootprint(log) {
    const breakdown = {
        commute: 0,
        food: 0,
        electricity: 0,
        purchases: 0,
    };

    // --- COMMUTE ---
    if (log.commutes && Array.isArray(log.commutes)) {
        log.commutes.forEach(commute => {
            if (commute.mode && commute.km) {
                // Determine emission factor for mode
                const ef = EF.commute[commute.mode] ?? EF.commute.car_petrol;
                // Add Monthly driving footprint (assuming `commute.km` is monthly distance)
                breakdown.commute += commute.km * ef;
            }
        });
    }

    // --- FOOD ---
    if (log.foodDays) {
        // We cap the max days at 31 to prevent user input errors inflating the score infinitely
        const vegDays = Math.min(log.foodDays.vegetarian || 0, 31);
        const mixedDays = Math.min(log.foodDays.mixed || 0, 31);
        const meatDays = Math.min(log.foodDays.red_meat || 0, 31);

        breakdown.food += vegDays * (EF.food.vegetarian ?? 1.5);
        breakdown.food += mixedDays * (EF.food.mixed ?? 2.5);
        breakdown.food += meatDays * (EF.food.red_meat ?? 3.5);
    }

    // --- ELECTRICITY ---
    // User enters monthly bill in ₹, we convert → kWh → CO₂
    if (log.monthlyBill) {
        const kWh = log.monthlyBill / EF.avgTariffPerUnit;
        const grid = EF.electricity[log.grid] ?? EF.electricity.default;
        breakdown.electricity = kWh * grid;
    }

    // --- PURCHASES ---
    if (log.purchases && Array.isArray(log.purchases)) {
        log.purchases.forEach(size => {
            breakdown.purchases += EF.purchases[size] ?? 0;
        });
    }

    const totalKgCO2 = Object.values(breakdown).reduce((a, b) => a + b, 0);

    return {
        totalKgCO2: parseFloat(totalKgCO2.toFixed(3)),
        breakdown,
        // India sustainable monthly limit ~165 kg/month per person
        isAboveLimit: totalKgCO2 > 165,
    };
}

/**
 * Convert kg CO₂ to a health score 0-100 for the tree animation
 * 0 kg = score 100 (full green tree)
 * 15+ kg = score 0 (dead tree)
 */
export function getHealthScore(totalKgCO2) {
    const max = 15;
    const score = Math.max(0, ((max - totalKgCO2) / max) * 100);
    return Math.round(score);
}