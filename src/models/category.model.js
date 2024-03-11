const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  ancestors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  icon: {
    type: String,
  },
  seoTitle: {
    type: String,
    trim: true,
    default: '',
  },
  seoDescription: {
    type: String,
    trim: true,
    default: '',
  },
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
})

categorySchema.index({ parent: 1, name: 1 })

categorySchema.path('parent').validate(async function (value) {
  if (!value) {
    return true // If no parent is specified, that's fine
  }

  const parentCategory = await this.constructor.findById(value)
  return Boolean(parentCategory) // Ensure parent category exists
}, 'The specified parent category does not exist.')

async function populateAncestors(category, CategoryModel) {
  if (!category.parent) {
    category.ancestors = []
    return
  }

  let ancestors = []
  let currentParentId = category.parent

  while (currentParentId) {
    const parentCategory = await CategoryModel.findById(currentParentId)
    if (!parentCategory) {
      throw new Error(
        'Cannot find a parent category with id ' + currentParentId
      )
    }
    ancestors.unshift(parentCategory._id)
    currentParentId = parentCategory.parent
  }

  category.ancestors = ancestors
}

categorySchema.pre('save', async function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.split(' ').join('-').toLowerCase()
  }
  if (this.isNew || this.isModified('parent')) {
    await populateAncestors(this, this.constructor)
  }
  this.updated_at = new Date() // Update the updated_at field on every save
  next()
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
