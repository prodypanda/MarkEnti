const { v4: uuidv4 } = require('uuid')

/**
 * Middleware to handle guest sessions.
 * - Checks if guest session cookie exists.
 * - If not, generates a new guest session ID and CSRF token and sets cookies.
 * - Calls next() to continue request processing.
 */
exports.guestSessionMiddleware = async (req, res, next) => {
  // Check if user is authenticated or not
  // If authenticated, skip guest session handling and continue request processing
  // If not authenticated, generate a new guest session ID and CSRF token and set cookies
  // If guest session cookie exists, continue request processing
  // If guest session cookie does not exist, generate a new guest session ID and CSRF token and set cookies
  console.log('startguestSessionMiddleware')
  console.log('req.auth: ' + req.auth)
  try {
    if (!req.auth) {
      // Check if guest session cookie exists
      console.log('guest user')

      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
      if (!req.cookies['XSRF-TOKEN']) {
        console.log('XSRF-TOKEN not found, generating new one')
        const csrfToken = uuidv4()
        await res.cookie('XSRF-TOKEN', csrfToken, {
          httpOnly: false,
          sameSite: 'lax',
          maxAge
        })

        console.log('csrfToken= ' + csrfToken)
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
    } else {
      console.log('user authenticated')
    }

    console.log('endguestSessionMiddleware')
    next()
  } catch (error) {
    next(error)
  }
}
