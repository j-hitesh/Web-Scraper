const mongoose = require('mongoose');

const Story = require('../models/Story');

const toStoryResponse = (storyDoc, userId) => {
  const story = storyDoc.toObject();
  const isBookmarked = userId
    ? story.bookmarkedBy.some((bookmarkUserId) => bookmarkUserId.toString() === userId.toString())
    : false;

  return {
    id: story._id,
    title: story.title,
    url: story.url,
    points: story.points,
    author: story.author,
    postedAt: story.postedAt,
    isBookmarked,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  };
};

const getStories = async (req, res) => {
  try {
    const hasPagination = req.query.page || req.query.limit;
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(Number.parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
    const userId = req.user?.id || null;

    const sortByPointsDesc = { points: -1, updatedAt: -1 };

    if (hasPagination) {
      const [stories, total] = await Promise.all([
        Story.find({}).sort(sortByPointsDesc).skip(skip).limit(limit),
        Story.countDocuments({}),
      ]);

      return res.status(200).json({
        stories: stories.map((story) => toStoryResponse(story, userId)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    }

    const stories = await Story.find({}).sort(sortByPointsDesc);
    return res.status(200).json(stories.map((story) => toStoryResponse(story, userId)));
  } catch (error) {
    console.error('Get stories error:', error);
    return res.status(500).json({ error: 'Unable to fetch stories' });
  }
};

const getStoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid story id' });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    return res.status(200).json(toStoryResponse(story, req.user?.id || null));
  } catch (error) {
    console.error('Get story by id error:', error);
    return res.status(500).json({ error: 'Unable to fetch story' });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid story id' });
    }

    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const existingIndex = story.bookmarkedBy.findIndex(
      (bookmarkUserId) => bookmarkUserId.toString() === userId
    );

    let isBookmarked;
    if (existingIndex >= 0) {
      story.bookmarkedBy.splice(existingIndex, 1);
      isBookmarked = false;
    } else {
      story.bookmarkedBy.push(userId);
      isBookmarked = true;
    }

    await story.save();

    return res.status(200).json({
      message: isBookmarked ? 'Story bookmarked' : 'Bookmark removed',
      isBookmarked,
      story: toStoryResponse(story, userId),
    });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return res.status(500).json({ error: 'Unable to toggle bookmark' });
  }
};

const getBookmarkedStories = async (req, res) => {
  try {
    const userId = req.user.id;
    const stories = await Story.find({ bookmarkedBy: userId }).sort({ points: -1, updatedAt: -1 });

    return res.status(200).json(stories.map((story) => toStoryResponse(story, userId)));
  } catch (error) {
    console.error('Get bookmarked stories error:', error);
    return res.status(500).json({ error: 'Unable to fetch bookmarked stories' });
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
};
