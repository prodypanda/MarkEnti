const express = require('express')
const promoCodeController = require('../controllers/promoCode.controller')
const {
  authMiddleware
} = require('../middlewares/security/authenticate.middleware')
const router = express.Router()

// POST route to create a promo code
router.post('/', authMiddleware, promoCodeController.createPromoCode)

// GET route to retrieve all promo codes
router.get('/', authMiddleware, promoCodeController.getPromoCodes)

// GET route to retrieve a single promo code by code
router.get('/:code', authMiddleware, promoCodeController.getPromoCodeByCode)

// PUT route to update a promo code
router.put('/:code', authMiddleware, promoCodeController.updatePromoCode)

// DELETE route to delete a promo code
router.delete('/:code', authMiddleware, promoCodeController.deletePromoCode)

/**
 * @swagger
 * tags:
 *   name: PromoCodes
 *   description: Promo code management
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /api/promoCodes:
 *   post:
 *     summary: Create a new promo code
 *     tags: [PromoCodes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromoCode'
 *     responses:
 *       200:
 *         description: Promo code created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/promoCodes:
 *   get:
 *     summary: Get all promo codes
 *     tags: [PromoCodes]
 *     responses:
 *       200:
 *         description: Promo codes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PromoCode'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/promoCodes/{code}:
 *   get:
 *     summary: Get a promo code by code
 *     tags: [PromoCodes]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo code
 *     responses:
 *       200:
 *         description: Promo code fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PromoCode'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/promoCodes/{code}:
 *  put:
 *    summary: Update a promo code
 *    tags: [PromoCodes]
 *    parameters:
 *      - in: path
 *        name: code
 *        schema:
 *          type: string
 *        required: true
 *        description: Promo code
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/PromoCode'
 *    responses:
 *      200:
 *        description: Promo code updated successfully
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      403:
 *        $ref: '#/components/responses/ForbiddenError'
 *      404:
 *        $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/promoCodes/{code}:
 *   delete:
 *     summary: Delete a promo code
 *     tags: [PromoCodes]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Promo code
 *     responses:
 *       200:
 *         description: Promo code deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

module.exports = router
