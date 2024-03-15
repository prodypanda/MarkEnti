const express = require('express')
const paymentController = require('../controllers/payment.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validatePaypalPayment,
  validateStripePayment,
  handleValidationErrors
} = require('../validation/payment')
const { handlePaymentFailure } = require('../controllers/payment.controller')

const router = express.Router()

router.post(
  '/process-paypal-payment',
  isAuthenticated,
  validatePaypalPayment,
  handleValidationErrors,
  paymentController.processPaypalPayment
)
router.post(
  '/process-stripe-payment',
  isAuthenticated,
  validateStripePayment,
  handleValidationErrors,
  paymentController.processStripePayment
)

// POST route to capture payment failure notifications
router.post('/payment-failure', isAuthenticated, handlePaymentFailure)

/**
 * @swagger
 * /api/payment/process-paypal-payment:
 *   post:
 *     summary: Process PayPal payment
 *     description: Process a PayPal payment for the logged in user's order.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The order ID to process payment for
 *               paymentId:
 *                 type: string
 *                 description: The PayPal payment ID
 *               payerId:
 *                 type: string
 *                 description: The PayPal payer ID
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Order not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/payment/process-stripe-payment:
 *   post:
 *     summary: Process Stripe payment
 *     description: Process a Stripe payment for the logged in user's order.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The order ID to process payment for
 *               stripeToken:
 *                 type: string
 *                 description: The Stripe token generated client-side
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Order not found
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /api/payment/payment-failure:
 *   post:
 *     summary: Handle payment failure
 *     description: Handle a payment failure webhook from PayPal or Stripe
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The order ID for the failed payment
 *     responses:
 *       200:
 *         description: Payment failure handled
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */

module.exports = router
