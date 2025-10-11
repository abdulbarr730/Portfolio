// server/routes/MediumRoutes.js
const express = require('express');
const Parser = require('rss-parser');

const router = express.Router();
const parser = new Parser();

// Your Medium RSS feed URL
const MEDIUM_RSS_URL = 'https://medium.com/feed/@abdulbarr730';

router.get('/', async (req, res) => {
  try {
    const feed = await parser.parseURL(MEDIUM_RSS_URL);
    // map to only what you need
    const posts = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
    }));
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Medium posts' });
  }
});

module.exports = router; // ✅ Important for require() in index.js
