const { Resend } = require("resend");
const Subscriber = require("../models/subscriber.model");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBlogEmail = async (title, link, description) => {
  try {

    const subscribers = await Subscriber.find({
      isVerified: true
    });

    if (!subscribers.length) return;

    const base = process.env.CLIENT_ORIGIN?.replace(/\/$/, "");

    for (const sub of subscribers) {

      const unsubscribeUrl =
        `${base}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`;

      await resend.emails.send({
        from: "Abdul Barr <updates@abdulbarr.in>",
        to: sub.email,
        subject: `New Blog: ${title}`,
        html: `
        <div style="font-family: sans-serif; max-width:600px; margin:auto; line-height:1.6;">
        
          <h2>New Blog Published</h2>

          <h3>${title}</h3>

          <p>${description}</p>

          <a 
            href="${link}"
            style="background:black;color:white;padding:10px 16px;
            text-decoration:none;border-radius:6px;">
            Read Blog
          </a>

          <br/><br/>

          <hr style="margin:20px 0;" />

          <p style="font-size:12px;color:#666;">
            You're receiving this because you subscribed at abdulbarr.in
          </p>

          <p style="font-size:12px;">
            <a href="${unsubscribeUrl}"
            style="color:#666;text-decoration:underline;">
            Unsubscribe
            </a>
          </p>

          <p>— Abdul Barr</p>

        </div>
        `
      });

    }

  } catch (error) {
    console.error("Newsletter error:", error);
  }
};

module.exports = sendBlogEmail;