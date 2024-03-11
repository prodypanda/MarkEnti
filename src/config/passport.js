const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user.model')

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
          return done(null, false, { message: 'Incorrect email.' })
        }

        const isMatch = await user.verifyPassword(password)
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password.' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: false
}

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id).populate('role') // Modified line
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (error) {
      return done(error, false)
    }
  })
)

module.exports = passport
