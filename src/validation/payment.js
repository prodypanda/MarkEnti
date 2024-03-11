const { check, validationResult } = require('express-validator')

exports.validatePaypalPayment = [
  check('orderID').not().isEmpty().withMessage('Order ID is required'),
  check('paymentID').not().isEmpty().withMessage('Payment ID is required'),
  check('payerID').not().isEmpty().withMessage('Payer ID is required')
]

exports.validateStripePayment = [
  check('orderID').not().isEmpty().withMessage('Order ID is required'),
  check('token').not().isEmpty().withMessage('Stripe token is required'),
  check('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: '0.50' })
    .withMessage('Amount must be at least $0.50 usd')
]

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}
