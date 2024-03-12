const paypal = require('../config/paypal')
const stripe = require('../config/stripe')
const Order = require('../models/order.model')
const OrderService = require('../services/order.service')
const paymentFailureSservice = require('../services/paymentFailure.service')
const { sendEmail } = require('../services/email.service')

exports.processPaypalPayment = async (req, res) => {
  const { orderID, paymentID, payerID } = req.body
  const paymentDetails = { payer_id: payerID }
  try {
    paypal.payment.execute(paymentID, paymentDetails, (error, payment) => {
      if (error) {
        throw error
      } else {
        Order.findByIdAndUpdate(
          orderID,
          {
            payment: {
              provider: 'paypal',
              paymentID,
              payerID,
              execute_payment_json: payment,
              status: 'confirmed'
            }
          },
          { new: true }
        )
          .then((updatedOrder) => {
            return res.status(200).json(updatedOrder)
          })
          .catch((err) => {
            throw err
          })
      }
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

exports.confirmPaypalPayment = async (req, res) => {
  const { orderID, paymentID } = req.body
  try {
    const order = await Order.findById(orderID)
    if (!order) {
      throw new Error('Order not found')
    }
    if (order.payment.paymentID !== paymentID) {
      throw new Error('Payment ID mismatch')
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      orderID,
      {
        'payment.status': 'confirmed'
      },
      { new: true }
    )
    return res.status(200).json(updatedOrder)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

exports.processStripePayment = async (req, res) => {
  const { orderID, token, amount } = req.body
  try {
    const charge = await stripe.charges.create({
      amount: amount * 100, // Converting to cents for Stripe,
      currency: 'usd',
      source: token,
      description: `Charge for order ${orderID}`
    })
    const updatedOrder = await Order.findByIdAndUpdate(
      orderID,
      {
        'payment.provider': 'stripe',
        'payment.charge': charge,
        'payment.status': 'confirmed',
        status: 'paid'
      },
      { new: true }
    )
    return res.status(200).json(updatedOrder)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

exports.handlePaymentFailure = async (req, res) => {
  const { orderId, failureReason } = req.body

  try {
    const updatedOrder = await OrderService.recordPaymentFailure(
      orderId,
      failureReason
    )
    const updatedOrderF2 = await paymentFailureSservice.recordPaymentFailure(
      orderId,
      failureReason
    )
    const order = await Order.findById(orderId).populate('customer')
    // console.log(order)
    await sendEmail({
      from: process.env.EMAIL_FROM_ADDRESS,
      // to: 'nashab2016@gmail.com', // Assuming `customerEmail` exist on `order` object
      to: order.customer.email, // Assuming `customerEmail` exist on `order` object
      subject: 'Payment Failure Notification',
      text: `Dear Customer,\n\nWe regret to inform you that your payment for the order with ID: ${orderId} was unsuccessful.\nReason: ${failureReason}\n\nPlease visit your orders dashboard to attempt the payment again or contact our support team for further assistance.\n\nBest regards,\nPandaVee3 Team`,
      html: `<p>Dear Customer,</p><p>We regret to inform you that your payment for the order with ID: ${orderId} was unsuccessful.</p><p>Reason: ${failureReason}</p><p>Please visit your orders dashboard to attempt the payment again or contact our support team for further assistance.</p><p>Best regards,<br/>PandaVee3 Team</p>`,
      headers: {
        'X-serversender': 'prodypanda .inc',
        'X-Organisation-Name': 'prodypanda .inc'
      },
      priority: 'high' // ‘high’, ‘normal’ (default) or ‘low’.
    })
    return res
      .status(200)
      .json({ message: 'Payment failure processed', order: updatedOrder })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
