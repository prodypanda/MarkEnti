const mongoose = require('mongoose')
/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       required:
 *         - productId
 *         - discountPercentage
 *         - startDate
 *         - endDate
 *       properties:
 *         productId:
 *           type: string
 *           description: MongoDB object id of the associated product
 *         discountPercentage:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *           description: The percentage discount amount
 *         startDate:
 *           type: string
 *           format: date
 *           description: The start date of the discount period
 *         endDate:
 *           type: string
 *           format: date
 *           description: The end date of the discount period
 *         isActive:
 *           type: boolean
 *           default: false
 *           description: Whether the discount is currently active
 *         maxUsage:
 *           type: integer
 *           minimum: 0
 *           description: The maximum number of times this discount can be used (0 for unlimited)
 *         usageCount:
 *           type: integer
 *           minimum: 0
 *           description: The number of times this discount has been used so far
 *       example:
 *         productId: 5f9f5d9c9c9d9c9c9c9c9c9c
 *         discountPercentage: 10
 *         startDate: '2020-01-01'
 *         endDate: '2020-12-31'
 *         isActive: true
 *         maxUsage: 10
 *         usageCount: 5
 */

/**
 * Schema definition for the Discount model.
 *
 * Defines the fields, types, validators, etc. for Discount documents.
 * Includes product reference, percentage amount, start/end dates,
 * usage limits, and counts.
 */
const discountSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v)
        },
        message:
          'Invalid date format. Please use the following format: YYYY-MM-DD'
      }
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return mongoose.Types.Date.isValid(v)
        },
        message:
          'Invalid date format. Please use the following format: YYYY-MM-DD'
      }
    },
    isActive: {
      type: Boolean,
      default: false,
      validate: {
        validator: function (v) {
          return mongoose.Types.Boolean.isValid(v)
        },
        message:
          'Invalid Boolean format. Please use the following format: True or False'
      }
    },
    maxUsage: {
      type: Number,
      default: 0,
      min: 0, // 0 is for unlimited usage
      max: 10000000000
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000000000
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Middleware for automatic deactivation of expired discounts
/**
 * Middleware that runs before saving a Discount model instance.
 * Checks if the endDate is in the past and sets isActive to false if so,
 * to deactivate expired discounts.
 */
discountSchema.pre('save', function (next) {
  if (this.endDate < new Date()) {
    this.isActive = false
  }
  next()
})

const Discount = mongoose.model('Discount', discountSchema)

module.exports = Discount
