require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log("Testing email with user:", process.env.EMAIL_USER || "(undefined)");
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ ERROR: EMAIL_USER or EMAIL_PASS is missing from your .env file!");
    console.log("Please add them to backend/.env like this:");
    console.log("EMAIL_USER=your_email@gmail.com");
    console.log("EMAIL_PASS=your_app_password");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log("Attempting to send a test email to yourself...");

  try {
    const info = await transporter.sendMail({
      from: `"Founder OS Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "✅ Nodemailer Test Successful",
      text: "If you are receiving this, your nodemailer configuration is working perfectly!",
    });
    console.log("✅ SUCCESS! Email sent:");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("\n❌ FAILED to send email.");
    console.error(error.message);
    if (error.responseCode === 535) {
      console.log("\n--- TROUBLESHOOTING ---");
      console.log("You received a 535 Bad Credentials error.");
      console.log("To fix this for Gmail, you CANNOT use your regular Gmail password.");
      console.log("You must generate an 'App Password':");
      console.log("1. Go to your Google Account settings -> Security");
      console.log("2. Enable 2-Step Verification if it isn't already.");
      console.log("3. Search for 'App passwords' in your Google Account search bar.");
      console.log("4. Generate a new app password and paste it as EMAIL_PASS in your backend/.env file.");
      console.log("NOTE: Do not put spaces in your app password in the .env file.");
    }
  }
}

testEmail();
