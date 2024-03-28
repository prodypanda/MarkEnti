const express = require('express')
const { getSalesReport } = require('../controllers/salesReports.controller')
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Sales Reports
 *   description: Sales reports API
 *
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   security:
 *    - bearerAuth: []
 *
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     tags: [Sales Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

router.get('/report', authMiddleware, getSalesReport)

module.exports = router
