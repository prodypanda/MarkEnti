/**
 * @swagger
 * /Cart:
 *   get:
 *     summary: Get analytics registration stats
 *     description: Fetches statistics related to user registrations. Requires user to be authenticated.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *   post:
 *     summary: Add item to cart for authenticated user
 *     description: Adds item to cart for authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     summary: Remove item from cart for authenticated user
 *     description: Removes item from cart for authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Validation error
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

const express = require('express')
const cartController = require('../controllers/cart.controller')
const {
  isAuthenticated,
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateCartImput,
} = require('../validation/inputValidator')
const router = express.Router()

// Apply isAuthenticated middleware to ensure only authenticated users can access the cart
router.get('/', isAuthenticated, cartController.viewCart)

router.post(
  '/item',
  isAuthenticated,
  validateCartImput,
  cartController.addItemToCart
)
router.delete(
  '/item/:id',
  isAuthenticated,
  validateMongoId,
  cartController.removeItemFromCart
)

module.exports = router
