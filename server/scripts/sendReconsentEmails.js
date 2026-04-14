require("dotenv").config();

const mongoose = require("mongoose");
const { Resend } = require("resend");
const Subscriber = require("../models/subscriber.model");
const crypto = require("crypto");

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 CHANGE THIS WHEN POLICY CHANGES
const CURRENT_CONSENT_VERSION = 2;

const run = async () => {

  await mongoose.connect(process.env.MONGO_URI);

  const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

  const outdatedUsers = await Subscriber.find({
    isVerified: true,
    $or: [
        { consentVersion: { $lt: CURRENT_CONSENT_VERSION } },
        { consentVersion: { $exists: false } }
    ]
    });

  console.log("Users needing re-consent:", outdatedUsers.length);

  for (const user of outdatedUsers) {

    const token = crypto.randomBytes(32).toString("hex");

    user.token = token;
    await user.save();

    const confirmUrl = `${base}/api/confirm/${token}`;

    await resend.emails.send({
      from: "Abdul Barr <newsletter@abdulbarr.in>",
      to: user.email,
      subject: "Action required: Confirm your subscription",
      html: `
      <div style="font-family: system-ui, sans-serif; max-width:600px; margin:auto; line-height:1.6; padding:20px;">

      <p>Hi,</p>

      <p>We've updated our <strong>Privacy Policy</strong> and <strong>Terms & Conditions</strong>.</p>

      <p>You can review them here:</p>

      <p>
        <a href="${base}/privacy">Privacy Policy</a><br/>
        <a href="${base}/terms">Terms & Conditions</a>
      </p>

      <p><strong>Action required:</strong> Please confirm your subscription to continue receiving updates.</p>

      <p>If you do not confirm, you will stop receiving future emails.</p>

      <p>
      <a href="${confirmUrl}"
      style="display:inline-block;background:#000;color:#fff;padding:10px 14px;text-decoration:none;border-radius:6px;">
      Re-confirm Subscription
      </a>
      </p>

      <hr style="margin:20px 0;" />

      <p style="font-size:12px;color:#666;">
      You're receiving this because you subscribed at abdulbarr.in
      </p>

      <p style="font-size:12px;color:#666;">
      This email is not monitored. For any queries, contact: hello@abdulbarr.in
      </p>

      </div>
      `
    });

  }

  console.log("Re-consent emails sent");
  process.exit();
};

run();