const csurf = require('csurf')

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production'
  }
})

module.exports = {
  csrfProtection
}
