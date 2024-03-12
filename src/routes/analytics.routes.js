// skipcq: JS-0258
const express = require('express')
const analyticsController = require('../controllers/analytics.controller')
/**
 * Middleware that checks if the user is authenticated.
 * Redirects to the login page if not authenticated.
 */
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const router = express.Router()

/**
 * GET analytics registration stats.
 * Requires authentication.
 */
router.get(
  '/registration',
  isAuthenticated,
  analyticsController.getRegistrationStats
)

/**
 * GET analytics sales stats.
 * Requires authentication.
 */
router.get('/sales', isAuthenticated, analyticsController.getSalesStats)
/**
 * GET analytics for payment failures.
 * Requires authentication.
 */
router.get(
  '/payment-failures',
  isAuthenticated,
  analyticsController.getPaymentFailureAnalytics
)

module.exports = router
