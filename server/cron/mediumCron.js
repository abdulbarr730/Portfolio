const cron = require("node-cron");
const Parser = require("rss-parser");

const sendBlogEmail = require("../utils/sendBlogEmail");
const BlogSent = require("../models/blogSent.model");

const parser = new Parser();

const MEDIUM_RSS_URL = "https://medium.com/feed/@abdulbarr730";

cron.schedule("*/10 * * * *", async () => {
  console.log("Checking for new Medium posts...");

  try {

    const feed = await parser.parseURL(MEDIUM_RSS_URL);

    const latestPost = feed.items[0];

    const alreadySent = await BlogSent.findOne({
      link: latestPost.link
    });

    if (!alreadySent) {

      await sendBlogEmail(
        latestPost.title,
        latestPost.link,
        latestPost.contentSnippet
      );

      await BlogSent.create({
        link: latestPost.link
      });

      console.log("New blog email sent");

    } else {
      console.log("No new blog");
    }

  } catch (error) {
    console.error("Cron error:", error);
  }

});