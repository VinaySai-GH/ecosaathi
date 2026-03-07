// Neeru equivalency math — works fully offline, no API needed

import type { Equivalency } from './neeru.types';

const LITRES_PER_KL = 1000;

// Average references from CGWB / ICAR AP context
const FARMING_FAMILY_MONTHLY_KL = 12; // ~12 kL per family/month for small farm household
const DRINKING_WATER_DAILY_LITRES = 3; // per person per day (WHO minimum)
const OLYMPIC_POOL_KL = 2500;

export function calculateEquivalencies(kl_used: number): Equivalency[] {
    const litres = kl_used * LITRES_PER_KL;

    return [
        {
            label: 'Farming families supplied for a month',
            value: (kl_used / FARMING_FAMILY_MONTHLY_KL).toFixed(1),
        },
        {
            label: "Days of drinking water for one person",
            value: Math.round(litres / DRINKING_WATER_DAILY_LITRES).toString(),
        },
        {
            label: "% of an Olympic swimming pool",
            value: ((kl_used / OLYMPIC_POOL_KL) * 100).toFixed(2) + '%',
        },
    ];
}

export function percentChange(prev: number, curr: number): number {
    if (prev === 0) return 0;
    return ((curr - prev) / prev) * 100;
}
