const slugify = require('slugify')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: [
    {
      type: String
    }
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  variations: [
    {
      color: String,
      size: String,
      stock: Number,
      additionalPrice: Number
    }
  ],
  inventoryCount: {
    type: Number,
    required: true,
    min: [0, 'Inventory count cannot be negative.']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

// Generate slug before saving the product
productSchema.pre('save', async function (next) {
  // If slug is not provided, generate one from product name
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true })
  }
  // Check for uniqueness
  let count = 0
  while (true) {
    try {
      const existingProduct = await Product.findOne({ slug: this.slug })
      if (!existingProduct || existingProduct._id.equals(this._id)) {
        // No conflict or same product, break the loop
        break
      }
      count++
      this.slug = `${slugify(this.name, { lower: true })}-${count}`
    } catch (err) {
      return next(err)
    }
  }

  this.updated_at = Date.now() // Update the 'updated_at' field
  next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
