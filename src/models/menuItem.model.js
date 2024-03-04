const mongoose = require('mongoose')

const menuItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    orderIndex: {
      type: Number,
      required: true,
      default: 0,
      unique: false,
    },
    istoplevel: {
      type: Boolean,
      required: true,
      default: false,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      default: null,
    },
    ancestors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

menuItemSchema.index({ parent: 1, name: 1 })

menuItemSchema.path('parent').validate(async function (value) {
  if (!value) {
    return true // If no parent is specified, that's fine
  }

  const parentMenuItem = await this.constructor.findById(value)
  return !!parentMenuItem // Ensure parent Menu Item exists
}, 'The specified parent Menu Item does not exist.')

async function populateAncestors(menuItem, MenuItemModel) {
  if (!menuItem.parent) {
    menuItem.ancestors = []
    return
  }

  let ancestors = []
  let currentParentId = menuItem.parent

  while (currentParentId) {
    const parentMenuItem = await MenuItemModel.findById(currentParentId)
    if (!parentMenuItem) {
      throw new Error(
        'Cannot find a parent menu Item with id ' + currentParentId
      )
    }
    ancestors.unshift(parentMenuItem._id)
    currentParentId = parentMenuItem.parent
  }

  menuItem.ancestors = ancestors
}

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
