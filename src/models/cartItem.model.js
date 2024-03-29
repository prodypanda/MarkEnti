/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           description: ObjectId reference to a Product document
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Number of this product in the cart
 *         price:
 *           type: number
 *           description: Price of the product
 *       example:
 *         product: 5e2e7ad9860b2b5de45b493b
 *         quantity: 2
 *         price: 9.99
 */
const mongoose = require('mongoose')

/**
 * Schema for cart items.
 * Defines the shape of documents in the cartItems collection.
 * - product: ObjectId reference to a Product document. Required.
 * - quantity: Number of this product in the cart. Required and minimum 1.
 * - price: Price of the product. Required.
 */

const cartItemSchema = new mongoose.Schema(
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
 * Virtual getter for the total cost of the cart item.
 * Computes quantity * price.
 */
cartItemSchema.virtual('totalCost').get(function () {
  return this.quantity * this.price
})

const CartItem = mongoose.model('CartItem', cartItemSchema)

module.exports = CartItem
