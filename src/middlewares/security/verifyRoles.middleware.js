const User = require('../../models/user.model')

/**
 * Checks if the user is an admin or the owner of the requested resource.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 *
 * @returns {Promise} Returns a promise that resolves if authorized, rejects if not.
 */
exports.isAdminOrOwner = async (req, res, next) => {
  const userId = req.params.userId || req.body.userId // Assume userId is in params or body.

  try {
    const user = await User.findById(req.user.id).populate('role')
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

/**
 * Checks if the user's role matches one of the allowed roles.
 *
 * @param  {...string} allowedRoles - The allowed roles to check for.
 * @returns {Function} Returns a middleware function that checks the user's role.
 */

exports.verifyRoles = (...allowedRoles) => {
  const allowedRolesSet = new Set(allowedRoles)
  return (req, res, next) => {
    const userRole = req?.user?.role
    if (!userRole) {
      return res.sendStatus(401) // Unauthorized (no role)
    }

    const rolesArray = Array.isArray(userRole) ? userRole : [userRole] // Handle potential arrays for multiple roles & Ensure `userRole` is always an array

    const result = rolesArray.some((role) => allowedRolesSet.has(role))
    if (!result) {
      return res.sendStatus(403) // Forbidden
    }

    return next()
  }
}

// // Check if the user has the permission to create a new user.
// if (user.roles.some(role => role.permissions.includes('create-user'))) {
//   // Allow the user to create a new user.
// } else {
//   // Deny the user permission to create a new user.
// }
