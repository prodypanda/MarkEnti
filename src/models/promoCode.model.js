const mongoose = require('mongoose')

/**
 * @swagger
 * components:
 *   schemas:
 *     PromoCode:
 *       type: object
 *       required:
 *         - code
 *         - discountPercentage
 *       properties:
 *         code:
 *           type: string
 *           description: Unique promo code string
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *         expirationDate:
 *           type: string
 *           format: date
 *           description: Expiration date for the promo code
 *         isEnabled:
 *           type: boolean
 *           default: true
 *           description: Whether the promo code is enabled
 *       example:
 *         code: PROMO10
 *         discountPercentage: 10
 *         expirationDate: 2022-12-31
 *         isEnabled: true
 */
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
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const PromoCode = mongoose.model('PromoCode', promoCodeSchema)

module.exports = PromoCode
