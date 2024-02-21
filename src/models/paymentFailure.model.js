const mongoose = require('mongoose');

const paymentFailureSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  occurredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const PaymentFailure = mongoose.model('PaymentFailure', paymentFailureSchema);

module.exports = PaymentFailure;
