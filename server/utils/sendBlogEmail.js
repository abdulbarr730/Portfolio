const { Resend } = require("resend");
const Subscriber = require("../models/subscriber.model");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBlogEmail = async (title, link, description) => {
  try {

    const subscribers = await Subscriber.find();

    const emails = subscribers.map(sub => sub.email);

    if (!emails.length) return;

    const response = await resend.emails.send({
      from: "Abdul Barr <updates@abdulbarr.in>",
      to: emails,
      subject: `New Blog: ${title}`,
      html: `
      <div style="font-family: sans-serif; max-width:600px; margin:auto;">
      
        <h2>New Blog Published 🚀</h2>

        <h3>${title}</h3>

        <p>${description}</p>

        <a 
          href="${link}"
          style="background:black;color:white;padding:10px 16px;
          text-decoration:none;border-radius:6px;">
          Read Blog
        </a>

        <br/><br/>

        <p>— Abdul Barr</p>

      </div>
      `
    });

    console.log("Newsletter sent:", response);

  } catch (error) {
    console.error("Newsletter error:", error);
  }
};

module.exports = sendBlogEmail;