import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendMail({ to, subject, text }: EmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: import.meta.env.BREVO_SMTP_USER,
      pass: import.meta.env.BREVO_SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: import.meta.env.BREVO_SMTP_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
