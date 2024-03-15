const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customer
 *         - products
 *         - totalAmount
 *       properties:
 *         customer:
 *           type: string
 *           description: The user that placed the order
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 description: The product ID
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: The quantity of the product ordered
 *         totalAmount:
 *           type: number
 *           description: The total monetary amount for the order
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - processing
 *             - shipped
 *             - delivered
 *             - cancelled
 *             - refunded
 *             - payment_failed
 *           default: pending
 *         failureReason:
 *           type: string
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         customer: 5e2e7dde3c40b0b3b4ae9ae2
 *         products:
 *           - product: 5e2e7dde3c40b0b3b4ae9ae3
 *             quantity: 2
 *         totalAmount: 99.98
 *         status: pending
 *         failureReason:
 *         preferences:
 *           - expressShipping
 *         createdAt: 2020-01-27T01:14:41.618Z
 *         updatedAt: 2020-01-27T01:14:41.618Z
 */

/**
 * Defines the Mongoose schema for an order.
 *
 * The schema defines the structure of order documents in the database, including the fields, field types, validators, etc.
 *
 * Key fields include:
 * - customer: The user that placed the order
 * - products: An array of the products in the order
 * - totalAmount: The total monetary amount for the order
 * - status: The status of the order in its lifecycle (pending, processing, etc)
 */
const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity can not be less than 1.'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
        'payment_failed',
      ],
      default: 'pending',
    },
    failureReason: { type: String, default: '' },
    preferences: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
)

/**
 * Runs before saving the order document to the database.
 * Sets the updatedAt field to the current timestamp.
 */
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

/**
 * Schema for split payment object.
 *
 * @typedef {Object} SplitPayment
 * @property {ObjectId} payee - The user ID of the payee.
 * @property {number} amount - The amount to pay the payee.
 */
const splitPaymentSchema = new Schema({
  payee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
})

/**
 * Adds promotional code, discount amount, and split payment schema fields to order schema.
 *
 * promotionalCodeApplied: Applied promotional code for the order.
 * discount: Discount amount applied to the order.
 * splitPayments: Array of split payment objects for distributing order amount to multiple payees.
 */
orderSchema.add({
  promotionalCodeApplied: {
    type: String,
    default: null,
  },
  discount: {
    type: Number,
    default: 0,
  },
  splitPayments: [splitPaymentSchema],
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order
