const rateLimit = require('express-rate-limit')

// Define the rate limit rule
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
})

module.exports = {
  apiLimiter,
}
