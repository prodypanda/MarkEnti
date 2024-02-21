const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less than 1.']
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'payment_failed'],
    default: 'pending'
  },
  failureReason: { type: String, default: '' },
  preferences: [{
    type: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
},{
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

orderSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

const splitPaymentSchema = new Schema({
  payee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
});

orderSchema.add({
  promotionalCodeApplied: {
    type: String,
    default: null
  },
  discount: {
    type: Number,
    default: 0
  },
  splitPayments: [splitPaymentSchema]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
