const mongoose = require('mongoose');

const CarbonLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    },
    totalKgCO2: {
        type: Number,
        required: true
    },
    breakdown: {
        commute: { type: Number, default: 0 },
        food: { type: Number, default: 0 },
        electricity: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 }
    },
    formData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index to easily find a user's log for a specific month and year
CarbonLogSchema.index({ userId: 1, month: 1, year: 1 });

module.exports = mongoose.model('CarbonLog', CarbonLogSchema);
