import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.PUBLIC_GMAIL_SMTP_USER,
        pass: process.env.PUBLIC_GMAIL_SMTP_PASSWORD,
      },
    })
  );

  const mailOptions = {
    from: process.env.PUBLIC_GMAIL_SMTP_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
