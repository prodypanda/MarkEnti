/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management APIs for authenticated users
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart data for authenticated user
 *     description: Fetches cart data, including items and total cost, for the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                           category:
 *                             type: string
 *                             format: objectId
 *                           variations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 color:
 *                                   type: string
 *                                 size:
 *                                   type: string
 *                                 stock:
 *                                   type: number
 *                                 additionalPrice:
 *                                   type: number
 *                           inventoryCount:
 *                             type: number
 *                             minimum: 0
 *                           created_at:
 *                             type: string
 *                             format: date
 *                           updated_at:
 *                             type: string
 *                             format: date
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [root, admin, manager, customer, guest]
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                     created_at:
 *                       type: string
 *                       format: date
 *                     updated_at:
 *                       type: string
 *                       format: date
 *                 totalCost:
 *                   type: number
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/item:
 *   post:
 *     summary: Add item to cart
 *     description: Adds a product to the authenticated user's cart.
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: The quantity of the product to add
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                           category:
 *                             type: string
 *                             format: objectId
 *                           variations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 color:
 *                                   type: string
 *                                 size:
 *                                   type: string
 *                                 stock:
 *                                   type: number
 *                                 additionalPrice:
 *                                   type: number
 *                           inventoryCount:
 *                             type: number
 *                             minimum: 0
 *                           created_at:
 *                             type: string
 *                             format: date
 *                           updated_at:
 *                             type: string
 *                             format: date
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [root, admin, manager, customer, guest]
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                     created_at:
 *                       type: string
 *                       format: date
 *                     updated_at:
 *                       type: string
 *                       format: date
 *                 totalCost:
 *                   type: number
 *       400:
 *         description: Validation error (e.g., invalid productId or quantity)
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/item/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Removes an item from the authenticated user's cart.
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       product:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           images:
 *                             type: array
 *                             items:
 *                               type: string
 *                           category:
 *                             type: string
 *                             format: objectId
 *                           variations:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 color:
 *                                   type: string
 *                                 size:
 *                                   type: string
 *                                 stock:
 *                                   type: number
 *                                 additionalPrice:
 *                                   type: number
 *                           inventoryCount:
 *                             type: number
 *                             minimum: 0
 *                           created_at:
 *                             type: string
 *                             format: date
 *                           updated_at:
 *                             type: string
 *                             format: date
 *                       quantity:
 *                         type: integer
 *                       price:
 *                         type: number
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [root, admin, manager, customer, guest]
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           permissions:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                 name:
 *                                   type: string
 *                                 description:
 *                                   type: string
 *                     created_at:
 *                       type: string
 *                       format: date
 *                     updated_at:
 *                       type: string
 *                       format: date
 *                 totalCost:
 *                   type: number
 *       400:
 *         description: Validation error (e.g., invalid itemId)
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear cart
 *     description: Removes all items from the authenticated user's cart.
 *     security:
 *       - bearerAuth: []
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */

const express = require('express')
const cartController = require('../controllers/cart.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateCartImput
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

router.delete('/clear', isAuthenticated, cartController.clearCart)
module.exports = router
