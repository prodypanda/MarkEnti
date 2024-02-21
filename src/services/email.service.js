const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transport = nodemailer.createTransport({
  logger: true, // enable logging
  debug: true, // include SMTP traffic in the logs
  host: process.env.EMAIL_SMTP_HOST,
  port: process.env.EMAIL_SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_SMTP_USERNAME,
    pass: process.env.EMAIL_SMTP_PASSWORD
  }
});

const sendEmail = async ({ from, to, subject, text, html, headers, priority}) => {
  const mailOptions = { from, to, subject, text, html, headers, priority};

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error when sending email to ${to}: `, error);
  }
};

module.exports = {
  sendEmail,
};