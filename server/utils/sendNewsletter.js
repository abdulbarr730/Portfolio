const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendNewsletter = async (emails, title, link) => {
  try {
    await resend.emails.send({
      from: `Abdul Barr <${process.env.EMAIL_FROM}>`,
      to: emails,
      subject: `New Blog: ${title}`,
      html: `
        <h2>${title}</h2>
        <p>I just published a new blog.</p>
        <a href="${link}">Read here</a>
      `
    });

  } catch (error) {
    console.error("Resend error:", error);
  }
};

module.exports = sendNewsletter;