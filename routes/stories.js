const express = require('express');

const {
  getStories,
  getStoryById,
  toggleBookmark,
  getBookmarkedStories,
} = require('../controllers/storyController');
const { requireAuth, attachUserIfAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', attachUserIfAuthenticated, getStories);
router.get('/bookmarks', requireAuth, getBookmarkedStories);
router.get('/:id', attachUserIfAuthenticated, getStoryById);
router.post('/:id/bookmark', requireAuth, toggleBookmark);

module.exports = router;
