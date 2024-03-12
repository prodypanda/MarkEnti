const mongoSanitize = require('express-mongo-sanitize')

/**
 * Sanitizes request data against NoSQL query injection attacks using express-mongo-sanitize.
 * Replaces any keys starting with '$' or containing '.' with '_'. This prevents malicious queries.
 */
module.exports = function sanitize () {
  return mongoSanitize({
    replaceWith: '_'
  })
}
