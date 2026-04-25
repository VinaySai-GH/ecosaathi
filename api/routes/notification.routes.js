const express = require('express');
const { getNotifications, markAsRead, getUnreadCount } = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read', protect, markAsRead);

module.exports = router;
