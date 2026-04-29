const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a spot name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        category: {
            type: String,
            required: true,
            enum: ['ewaste', 'zerowaste', 'organic', 'refill', 'composting', 'nature', 'park', 'nursery', 'industry'],
        },
        lat: {
            type: Number,
            required: [true, 'Latitude is required'],
            min: -90,
            max: 90,
        },
        lng: {
            type: Number,
            required: [true, 'Longitude is required'],
            min: -180,
            max: 180,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        city: {
            type: String,
            default: 'Tirupati',
            trim: true,
        },
        opening_hours: {
            type: String,
            default: '',
        },
        cost: {
            type: String,
            default: '',
        },
        tips: {
            type: [String],
            default: [],
        },
        photos: {
            type: [String],
            default: [],
        },
        verified_by: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            default: [],
        },
        added_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        google_place_id: {
            type: String,
            default: '',
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true }
);

// Index for geospatial queries
spotSchema.index({ lat: 1, lng: 1 });
spotSchema.index({ category: 1 });

module.exports = mongoose.model('Spot', spotSchema);
