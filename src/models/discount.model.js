const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Middleware for automatic deactivation of expired discounts
discountSchema.pre('save', function(next) {
  if (this.endDate < new Date()) {
    this.isActive = false;
  }
  next();
});

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;
