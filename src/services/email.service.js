const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

/**
 * Configures and returns a Nodemailer transport instance for sending emails.
 * Uses SMTP with credentials loaded from environment variables.
 */
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
})

/**
 * Sends an email using the configured Nodemailer transporter.
 *
 * @param {Object} options - Email options
 * @param {string} options.from - Sender email address
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plaintext email body
 * @param {string} options.html - HTML email body
 * @param {Object} options.headers - Custom headers
 * @param {string} options.priority - Priority of the email (high, normal, low)
 */
const sendEmail = async ({
  from,
  to,
  subject,
  text,
  html,
  headers,
  priority
}) => {
  const mailOptions = { from, to, subject, text, html, headers, priority }

  try {
    await transport.sendMail(mailOptions)
    console.log(`Email sent to ${to}`)
  } catch (error) {
    console.error(`Error when sending email to ${to}: `, error)
  }
}

module.exports = {
  sendEmail
}
