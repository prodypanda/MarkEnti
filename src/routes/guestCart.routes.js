// skipcq: JS-0258
const express = require('express')
const router = express.Router()
const guestCartController = require('../controllers/guestCart.controller.js')
const guestSessionMiddleware = require('../middlewares/guestSession.middleware.js')

/**
 * @swagger
 * tags:
 *   name: Cart (Guest)
 *   summary: Cart management APIs for non authenticated users
 *   description: Cart management APIs for non authenticated users
 */

// /**
//  * @swagger
//  * /carts/guest:
//  *   post:
//  *     summary: Create a new guest cart
//  *     description: Creates a new guest cart for the non authenticated user.
//  *     tags: [Cart (Guest)]
//  *     responses:
//  *       201:
//  *         description: Newly created guest cart
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/GuestCart'
//  *       500:
//  *         description: Error creating a new guest cart
//  */
// router.post('/', [guestSessionMiddleware], guestCartController.createGuestCart)
/**
 * @swagger
 * /carts/guest/items:
 *   post:
 *     summary: Add an item to the guest cart
 *     description: Adds an item to the guest cart for the non authenticated user.
 *     tags: [Cart (Guest)]
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
 *     description: Retrieves the current guest cart for the non authenticated user.
 *     tags: [Cart (Guest)]
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

/**
 * Updates all items in the guest cart.
 */
/**
 * @swagger
 * /carts/guest:
 *   put:
 *     summary: Update all items in guest cart
 *     description: Updates all items in the guest cart for the non authenticated user.
 *     tags: [Cart (Guest)]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Guest cart updated with new items
 *       500:
 *         description: Error updating guest cart
 */
router.put(
  '/',
  [guestSessionMiddleware],
  guestCartController.updateAllItemsInGuestCart
)

/**
 * @swagger
 * /carts/guest/items/{itemId}:
 *   put:
 *     summary: Update a guest cart item
 *     description: Updates a guest cart item for the non authenticated user.
 *     tags: [Cart (Guest)]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *             required:
 *               - quantity
 *     responses:
 *       200:
 *         description: Guest cart item updated
 *       500:
 *         description: Error updating guest cart item
 */
router.put(
  '/items/:itemId',
  [guestSessionMiddleware],
  guestCartController.updateItemInGuestCart
)

/**
 * @swagger
 * /api/carts/guest/items/{itemId}:
 *   delete:
 *     summary: Remove an item from guest cart
 *     description: Removes an item from the guest cart for the non authenticated user.
 *     tags: [Cart (Guest)]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The item ID to remove
 *     responses:
 *       200:
 *         description: Guest cart item removed
 *       404:
 *         description: Guest cart item not found
 *       500:
 *         description: Error removing guest cart item
 */
router.delete(
  '/items/:itemId',
  [guestSessionMiddleware],
  guestCartController.removeItemFromGuestCart
)

/**
 * @swagger
 * /api/carts/guest:
 *   delete:
 *     summary: Delete entire guest cart
 *     description: Deletes the entire guest cart for the non authenticated user.
 *     tags: [Cart (Guest)]
 *     responses:
 *       200:
 *         description: Guest cart deleted
 *       404:
 *         description: Guest cart not found
 *       500:
 *         description: Error deleting guest cart
 */
router.delete(
  '/',
  [guestSessionMiddleware],
  guestCartController.deleteGuestCart
)
module.exports = router
