const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem'
      }
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

cartSchema.virtual('totalCost').get(function () {
  return this.items.reduce((total, item) => total + item.totalCost, 0)
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart
