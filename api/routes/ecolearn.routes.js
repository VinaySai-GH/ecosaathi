const express = require('express');
const { getProgress, markLessonComplete, submitQuiz } = require('../controllers/ecolearn.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/progress', protect, getProgress);
router.post('/progress', protect, markLessonComplete);
router.post('/quiz/submit', protect, submitQuiz);

module.exports = router;
