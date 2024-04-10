const User = require('../models/user.model')
const bcrypt = require('bcrypt')

exports.getUserProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('-password -__v')
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .populate({
        path: 'roles',
        select: '-password -__v',
        populate: { path: 'permissions', select: '-__v' }
      })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -__v')
      .populate({
        path: 'roles',
        select: '-password -__v',
        populate: { path: 'permissions', select: '-__v' }
      })
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v')
    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateUserProfile = async (req, res) => {
  const { email, password, username, roles, active } = req.body // INPUT_REQUIRED {Add any additional user fields that need to be updated}
  const updateFields = {}
  if (username) updateFields.username = username // INPUT_REQUIRED {Handle any additional fields here}
  if (email) updateFields.email = email
  if (roles) updateFields.roles = roles
  if (password) {
    const salt = await bcrypt.genSalt(10)
    updateFields.password = await bcrypt.hash(password, salt)
  }
  if (active) updateFields.active = active
  try {
    // const user = await User.findById(req.user.id)
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const updatedUser = await User.findByIdAndUpdate(
      // req.user.id,
      req.params.id,

      { $set: updateFields },
      { new: true }
    ).select('-password')
    return res.json(updatedUser)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await userInfo.findByIdAndDelete(id)
    return res.status(200).json({ message: 'MenuItem deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
