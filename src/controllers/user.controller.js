const User = require('../models/user.model')
const bcrypt = require('bcrypt')

exports.getUserProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id).select('-password -__v')
    const user = await User.findById(req.user.id).select('-password -__v').populate({path:'roles', select: '-password -__v', populate: {path: 'permissions', select: '-__v'}})
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v').populate({path:'roles', select: '-password -__v', populate: {path: 'permissions', select: '-__v'}})
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v')
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}





exports.updateUserProfile = async (req, res) => {
  const { email, password, username, roles } = req.body // INPUT_REQUIRED {Add any additional user fields that need to be updated}
  const updateFields = {}
  if (username) updateFields.username = username // INPUT_REQUIRED {Handle any additional fields here}
  if (email) updateFields.email = email
  if (roles) updateFields.roles = roles
  if (password) {
    const salt = await bcrypt.genSalt(10)
    updateFields.password = await bcrypt.hash(password, salt)
  }
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password')
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await userInfo.findByIdAndDelete(id)
    res.status(200).json({ message: 'MenuItem deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}