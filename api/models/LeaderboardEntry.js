const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema(
    {
        hostel: {
            type: String,
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        total_points: {
            type: Number,
            default: 0,
        },
        member_count: {
            type: Number,
            default: 1,
        },
        avg_score: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// We want only one leaderboard entry per hostel per month/year
leaderboardEntrySchema.index({ hostel: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
