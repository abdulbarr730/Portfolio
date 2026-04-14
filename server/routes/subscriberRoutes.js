const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");
const validateEmail = require("../utils/validateEmail");
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

    email = email.trim().toLowerCase();

    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success:false,
        message:"Already subscribed"
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const subscriber = new Subscriber({
      email,
      token,
      isVerified:false
    });

    await subscriber.save();

    const confirmUrl = `https://portfolio-backend-omega-khaki.vercel.app/api/confirm/${token}`;

    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: email,
      subject: "Confirm your subscription",
      html: `
        <h2>Confirm your subscription</h2>
        <p>Click below to confirm your email</p>

        <a href="${confirmUrl}"
        style="background:black;color:white;padding:10px 16px;text-decoration:none;">
        Confirm Subscription
        </a>

        <p>If you didn't request this, ignore.</p>
      `
    });

    res.json({
      success:true,
      message:"Check your email to confirm"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success:false
    });

  }
});

router.get("/confirm/:token", async (req, res) => {
  try {

    const subscriber = await Subscriber.findOne({
      token: req.params.token
    });

    if (!subscriber) {
      return res.send("Invalid or expired link");
    }

    subscriber.isVerified = true;
    subscriber.token = null;

    await subscriber.save();

    // Fetch latest blogs
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
      to: subscriber.email,
      subject: "Welcome to Abdul Barr Newsletter",
      html: `
      <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6;">

      <h2>Welcome</h2>

      <p>You're now subscribed.</p>

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
      Multi-college SaaS for managing hackathons
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

      <a href="https://github.com/abdulbarr730">
      github.com/abdulbarr730
      </a>

      <hr/>

      <p>
      You'll hear from me when I:
      </p>

      <ul>
        <li>Ship something new</li>
        <li>Write a new blog</li>
        <li>Learn something useful</li>
      </ul>

      <p>
      — Abdul Barr
      </p>

      </div>
      `
    });

    res.send("Email confirmed. Welcome!");

  } catch (error) {
    console.error(error);
    res.send("Something went wrong");
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