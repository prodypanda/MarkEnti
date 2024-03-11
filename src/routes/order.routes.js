const express = require('express')
const orderController = require('../controllers/order.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  calculatePreferencesOnOrderCompletion
} = require('../middlewares/orderEvent.middleware')
const router = express.Router()

router.post('/', isAuthenticated, orderController.placeOrder)
router.put(
  '/:id/status',
  isAuthenticated,
  calculatePreferencesOnOrderCompletion,
  orderController.updateOrderStatus
)
router.put('/:id/cancel', isAuthenticated, orderController.cancelOrder)
router.put('/:id/refund', isAuthenticated, orderController.refundOrder)
router.get('/', isAuthenticated, orderController.getOrders)
router.get('/:id', isAuthenticated, orderController.getOrder)
router.get(
  '/customer/:customerId',
  isAuthenticated,
  orderController.getCustomerOrders
)

// Add route to record payment failure
router.post(
  '/:id/payment-failure',
  isAuthenticated,
  orderController.recordPaymentFailure
)
// Add route to retry payment, which might redirect to the payment gateway or similar action
router.post('/:id/retry-payment', isAuthenticated, orderController.retryPayment)
// Add route to cancel the order after payment has failed
router.post('/:id/cancel-order', isAuthenticated, orderController.cancelOrder)

module.exports = router
