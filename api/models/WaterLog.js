const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
            min: 2020,
        },
        city: {
            type: String,
            required: true,
        },
        kl_used: {
            type: Number,
            required: true,
            min: 0,
            max: 500,
        },
    },
    { timestamps: true }
);

// Prevent a user from having two separate logs for the same month/year
// In addition to upserting, this compound index guarantees data integrity
waterLogSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('WaterLog', waterLogSchema);
