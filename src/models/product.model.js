/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - inventoryCount
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *           unique: true
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         category:
 *           type: string
 *           format: objectId
 *         variations:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               color:
 *                 type: string
 *               size:
 *                 type: string
 *               stock:
 *                 type: number
 *               additionalPrice:
 *                 type: number
 *         inventoryCount:
 *           type: number
 *           minimum: 0
 *         created_at:
 *           type: string
 *           format: date
 *         updated_at:
 *           type: string
 *           format: date
 *       example:
 *         name: "Product 1"
 *         slug: "product-1"
 *         description: "This is product 1"
 *         price: 100
 *         images: ["image1.jpg"]
 *         category: "5f32291b2a7908662c33e252"
 *         variations: [{color: "Red", size: "M", stock: 10, additionalPrice: 10}]
 *         inventoryCount: 15
 *         created_at: "2020-08-01T00:00:00.000Z"
 *         updated_at: "2020-08-01T00:00:00.000Z"
 */

const slugify = require('slugify')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Product schema definition.
 * Defines the schema for Product model.
 * Includes name, slug, description, price, images, category,
 * variations, inventoryCount, created_at and updated_at fields.
 */
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  variations: [
    {
      color: String,
      size: String,
      stock: Number,
      additionalPrice: Number,
    },
  ],
  inventoryCount: {
    type: Number,
    required: true,
    min: [0, 'Inventory count cannot be negative.'],
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

// Generate slug before saving the product
/**
 * Middleware to generate a unique slug from the product name before saving.
 * Checks for slug uniqueness and appends a counter if conflict found.
 */
productSchema.pre('save', async function (next) {
  // If slug is not provided, generate one from product name
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true })
  }
  // Check for uniqueness
  let count = 0
  while (true) {
    try {
      let existingProduct = await Product.findOne({ slug: this.slug })
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
  return next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product
