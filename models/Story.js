const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
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
    },
    author: {
      type: String,
      default: null,
      trim: true,
    },
    postedAt: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);
