// server/routes/MediumRoutes.js
const express = require('express');
const Parser = require('rss-parser');
const sendBlogEmail = require("../utils/sendBlogEmail");
const BlogSent = require("../models/blogSent.model");

const router = express.Router();
const parser = new Parser();

// Your Medium RSS feed URL
const MEDIUM_RSS_URL = 'https://medium.com/feed/@abdulbarr730';

router.get('/', async (req, res) => {
  try {
    const feed = await parser.parseURL(MEDIUM_RSS_URL);

    const posts = feed.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      contentSnippet: item.contentSnippet,
    }));

    // Get latest post
    const latestPost = posts[0];

    // Check if already sent
    const alreadySent = await BlogSent.findOne({
      link: latestPost.link
    });

    if (!alreadySent) {

      // Send Email
      await sendBlogEmail(
        latestPost.title,
        latestPost.link,
        latestPost.contentSnippet
      );

      // Save to DB
      await BlogSent.create({
        link: latestPost.link
      });

      console.log("New blog email sent");
    }

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Medium posts' });
  }
});

module.exports = router; // ✅ Important for require() in index.js
