require("dotenv").config();
const mongoose = require("mongoose");
const { Resend } = require("resend");
const Subscriber = require("../models/subscriber.model");
const crypto = require("crypto");

const resend = new Resend(process.env.RESEND_API_KEY);
const CURRENT_CONSENT_VERSION = 2;

// Helper to pause execution
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to split arrays into chunks
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected.");

    const base = (process.env.CLIENT_ORIGIN || "http://localhost:3000").replace(/\/$/, "");

    const outdatedUsers = await Subscriber.find({
      isVerified: true,
      $or: [
        { consentVersion: { $lt: CURRENT_CONSENT_VERSION } },
        { consentVersion: { $exists: false } }
      ]
    });

    if (!outdatedUsers.length) {
      console.log("No users need re-consent. Exiting.");
      process.exit(0);
    }

    console.log(`Found ${outdatedUsers.length} users needing re-consent.`);

    // 1. Generate tokens and prepare Bulk DB operations & Email Payloads
    const bulkDbOps = [];
    const emailPayloads = [];

    for (const user of outdatedUsers) {
      const token = crypto.randomBytes(32).toString("hex");
      const confirmUrl = `${base}/api/confirm/${token}`;

      // Prepare DB update
      bulkDbOps.push({
        updateOne: {
          filter: { _id: user._id },
          update: { $set: { token: token } }
        }
      });

      // Prepare Email payload
      emailPayloads.push({
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
            <a href="${confirmUrl}" style="display:inline-block;background:#000;color:#fff;padding:10px 14px;text-decoration:none;border-radius:6px;">
              Re-confirm Subscription
            </a>
          </p>
          <hr style="margin:20px 0;" />
          <p style="font-size:12px;color:#666;">You're receiving this because you subscribed at abdulbarr.in</p>
          <p style="font-size:12px;color:#666;">This email is not monitored. For any queries, contact: hello@abdulbarr.in</p>
        </div>
        `
      });
    }

    // 2. Execute DB updates in ONE network call using bulkWrite
    console.log("Saving new tokens to database...");
    await Subscriber.bulkWrite(bulkDbOps);
    console.log("Tokens saved successfully.");

    // 3. Chunk emails and send via Batch API with Rate Limit protection
    const BATCH_SIZE = 100;
    const batches = chunkArray(emailPayloads, BATCH_SIZE);

    console.log(`Sending emails in ${batches.length} batches...`);

    for (let i = 0; i < batches.length; i++) {
      try {
        const { data, error } = await resend.batch.send(batches[i]);

        if (error) {
          console.error(`❌ Batch ${i + 1} failed via API:`, error);
        } else {
          console.log(`✅ Batch ${i + 1} sent successfully.`);
        }

        // Rate Limit Protection (1 request per second)
        if (i < batches.length - 1) {
          await sleep(1000); 
        }

      } catch (batchError) {
        console.error(`🚨 Critical network error on Batch ${i + 1}:`, batchError);
      }
    }

    console.log("Process complete.");

  } catch (error) {
    console.error("Fatal script error:", error);
  } finally {
    // 4. Always disconnect the DB gracefully
    await mongoose.disconnect();
    console.log("Database disconnected.");
    process.exit(0);
  }
};

run();