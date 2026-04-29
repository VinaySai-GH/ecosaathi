const express = require('express');
const router = express.Router();
const psController = require('../controllers/pollutionsense.controller');
const auth = require('../middleware/auth'); // assuming auth.protect is the middleware

router.get('/aqi', psController.getAQI);
router.get('/live-aqi', psController.getLiveAQI);
router.get('/score', psController.getScore);
router.get('/reports', psController.getReports);

// Protected routes
router.post('/report', auth.protect, psController.createReport);
router.put('/reports/:id/upvote', auth.protect, psController.upvoteReport);

module.exports = router;
