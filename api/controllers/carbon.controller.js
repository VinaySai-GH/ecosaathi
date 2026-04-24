const CarbonLog = require('../models/CarbonLog');
const User = require('../models/User');
const { calculateCarbonFromInputs } = require('../utils/carbonCalculator');

exports.calculateCarbonLog = async (req, res) => {
    try {
        const { month, year, ...inputs } = req.body;
        if (!month || !year) return res.status(400).json({ error: 'Month and year are required' });
        const calculations = calculateCarbonFromInputs(inputs);
        res.status(200).json({
            log: { month, year, ...inputs, ...calculations },
            calculations
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to preview calculation' });
    }
};

exports.saveCarbonLog = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year, ...inputs } = req.body;

        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        // Calculate factors
        const calculations = calculateCarbonFromInputs(inputs);

        // Check if a log already exists for this user, month, and year
        let existingLog = await CarbonLog.findOne({ userId, month, year });
        let scoreDifference = calculations.eco_score;

        if (existingLog) {
            scoreDifference = calculations.eco_score - (existingLog.eco_score || 0);
            
            // Update the existing record
            Object.assign(existingLog, inputs, calculations);
            await existingLog.save();

            // Update user points with 50 scaled points system
            const addedPoints = Math.round(scoreDifference / 2);
            if(addedPoints !== 0) {
                await User.findByIdAndUpdate(userId, { $inc: { points: addedPoints } });
            }

            return res.status(200).json({
                message: 'Carbon footprint updated successfully',
                log: existingLog,
                calculations
            });
        }

        // Create a new record
        const newLog = new CarbonLog({
            userId,
            month,
            year,
            ...inputs,
            ...calculations
        });

        await newLog.save();

        // Update user points and add log reference robustly (scale 50 max)
        const addedPoints = Math.max(0, Math.round(calculations.eco_score / 2));
        await User.findByIdAndUpdate(userId, { 
            $inc: { points: addedPoints },
            $addToSet: { carbon_logs: newLog._id }
        });

        res.status(201).json({
            message: 'Carbon footprint saved successfully',
            log: newLog,
            calculations
        });
    } catch (error) {
        console.error('Error saving carbon log:', error);
        res.status(500).json({ error: 'Failed to save carbon footprint' });
    }
};

exports.getCarbonHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        // Fetch all logs, sorted by year and month descending (newest first)
        const history = await CarbonLog.find({ userId }).sort({ year: -1, month: -1 });
        res.status(200).json({ logs: history });
    } catch (error) {
        console.error('Error fetching carbon history:', error);
        res.status(500).json({ error: 'Failed to fetch carbon history' });
    }
};
