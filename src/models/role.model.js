const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Role schema definition. Defines the structure of Role documents.
 * name: Name of the role, required and unique.
 * permissions: Array of Permission object IDs associated with this role.
 */
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'admin', 'manager'
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
})

const Role = mongoose.model('Role', roleSchema)
module.exports = Role
