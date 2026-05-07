const express = require('express');

const { runScrape } = require('../controllers/scrapeController');

const router = express.Router();

router.post('/', runScrape);

module.exports = router;
