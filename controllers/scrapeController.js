const { scrapeTopStories } = require('../services/scraperService');

const runScrape = async (_req, res) => {
  try {
    const stories = await scrapeTopStories();
    return res.status(200).json({
      message: 'Scrape completed successfully',
      total: stories.length,
      stories,
    });
  } catch (error) {
    console.error('Scrape controller error:', error);
    return res.status(500).json({ error: 'Unable to scrape stories' });
  }
};

module.exports = {
  runScrape,
};
