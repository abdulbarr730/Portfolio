const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");
const Parser = require("rss-parser");
const crypto = require("crypto");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose"); // Required for ID validation

const CURRENT_CONSENT_VERSION = 2;
const resend = new Resend(process.env.RESEND_API_KEY);
const parser = new Parser();
const router = express.Router();
const MEDIUM_RSS_URL = "https://medium.com/feed/@abdulbarr730";

// =========================
// RATE LIMITER DEFENSE
// =========================
// Protects Resend account from bot attacks (Max 5 requests per 15 minutes per IP)
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { 
    success: false, 
    message: "Too many subscription attempts from this IP. Please try again later." 
  }
});


// =========================
// SUBSCRIBE
// =========================
router.post("/subscribe", subscribeLimiter, async (req, res) => {
  try {
    let { email, consent } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (!consent) {
      return res.status(400).json({ success: false, message: "Consent is required" });
    }

    email = email.trim().toLowerCase();
    const existing = await Subscriber.findOne({ email });
    let token;

    if (existing) {
      if (existing.isVerified) {
        existing.consent = true;
        existing.consentAt = new Date();
        existing.consentVersion = CURRENT_CONSENT_VERSION;
        await existing.save();

        return res.json({
          success: true,
          message: "You're already subscribed. Your consent has been updated."
        });
      } else {
        token = crypto.randomBytes(32).toString("hex");
        existing.token = token;
        existing.consent = true;
        existing.consentAt = new Date();
        existing.consentVersion = CURRENT_CONSENT_VERSION;
        await existing.save();
      }
    } else {
      token = crypto.randomBytes(32).toString("hex");
      await Subscriber.create({
        email,
        token,
        isVerified: false,
        consent: true,
        consentAt: new Date(),
        consentVersion: CURRENT_CONSENT_VERSION
      });
    }

    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
    const confirmUrl = `${base}/api/confirm/${token}`;

    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: email,
      subject: "Confirm your subscription",
      html: `
      <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6; padding:20px;">
        <p>Hi,</p>
        <p>You requested to subscribe to updates from <strong>abdulbarr.in</strong>.</p>
        <p>Please confirm your email to start receiving updates on projects, blogs, and development insights.</p>
        <p>
          <a href="${confirmUrl}" style="display:inline-block;background:#000;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">
          Confirm Subscription
          </a>
        </p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <hr style="margin:20px 0;" />
        <p style="font-size:12px;color:#666;">This email is not monitored. For any queries, contact: hello@abdulbarr.in</p>
      </div>
      `
    });

    return res.json({
      success: true,
      message: "Please check your email to confirm subscription"
    });

  } catch (error) {
    console.error("[POST /subscribe] Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// =========================
// CONFIRM
// =========================
router.get("/confirm/:token", async (req, res) => {
  const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
  
  try {
    const subscriber = await Subscriber.findOne({ token: req.params.token });

    if (!subscriber) {
      return res.redirect(`${base}/newsletter/confirmed?status=error`);
    }

    if (subscriber.isVerified && subscriber.consentVersion === CURRENT_CONSENT_VERSION) {
      return res.redirect(`${base}/newsletter/confirmed?status=success`);
    }

    subscriber.isVerified = true;
    subscriber.token = null;
    subscriber.expiresAt = null;
    subscriber.consent = true;
    subscriber.consentAt = new Date();
    subscriber.consentVersion = CURRENT_CONSENT_VERSION;

    await subscriber.save();

    let blogHtml = "<li>Check latest blogs on the website</li>";

    // Non-blocking RSS fetch with a strict 3-second timeout to prevent server hangs
    try {
      const fetchPromise = parser.parseURL(MEDIUM_RSS_URL);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('RSS Timeout')), 3000));
      
      const feed = await Promise.race([fetchPromise, timeoutPromise]);
      const topBlogs = feed.items.slice(0, 3);

      blogHtml = topBlogs.map(blog => `
        <li>
          <a href="${blog.link}">${blog.title}</a>
        </li>
      `).join("");
    } catch (rssError) {
      console.warn("[GET /confirm] RSS Fetch failed or timed out. Proceeding without latest blogs.");
    }

    // CRITICAL FIX: Unsubscribe uses database _id, NOT raw email
    const unsubscribeUrl = `${base}/api/unsubscribe?id=${subscriber._id}`;

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
          <a href="https://abdulbarr.in/projects" style="background:black;color:white;padding:10px 14px;text-decoration:none;border-radius:6px;">
          View Project
          </a>
          <hr style="margin:25px 0;" />
          <h3>Top Blogs</h3>
          <ul>${blogHtml}</ul>
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
          <p style="font-size:12px;color:#666;">This email is not monitored. For any queries, contact: hello@abdulbarr.in</p>
          <p>— Abdul Barr</p>
          <p style="font-size:12px;color:#666;">You're receiving this because you subscribed at abdulbarr.in</p>
          <p style="font-size:12px;">
            <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">Unsubscribe</a>
          </p>
        </div>
        `
      });
    } catch (emailError) {
      console.error("[GET /confirm] Failed to send welcome email:", emailError);
    }

    return res.redirect(`${base}/newsletter/confirmed?status=success`);

  } catch (error) {
    console.error("[GET /confirm] Fatal Error:", error);
    return res.redirect(`${base}/newsletter/confirmed?status=error`);
  }
});


// =========================
// UNSUBSCRIBE
// =========================
router.get("/unsubscribe", async (req, res) => {
  const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
  
  try {
    const { id } = req.query;

    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).send("Invalid unsubscribe request");
    }

    // CRITICAL FIX: Delete by ID, not email. Prevents mass-deletion attacks.
    await Subscriber.findByIdAndDelete(id);

    return res.redirect(`${base}/newsletter/unsubscribed`);

  } catch (error) {
    console.error("[GET /unsubscribe] Error:", error);
    return res.status(500).send("Something went wrong processing your request.");
  }
});


// =========================
// GET SUBSCRIBERS
// =========================
router.get("/subscribers", async (req, res) => {
  try {
    // CRITICAL FIX: Locked down endpoint. Requires x-api-key header.
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      console.warn("[GET /subscribers] Unauthorized access attempt.");
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const subscribers = await Subscriber.find({
      isVerified: true,
      consentVersion: CURRENT_CONSENT_VERSION
    })
    .select("-token") // Do not return raw tokens to the client
    .sort({ subscribedAt: -1 });

    return res.json({
      success: true,
      count: subscribers.length,
      subscribers
    });

  } catch (error) {
    console.error("[GET /subscribers] Error:", error);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;