// App-wide constants — web version
export const SCORING = {
    NEERU_LOG_SUBMITTED: 50,
    NEERU_REDUCTION_BONUS: 10,
    GREENSPOT_LISTING_ADDED: 30,
    GREENSPOT_VERIFICATION_GIVEN: 5,
    RKT_DAILY_REPLY: 5,
    RKT_STREAK_BONUS: 50,
};
export const LEADERBOARD_REFRESH_HOURS = 6;
// Use .env file with VITE_API_URL to override, perfectly resolves host IP for mobile testing
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : `http://${window.location.hostname}:5000/api`);
