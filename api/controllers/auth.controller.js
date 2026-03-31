const authService = require('../services/auth.service');
const User = require('../models/User');

exports.getCities = async (req, res, next) => {
    try {
        const cities = await User.distinct('city');
        const validCities = cities.filter(c => c && c.trim() !== '');
        res.status(200).json({ cities: validCities });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, phone, password } = req.body;
        const city = req.body.city || ''; // Optional

        if (!name || !phone || !password) {
            return res.status(400).json({ error: 'Please provide name, phone and password' });
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
        const { name, password, city } = req.body;
        const updatedData = await authService.updateUser(userId, { name, password, city });
        res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
};
