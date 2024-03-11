const mongoSanitize = require('express-mongo-sanitize')

module.exports = function sanitize () {
  return mongoSanitize({
    replaceWith: '_'
  })
}
