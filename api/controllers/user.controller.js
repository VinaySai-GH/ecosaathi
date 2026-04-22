const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/users/:id  — public profile + posts
exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name city bio points createdAt');
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name city');

    res.status(200).json({ user, posts });
  } catch (error) {
    next(error);
  }
};
