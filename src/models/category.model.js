/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - isActive
 *         - slug
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the category
 *         description:
 *           type: string
 *           description: Description of the category
 *         parent:
 *           type: string
 *           description: ObjectId of parent category
 *           default: null
 *         ancestors:
 *           type: array
 *           items:
 *             type: string
 *             description: Array of ObjectIds of ancestor categories
 *         isActive:
 *           type: boolean
 *           description: Whether the category is active or not
 *           default: true
 *         sortOrder:
 *           type: integer
 *           description: Sort order of category
 *           default: 0
 *         image:
 *           type: string
 *           description: Image URL for the category
 *         icon:
 *           type: string
 *           description: Icon name for the category
 *         seoTitle:
 *           type: string
 *           description: SEO title for the category
 *           default: ''
 *         seoDescription:
 *           type: string
 *           description: SEO description for the category
 *           default: ''
 *         slug:
 *           type: string
 *           description: Slugified name for URLs
 *         created_at:
 *           type: string
 *           format: date
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date
 *           description: Last updated timestamp
 *       example:
 *         name: Books
 *         description: This is the book category
 *         isActive: true
 *         slug: books
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 */

const mongoose = require('mongoose')

/**
 * Category schema definition. Defines the schema for Category model.
 * Includes name, description, parent category, ancestor categories,
 * active status, sort order, image, icon, SEO fields, slug, and timestamps.
 */
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

/**
 * Validates that the given parent category ID refers to an existing category.
 * Throws a validation error if the parent category does not exist.
 */
categorySchema.path('parent').validate(async function (value) {
  if (!value) {
    return true // If no parent is specified, that's fine
  }

  const parentCategory = await this.constructor.findById(value)
  return Boolean(parentCategory) // Ensure parent category exists
}, 'The specified parent category does not exist.')

/**
 * Populates the ancestors array on the given category by recursively looking up
 * parent categories. Stops when no parent is found.
 *
 * @param {Object} category - The category document to populate ancestors on
 * @param {Model} CategoryModel - The category model class
 */
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
        `Cannot find a parent category with id ${currentParentId}`
      )
    }
    ancestors.unshift(parentCategory._id)
    currentParentId = parentCategory.parent
  }

  category.ancestors = ancestors
}

/**
 * Before saving, populate the slug from the name if missing,
 * populate the ancestors array by looking up parent categories recursively,
 * and update the updated_at timestamp.
 */
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
