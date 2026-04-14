const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");
const validateEmail = require("../utils/validateEmail");
const Parser = require("rss-parser");

const resend = new Resend(process.env.RESEND_API_KEY);
const parser = new Parser();

const router = express.Router();

const MEDIUM_RSS_URL = "https://medium.com/feed/@abdulbarr730";


// Subscribe
router.post("/subscribe", async (req, res) => {
  try {

    let { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    email = email.trim().toLowerCase();

    // Validate Email
    const validation = await validateEmail(email);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Check duplicate
    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed"
      });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();


    // Fetch Medium Blogs
    const feed = await parser.parseURL(MEDIUM_RSS_URL);

    const topBlogs = feed.items.slice(0, 3);

    const blogHtml = topBlogs.map(blog => `
      <li>
        <a href="${blog.link}" style="color:#000;text-decoration:underline;">
          ${blog.title}
        </a>
      </li>
    `).join("");


    // Send Welcome Email
    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: email,
      subject: "You're in",
      html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; line-height: 1.6; padding: 20px;">

        <h2>You're in</h2>

        <p>Hey,</p>

        <p>Glad you subscribed. I only send useful stuff.</p>

        <p>Here's what you'll get:</p>

        <ul>
            <li>Real projects I'm building</li>
            <li>How I build them</li>
            <li>Useful dev + AI insights</li>
        </ul>

        <hr style="margin: 25px 0;" />

        <h3>Latest Project</h3>

        <p><strong>College Hackathon Management Platform</strong></p>

        <p>
            <a href="https://abdulbarr.in/projects"
            style="background:#000;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">
            View Project
            </a>
        </p>

        <hr style="margin: 25px 0;" />

        <h3>Top Blogs</h3>

        <ul>
        ${blogHtml}
        </ul>

        <hr style="margin: 25px 0;" />

        <h3>GitHub</h3>

        <p>
            <a href="https://github.com/abdulbarr730"
            style="background:#f3f3f3;color:#000;padding:10px 16px;text-decoration:none;border-radius:6px;">
            Visit GitHub
            </a>
        </p>

        <hr style="margin: 25px 0;" />

        <h3>What to Expect</h3>

        <ul>
            <li>New projects</li>
            <li>New blogs</li>
            <li>AI engineering insights</li>
        </ul>

        <br/>

        <p>– Abdul Barr</p>

        <p style="font-size: 13px; color: #666;">
            You’re receiving this because you subscribed at abdulbarr.in
        </p>

      </div>
      `
    });

    res.status(201).json({
      success: true,
      message: "Subscribed successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Get subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ subscribedAt: -1 });

    res.json({
      success: true,
      subscribers
    });

  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;