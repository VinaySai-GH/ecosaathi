// Eco Pulse mock — IIT Tirupati hostel leaderboard seed data

import type { LeaderboardResponse, MyRankResponse } from './ecopulse.types';

export const MOCK_LEADERBOARD: LeaderboardResponse = {
    entries: [
        { _id: 'lb-1', hostel: 'Nilgiri', month: 3, year: 2026, total_points: 1420, member_count: 40, avg_score: 35.5 },
        { _id: 'lb-2', hostel: 'Sahyadri', month: 3, year: 2026, total_points: 1280, member_count: 38, avg_score: 33.7 },
        { _id: 'lb-3', hostel: 'Vindhya', month: 3, year: 2026, total_points: 1190, member_count: 42, avg_score: 28.3 },
        { _id: 'lb-4', hostel: 'Aravalli', month: 3, year: 2026, total_points: 980, member_count: 35, avg_score: 28.0 },
        { _id: 'lb-5', hostel: 'Himadri', month: 3, year: 2026, total_points: 760, member_count: 30, avg_score: 25.3 },
    ],
};

export const MOCK_MY_RANK: MyRankResponse = {
    rank: 1,
    points: 55,
    hostel_score: 35.5,
};
