const mongoose = require('mongoose')
const { slugify } = require('../utils/stringUtils')

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
