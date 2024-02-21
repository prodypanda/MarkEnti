const { check, validationResult } = require('express-validator')

module.exports = [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('email').isEmail().withMessage('Must be a valid email address'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
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
