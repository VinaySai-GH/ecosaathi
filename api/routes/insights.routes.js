const express = require('express');
const { getEcoInsight } = require('../controllers/insights.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/eco', protect, getEcoInsight);

module.exports = router;
