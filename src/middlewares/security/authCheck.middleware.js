const User = require('../../models/user.model')

exports.isAdminOrOwner = async (req, res, next) => {
  const userId = req.params.userId || req.body.userId // Assume userId is in params or body.

  try {
    const user = await User.findById(req.user.id)
    if (user.role === 'admin' || user.id === userId) {
      return next()
    }

    return res
      .status(403)
      .json({ message: 'You are not authorized to perform this action.' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error checking user authorization.' })
  }
}
