const mongoose = require('mongoose')
const { slugify } = require('../utils/stringUtils')

/**
 * Page schema definition. Defines the schema for Page model.
 * Includes title, content, slug, published status, publish date fields.
 */
const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    published: {
      type: Boolean,
      default: false
    },
    publishedAt: {
      type: Date
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

/**
 * Middleware to handle slug generation and updating publish date when publishing.
 * Generates slug from title if new document.
 * Updates publishedAt date if publishing status changes to published.
 */
pageSchema.pre('save', function (next) {
  if (!this.isNew && this.isModified('published') && this.published) {
    this.publishedAt = new Date()
  }
  if (this.isNew && !this.slug) {
    this.slug = slugify(this.title)
  }
  next()
})

const Page = mongoose.model('Page', pageSchema)

module.exports = Page
