const passport = require('passport')

exports.isAuthenticated = passport.authenticate('jwt', { session: false })
