// Eco Pulse feature types

export interface LeaderboardEntry {
    _id: string;
    hostel: string;
    month: number;
    year: number;
    total_points: number;
    member_count: number;
    avg_score: number;
}

export interface LeaderboardResponse {
    entries: LeaderboardEntry[];
}

export interface MyRankResponse {
    rank: number;
    points: number;
    hostel_score: number;
}
