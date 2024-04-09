const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user.model')
const logger = require('logger').createLogger('development.log') // logs to a file
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        // skipcq: JS-0240
        console.log('start passport.use - LocalStrategy')
        const user = await User.findOne({ email: email }).select('+password')
        if (!user) {
          console.log('passport.use - !user')
          return done(null, false, { message: 'Incorrect email.' })
        }

        const isMatch = await user.verifyPassword(password)
        if (!isMatch) {
          console.log('passport.use - !isMatch')
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
  passReqToCallback: true,
  ignoreExpiration: false,
}

/**
 * This middleware verifies a JWT token and passes the payload to the next middleware
 * if the token is valid.
 *
 * @param {Object} opts - The options for the JWT strategy.
 * @param {Function} opts.jwtFromRequest - A function that extracts the JWT token from the request.
 * @param {string} opts.secretOrKey - The secret or public key to verify the token's signature.
 * @param {boolean} [opts.passReqToCallback=false] - If true, `req` is the first argument to the verify callback.
 * @param {Function} verify - The verify callback that gets called with the decoded JWT.
 *
 * @returns {Function} - The passport middleware function.
 */
passport.use(
  new JwtStrategy(opts, async (req, jwt_payload, done) => {
    try {
      // 'fatal', 'error', 'warn', 'info', 'debug'
      // logger.setLevel('info')
      // Log the execution of this middleware
      logger.info({ /*req,*/ jwt_payload }, 'Executing JWT strategy.')

      // Find the user by its ID
      const user = await User.findById(jwt_payload.id)
        .populate('roles')
        .lean()
        .exec()

      // If the user is not found, return done with an error and a flag indicating no token was provided
      if (!user) {
        logger.warn(`No user found with ID '${jwt_payload.id}'.`)
        return done(null, false, { message: 'Incorrect user.' }, false)
      } else {
        // Log the found user
        logger.info(
          { user },
          `User found with ID '${jwt_payload.id}': email '${user.email}' and username '${user.username}'.`
        )
      }

      // Check if the user is active
      if (!user.active) {
        logger.warn(`User with ID '${jwt_payload.id}' is not active.`)
        return done(null, false, { message: 'User is not active.' }, false)
      }

      // Check if the user has a valid role
      if (!user.roles || !user.roles._id) {
        logger.warn(`User with ID '${jwt_payload.id}' has no valid roles.`)
        return done(null, false, { message: 'User has no valid roles.' }, false)
      } else {
        logger.info(
          `User with ID '${jwt_payload.id}' has a roles '${user.roles._id}' named '${user.roles.name}'.`
        )
      }

      // Check if the user's IP is the same as the IP in the JWT payload
      // if (user.ip !== req.ip) {
      //   logger.warn(
      //     `User with ID '${jwt_payload.id}' IP '${user.ip}' does not match request IP '${req.ip}'.`
      //   )
      //   return done(null, false, { message: 'Incorrect IP.' }, false)
      // }

      // Return done with the user and a flag indicating a token was provided
      return done(null, user, { message: 'Success!' }, true)
    } catch (error) {
      // Log the error
      logger.error({ error }, 'Error verifying JWT token.')

      // Return done with the error and a flag indicating no token was provided
      return done(error, false, { message: 'Incorrect token.' }, false)
    }
  })
)

module.exports = passport
