// App-wide constants — no hardcoded values anywhere else

export const SCORING = {
    NEERU_LOG_SUBMITTED: 50,
    NEERU_REDUCTION_BONUS: 10,
    GREENSPOT_LISTING_ADDED: 30,
    GREENSPOT_VERIFICATION_GIVEN: 5,
    RKT_DAILY_REPLY: 5,
    RKT_STREAK_BONUS: 50,
} as const;

export const BOT_TIMES = ['21:00', '21:30', '22:00'] as const;
export type BotTime = typeof BOT_TIMES[number];

export const SPOT_CATEGORIES = [
    'ewaste',
    'zerowaste',
    'organic',
    'refill',
    'composting',
] as const;
export type SpotCategory = typeof SPOT_CATEGORIES[number];

import Constants from 'expo-constants';

export const LEADERBOARD_REFRESH_HOURS = 6;

// Automatically resolve the local IP address for Expo Go so the phone can reach the PC's backend
const hostUri = Constants.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : 'localhost';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${localIp}:5000/api`;
