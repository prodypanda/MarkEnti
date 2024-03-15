const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Unique name of the permission. Used for lookups.
 *         description:
 *           type: string
 *           description: Optional human-readable description.
 *       example:
 *         name: update_product
 *         description: Allows updating products
 */
/**
 * Schema for Permission model. Defines the shape of documents in the
 * 'permissions' collection.
 *
 * @typedef {Object} Permission
 * @property {string} name - Unique name of the permission. Used for lookups.
 * @property {string} [description] - Optional human-readable description.
 */
const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // E.g., 'update_product', 'view_orders'
  description: { type: String }
})

const Permission = mongoose.model('Permission', permissionSchema)
module.exports = Permission
