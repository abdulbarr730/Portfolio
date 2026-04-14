const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");
const Parser = require("rss-parser");
const crypto = require("crypto");

const resend = new Resend(process.env.RESEND_API_KEY);
const parser = new Parser();

const router = express.Router();

const MEDIUM_RSS_URL = "https://medium.com/feed/@abdulbarr730";


// Subscribe (Double Opt-in)
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

    const exists = await Subscriber.findOne({ email });

    if (exists && exists.isVerified) {
      return res.status(400).json({
        success: false,
        message: "You're already subscribed"
      });
    }

    if (exists && !exists.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please confirm your email first"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await Subscriber.create({
      email,
      token,
      isVerified: false
    });

    const confirmUrl =
      `https://portfolio-backend-omega-khaki.vercel.app/api/confirm/${token}`;

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

    res.json({
      success: true,
      message: "Please check your email to confirm subscription"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// Confirm Email
router.get("/confirm/:token", async (req, res) => {
  try {

    const subscriber = await Subscriber.findOne({
      token: req.params.token
    });

    if (!subscriber) {
      return res.send("Invalid or expired confirmation link");
    }

    subscriber.isVerified = true;
    subscriber.token = null;

    await subscriber.save();

    // Fetch latest Medium blogs
    const feed = await parser.parseURL(MEDIUM_RSS_URL);
    const topBlogs = feed.items.slice(0, 3);

    const blogHtml = topBlogs.map(blog => `
      <li>
        <a href="${blog.link}">
          ${blog.title}
        </a>
      </li>
    `).join("");


    // Send Welcome Email
    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: subscriber.email,
      subject: "Welcome to Abdul Barr Newsletter",
      html: `
      <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6;">

      <h2>Welcome</h2>

      <p>You are now subscribed.</p>

      <p>Here's what you'll get:</p>

      <ul>
        <li>Real projects I'm building</li>
        <li>Architecture breakdowns</li>
        <li>AI engineering insights</li>
      </ul>

      <hr/>

      <h3>Latest Project</h3>

      <p>
      College Hackathon Management Platform  
      Multi-college SaaS platform
      </p>

      <a href="https://abdulbarr.in/projects"
      style="background:black;color:white;padding:10px 14px;text-decoration:none;">
      View Project
      </a>

      <hr/>

      <h3>Top Blogs</h3>

      <ul>
        ${blogHtml}
      </ul>

      <hr/>

      <h3>GitHub</h3>

      <p>
        <a href="https://github.com/abdulbarr730">
          github.com/abdulbarr730
        </a>
      </p>

      <hr/>

      <h3>Website</h3>

      <p>
        <a href="https://abdulbarr.in">
          abdulbarr.in
        </a>
      </p>

      <hr/>

      <p>
      You'll hear from me when I:
      </p>

      <ul>
        <li>Ship something new</li>
        <li>Publish a new blog</li>
        <li>Share something useful</li>
      </ul>

      <p>
      — Abdul Barr
      </p>

      </div>
      `
    });

    res.send("Email confirmed successfully");

  } catch (error) {
    console.error(error);
    res.send("Something went wrong");
  }
});


// Get Only Verified Subscribers
router.get("/subscribers", async (req, res) => {
  try {

    const subscribers = await Subscriber.find({
      isVerified: true
    }).sort({ subscribedAt: -1 });

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