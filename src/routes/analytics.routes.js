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
/**
 * @swagger
 * /analytics/registration:
 *   get:
 *     summary: Get analytics registration stats
 *     description: Requires authentication. Returns analytics data on user registrations.
 *     responses:
 *       200:
 *         description: Registration stats returned successfully.
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
/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Get sales statistics
 *     description: Requires authentication to access sales statistics.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved sales statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: integer
 *                   description: Total number of sales.
 *                 totalRevenue:
 *                   type: number
 *                   format: float
 *                   description: Total revenue from sales.
 *       401:
 *         description: Unauthorized, valid user authentication required.
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
