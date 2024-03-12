const mongoose = require('mongoose')

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
