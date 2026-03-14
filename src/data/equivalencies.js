export const EQUIVALENCIES = [
    { id: 'swimming_pool', icon: '🏊', title: 'Swimming Pools', compute: (kl) => `${(kl / 375).toFixed(2)} school swimming pools`, subtitle: 'A standard school pool holds ~375 KL of water.', source: 'Bureau of Indian Standards' },
    { id: 'farming_family', icon: '🌾', title: 'Farming Family', compute: (kl) => `${(kl / 12).toFixed(1)}x a farming family monthly use`, subtitle: 'An average AP farming family uses ~12 KL per month.', source: 'ICAR / CGWB Andhra Pradesh' },
    { id: 'packaged_water', icon: '🧴', title: 'Packaged Water Cost', compute: (kl) => `Rs ${(Math.round(kl * 1000) * 20).toLocaleString('en-IN')} worth of 1L bottles`, subtitle: 'If you bought this water in 1L packaged bottles at Rs 20 each.', source: 'Market price estimate' },
    { id: 'drinking_days', icon: '💧', title: 'Drinking Water', compute: (kl) => `${Math.round((kl * 1000) / 3)} days of drinking water for one person`, subtitle: 'WHO recommends minimum 3 litres of drinking water per person per day.', source: 'World Health Organization' },
    { id: 'ro_waste', icon: '🚰', title: 'RO Filter Waste', compute: (kl) => `${(kl * 3).toFixed(1)} KL wasted by RO filters`, subtitle: 'RO purifiers waste 3 litres for every 1 litre purified.', source: 'Bureau of Energy Efficiency, India' },
];
export const pickEquivalencies = (kl) => {
    if (kl >= 20) return [EQUIVALENCIES[0], EQUIVALENCIES[1], EQUIVALENCIES[2]];
    if (kl >= 10) return [EQUIVALENCIES[1], EQUIVALENCIES[3], EQUIVALENCIES[4]];
    return [EQUIVALENCIES[3], EQUIVALENCIES[2], EQUIVALENCIES[0]];
};
