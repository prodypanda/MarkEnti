const mongoose = require('mongoose')

/**
 * Schema for guest cart items.
 * Defines the product, quantity and price fields.
 * Product is a reference to a Product model.
 * Quantity and price are required numbers.
 */
const guestCartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

/**
 * Schema for the guest cart model.
 * Defines the sessionId and items fields.
 * sessionId is a required string.
 * items is an array of guestCartItemSchema refs.
 */
const guestCartSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
    },
    items: [guestCartItemSchema],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
)

const GuestCart = mongoose.model('GuestCart', guestCartSchema)

module.exports = GuestCart
