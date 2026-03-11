const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');

        // Attach user to request, fetching from DB to ensure they still exist
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }
};
