// skipcq: JS-0258
const express = require('express')
const analyticsController = require('../controllers/analytics.controller')

/**
 * Middleware that checks if the user is authenticated.
 * Redirects to the login page if not authenticated.
 */
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics management
 */

/**
 * GET analytics registration stats.
 * Requires authentication.
 */
/**
 * @swagger
 * /analytics/registration:
 *   get:
 *     summary: Get analytics registration stats
 *     description: Fetches statistics related to user registrations. Requires user to be authenticated.
 *     parameters:
 *       - name: sortBy
 *         in: query
 *         description: The field to sort the results by.
 *         schema:
 *           type: string
 *           enum: [_id, count]
 *       - name: sortOrder
 *         in: query
 *         description: The order to sort the results in.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: limit
 *         in: query
 *         description: The maximum number of documents to return.
 *         schema:
 *           type: integer
 *           minimum: 1
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registration statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: date
 *                   count:
 *                     type: integer
 *       500:
 *         description: Internal server error.
 *       204:
 *         description: Successfully retrieved registration statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRegistrations:
 *                   type: integer
 *                   description: Total number of registrations.
 *                 successfulRegistrations:
 *                   type: integer
 *                   description: Number of successful registrations.
 *                 failedRegistrations:
 *                   type: integer
 *                   description: Number of failed registrations.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 */
router.get(
  '/registration',
  authMiddleware,
  analyticsController.getRegistrationStats
)

/**
 * GET analytics sales stats.
 * Requires authentication.
 */
/**
 * @swagger
 * /analytics/sales:
 *   get:
 *     summary: Gets sales statistics
 *     description: Retrieve sales statistics. Requires user to be authenticated.
 *     parameters:
 *       - name: groupBy
 *         in: query
 *         description: The field to group the results by.
 *         schema:
 *           type: string
 *           enum: [createdAt,status]
 *       - name: status
 *         in: query
 *         description: The status of the sales transaction.
 *         schema:
 *           type: string
 *           enum: [all,failed,pending,paid,refunded,processing,cancelled,delivered,completed]
 *       - name: sortBy
 *         in: query
 *         description: The field to sort the results by.
 *         schema:
 *           type: string
 *           enum: [_id, totalSales, totalOrders]
 *       - name: sortOrder
 *         in: query
 *         description: The order to sort the results in.
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: limit
 *         in: query
 *         description: The maximum number of documents to return.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
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
 *                   type: number
 *                   description: Total sales amount.
 *                 totalOrders:
 *                   type: integer
 *                   description: Number of sales transactions.
 *       401:
 *         description: Unauthorized, user not authenticated.
 */
router.get('/sales', authMiddleware, analyticsController.getSalesStats)

/**
 * GET analytics for payment failures.
 * Requires authentication.
 */
/**
 * @swagger
 * /analytics/payment-failures:
 *   get:
 *     summary: Gets analytics for payment failures
 *     description: Retrieve analytics data for payment failures. Requires user authentication.
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation, returns payment failure analytics data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: '2023-01-01'
 *                       failures:
 *                         type: integer
 *                         example: 5
 *       401:
 *         description: Unauthorized, user not authenticated.
 */
router.get(
  '/payment-failures',
  authMiddleware,
  analyticsController.getPaymentFailureAnalytics
)

module.exports = router
