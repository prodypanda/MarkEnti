const rateLimit = require('express-rate-limit')

// Define the rate limit rule
/**
 * Rate limiting middleware for API routes
 * Uses the express-rate-limit module to limit requests per IP
 * Limits requests to 200 per 15 minute window
 * Returns 429 Too Many Requests error with custom message after limit reached
 */

const timePerMinute = 15 * 60 * 1000 // 15 minutes
const errorMessage = `Too many requests from this IP address (200 requests per 15 minutes), please try again after ${timePerMinute / 1000 / 60} minutes`
const apiLimiter = rateLimit({
  windowMs: timePerMinute,
  max: 200, // limit each IP to 200 requests per windowMs
  message: errorMessage,
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  standardHeaders: 'draft-7'
  // standardHeaders: true,
  // validate: {
  //   ip: false,
  //   default: true,
  // },
})

module.exports = {
  apiLimiter
}

// const handleRateLimitExceeded = (req, res, next) => {
//   res.status(429).json({ error: 'Too many requests from this IP, please try again after 15 minutes' });
// };

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // limit each IP to 100 requests per windowMs
//   handler: handleRateLimitExceeded,
// })
