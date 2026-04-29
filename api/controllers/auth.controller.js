const authService = require('../services/auth.service');
const User = require('../models/User');
const WaterLog = require('../models/WaterLog');
const CarbonLog = require('../models/CarbonLog');
const Spot = require('../models/Spot');

exports.getCities = async (req, res, next) => {
    try {
        const userCities = await User.distinct('city');
        const spotCities = await Spot.distinct('city');
        
        // Combine and deduplicate cities
        const allCities = [...new Set([...userCities, ...spotCities])];
        const validCities = allCities.filter(c => c && c.trim() !== '').sort();
        
        res.status(200).json({ cities: validCities });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, phone, password, city } = req.body;
        
        if (!name || !phone || !password || !city) {
            return res.status(400).json({ error: 'Please provide name, phone, password and city' });
        }

        const userData = await authService.registerUser({ name, phone, password, city });
        res.status(201).json(userData);
    } catch (error) {
        if (error.message.includes('already exists')) {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ error: 'Please provide a phone number and password' });
        }

        const userData = await authService.loginUser(phone, password);
        res.status(200).json(userData);
    } catch (error) {
        // Don't reveal which credential is wrong (security best practice)
        if (error.message.includes('Invalid phone number') || error.message.includes('Invalid password')) {
            return res.status(401).json({ error: 'Invalid phone number or password' });
        }
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, password, city, bio } = req.body;
        const updatedData = await authService.updateUser(userId, { name, password, city, bio });
        res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
};

exports.getProfileStats = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const [waterLogs, carbonLogs, spotsAdded, user] = await Promise.all([
            WaterLog.countDocuments({ userId }),
            CarbonLog.countDocuments({ userId }),
            Spot.countDocuments({ added_by: userId }),
            User.findById(userId).select('points'),
        ]);
        res.status(200).json({
            waterLogs,
            carbonLogs,
            spotsAdded,
            ecoScore: user ? user.points : 0,
        });
    } catch (error) {
        next(error);
    }
};
