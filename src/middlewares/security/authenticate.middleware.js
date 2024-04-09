const passport = require('passport')
const logger = require('logger').createLogger('development.log') // logs to a file

// exports.authMiddleware = passport.authenticate('jwt', { session: false, failWithError: false })

exports.authMiddleware = async (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false, failWithError: true },
    (err, user, info, isAuthenticated) => {
      if (!req.headers.authorization) {
        req.auth = false
        return next()
      }

      console.log('startauthMiddleware')
      console.log('--------------')
      console.log('--------------')

      console.log('req.headers.authorization: ' + req.headers.authorization)
      console.log('agagagag')
      if (err) {
        req.auth = false
        console.log('err')
        return next(err)
      }
      if (!user) {
        console.log('!user')
        console.log(info.message)
        req.auth = false
        return res.status(401).json({ message: info.message })
      }
      console.log('info.message: ' + info.message)
      req.auth = true
      req.user = user
      console.log('req.user._id= ' + req.user._id)
      console.log('--------------')
      console.log('--------------')
      console.log('endauthMiddleware')
      next()
    }
  )(req, res, next)
}

exports.isAuthenticated = (req, res, next) => {
  return passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err)
      return false
    }

    if (!user) {
      console.log('not authenticated')
      return false
    }
    console.log('authenticated')
    req.user = user

    return true
  })(req, res, next)
}

// second solution
// const jwt = require('jsonwebtoken'); //you need to install jsonwebtoken first
// require('dotenv').config();
// exports.verifyToken  = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (err) {
//         res.status(400).json({ error: 'Invalid token.' });
//     }
//   };
