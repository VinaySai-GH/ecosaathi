const express = require('express');
const { getLeaderboard, getMyLeaderboard } = require('../controllers/ecopulse.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getLeaderboard);
router.get('/me', protect, getMyLeaderboard);

module.exports = router;
