const express = require('express');
const { logWater, getHistory } = require('../controllers/neeru.controller');
const { hfOcr } = require('../controllers/ocr.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// OCR endpoint does NOT require auth — it's a utility feature
router.post('/ocr/hf', hfOcr);

// Apply the protect middleware to data endpoints
router.use(protect);

router.post('/log', logWater);
router.get('/history', getHistory);

module.exports = router;
