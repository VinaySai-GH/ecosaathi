const WaterLog = require('../models/WaterLog');
const User = require('../models/User');

exports.saveWaterLog = async (userId, payload, overwrite = false) => {
    const { month, year, city, kl_used } = payload;

    // First check if it already exists
    const existingLog = await WaterLog.findOne({ userId, month, year });

    if (existingLog && !overwrite) {
        // We found one, but the user hasn't explicitly said "yes, overwrite it"
        const error = new Error('A water log already exists for this month.');
        error.recordExists = true;
        error.existingKl = existingLog.kl_used;
        throw error;
    }

    // Now do the actual save/overwrite
    const log = await WaterLog.findOneAndUpdate(
        { userId, month, year }, // Search criteria
        { $set: { city, kl_used } }, // What to update
        { new: true, upsert: true } // Return updated doc, create if missing
    );

    // Award points only for new logs
    if (!existingLog) {
        await User.findByIdAndUpdate(userId, { 
            $inc: { points: 50 },
            $addToSet: { water_logs: log._id }
        });
    } else {
        // Ensure log ID is stored even on updates if missing
        await User.findByIdAndUpdate(userId, { 
            $addToSet: { water_logs: log._id }
        });
    }

    return {
        log,
        // The frontend neeru.service.ts interface expects this array shape even if empty
        equivalencies: [],
    };
};

exports.fetchUserHistory = async (userId) => {
    // Return logs sorted by oldest first (for proper chart progression left→right)
    return await WaterLog.find({ userId })
        .sort({ year: 1, month: 1 })
        .lean();
};
