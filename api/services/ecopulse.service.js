const User = require('../models/User');

/**
 * Get the campus leaderboard (aggregated by city)
 */
exports.getLeaderboard = async () => {
    return User.aggregate([
        {
            $group: {
                _id: '$city',
                total_points: { $sum: '$points' },
                member_count: { $sum: 1 }
            }
        },
        {
            $project: {
                hostel: '$_id', // using hostel field name as per schema requirements
                total_points: 1,
                member_count: 1,
                avg_score: { 
                    $cond: [
                        { $eq: ['$member_count', 0] }, 
                        0, 
                        { $divide: ['$total_points', '$member_count'] }
                    ]
                },
                _id: 0
            }
        },
        { $sort: { avg_score: -1 } }
    ]);
};

/**
 * Get top 50 users globally
 */
exports.getTopUsers = async (limit = 50) => {
    return User.find({}, 'name points city')
        .sort({ points: -1 })
        .limit(limit);
};
