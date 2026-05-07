const express = require('express');
const cheerio = require('cheerio');

const Story = require('../models/Story');

const router = express.Router();
const HACKER_NEWS_URL = 'https://news.ycombinator.com/';

router.get('/hackernews', async (req, res) => {
  try {
    const response = await fetch(HACKER_NEWS_URL);
    if (!response.ok) {
      throw new Error(`Hacker News responded with ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];

    $('.athing').each((index, element) => {
      if (results.length >= 10) {
        return false;
      }

      const titleLink = $(element).find('.titleline > a').first();
      const title = titleLink.text().trim();
      const rawUrl = titleLink.attr('href') || '';
      const subtext = $(element).next();
      const pointsText = subtext.find('.score').text().trim();
      const points = parseInt(pointsText, 10) || 0;
      const author = subtext.find('.hnuser').text().trim() || null;
      const age = subtext.find('.age').first();
      const postedAt = age.attr('title') || age.text().trim() || null;

      if (!title || !rawUrl) {
        return;
      }

      const url = new URL(rawUrl, HACKER_NEWS_URL).href;

      results.push({
        title,
        url,
        points,
        author,
        postedAt,
      });
    });

    await Story.deleteMany({});
    const savedStories = await Story.insertMany(results);

    res.json({
      source: HACKER_NEWS_URL,
      count: savedStories.length,
      items: savedStories,
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Unable to fetch Hacker News data' });
  }
});

module.exports = router;
