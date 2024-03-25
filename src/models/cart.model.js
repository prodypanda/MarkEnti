/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         items:
 *           $ref: '#/components/schemas/CartItem'
 *
 *         user:
 *           $ref: '#/components/schemas/User'
 *         totalCost:
 *           type: number
 *           readOnly: true
 *           description: Virtual property that calculates the total cost of all items in the cart
 *       middleware:
 *         - name: populate
 *           options:
 *             path: items
 *             model: CartItem
 *         - name: populate
 *           options:
 *             path: user
 *             model: User
 */

const mongoose = require('mongoose')

/**
 * Schema for cart model.
 * Defines cart properties like items array of CartItem refs,
 * and user ref to User model.
 */

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

/**
 * Defines a virtual property 'totalCost' that
 * calculates the total cost of all items in the cart.
 * It does this by reducing the items array into
 * a total, adding up each item's 'totalCost' property.
 */
cartSchema.virtual('totalCost').get(function () {
  return this.items.reduce((total, item) => total + item.totalCost, 0)
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
