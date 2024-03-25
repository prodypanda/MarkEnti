const { v4: uuidv4 } = require('uuid')

/**
 * Middleware to handle guest sessions.
 * - Checks if guest session cookie exists.
 * - If not, generates a new guest session ID and CSRF token and sets cookies.
 * - Calls next() to continue request processing.
 */
const guestSession = async (req, res, next) => {
  const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  if (!req.cookies['XSRF-TOKEN']) {
    const csrfToken = uuidv4()
    await res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      sameSite: 'lax',
      maxAge
    })
    console.log('XSRF-TOKEN not found, generating new one')
    console.log('req.cookies.XSRF-TOKEN= ' + csrfToken)
    req.csrfToken = csrfToken
    // return res.json({
    //   state: 'new',
    //   msg: 'XSRF-TOKEN not found, generating new one',
    //   'XSRF-TOKEN': csrfToken,
    // })
  } else {
    console.log('req.cookies.XSRF-TOKEN= ' + req.cookies['XSRF-TOKEN'])
    req.csrfToken = req.cookies['XSRF-TOKEN']
  }

  next()
}

module.exports = guestSession
