import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMail({
  to,
  subject,
  text,
  html,
  from = `"No Reply" <${process.env.SMTP_USER}>`
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
    console.error('SMTP Send Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
