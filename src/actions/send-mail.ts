import nodemailer from 'nodemailer';
import smtpTransport from "nodemailer-smtp-transport";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: EmailOptions): Promise<void> {
   // Enhanced error logging and configuration
   if (!process.env.PUBLIC_GMAIL_SMTP_USER) {
    console.error('SMTP User is not defined');
    throw new Error('SMTP User environment variable is missing');
  }

  if (!process.env.PUBLIC_GMAIL_SMTP_PASSWORD) {
    console.error('SMTP Password is not defined');
    throw new Error('SMTP Password environment variable is missing');
  }

   console.log('Attempting to send email with:', {
    service: 'gmail',
    user: process.env.PUBLIC_GMAIL_SMTP_USER || 'No user found',
    toEmail: to,
    subject: subject
  });

  // Use less secure app method or generate an App Password
  const transporter = nodemailer.createTransport(
  // {
  //   host: 'smtp.gmail.com',  
  //   auth: {
  //     user: process.env.PUBLIC_GMAIL_SMTP_USER,
  //     pass: process.env.PUBLIC_GMAIL_SMTP_PASSWORD,
  //   },
  //   // Add secure connection options
  //   secure: true,
  //   requireTLS: true,
  //   port: 465
  // }
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
    console.log('Email sent successfully:', info);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
