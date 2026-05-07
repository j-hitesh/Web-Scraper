const cheerio = require('cheerio');

const Story = require('../models/Story');

const HN_BASE_URL = 'https://news.ycombinator.com';

const toAbsoluteUrl = (rawUrl) => {
  if (!rawUrl) {
    return HN_BASE_URL;
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }

  return new URL(rawUrl, `${HN_BASE_URL}/`).toString();
};

const scrapeTopStories = async () => {
  const response = await fetch(HN_BASE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch HN page: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const rows = $('tr.athing').slice(0, 10);
  const stories = [];

  rows.each((_index, element) => {
    const storyRow = $(element);
    const metaRow = storyRow.next();
    const linkElement = storyRow.find('span.titleline a').first();
    const pointsText = metaRow.find('.score').text().trim();

    const story = {
      hackerNewsId: Number(storyRow.attr('id')),
      title: linkElement.text().trim(),
      url: toAbsoluteUrl(linkElement.attr('href')),
      points: Number.parseInt(pointsText, 10) || 0,
      author: metaRow.find('.hnuser').text().trim() || 'unknown',
      postedAt: metaRow.find('.age').text().trim() || '',
      lastScrapedAt: new Date(),
    };

    if (story.hackerNewsId && story.title && story.url) {
      stories.push(story);
    }
  });

  const savedStories = [];
  for (const story of stories) {
    const savedStory = await Story.findOneAndUpdate(
      { hackerNewsId: story.hackerNewsId },
      {
        $set: {
          title: story.title,
          url: story.url,
          points: story.points,
          author: story.author,
          postedAt: story.postedAt,
          lastScrapedAt: story.lastScrapedAt,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    savedStories.push(savedStory);
  }

  return savedStories;
};

module.exports = {
  scrapeTopStories,
};
