const Order = require('../models/order.model')
const User = require('../models/user.model')
const PromoCode = require('../models/promoCode.model')
const Product = require('../models/product.model')
const { order } = require('paypal-rest-sdk')
const preferenceService = require('../services/preference.service')

exports.placeOrder = async (req, res) => {
  try {
    const { customer, products, totalAmount, promoCode, splitPayments } =
      req.body

    if (promoCode) {
      // Check if the promo code exists
      const promo = await PromoCode.findOne({ code: promoCode })
      if (!promo) {
        return res
          .status(400)
          .json({ message: 'Invalid promo code or promo code does not exist' })
      }

      // Check if the promo code is enabled and has not expired
      if (!promo.isEnabled || promo.expirationDate < new Date()) {
        return res
          .status(400)
          .json({ message: 'Promo code is not valid or has expired' })
      }
    }

    // Check if the customer exists
    const user = await User.findById(customer)
    if (!user) {
      return res.status(400).json({ message: 'Invalid customer' })
    }

    // Calculate the discount
    let discount = 0
    let promoCodeApplied = null

    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode,
        isEnabled: true,
        expirationDate: { $gte: new Date() },
      })
      if (promo) {
        discount = (promo.discountPercentage / 100) * totalAmount
        promoCodeApplied = promoCode
      }
    }

    // Implement logic to calculate the totalAmount after applying discount.
    const totalAmountAfterDiscount = totalAmount - discount

    let order = new Order({
      customer,
      products,
      totalAmount: totalAmountAfterDiscount, // Use the `totalAmountAfterDiscount` variable here.
      discount: discount,
      promotionalCodeApplied: promoCodeApplied,
      splitPayments,
    })

    // Implement logic to handle split payments distribution.
    // This could involve creating multiple payment records or updating existing ones.

    order = await order.save()
    // res.status(201).json(order);

    try {
      // After successfully saving an order, calculate preferences
      const preferences = await preferenceService.calculatePreferences(customer) // `customer` is the customer's ID
      await Order.findByIdAndUpdate(order._id, { preferences: preferences })

      res.status(201).json({ ...order.toObject(), preferences })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ message: 'Status is required' })
    }
    if (
      !['pending', 'processing', 'completed', 'cancelled', 'refunded'].includes(
        status
      )
    ) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    )
    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

exports.refundOrder = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
    if (!order) {
      return res
        .status(404)
        .json({
          message: 'Order not found, cannot refund order that does not exist',
        })
    }

    // Check if the order has already been refunded
    if (order.status === 'refunded') {
      return res
        .status(400)
        .json({
          message: 'Order is already refunded and cannot be refunded again',
        })
    }

    // Check if the order has been paid
    if (!order.status === 'processing') {
      return res
        .status(400)
        .json({
          message:
            'Order is not paid yet and cannot be refunded, please contact customer support for further assistance if you believe this is a mistake',
        })
    }

    // Implement logic to refund the order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: 'refunded' },
      { new: true }
    )
    return res.status(200).json(updatedOrder)
    //res.status(200).json({ message: 'Order refunded successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const { customer } = req.query
    if (customer) {
      const orders = await Order.find({ customer })
      return res.status(200).json(orders)
    }
    const orders = await Order.find()
    return res.status(200).json(orders)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params
    theorder = await Order.findById(id)
    if (theorder == null) {
      return res.status(404).json({ message: 'Order not found' })
    }

    return res.status(200).json(theorder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.recordPaymentFailure = async (req, res) => {
  const { orderId, failureReason } = req.body

  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    order.status = 'payment_failed'
    order.failureReason = failureReason
    await order.save()

    res.status(200).json({ message: 'Payment failure recorded', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params
    const orders = await Order.find({ customer: customerId }).populate(
      'products.product'
    )
    const preferences = await preferenceService.calculatePreferences(customerId)
    res.status(200).json({ orders, preferences })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// This method would ideally interact with the payment service to retry the payment
exports.retryPayment = async (req, res) => {
  const { id } = req.params // This is the order ID

  try {
    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== 'payment_failed') {
      return res
        .status(400)
        .json({ message: 'Payment has not failed for this order' })
    }

    // Logic to initiate the retry payment process goes here...
    // This can be a redirection to the payment service or creation of a new payment intent

    res.status(200).json({ message: 'Payment retry initiated' })
    // On the frontend, handle this response appropriately to guide the user through the retry process
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// This method handles the cancellation of the order after a payment failure
exports.cancelOrder = async (req, res) => {
  const { id } = req.params // This is the order ID

  try {
    const order = await Order.findById(id)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== 'payment_failed') {
      return res
        .status(400)
        .json({ message: 'Order status is not set to payment failed' })
    }

    order.status = 'cancelled'
    await order.save()

    res.status(200).json({ message: 'Order has been cancelled', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
