const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        question_ids: {
            type: [String],
            default: [],
        },
        answers: {
            type: [String],
            enum: ['Y', 'N', 'Hmm'],
            default: [],
        },
        points_awarded: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
