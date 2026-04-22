const express = require('express');
const { getPosts, createPost, toggleLike, addComment, deletePost, updatePostStatus } = require('../controllers/post.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getPosts);
router.post('/', protect, createPost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id', protect, deletePost);
router.put('/:id/status', protect, updatePostStatus);

module.exports = router;
