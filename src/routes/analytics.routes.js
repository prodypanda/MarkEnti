// skipcq: JS-0258
const express = require('express')
const analyticsController = require('../controllers/analytics.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const router = express.Router()

router.get(
  '/registration',
  isAuthenticated,
  analyticsController.getRegistrationStats
)
router.get('/sales', isAuthenticated, analyticsController.getSalesStats)
router.get(
  '/payment-failures',
  isAuthenticated,
  analyticsController.getPaymentFailureAnalytics
)

module.exports = router
