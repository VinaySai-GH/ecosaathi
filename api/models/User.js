const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        hostel: {
            type: String,
            default: '',
            trim: true,
        },
        water_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WaterLog' }],
        carbon_logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CarbonLog' }],
        phone: {
            type: String,
            required: [true, 'Please provide a phone number'],
            unique: true,
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            trim: true,
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        points: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
