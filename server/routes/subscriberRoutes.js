const express = require("express");
const Subscriber = require("../models/subscriber.model");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const router = express.Router();

// Email validation
const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

  return regex.test(email);
};


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

    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed"
      });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send Welcome Email
    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: email,
      subject: "You're subscribed 🎉",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; line-height: 1.6; padding: 20px;">

        <h2 style="margin-bottom: 10px;">You're in 🚀</h2>

        <p>Hey,</p>

        <p>Glad you subscribed. I only send useful stuff — no spam.</p>

        <p>Here's what you'll get:</p>

        <ul>
            <li>Real projects I'm building</li>
            <li>How I build them (architecture & decisions)</li>
            <li>Useful dev + AI insights</li>
        </ul>

        <hr style="margin: 25px 0;" />

        <h3>🔥 Latest Project</h3>

        <p><strong>College Hackathon Management Platform</strong></p>

        <p>A multi-college SaaS platform to manage hackathons, teams, judging, and submissions.</p>

        <p>
            <a href="https://abdulbarr.in/projects" 
            style="background:#000;color:#fff;padding:10px 16px;text-decoration:none;border-radius:6px;">
            View Project
            </a>
        </p>

        <hr style="margin: 25px 0;" />

        <h3>📚 Top Blogs</h3>

        <ul>
            <li>
            <a href="https://abdulbarr.in/blog">
                Building a Multi-Tenant SaaS from Scratch
            </a>
            </li>
            <li>
            <a href="https://abdulbarr.in/blog">
                JWT Auth Done Right (With Real Example)
            </a>
            </li>
            <li>
            <a href="https://abdulbarr.in/blog">
                How I Built My Portfolio (Architecture)
            </a>
            </li>
        </ul>

        <hr style="margin: 25px 0;" />

        <h3>💻 Check My Code</h3>

        <p>
            I share real projects and architecture decisions on GitHub.
        </p>

        <p>
            <a href="https://github.com/abdulbarr730"
            style="background:#f3f3f3;color:#000;padding:10px 16px;text-decoration:none;border-radius:6px;">
            Visit GitHub
            </a>
        </p>

        <hr style="margin: 25px 0;" />

        <h3>📬 What to Expect</h3>

        <p>
            I'll email you when:
        </p>

        <ul>
            <li>I launch a new project</li>
            <li>I publish a new blog</li>
            <li>I learn something useful worth sharing</li>
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