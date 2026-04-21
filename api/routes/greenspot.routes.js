const express = require('express');
const { getSpots, createSpot, verifySpot, getCityEcoScore } = require('../controllers/greenspot.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSpots);
router.get('/stats/eco-score', getCityEcoScore);
router.post('/', protect, createSpot);
router.post('/:id/verify', protect, verifySpot);

module.exports = router;
