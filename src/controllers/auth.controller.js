const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const passport = require('passport')

/**
 * Register a new user in the system.
 * @param {object} req - The request object containing the new user's details.
 * @param {object} res - The response object to send back the HTTP response.
 */
exports.register = async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'Register a new user in the system.'
  // #swagger.description = 'Registers a new user in the system with the provided username, email, and password.'
  // #swagger.operationId = 'register'

  try {
    const { username, email, password } = req.body

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username })
    const existingEmail = await User.findOne({ email })

    if (existingUsername) {
      return res.status(400).send({ error: 'Username already exists' })
    }

    if (existingEmail) {
      return res.status(400).send({ error: 'Email already exists' })
    }

    // Create and save new user
    const user = new User({ username, email, password })
    await user.save()

    // Send success response
    return res.status(201).send({ message: 'User registered successfully' })
  } catch (error) {
    // Handle other errors
    return res.status(500).send({ error: error.message })
  }
}

/**
 * Authenticates a user with local strategy and issues JWT token if valid.
 *
 * Authenticates the user with passport local strategy.
 * If valid user, creates JWT payload with user ID and role.
 * Signs and returns JWT token in response with user object.
 *
 * @param {object} req - The request object containing the user's credentials.
 * @param {object} res - The response object to send back the HTTP response with the JWT token.
 * @returns {Object} - A JSON response containing the authenticated user's ID, username, role, and a JWT token.
 */
// skipcq: JS-0045, JS-0045
exports.login = async (req, res) => {
  try {
    await passport.authenticate(
      'local',
      { session: false },
      (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: err.message })
        }
        if (!user) {
          return res.status(400).json({ message: info.message })
        }

        const payload = { id: user._id, role: user.role }
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_expiresIn || '30d',
        })

        return res.json({
          user: { id: user._id, username: user.username, role: user.role },
          token,
        })
      }
    )(req, res)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
