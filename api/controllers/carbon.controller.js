const CarbonLog = require('../models/CarbonLog');
const User = require('../models/User');

exports.saveCarbonLog = async (req, res) => {
    try {
        const { date, totalKgCO2, breakdown, month, year, formData } = req.body;
        const overwrite = req.query.overwrite === 'true';
        const userId = req.user.id;

        // Check if a log already exists for this user, month, and year
        const existingLog = await CarbonLog.findOne({ userId, month, year });

        if (existingLog && !overwrite) {
            return res.status(409).json({
                error: 'A log for this month and year already exists.',
                existingLog
            });
        }

        if (existingLog && overwrite) {
            // Update the existing record
            existingLog.totalKgCO2 = totalKgCO2;
            existingLog.breakdown = breakdown;
            existingLog.formData = formData;
            existingLog.date = date || Date.now();
            await existingLog.save();

            return res.status(200).json({
                message: 'Carbon footprint updated successfully',
                log: existingLog
            });
        }

        // Create a new record
        const newLog = new CarbonLog({
            userId,
            month,
            year,
            totalKgCO2,
            breakdown,
            formData,
            date: date || Date.now()
        });

        await newLog.save();

        // Attach carbon log tracking reference securely to the User Document
        await User.findByIdAndUpdate(userId, { $push: { carbon_logs: newLog._id } });

        res.status(201).json({
            message: 'Carbon footprint saved successfully',
            log: newLog
        });
    } catch (error) {
        console.error('Error saving carbon log:', error);
        res.status(500).json({ error: 'Failed to save carbon footprint' });
    }
};

exports.getCarbonHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch all logs, sorted by year and month descending (newest first)
        const history = await CarbonLog.find({ userId }).sort({ year: -1, month: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching carbon history:', error);
        res.status(500).json({ error: 'Failed to fetch carbon history' });
    }
};
