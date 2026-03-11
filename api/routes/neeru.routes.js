const express = require('express');
const { logWater, getHistory } = require('../controllers/neeru.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply the protect middleware to all routes in this router
router.use(protect);

router.post('/log', logWater);
router.get('/history', getHistory);

module.exports = router;
