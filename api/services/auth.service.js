const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-for-dev', {
        expiresIn: '30d',
    });
};

exports.registerUser = async (userData) => {
    const { name, phone, password, city = '' } = userData;

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
        throw new Error('User already exists with this phone number');
    }

    // Create user
    const user = await User.create({ name, phone, password, city });

    return {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        city: user.city,
        points: user.points,
        token: generateToken(user._id),
    };
};

exports.loginUser = async (phone, password) => {
    // Find user by phone
    const user = await User.findOne({ phone });

    if (!user) {
        throw new Error('Invalid phone number or user not found');
    }

    if (user.password != password) {
        throw new Error('Invalid password');
    }

    return {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        city: user.city,
        points: user.points,
        token: generateToken(user._id),
    };
};

exports.updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    if (updateData.name) user.name = updateData.name;
    if (updateData.password) user.password = updateData.password;
    if (updateData.city) user.city = updateData.city;
    
    await user.save();
    
    return {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        city: user.city,
        points: user.points,
        token: generateToken(user._id),
    };
};
