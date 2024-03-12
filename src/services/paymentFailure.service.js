const PaymentFailure = require('../models/paymentFailure.model.js')

/**
 * Records a payment failure for the given order.
 *
 * @param {string} orderId - The ID of the order that failed payment.
 * @param {string} reason - The reason the payment failed.
 */
const recordPaymentFailure = async (orderId, reason) => {
  try {
    const paymentFailure = new PaymentFailure({
      orderId,
      reason
    })
    await paymentFailure.save()
  } catch (error) {
    console.error('Error recording payment failure:', error)
    throw error
  }
}

/**
 * Retrieves all payment failure records from the database.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of payment failure objects.
 */
const getPaymentFailures = async () => {
  try {
    return await PaymentFailure.find().lean()
  } catch (error) {
    console.error('Error retrieving payment failures:', error)
    throw error
  }
}

module.exports = { recordPaymentFailure, getPaymentFailures }
