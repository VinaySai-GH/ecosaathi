const express = require('express');
const { register, login, updateProfile, getCities } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/cities', getCities);
router.put('/profile', protect, updateProfile);

module.exports = router;
