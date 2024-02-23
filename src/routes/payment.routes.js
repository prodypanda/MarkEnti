const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validatePaypalPayment, validateStripePayment, handleValidationErrors } = require('../validation/payment');
const { handlePaymentFailure } = require('../controllers/payment.controller');

const router = express.Router();

router.post('/process-paypal-payment', isAuthenticated, validatePaypalPayment, handleValidationErrors, paymentController.processPaypalPayment);
router.post('/process-stripe-payment', isAuthenticated, validateStripePayment, handleValidationErrors, paymentController.processStripePayment);


// POST route to capture payment failure notifications
router.post('/payment-failure', isAuthenticated, handlePaymentFailure);

module.exports = router;


