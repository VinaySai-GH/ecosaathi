const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ error: 'Please provide name and phone' });
        }

        const userData = await authService.registerUser({ name, phone, password });
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
        if (error.message.includes('Invalid phone number')) {
            return res.status(401).json({ error: error.message });
        }
        next(error);
    }
};
