// Static equivalency comparisons — no API needed, pure arithmetic

export interface Equivalency {
    id: string;
    icon: string;
    title: string;
    compute: (kl: number) => string;
    subtitle: string;
    source: string;
}

export const EQUIVALENCIES: Equivalency[] = [
    {
        id: 'swimming_pool',
        icon: '🏊',
        title: 'Swimming Pools',
        compute: (kl) => {
            const pools = (kl / 375).toFixed(2);
            return `${pools} school swimming pools`;
        },
        subtitle: 'A standard school pool holds ~375 KL of water.',
        source: 'Bureau of Indian Standards',
    },
    {
        id: 'farming_family',
        icon: '🌾',
        title: 'Farming Family',
        compute: (kl) => {
            const ratio = (kl / 12).toFixed(1);
            return `${ratio}x a farming family monthly use`;
        },
        subtitle: 'An average AP farming family uses ~12 KL per month for all household needs.',
        source: 'ICAR / CGWB Andhra Pradesh',
    },
    {
        id: 'packaged_water',
        icon: '🧴',
        title: 'Packaged Water Cost',
        compute: (kl) => {
            const litres = kl * 1000;
            const bottles = Math.round(litres / 1);
            return `Rs ${(bottles * 20).toLocaleString('en-IN')} worth of 1L bottles`;
        },
        subtitle: 'If you bought this water in 1L packaged bottles at Rs 20 each.',
        source: 'Market price estimate',
    },
    {
        id: 'drinking_days',
        icon: '💧',
        title: 'Drinking Water',
        compute: (kl) => {
            const days = Math.round((kl * 1000) / 3);
            return `${days} days of drinking water for one person`;
        },
        subtitle: 'WHO recommends minimum 3 litres of drinking water per person per day.',
        source: 'World Health Organization',
    },
    {
        id: 'ro_waste',
        icon: '🚰',
        title: 'RO Filter Waste',
        compute: (kl) => {
            const wasteKl = (kl * 3).toFixed(1);
            return `${wasteKl} KL wasted by RO filters`;
        },
        subtitle: 'RO purifiers waste 3 litres for every 1 litre purified. That is in addition to what you used.',
        source: 'Bureau of Energy Efficiency, India',
    },
];

export function pickEquivalencies(kl: number): Equivalency[] {
    if (kl >= 20) return [EQUIVALENCIES[0]!, EQUIVALENCIES[1]!, EQUIVALENCIES[2]!];
    if (kl >= 10) return [EQUIVALENCIES[1]!, EQUIVALENCIES[3]!, EQUIVALENCIES[4]!];
    return [EQUIVALENCIES[3]!, EQUIVALENCIES[2]!, EQUIVALENCIES[0]!];
}
