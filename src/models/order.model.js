const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
