import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: EmailOptions): Promise<void> {
   // Enhanced error logging and configuration
   console.log('Attempting to send email with:', {
    service: 'gmail',
    user: process.env.PUBLIC_GMAIL_SMTP_USER || 'No user found',
    toEmail: to,
    subject: subject
  });

  // Use less secure app method or generate an App Password
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.PUBLIC_GMAIL_SMTP_USER,
      pass: process.env.PUBLIC_GMAIL_SMTP_PASSWORD,
    },
    // Add secure connection options
    secure: true,
    requireTLS: true,
    port: 465
  });

  const mailOptions = {
    from: import.meta.env.PUBLIC_GMAIL_SMTP_USER,
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
