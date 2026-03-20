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
            enum: ['21:00', '21:30', '22:00'],
            default: '21:00',
        },
        streak: {
            type: Number,
            default: 0,
        },
        last_answered: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('BotUser', botUserSchema);
