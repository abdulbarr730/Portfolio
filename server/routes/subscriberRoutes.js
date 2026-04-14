const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");
const Parser = require("rss-parser");
const crypto = require("crypto");

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
        message: "Email is required"
      });
    }

    email = email.trim().toLowerCase();

    const existing = await Subscriber.findOne({ email });

    // Already verified
    if (existing && existing.isVerified) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed"
      });
    }

    // Already pending → resend token
    let token;

    if (existing && !existing.isVerified) {
      token = crypto.randomBytes(32).toString("hex");

      existing.token = token;
      await existing.save();
    } else {
      token = crypto.randomBytes(32).toString("hex");

      await Subscriber.create({
        email,
        token,
        isVerified: false
      });
    }

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "");

    const confirmUrl = `${base}/api/confirm/${token}`;

    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: email,
      subject: "Confirm your subscription",
      html: `
        <h2>Confirm your subscription</h2>

        <p>Please confirm your email to complete subscription</p>

        <a href="${confirmUrl}"
        style="background:black;color:white;padding:10px 14px;text-decoration:none;">
        Confirm Email
        </a>

        <p>If you didn't request this, ignore this email.</p>
      `
    });

    return res.json({
      success: true,
      message: "Please check your email to confirm subscription"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Confirm
router.get("/confirm/:token", async (req, res) => {
  try {

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "");

    const subscriber = await Subscriber.findOne({
      token: req.params.token
    });

    if (!subscriber) {
      return res.redirect(`${base}/newsletter/confirmed?status=error`);
    }

    // Already verified → still success
    if (subscriber.isVerified) {
      return res.redirect(`${base}/newsletter/confirmed?status=success`);
    }

    subscriber.isVerified = true;
    subscriber.token = null;
    subscriber.expiresAt = null;

    await subscriber.save();

    // Fetch blogs
    const feed = await parser.parseURL(MEDIUM_RSS_URL);
    const topBlogs = feed.items.slice(0, 3);

    const blogHtml = topBlogs.map(blog => `
      <li>
        <a href="${blog.link}">
          ${blog.title}
        </a>
      </li>
    `).join("");

    // Welcome email
    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: subscriber.email,
      subject: "Welcome to Abdul Barr Newsletter",
      html: `
      <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6;">

      <h2>Welcome</h2>

      <p>You are now subscribed.</p>

      <ul>
        <li>Real projects I'm building</li>
        <li>Architecture breakdowns</li>
        <li>AI engineering insights</li>
      </ul>

      <hr/>

      <h3>Latest Project</h3>

      <a href="https://abdulbarr.in/projects"
      style="background:black;color:white;padding:10px 14px;text-decoration:none;">
      View Project
      </a>

      <hr/>

      <h3>Top Blogs</h3>

      <ul>${blogHtml}</ul>

      <hr/>

      <p>
        <a href="https://github.com/abdulbarr730">GitHub</a>
      </p>

      <p>
        <a href="https://abdulbarr.in">Website</a>
      </p>

      <p>— Abdul Barr</p>

      </div>
      `
    });

    return res.redirect(`${base}/newsletter/confirmed?status=success`);

  } catch (error) {
    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "");
    return res.redirect(`${base}/newsletter/confirmed?status=error`);
  }
});


// Get Verified Subscribers
router.get("/subscribers", async (req, res) => {
  try {

    const subscribers = await Subscriber.find({
      isVerified: true
    }).sort({ subscribedAt: -1 });

    return res.json({
      success: true,
      subscribers
    });

  } catch (error) {
    return res.status(500).json({
      success: false
    });
  }
});

module.exports = router;