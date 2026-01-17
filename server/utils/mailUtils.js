import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // your@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // app password
  }
});

export async function sendMail({
  to,
  subject,
  text,
  html,
  from = `"No Reply" <${process.env.GMAIL_USER}>`
}) {
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Gmail Send Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

