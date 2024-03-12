const Role = require('../models/role.model')
// const validateNestingLevel = require('../helpers/validateNestingLevel')
// const deleteWithDescendants = require('../helpers/deleteWithDescendants')
// const retrieveCategoryTree = require('../helpers/retrieveCategoryTree')
// const slugify = require('../utils/stringUtils')

// router.post('/',  createRole)
// router.put('/:id',  updateRole)
// router.delete('/:id', deleteRole)
// router.get('/',  getRoles)
// router.get('/:id', getRole)

// router.get('/myRole',  getMyRole)
// router.put('/myRole',  updateMyRole)

exports.createRole = async (req, res) => {
  const { name, permissions } = req.body

  try {
    const role = new Role({
      name,
      permissions,
    })
    await role.validate()
    const savedRole = await role.save()
    return res.status(201).json(savedRole)
  } catch (error) {
    if (error.code === 11000) {
      // Determine which field caused the duplicate key error
      const field = Object.keys(error.keyValue || {})[0]
      let errorMessage = 'Duplicate field error'
      if (field === 'name') {
        errorMessage = `Category name "${name}" already exists, please choose another name.`
      } else if (field === 'permissions') {
        errorMessage = `permissions "${permissions}" already exists, please choose another permission.`
      } else {
        errorMessage = `${field} already exists, please choose another one.`
      }

      return res.status(400).json({
        success: false,
        message: errorMessage,
      })
    } else {
      // Handle other errors
      return res.status(400).json({
        success: false,
        message: error.message || 'An error occurred while creating the role.',
      })
    }
  }
}

exports.updateRole = async (req, res) => {
  const { name, permissions } = req.body
  try {
    const role = await Role.findById(req.params.id)
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found.',
      })
    }
    role.name = name
    role.permissions = permissions
    await role.validate()
    const updatedRole = await role.save()
    return res.status(200).json(updatedRole)
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'An error occurred while updating the role.',
    })
  }
}

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params
    await Role.findByIdAndDelete(id)
    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully.',
    })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find()
    return res.status(200).json(roles)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
    return res.status(200).json(role)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

exports.getMyRole = async (req, res) => {
  console.log(req.user)
  try {
    const roles = req.user.roles
    console.log(roles)
    const role = await Role.findById(req.user.roles)
    return res.status(200).json(role)
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

//   exports.updateMyRole = async (req, res) => {
//     const {
//       name,
//       permissions
//     } = req.body
//     try {
//         await Role.findByIdAndUpdate(req.user.role, {
//         name,
//         permissions
//       })
//       res.status(200).json({
//         success: true,
//         message: "My role was updated successfuly"
//       })
//     }catch (error) {
//       res.status(400).json({ message: error.message })

//     }
// }
