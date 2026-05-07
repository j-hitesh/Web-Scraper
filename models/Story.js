const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    hackerNewsId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: String,
      default: 'unknown',
      trim: true,
    },
    postedAt: {
      type: String,
      default: '',
      trim: true,
    },
    bookmarkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastScrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
