const mongoose = require('mongoose')
/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - link
 *         - orderIndex
 *         - istoplevel
 *         - createdBy
 *       properties:
 *         title:
 *           type: string
 *           description: Menu item title
 *         slug:
 *           type: string
 *           description: Menu item slug
 *         link:
 *           type: string
 *           description: Menu item link
 *         orderIndex:
 *           type: integer
 *           description: Menu item order index
 *         istoplevel:
 *           type: boolean
 *           description: Whether menu item is top level
 *         parent:
 *           type: string
 *           description: Menu item parent object id
 *         ancestors:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of menu item ancestor ids
 *         createdBy:
 *           type: string
 *           description: User id that created the menu item
 *         updatedBy:
 *           type: string
 *           description: User id that updated the menu item
 *       example:
 *         title: "About"
 *         slug: "about"
 *         link: "/about"
 *         orderIndex: 1
 *         istoplevel: true
 *         parent: null
 *         ancestors: []
 *         createdBy: "1234abcd"
 *         updatedBy: null
 *
 *   parameters:
 *     menuItemId:
 *       name: id
 *       in: path
 *       description: Menu item id
 *       required: true
 *       schema:
 *         type: string
 *
 *   responses:
 *     MenuItem:
 *       description: Menu item object
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * Schema definition for MenuItem model.
 * Defines the fields and constraints for MenuItem documents.
 */
const menuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    link: {
      type: String,
      required: true,
      trim: true
    },
    orderIndex: {
      type: Number,
      required: true,
      default: 0,
      unique: false
    },
    istoplevel: {
      type: Boolean,
      required: true,
      default: false
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null
    },
    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
)

menuItemSchema.index({ parent: 1, name: 1 })

/**
 * Validates that the parent Menu Item specified for this Menu Item exists.
 * Checks that the parent Menu Item ID refers to a valid document in the MenuItem collection.
 */
menuItemSchema.path('parent').validate(async function (value) {
  if (!value) {
    return true // If no parent is specified, that's fine
  }

  const parentMenuItem = await this.constructor.findById(value)
  return Boolean(parentMenuItem) // Ensure parent Menu Item exists
}, 'The specified parent Menu Item does not exist.')

/**
 * Populates the ancestors array for the given menuItem recursively based on its parent.
 *
 * @param {Object} menuItem - The menuItem document to populate ancestors for
 * @param {Model} MenuItemModel - The Mongoose model class for MenuItem
 */
async function populateAncestors (menuItem, MenuItemModel) {
  if (!menuItem.parent) {
    menuItem.ancestors = []
    return
  }

  const ancestors = []
  let currentParentId = menuItem.parent

  while (currentParentId) {
    const parentMenuItem = await MenuItemModel.findById(currentParentId)
    if (!parentMenuItem) {
      throw new Error(
        `Cannot find a parent menu Item with id ${currentParentId}`
      )
    }
    ancestors.unshift(parentMenuItem._id)
    currentParentId = parentMenuItem.parent
  }

  menuItem.ancestors = ancestors
}

/**
 * Before saving, populate slug from name if missing,
 * populate ancestors array recursively based on parent,
 * and update updated_at timestamp.
 */
menuItemSchema.pre('save', async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.split(' ').join('-').toLowerCase()
  }
  if (this.isNew || this.isModified('parent')) {
    await populateAncestors(this, this.constructor)
  }
  this.updated_at = new Date() // Update the updated_at field on every save
  next()
})

const MenuItem = mongoose.model('MenuItem', menuItemSchema)
module.exports = MenuItem
