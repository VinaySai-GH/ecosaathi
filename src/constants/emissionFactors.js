const EMISSION_FACTORS = {
    commute: {
        walk: 0,          // kg CO₂/km
        cycle: 0,
        metro: 0.044118,   // Delhi Metro (CGWB)
        train: 0.0096,     // Rail
        bus_cng: 0.004,      // per passenger-km (bus_total/avg_passengers)
        bus_diesel: 0.006,
        auto_petrol: 0.05744,    // ARAI 2009
        two_wheeler: 0.04560,
        car_petrol: 0.17295,    // E-IV standard
        car_diesel: 0.14876,
        car_cng: 0.13119,
    },

    food: {
        vegetarian: 3.8,        // kg CO₂/day (standard Indian diet)
        mixed: 5.6,
        red_meat: 7.2,
    },

    electricity: {
        NEWNE: 0.84,       // North/East India — kg CO₂e/kWh
        South: 0.90,       // South India
        default: 0.84,
    },

    purchases: {
        nothing: 0,
        small: 10,         // one-time kg CO₂ (clothes, gadgets)
        large: 80,         // appliances, furniture
    },

    // For monthly bill → kWh conversion
    avgTariffPerUnit: 7,        // ₹7 per kWh average India
};

export default EMISSION_FACTORS;