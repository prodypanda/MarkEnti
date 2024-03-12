const { check, validationResult } = require('express-validator')

/**
 * Validates a PayPal payment request.
 *
 * Checks that the order ID, payment ID, and payer ID are provided.
 */
exports.validatePaypalPayment = [
  check('orderID').not().isEmpty().withMessage('Order ID is required'),
  check('paymentID').not().isEmpty().withMessage('Payment ID is required'),
  check('payerID').not().isEmpty().withMessage('Payer ID is required')
]

/**
 * Validates a Stripe payment request.
 *
 * Checks that the order ID, Stripe token, and amount are provided and valid.
 * The amount must be a number and at least $0.50 USD.
 */
exports.validateStripePayment = [
  check('orderID').not().isEmpty().withMessage('Order ID is required'),
  check('token').not().isEmpty().withMessage('Stripe token is required'),
  check('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: '0.50' })
    .withMessage('Amount must be at least $0.50 usd')
]

/**
 * Handles validation errors from express-validator middleware.
 * Checks if there are any errors from validationResult(),
 * and if so, responds with a 422 status code and the errors.
 * Otherwise calls next().
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  return next()
}
