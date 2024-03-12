const mongoose = require('mongoose')

/**
 * Schema for promo code documents.
 *
 * @typedef {Object} PromoCode
 * @property {string} code - Unique promo code string. Required.
 * @property {number} discountPercentage - Discount percentage. Min 0, max 100. Required.
 * @property {Date} expirationDate - Expiration date for the promo code.
 * @property {boolean} isEnabled - Whether the promo code is enabled. Default true.
 */
const promoCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    expirationDate: {
      type: Date
    },
    isEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

const PromoCode = mongoose.model('PromoCode', promoCodeSchema)

module.exports = PromoCode
