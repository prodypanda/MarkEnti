// skipcq: JS-0258
const express = require('express')
const router = express.Router()
const guestCartController = require('../controllers/guestCart.controller.js')
const guestSessionMiddleware = require('../middlewares/guestSession.middleware.js')

/**
 * @swagger
 * /carts/guest:
 *   post:
 *     summary: Create a new guest cart
 *     tags: [Guest Cart]
 *     responses:
 *       201:
 *         description: Newly created guest cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestCart'
 *       500:
 *         description: Error creating a new guest cart
 */
router.post('/', [guestSessionMiddleware], guestCartController.createGuestCart)
/**
 * @swagger
 * /carts/guest/items:
 *   post:
 *     summary: Add an item to the guest cart
 *     tags: [Guest Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *             required:
 *               - productId
 *               - quantity
 *     responses:
 *       201:
 *         description: Item added to guest cart
 *       500:
 *         description: Error adding item to guest cart
 */
router.post(
  '/items',
  [guestSessionMiddleware],
  guestCartController.addItemToGuestCart
)

/**
 * @swagger
 * /carts/guest:
 *   get:
 *     summary: Retrieve current guest cart
 *     tags: [Guest Cart]
 *     responses:
 *       200:
 *         description: The current guest cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GuestCart'
 *       500:
 *         description: Error retrieving guest cart
 */
router.get('/', guestSessionMiddleware, guestCartController.getGuestCart)

router.put(
  '/',
  [guestSessionMiddleware],
  guestCartController.updateAllItemsInGuestCart
)
router.put(
  '/items/:itemId',
  [guestSessionMiddleware],
  guestCartController.updateItemInGuestCart
)

/**
 * @swagger
 * /carts/guest/items/{itemId}:
 *   delete:
 *     summary: Remove an item from the guest cart
 *     tags: [Guest Cart]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique item identifier
 *     responses:
 *       200:
 *         description: Item removed from guest cart
 *       500:
 *         description: Error removing item from guest cart
 */
router.delete(
  '/items/:itemId',
  [guestSessionMiddleware],
  guestCartController.removeItemFromGuestCart
)

router.delete(
  '/',
  [guestSessionMiddleware],
  guestCartController.deleteGuestCart
)
module.exports = router
