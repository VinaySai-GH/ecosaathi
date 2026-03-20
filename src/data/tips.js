export const TIPS = [
    { id: 'ro_bucket', icon: '🪣', text: 'Your RO filter wastes 3 litres for every litre purified. Put a bucket under the waste pipe and use that water for mopping or watering plants.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'washing_machine_full', icon: '🫧', text: 'Running a washing machine half-full uses the same water as a full load. Fill it before running — that alone cuts laundry water by half.', tags: ['above_benchmark', 'general'] },
    { id: 'bucket_shower', icon: '🚿', text: 'A 5-minute shower uses 60-80 litres. A bucket bath uses 15-20 litres. Switching even 4 days a week saves ~200 litres a month.', tags: ['above_benchmark', 'water_stress'] },
    { id: 'tap_off_brushing', icon: '🦷', text: 'Leaving the tap on while brushing wastes 6 litres per minute. Turn it off — that is 180 litres saved per month per person.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'plants_morning', icon: '🌿', text: 'Water plants in the morning or evening — watering at noon loses 30% to evaporation before it reaches the roots.', tags: ['general', 'water_stress'] },
    { id: 'vessel_washing', icon: '🍽️', text: 'Rinsing vessels under a running tap uses 10x more water than soaking them first. Soak for 2 minutes, then rinse quickly.', tags: ['above_benchmark', 'general'] },
    { id: 'below_streak', icon: '🏆', text: 'You are under the city benchmark — great discipline! Share your report to inspire your city mates.', tags: ['below_benchmark'] },
    { id: 'below_maintain', icon: '📊', text: 'You are using less than the city average. Keep tracking monthly — even small reductions add up to thousands of litres a year.', tags: ['below_benchmark'] },
    { id: 'check_leaks', icon: '🔧', text: 'A dripping tap wastes ~20 litres a day — 600 litres a month. Report leaky taps to the maintenance desk immediately.', tags: ['above_benchmark', 'water_stress', 'general'] },
    { id: 'grey_water', icon: '♻️', text: 'Water from washing vegetables or rinsing dal is perfectly safe for mopping or watering plants. Keep a small vessel nearby while cooking.', tags: ['general', 'water_stress'] },
];
export function pickTips(status, isWaterStressed) {
    const primaryTag = status === 'over' ? 'above_benchmark' : 'below_benchmark';
    const pool = TIPS.filter(t => t.tags.includes(primaryTag) || (isWaterStressed && t.tags.includes('water_stress')) || t.tags.includes('general'));
    const seen = new Set(); const result = [];
    for (const tip of pool) { if (!seen.has(tip.id) && result.length < 3) { seen.add(tip.id); result.push(tip); } }
    return result;
}
