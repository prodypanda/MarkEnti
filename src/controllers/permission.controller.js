const Permission = require('../models/permission.model')
const Role = require('../models/role.model')
// router.post('/',  createPermission)
// router.put('/:id',  updatePermission)
// router.delete('/:id', deletePermission)
// router.get('/',  getPermissions)
// router.get('/:id', getPermission)

// router.get('/myPermissions',  getMyPermissions)

exports.createPermission = async (req, res) => {
  const { name, description } = req.body
  try {
    const permission = await Permission.create({ name, description })
    return res.status(201).json(permission)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updatePermission = async (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  try {
    const permission = await Permission.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    )
    return res.status(200).json(permission)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deletePermission = async (req, res) => {
  const { id } = req.params
  try {
    const permission = await Permission.findByIdAndDelete(id)
    if (!permission) {
      res.status(404).json({ message: 'Permission not found' })
    } else {
      return res.status(200).json(permission)
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
    return res.status(200).json(permissions)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getPermission = async (req, res) => {
  const { id } = req.params
  try {
    const permission = await Permission.findOne({ _id: id })
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' })
    } else {
      return res.status(200).json(permission)
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getMyPermissions = async (req, res) => {
  const { id } = req.user
  // console.log(req.user.roles)
  const roles = req.user.roles
  // const roles = ["65dadfdd645008d3066efe36", "65dae084645008d3066efe3b"];
  // Get the permissions for the user's roles.
  // const permissions = await Role.find({ _id: { $in: roles } }).populate('permissions').select('permissions').select('name');
  const permissions = await Role.find({ _id: { $in: roles } }).populate({
    path: 'permissions',
    select: 'name description',
  })

  // // Get the permissions for the user's roles.
  const myPermissions = permissions.map((permission) => permission.permissions)
  // // Flatten the array of arrays.
  const flattenedPermissions = myPermissions.flat()
  // // Remove duplicates.
  const uniquePermissions = [...new Set(flattenedPermissions)]
  return res.status(200).json(flattenedPermissions)
}

// module.exports.permissionController = {
//     getPermission: (req, res) =>    {
//         Permission.find().then((data) => {
//             res.json(data)
//         })
//     },
//     addPermission: (req, res) =>    {
//         Permission.create({
//             name: req.body.name,
//             description: req.body.description
//         }).then((data) => {
//             res.json(data)
//         })
//     },
//     deletePermission: (req, res) =>    {
//         Permission.findByIdAndRemove(req.params.id).then(() => {
//             res.json('Permission deleted')
//         })
//     },
//     updatePermission: (req, res) =>    {
//         Permission.findByIdAndUpdate(req.params.id, {
//             name: req.body.name,
//             description: req.body.description
//         }, {new: true}).then((data) => {
//             res.json(data)
//         })
//     },
//     getPermissionById: (req, res) =>    {
//         Permission.findById(req.params.id).then((data) => {
//             res.json(data)
//         })
//     },
//     getPermissionByName: (req, res) =>    {
//         Permission.find({name: req.params.name}).then((data) => {
//             res.json(data)
//         })
//     },
//     getPermissionByDescription: (req, res) =>    {
//         Permission.find({description: req.params.description}).then((data) => {
//             res.json(data)
//         })
//     }
// }

// // WEBPACK FOOTER //
// // ./src/controllers/permission.controller.js
// // module id = 10
// // module chunks = 0

// // WEBPACK FOOTER //
// // ui/src/controllers/permission.controller.js
