// server/routes/MediumRoutes.js
const express = require('express');
const Parser = require('rss-parser');
const sendBlogEmail = require("../utils/sendBlogEmail");
const BlogSent = require("../models/blogSent.model");
const SiteSettings = require("../models/siteSettings.model");

const router = express.Router();
const parser = new Parser();

// Your Medium RSS feed URL
const MEDIUM_RSS_URL = 'https://medium.com/feed/@abdulbarr730';

router.get('/', async (req, res) => {
  try {
    const feed = await parser.parseURL(MEDIUM_RSS_URL);

    const posts = feed.items.map(item => {
      // Medium puts the full article HTML in content:encoded
      const html = item['content:encoded'] || item.content || '';
      const text = html.replace(/<figcaption[\s\S]*?<\/figcaption>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&#39;|&rsquo;/g, "'")
        .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
      const words = text ? text.split(' ').length : 0;
      // the article body usually starts by repeating the title; drop it
      const body = item.title && text.startsWith(item.title) ? text.slice(item.title.length).trim() : text;
      const snippet = item.contentSnippet || (body.length > 220 ? `${body.slice(0, 220).replace(/\s+\S*$/, '')}…` : body);
      // first real article image (skip Medium's 1x1 tracking pixel)
      const image =
        [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)]
          .map((m) => m[1])
          .find((src) => /miro\.medium\.com|cdn-images-\d\.medium\.com/.test(src)) || '';
      return {
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: snippet,
        image,
        mediumImage: image,
        categories: item.categories || [],
        readingTime: Math.max(1, Math.round(words / 220)),
      };
    });

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

    // Admin-uploaded cover overrides (admin -> Blog covers), matched by link without query string
    try {
      const settings = await SiteSettings.findOne({ key: 'main' }).select('blogCovers').lean();
      const covers = new Map((settings?.blogCovers || []).filter((c) => c.link && c.image).map((c) => [c.link.split('?')[0], c.image]));
      for (const p of posts) {
        const override = covers.get((p.link || '').split('?')[0]);
        if (override) p.image = override;
      }
    } catch (e) {
      console.error('blog cover overrides failed:', e.message);
    }

    res.json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Medium posts' });
  }
});

module.exports = router; // ✅ Important for require() in index.js
