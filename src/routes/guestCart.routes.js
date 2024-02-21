const express = require('express');
const router = express.Router();
const guestCartController = require('../controllers/guestCart.controller.js');
const guestSessionMiddleware = require('../middleware/guestSession.middleware.js');
const { csrfProtection } = require('../middleware/csrf.middleware');


/**
 * @swagger
 * tags:
 *   name: GuestCart
 *   description: Category management
 * components:
 *   schemas:
 *     GuestCartItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *         quantity:
 *           type: integer
 *         price:
 *           type: number
 *       required:
 *         - product
 *         - quantity
 *         - price
 *     GuestCart:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GuestCartItem'
 *
 * @swagger
 * /api/carts/guest:
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
 *
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
 *
 * @swagger
 * /api/carts/guest/items:
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
 *
 * @swagger
 * /api/carts/guest/items/{itemId}:
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

router.post('/', [guestSessionMiddleware, csrfProtection], guestCartController.createGuestCart);
router.post('/items', [guestSessionMiddleware, csrfProtection], guestCartController.addItemToGuestCart);
router.delete('/items/:itemId', [guestSessionMiddleware, csrfProtection], guestCartController.removeItemFromGuestCart);
router.get('/', guestSessionMiddleware, guestCartController.getGuestCart);

module.exports = router;
