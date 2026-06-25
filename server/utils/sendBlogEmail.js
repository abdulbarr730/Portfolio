const { Resend } = require("resend");
const Subscriber = require("../models/subscriber.model");

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to pause execution (throttle)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to split an array into chunks
const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const sendBlogEmail = async (title, link, description) => {
  try {
    const subscribers = await Subscriber.find({ isVerified: true });
    if (!subscribers.length) return;

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "");

    // 1. Map all subscribers to their unique email payloads
    const emailPayloads = subscribers.map((sub) => {
      const unsubscribeUrl = `${base}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`;

      return {
        from: "Abdul Barr <updates@abdulbarr.in>",
        to: sub.email,
        subject: `New Blog: ${title}`,
        html: `
        <div style="font-family: sans-serif; max-width:600px; margin:auto; line-height:1.6;">
          <h2>New Blog Published</h2>
          <h3>${title}</h3>
          <p>${description}</p>
          <a href="${link}" style="background:black;color:white;padding:10px 16px; text-decoration:none;border-radius:6px;">
            Read Blog
          </a>
          <br/><br/>
          <hr style="margin:20px 0;" />
          <p style="font-size:12px;color:#666;">
           This email is not monitored. For any queries, contact: hello@abdulbarr.in
          </p>
          <p style="font-size:12px;color:#666;">
            You're receiving this because you subscribed at abdulbarr.in
          </p>
          <p style="font-size:12px;">
            <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">
            Unsubscribe
            </a>
          </p>
          <p>— Abdul Barr</p>
        </div>
        `
      };
    });

    // 2. Split the massive array into chunks of 100 (Resend's Batch Limit)
    const BATCH_SIZE = 100;
    const batches = chunkArray(emailPayloads, BATCH_SIZE);

    console.log(`Preparing to send ${emailPayloads.length} emails in ${batches.length} batches.`);

    // 3. Process each batch sequentially
    for (let i = 0; i < batches.length; i++) {
      try {
        // Use the Batch API endpoint instead of the standard send endpoint
        const { data, error } = await resend.batch.send(batches[i]);

        if (error) {
          console.error(`Batch ${i + 1} failed:`, error);
          // Do not throw; let the next batch attempt to send
        } else {
          console.log(`Batch ${i + 1} sent successfully.`);
        }

        // 4. Rate Limit Protection: Sleep for 1 second between batches
        // Since limit is 2 API req/s, 1 request per second keeps you extremely safe
        if (i < batches.length - 1) {
          await sleep(1000); 
        }

      } catch (batchError) {
        // If a network error occurs on this specific batch, log it but don't crash the whole job
        console.error(`Network error on Batch ${i + 1}:`, batchError);
      }
    }

    console.log("Newsletter broadcast complete.");

  } catch (error) {
    // This now only catches severe database/initialization errors
    console.error("Critical Newsletter error:", error);
  }
};

module.exports = sendBlogEmail;