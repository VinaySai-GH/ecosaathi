const mongoose = require('mongoose');

const AQICacheSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Array, // raw results from OpenAQ
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AQICache', AQICacheSchema);
