const mongoose = require('mongoose');

const ecoReportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['Air Pollution', 'Water Pollution', 'Illegal Dumping', 'Open Burning', 'Noise Pollution', 'Deforestation'],
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000,
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            required: true,
        },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            address: { type: String, default: '' },
        },
        photoUrl: {
            type: String,
            default: null,
        },
        upvotes: {
            type: Number,
            default: 0,
            min: 0,
        },
        upvotedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'community_verified', 'resolved'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('EcoReport', ecoReportSchema);
