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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 *
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The order ID
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           description: The total order amount
 *         status:
 *           type: string
 *           description: The order status
 *         paymentMethod:
 *           type: string
 *           description: The payment method used
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           $ref: '#/components/schemas/Product'
 *         quantity:
 *           type: integer
 *           description: The quantity ordered
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Bad request
 *
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}/status:
 *  put:
 *    summary: Update order status
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                description: The new order status
 *    responses:
 *      200:
 *        description: Order status updated successfully
 *      404:
 *        description: Order not found
 *      400:
 *        description: Invalid status value
 */

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *  put:
 *    summary: Cancel order
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    responses:
 *      200:
 *        description: Order cancelled successfully
 *      404:
 *        description: Order not found
 *
 */

/**
 * @swagger
 * /api/orders/{id}/refund:
 *  put:
 *    summary: Refund order
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    responses:
 *      200:
 *        description: Order refunded successfully
 *      404:
 *        description: Order not found
 */

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Get orders by customer ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The customer ID
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Customer not found
 */

/**
 * @swagger
 * /api/orders/{id}/payment-failure:
 *  post:
 *    summary: Record payment failure for order
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    responses:
 *      200:
 *        description: Payment failure recorded
 *      404:
 *        description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}/retry-payment:
 *  post:
 *    summary: Retry payment for failed order
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    responses:
 *      200:
 *        description: Payment retried
 *      404:
 *        description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}/cancel-order:
 *  post:
 *    summary: Cancel order after payment failure
 *    tags: [Orders]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order ID
 *    responses:
 *      200:
 *        description: Order cancelled
 *      404:
 *        description: Order not found
 */

module.exports = router
