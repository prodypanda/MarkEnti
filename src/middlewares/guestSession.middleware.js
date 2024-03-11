const { v4: uuidv4 } = require('uuid')

const guestSession = (req, res, next) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  if (!req.cookies.guestSessionId) {
    const guestSessionId = uuidv4()
    res.cookie('guestSessionId', guestSessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge
    })
  }
  next()
}

module.exports = guestSession
