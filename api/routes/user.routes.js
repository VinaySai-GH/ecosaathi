const express = require('express');
const { getPublicProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public profile — still requires auth so we know who's asking
router.get('/:id', protect, getPublicProfile);

module.exports = router;
