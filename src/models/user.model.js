/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         password:
 *           type: string
 *           description: The hashed password of the user
 *         role:
 *           type: string
 *           enum: [root, admin, manager, customer, guest]
 *           default: customer
 *           description: The role of the user
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *           description: Array of role objects for the user
 *         created_at:
 *           type: string
 *           format: date
 *           description: The date when the user was created
 *         updated_at:
 *           type: string
 *           format: date
 *           description: The date when the user was last updated
 *       middlewares:
 *         - bcrypt password hashing on save
 *         - bcrypt password verification method
 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

// Define the User schema
/**
 * User schema definition.
 *
 * Defines the schema for User documents in MongoDB.
 * Includes fields like username, email, password, roles, etc.
 */

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['root', 'admin', 'manager', 'customer', 'guest'],
    default: 'customer',
  },
  roles: { type: Schema.Types.ObjectId, ref: 'Role' },
  active: { type: Boolean, default: true },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

// Hash password before saving
/**
 * Hash password before saving if password is modified or new user.
 * Uses bcrypt to generate a salt and hash the password before saving.
 */
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
  return next()
})

// Verify password
/**
 * Verify password method.
 *
 * Compares a given password with the hashed password stored in the user document.
 * Uses bcrypt to compare the passwords.
 * Returns true if the passwords match, false otherwise.
 */
userSchema.methods.verifyPassword = async function (password) {
  const returned = await bcrypt.compare(password, this.password)
  return returned
}

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema)

module.exports = User
