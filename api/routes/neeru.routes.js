const express = require('express');
const { logWater, getHistory } = require('../controllers/neeru.controller');
const { hfOcr } = require('../controllers/ocr.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply the protect middleware to all routes in this router
router.use(protect);

router.post('/log', logWater);
router.get('/history', getHistory);

// Hugging Face OCR endpoint
router.post('/ocr/hf', hfOcr);

module.exports = router;
