const mongoose = require('mongoose')
/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *       properties:
 *         title:
 *           type: string
 *           description: Menu title
 *           minLength: 3
 *           maxLength: 100
 *         slug:
 *           type: string
 *           description: Menu slug
 *           format: lowercase
 *         visible:
 *           type: boolean
 *           default: true
 *           description: Whether menu is visible
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MenuItem'
 *       additionalProperties: false
 */

/**
 * Schema for menu model. Defines fields for:
 * - title: String, required, unique
 * - slug: String, required, unique, lowercase
 * - visible: Boolean, default true
 * - items: Array of ObjectIds referencing MenuItem model
 */
const menuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    visible: {
      type: Boolean,
      default: true
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      }
    ]
  },
  {
    timestamps: true
  }
)

const Menu = mongoose.model('Menu', menuSchema)

module.exports = Menu
