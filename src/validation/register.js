const { check, validationResult } = require('express-validator')
const User = require('../models/user.model')

// Register validation
module.exports = [
  check('username').not().isEmpty().withMessage('Username is required').trim().escape().isLength({ min: 4, max: 20 }).withMessage('Username must be between 4 and 20 characters')
  .custom(async value => {
    const existingUser = await User.findOne({username:value});
    if (existingUser) {
      throw new Error('A user already exists with the same username, please choose another username');
    }
  }),
  check('email').trim().isEmail().withMessage('Must be a valid email address').escape()
  .custom(async value => {
    const existingUser = await User.findOne({email:value});
    if (existingUser) {
      throw new Error('A user already exists with this e-mail address, please choose another e-mail address');
    }
  }),
  check('role').optional().trim().custom((value) => {
    if (['root', 'admin', 'manager', 'customer', 'guest'].includes(value)) {
      return true; // Validation succeeded
    }
    throw new Error('role is not valid'); // Throw error if validation fails
  }),
  check('password').trim()
    .not()
    .isEmpty()
    .withMessage('Password is required')
    .isLength({ min: process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6 })
    .withMessage(`Password must be at least ${process.env.REGISTERATION_PASSWORD_MIN_LENGTH || 6} characters`),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {

      if (process.env.NODE_ENV === 'production') {

        return res.status(422).json({ errors: errors.array() })

      } else if (process.env.NODE_ENV === 'dev') {

        // Modify the errors array to exclude "value" and "location"
        const filteredErrors = errors.array().map((error) => {
          return {
            type: 'field',
            msg: error.msg,
            path: error.path, // "param" is the field name, equivalent to your desired "path".
            // Comment out or remove both "value" and "location" as they are not needed in the response.
            // value: error.value,       // This line can be removed as you don't want value in the response.
            // location: error.location, // This line can be removed as you don't want location in the response.
          }
        })

        // Send the modified error response
        return res.status(422).json({ errors: filteredErrors })

      } else {

        return res.status(500).json({ errors: 'server error 500 - Code*447101' })

      }

    }
    next()
  },
]
