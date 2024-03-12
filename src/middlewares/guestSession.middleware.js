const { v4: uuidv4 } = require('uuid')

/**
 * Middleware that checks for a guest session cookie.
 * If no guest session cookie exists, generates a new
 * unique ID and sets a guest session cookie with that ID.
 */
const guestSession = (req, res, next) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  if (!req.cookies.guestSessionId) {
    const guestSessionId = uuidv4()
    res.cookie('guestSessionId', guestSessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: maxAge,
    })
  }
  next()
}

module.exports = guestSession
