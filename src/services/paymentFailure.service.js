const PaymentFailure = require('../models/paymentFailure.model.js');

const recordPaymentFailure = async (orderId, reason) => {
  try {
    const paymentFailure = new PaymentFailure({
      orderId: orderId,
      reason: reason
    });
    await paymentFailure.save();
  } catch (error) {
    console.error('Error recording payment failure:', error);
    throw error;
  }
};

const getPaymentFailures = async () => {
  try {
    return await PaymentFailure.find().lean();
  } catch (error) {
    console.error('Error retrieving payment failures:', error);
    throw error;
  }
};

module.exports = { recordPaymentFailure, getPaymentFailures };
