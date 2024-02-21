const mongoose = require('mongoose');

const guestCartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const guestCartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  items: [guestCartItemSchema],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const GuestCart = mongoose.model('GuestCart', guestCartSchema);

module.exports = GuestCart;