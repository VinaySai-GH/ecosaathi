const User = require('../models/User');
const ecopulseService = require('../services/ecopulse.service');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const aggregated = await ecopulseService.getLeaderboard();
        const topUsers = await ecopulseService.getTopUsers();

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
        
        const aggregated = await ecopulseService.getLeaderboard();

        const myCityEntry = aggregated.find(entry => entry.hostel === user.city);
        const rank = aggregated.findIndex(entry => entry.hostel === user.city) + 1;

        res.status(200).json({
            rank: rank || 0,
            points: user.points,
            city_score: myCityEntry ? myCityEntry.avg_score : 0,
        });
    } catch (error) {
        next(error);
    }
};
