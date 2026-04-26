const express = require('express');
const { getReports, createReport, upvoteReport, deleteReport } = require('../controllers/ecoreport.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getReports);
router.post('/', protect, createReport);
router.put('/:id/upvote', protect, upvoteReport);
router.delete('/:id', protect, deleteReport);

module.exports = router;
