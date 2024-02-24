const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., 'admin', 'manager'
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }] 
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
