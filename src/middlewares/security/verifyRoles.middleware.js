const User = require('../../models/user.model')

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



exports.verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
      if (!req?.user?.role) return res.sendStatus(401); // Unauthorized (no role)

      const userRole = req.user.role; 
      const rolesArray = Array.isArray(userRole) ? userRole : [userRole]; // Handle potential arrays for multiple roles

      const result = rolesArray.some((role) => allowedRoles.includes(role));
      if (!result) return res.sendStatus(403); // Forbidden

      next();
  };
};



// // Check if the user has the permission to create a new user.
// if (user.roles.some(role => role.permissions.includes('create-user'))) {
//   // Allow the user to create a new user.
// } else {
//   // Deny the user permission to create a new user.
// }