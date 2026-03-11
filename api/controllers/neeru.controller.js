const { saveWaterLog, fetchUserHistory } = require('../services/neeru.service');

exports.logWater = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { month, year, city, kl_used, overwrite } = req.body;

        if (!month || !year || !city || kl_used === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await saveWaterLog(userId, { month, year, city, kl_used }, overwrite);
        res.status(200).json(result);
    } catch (error) {
        if (error.recordExists) {
            return res.status(409).json({
                error: error.message,
                exists: true,
                existingKl: error.existingKl
            });
        }
        next(error);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const logs = await fetchUserHistory(userId);
        res.status(200).json({ logs });
    } catch (error) {
        next(error);
    }
};
