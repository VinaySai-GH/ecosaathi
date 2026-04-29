const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const mailService = require('../services/mail.service');

// Trending score: recency + like-weight
function trendScore(post) {
  const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / 3600000;
  return post.likes.length * 10 - ageHours * 0.5;
}

// GET /api/posts?page=1&limit=20
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name city')
      .populate('comments.user', 'name');

    // Re-sort in-memory by trend score for the first page
    const sorted = page === 1 ? [...posts].sort((a, b) => trendScore(b) - trendScore(a)) : posts;

    res.status(200).json({ posts: sorted, page, hasMore: posts.length === limit });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { type, caption, image, locationText, locationCoords, isGrievance, grievanceDetails } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Post type is required.' });
    }

    const post = await Post.create({
      user: req.user._id,
      type,
      caption: caption || '',
      image: image || null,
      locationText: locationText || '',
      locationCoords: locationCoords || { lat: null, lng: null },
      isGrievance: isGrievance || false,
      grievanceDetails: grievanceDetails || { category: null, subCategory: null, description: null },
    });

    await post.populate('user', 'name city phone');

    // Award points for posting
    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 30 } });

    // Send notification for points
    await Notification.create({
      user: req.user._id,
      message: `You earned 30 points for creating a new ${type} post!`,
    });

    // Handle Grievance in background
    if (isGrievance) {
      const draftGrievanceMail = async () => {
        try {
          const user = post.user;
          const { category, subCategory, description } = grievanceDetails;
          
          // Basic extraction of city/address parts
          const addressParts = locationText.split(',').map(s => s.trim());
          const city = addressParts[0] || 'Unknown City';
          const locality = addressParts.slice(1, 3).join(', ') || 'Unknown Locality';

          const subject = `Grievance Regarding ${category} (${subCategory}) – ${city}`;
          
          const html = `
            <h3>Civic Issue Grievance Report</h3>
            <p><strong>To,</strong><br/>The Commissioner & Director of Municipal Administration's Head office, Andhra Pradesh.</p>
            
            <p><strong>Dear Sir/Madam,</strong></p>
            
            <p>I am writing to report a civic issue in my locality. Below are my details:</p>
            
            <ul>
              <li><strong>Full Name:</strong> ${user.name}</li>
              <li><strong>Mobile Number:</strong> ${user.phone || 'Not provided'}</li>
              <li><strong>Address:</strong> ${locationText}</li>
              <li><strong>Category:</strong> ${category}</li>
              <li><strong>Sub-Category:</strong> ${subCategory}</li>
            </ul>
            
            <p><strong>Issue Description:</strong><br/>
            ${description}</p>
            
            <p>I have attached a photo of the issue for your reference.</p>
            
            <p>Kindly look into this matter and resolve it at the earliest.</p>
            
            <p><strong>Sincerely,</strong><br/>
            ${user.name}<br/>
            Resident/Citizen</p>
          `;

          await mailService.sendGrievanceEmail({
            to: 'yuvabhargav27@gmail.com',
            subject,
            html,
            image: post.image,
          });

          // Create success notification
          await Notification.create({
            user: user._id,
            message: 'Your grievance is mailed to CDMA, and kindly raise your grievance at https://cdma.ap.gov.in',
            link: 'https://cdma.ap.gov.in',
          });

        } catch (error) {
          console.error('[Grievance] Background process failed:', error);
          // Create failure notification
          await Notification.create({
            user: req.user._id,
            message: 'Failed to send your grievance email to CDMA. Please try again or visit https://cdma.ap.gov.in directly.',
            link: 'https://cdma.ap.gov.in',
          });
        }
      };

      // Execute in background
      draftGrievanceMail();
    }

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts/:id/like  (toggle)
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    next(error);
  }
};

// POST /api/posts/:id/comment
exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    post.comments.push({ user: req.user._id, text: text.trim() });
    await post.save();

    // Return newly added comment with populated user
    const updated = await Post.findById(post._id).populate('comments.user', 'name');
    const newComment = updated.comments[updated.comments.length - 1];

    res.status(201).json({ comment: newComment });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    // Ensure the current user is the owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post.' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/posts/:id/status
exports.updatePostStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['persisting', 'solved'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });

    // Ensure the current user is the owner
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post.' });
    }

    // Ensure it's an issue post
    if (post.type !== 'issue') {
      return res.status(400).json({ error: 'Status can only be updated for issue posts.' });
    }

    post.status = status;
    await post.save();
    
    // Return updated post
    await post.populate('user', 'name city');
    res.status(200).json({ post });
  } catch (error) {
    next(error);
  }
};
