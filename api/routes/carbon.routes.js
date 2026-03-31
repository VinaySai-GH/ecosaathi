const express = require('express');
const router = express.Router();
const carbonController = require('../controllers/carbon.controller');
const auth = require('../middleware/auth');

// Protected routes (require valid JWT)
router.post('/calculate', auth.protect, carbonController.calculateCarbonLog);
router.post('/log', auth.protect, carbonController.saveCarbonLog);
router.get('/history', auth.protect, carbonController.getCarbonHistory);

module.exports = router;
