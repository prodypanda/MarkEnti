const Order = require('../models/order.model')

/**
 * Records a payment failure for the given order.
 *
 * @param {ObjectId} orderId - The ID of the order that failed payment.
 * @param {string} failureReason - The reason the payment failed.
 *
 * @returns {Promise<Order>} The updated order document.
 */
const recordPaymentFailure = async (orderId, failureReason) => {
  const order = await Order.findById(orderId)
  if (!order) {
    throw new Error('Order not found')
  }

  order.status = 'payment_failed'
  order.failureReason = failureReason // Assuming the Order model includes a field to store the reason for payment failure
  await order.save()

  // Additional logic, such as emailing the store admin or logging the event, can be added here

  return order
}

module.exports = {
  recordPaymentFailure
}
