const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Post type: casual news, upcoming event, or issue report
    type: {
      type: String,
      enum: ['news', 'event', 'issue'],
      required: true,
    },
    // Status for issue posts
    status: {
      type: String,
      enum: ['persisting', 'solved'],
      default: 'persisting',
    },
    caption: { type: String, trim: true, maxlength: 2000 },
    // Optional image stored as base64 data-URL or a URL string
    image: { type: String, default: null },
    // Human-readable location text (auto-reverse-geocoded or typed)
    locationText: { type: String, default: '' },
    // Coordinates for deep-linking to Eco Atlas map
    locationCoords: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

// Index for efficient trending/latest sort
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
