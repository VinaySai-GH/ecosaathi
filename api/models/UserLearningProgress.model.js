const mongoose = require('mongoose');

const userLearningProgressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        moduleId: {
            type: String,
            required: true,
        },
        lessonsCompleted: {
            type: [String],
            default: [],
        },
        quizScore: {
            type: Number,
            default: null,
        },
        pointsAwarded: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

// Compound unique index — one progress doc per user per module
userLearningProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('UserLearningProgress', userLearningProgressSchema);
