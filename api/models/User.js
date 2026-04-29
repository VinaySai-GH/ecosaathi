const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        city: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true,
            maxlength: [160, 'Bio cannot exceed 160 characters'],
            default: '',
        },
        water_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WaterLog' }],
        carbon_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CarbonLog' }],
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            unique: true,
            match: [/^[0-9]{10,13}$/, 'Please provide a valid phone number (10-13 digits)'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            trim: true,
            minlength: [6, 'Password must be at least 6 characters long'],
            select: false, // Don't return password by default in queries
        },
        points: {
            type: Number,
            default: 0,
            min: 0,
        },
        last_insight_at:    { type: Date, default: null },
        next_insight_after: { type: Date, default: null },
        cached_insight:     { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
