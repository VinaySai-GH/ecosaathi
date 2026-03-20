const User = require('../models/User');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const aggregated = await User.aggregate([
            {
                $group: {
                    _id: '$hostel',
                    total_points: { $sum: '$points' },
                    member_count: { $sum: 1 }
                }
            },
            {
                $project: {
                    hostel: '$_id',
                    total_points: 1,
                    member_count: 1,
                    avg_score: { $divide: ['$total_points', '$member_count'] },
                    _id: 0
                }
            },
            { $sort: { avg_score: -1 } }
        ]);

        const topUsers = await User.find({}, 'name points hostel')
            .sort({ points: -1 })
            .limit(50); // Get top 50 users globally

        res.status(200).json({ entries: aggregated, topUsers });
    } catch (error) {
        next(error);
    }
};

exports.getMyLeaderboard = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const aggregated = await User.aggregate([
            {
                $group: {
                    _id: '$hostel',
                    total_points: { $sum: '$points' },
                    member_count: { $sum: 1 }
                }
            },
            {
                $project: {
                    hostel: '$_id',
                    total_points: 1,
                    member_count: 1,
                    avg_score: { $divide: ['$total_points', '$member_count'] },
                    _id: 0
                }
            },
            { $sort: { avg_score: -1 } }
        ]);

        const myHostelEntry = aggregated.find(entry => entry.hostel === user.hostel);
        const rank = aggregated.findIndex(entry => entry.hostel === user.hostel) + 1;

        res.status(200).json({
            rank: rank || 0,
            points: user.points,
            hostel_score: myHostelEntry ? myHostelEntry.avg_score : 0,
        });
    } catch (error) {
        next(error);
    }
};
