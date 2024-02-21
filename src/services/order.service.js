const Order = require('../models/order.model');

const recordPaymentFailure = async (orderId, failureReason) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = 'payment_failed';
  order.failureReason = failureReason; // Assuming the Order model includes a field to store the reason for payment failure
  await order.save();

  // Additional logic, such as emailing the store admin or logging the event, can be added here

  return order;
};

module.exports = {
  recordPaymentFailure
};
