export const CITIES = [
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
export const DEFAULT_CITY = CITIES[0];
export const findCity = (label) => CITIES.find((c) => c.label === label) ?? DEFAULT_CITY;
export const getBenchmarkStatus = (kl, city) =>
    kl < city.benchmark_kl ? 'under' : kl > city.benchmark_kl ? 'over' : 'at';
