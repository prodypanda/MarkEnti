const express = require('express')
const inventoryController = require('../controllers/inventory.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateInventoryNumeric
} = require('../validation/inputValidator')
const router = express.Router()

// id: the id of product (productId)
router.put(
  '/:id',
  isAuthenticated,
  validateMongoId,
  validateInventoryNumeric,
  inventoryController.updateInventory
)
router.get(
  '/:id',
  isAuthenticated,
  validateMongoId,
  inventoryController.getInventory
)

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Updates the inventory count for a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inventory:
 *                 type: integer
 *                 description: The new inventory count
 *                 example: 100
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation failed
 *
 *   get:
 *     summary: Get the inventory count for a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the product
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventory:
 *                   type: integer
 *                   description: The inventory count
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Product not found
 */

module.exports = router
