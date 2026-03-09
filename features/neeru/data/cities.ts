// CGWB-sourced recommended monthly household water use per city (in KL)
// Source: Central Ground Water Board district reports + CPHEEO guidelines

export interface CityBenchmark {
    label: string;      // display name
    state: string;
    benchmark_kl: number;   // recommended KL per household per month
    isWaterStressed: boolean;
}

export const CITIES: CityBenchmark[] = [
    { label: 'Tirupati', state: 'Andhra Pradesh', benchmark_kl: 15, isWaterStressed: true },
    { label: 'Vijayawada', state: 'Andhra Pradesh', benchmark_kl: 14, isWaterStressed: false },
    { label: 'Visakhapatnam', state: 'Andhra Pradesh', benchmark_kl: 16, isWaterStressed: false },
    { label: 'Kurnool', state: 'Andhra Pradesh', benchmark_kl: 12, isWaterStressed: true },
    { label: 'Chennai', state: 'Tamil Nadu', benchmark_kl: 14, isWaterStressed: true },
    { label: 'Hyderabad', state: 'Telangana', benchmark_kl: 18, isWaterStressed: false },
    { label: 'Bangalore', state: 'Karnataka', benchmark_kl: 16, isWaterStressed: true },
    { label: 'Mumbai', state: 'Maharashtra', benchmark_kl: 17, isWaterStressed: false },
    { label: 'Delhi', state: 'Delhi', benchmark_kl: 20, isWaterStressed: false },
    { label: 'Pune', state: 'Maharashtra', benchmark_kl: 15, isWaterStressed: false },
];

export const DEFAULT_CITY = CITIES[0]!; // Tirupati — pilot campus

export function findCity(label: string): CityBenchmark {
    return CITIES.find((c) => c.label === label) ?? DEFAULT_CITY;
}

export function getBenchmarkStatus(
    kl: number,
    city: CityBenchmark,
): 'under' | 'over' | 'at' {
    if (kl < city.benchmark_kl) return 'under';
    if (kl > city.benchmark_kl) return 'over';
    return 'at';
}
