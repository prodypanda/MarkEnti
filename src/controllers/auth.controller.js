const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const passport = require('passport')

/**
 * Register a new user in the system.
 * @param {object} req - The request object containing the new user's details.
 * @param {object} res - The response object to send back the HTTP response.
 */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    const user = new User({ username, email, password })
    await user.save()

    res.status(201).send({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

/**
 * Authenticate a user and issue a JWT token for further API calls.
 * @param {object} req - The request object containing the user's credentials.
 * @param {object} res - The response object to send back the HTTP response with the JWT token.
 */
exports.login = async (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message })
    }
    if (!user) {
      return res.status(400).json({ message: info.message })
    }

    const payload = { id: user._id, role: user.role }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    return res.json({
      user: { id: user._id, username: user.username, role: user.role },
      token,
    })
  })(req, res)
}
