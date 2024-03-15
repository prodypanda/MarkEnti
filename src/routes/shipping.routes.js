const express = require('express')
const router = express.Router()
const shippingController = require('../controllers/shipping.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')

/**
 * @swagger
 * /shipping:
 *   get:
 *     summary: Get available shipping options
 *     description: Retrieves a list of available shipping options for the authenticated user's cart. Requires authentication.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShippingOption'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
/**
 * Route handler for GET /shipping
 * Requires authentication
 */
router.get('/', isAuthenticated, shippingController.getShippingOptions)

/**
 * @swagger
 * /api/shipping:
 *   post:
 *     summary: Create a new shipping option
 *     description: Creates a new shipping option
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingOption'
 *     responses:
 *       201:
 *         description: Shipping option created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', isAuthenticated, shippingController.createShippingOption)

/**
 * @swagger
 * /api/shipping/{id}:
 *   put:
 *     summary: Update a shipping option
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The shipping option id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShippingOption'
 *     responses:
 *       200:
 *         description: Shipping option updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Shipping option not found
 *       422:
 *         description: Validation failed
 */
router.put('/:id', isAuthenticated, shippingController.updateShippingOption)
/**
 * Deletes a shipping option by ID
 * Requires authentication
 */
/**
 * @swagger
 * /api/shipping/{id}:
 *   delete:
 *     summary: Deletes a shipping option
 *     description: Deletes a shipping option by ID. Requires authentication.
 *     tags: [Shipping]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of shipping option to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shipping option deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Shipping option not found
 */

router.delete('/:id', isAuthenticated, shippingController.deleteShippingOption)

module.exports = router
