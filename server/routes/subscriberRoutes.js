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

    if (existing && existing.isVerified) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed"
      });
    }

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

    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

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

    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

    const subscriber = await Subscriber.findOne({
      token: req.params.token
    });

    if (!subscriber) {
      return res.redirect(`${base}/newsletter/confirmed?status=error`);
    }

    if (subscriber.isVerified) {
      return res.redirect(`${base}/newsletter/confirmed?status=success`);
    }

    subscriber.isVerified = true;
    subscriber.token = null;
    subscriber.expiresAt = null;

    await subscriber.save();

    // SAFE blog fetch
    let blogHtml = "<li>Check latest blogs on the website</li>";

    try {
      const feed = await parser.parseURL(MEDIUM_RSS_URL);
      const topBlogs = feed.items.slice(0, 3);

      blogHtml = topBlogs.map(blog => `
        <li>
          <a href="${blog.link}">
            ${blog.title}
          </a>
        </li>
      `).join("");
    } catch {}

    // unsubscribe link
    const unsubscribeUrl =
      `${base}/api/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;

    // FULL welcome email (not shortened)
    try {
      await resend.emails.send({
        from: "Abdul Barr <newsletter@abdulbarr.in>",
        to: subscriber.email,
        subject: "Welcome to Abdul Barr Newsletter",
        html: `
        <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6; padding:20px;">

        <h2>You're in</h2>

        <p>Thanks for subscribing. I only send useful stuff.</p>

        <ul>
          <li>Real projects I'm building</li>
          <li>Architecture decisions and breakdowns</li>
          <li>Useful AI + dev insights</li>
        </ul>

        <hr style="margin:25px 0;" />

        <h3>Latest Project</h3>

        <p><strong>College Hackathon Management Platform</strong></p>

        <p>Multi-college SaaS system to manage hackathons, teams, judging and submissions.</p>

        <a href="https://abdulbarr.in/projects"
        style="background:black;color:white;padding:10px 14px;text-decoration:none;border-radius:6px;">
        View Project
        </a>

        <hr style="margin:25px 0;" />

        <h3>Top Blogs</h3>

        <ul>
          ${blogHtml}
        </ul>

        <hr style="margin:25px 0;" />

        <h3>Explore More</h3>

        <p>
          <a href="https://github.com/abdulbarr730">GitHub</a><br/>
          <a href="https://abdulbarr.in">Website</a>
        </p>

        <hr style="margin:25px 0;" />

        <p>You'll hear from me when:</p>

        <ul>
          <li>I ship something new</li>
          <li>I publish a blog</li>
          <li>I learn something worth sharing</li>
        </ul>

        <br/>

        <p>— Abdul Barr</p>

        <p style="font-size:12px;color:#666;">
          You're receiving this because you subscribed at abdulbarr.in
        </p>

        <p style="font-size:12px;">
          <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">
            Unsubscribe
          </a>
        </p>

        </div>
        `
      });
    } catch {}

    return res.redirect(`${base}/newsletter/confirmed?status=success`);

  } catch (error) {
    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
    return res.redirect(`${base}/newsletter/confirmed?status=error`);
  }
});


// Unsubscribe
router.get("/unsubscribe", async (req, res) => {
  try {

    const { email } = req.query;

    if (!email) {
      return res.send("Invalid request");
    }

    await Subscriber.deleteOne({ email });

    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

    return res.redirect(`${base}/newsletter/unsubscribed`);

  } catch {
    return res.send("Something went wrong");
  }
});


// Get verified subscribers
router.get("/subscribers", async (req, res) => {
  try {

    const subscribers = await Subscriber.find({
      isVerified: true
    }).sort({ subscribedAt: -1 });

    return res.json({
      success: true,
      subscribers
    });

  } catch {
    return res.status(500).json({
      success: false
    });
  }
});

module.exports = router;