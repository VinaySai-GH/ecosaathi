const mongoose = require('mongoose');

const botUserSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        preferred_time: {
            type: String,
            default: '21:00',
        },
        streak: {
            type: Number,
            default: 0,
        },
        last_answered: {
            type: Date,
        },
        last_notified_at: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('BotUser', botUserSchema);
