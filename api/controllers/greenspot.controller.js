const greenspotService = require('../services/greenspot.service');

exports.getSpots = async (req, res, next) => {
    try {
        const { category, lat, lng, q } = req.query;
        const spots = await greenspotService.getSpots({ category, lat, lng, q });
        res.status(200).json({ spots });
    } catch (error) {
        next(error);
    }
};

exports.createSpot = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const spot = await greenspotService.createSpot(req.body, userId);
        res.status(201).json({ spot });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        next(error);
    }
};

exports.verifySpot = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const spot = await greenspotService.verifySpot(id, userId);
        res.status(200).json({ spot });
    } catch (error) {
        if (error.message === 'Spot not found') {
            return res.status(404).json({ error: error.message });
        }
        next(error);
    }
};

exports.getCityEcoScore = async (req, res, next) => {
    try {
        const { city } = req.query;
        const score = await greenspotService.getCityEcoScore(city);
        res.status(200).json(score);
    } catch (error) {
        next(error);
    }
};
