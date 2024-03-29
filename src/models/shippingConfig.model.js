/**
 * @swagger
 * components:
 *   schemas:
 *     ShippingConfig:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           type: string
 *           enum: [flat_rate, vendor_paid, free]
 *         cost:
 *           type: number
 *           description: Required if type is flat_rate
 *       example:
 *         type: flat_rate
 *         cost: 10
 */

const mongoose = require('mongoose')

/**
 * Schema for shipping configuration.
 * Defines shipping type, cost rules based on type.
 */
const shippingConfigSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['flat_rate', 'vendor_paid', 'free'],
      required: true,
    },
    cost: {
      type: Number,
      // skipcq: JS-0240
      required: function () {
        return this.type === 'flat_rate'
      },
      default: 0,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const ShippingConfig = mongoose.model('ShippingConfig', shippingConfigSchema)

module.exports = ShippingConfig
