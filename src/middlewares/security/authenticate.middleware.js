const passport = require('passport')

// exports.isAuthenticated = passport.authenticate('jwt', { session: false, failWithError: false })

exports.isAuthenticated = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false, failWithError: true },
    (err, user, info) => {
      if (err) {
        return next(err)
      } // Handle general errors
      if (!user) {
        return res.status(401).json({
          message: 'You do not have access to this resource, please login.'
        })
      }
      req.user = user // Attach the user to the request
      next() // Continue to the next middleware or route handler
    }
  )(req, res, next)
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
