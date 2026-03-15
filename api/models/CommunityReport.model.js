const mongoose = require('mongoose');

const CommunityReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    issueType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 200,
        required: true
    },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String }
    },
    photoUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'live'],
        default: 'live' // auto-live for demo
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CommunityReport', CommunityReportSchema);
