// skipcq: JS-0258
const express = require('express')
const discountController = require('../controllers/discount.controller')
const {
  authMiddleware
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateDiscountCreate,
  validateDiscountUpdate
} = require('../validation/inputValidator')
const router = express.Router()

router.get('/', discountController.getAllDiscounts)

router.get('/:id', validateMongoId, discountController.getDiscountById)
router.delete('/:id', validateMongoId, discountController.deleteDiscount)
// now for useDiscount
router.put(
  '/useDiscount/:id',
  authMiddleware,
  validateMongoId,
  discountController.useDiscount
)
router.post(
  '/',
  authMiddleware,
  validateDiscountCreate,
  discountController.createDiscount
)
router.put(
  '/:id',
  authMiddleware,
  validateMongoId,
  validateDiscountUpdate,
  discountController.updateDiscount
)

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discounts management APIs
 * security:
 *   - bearerAuth: []
 */

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Create a new discount
 *     description: This endpoint is used for creating a new discount. It requires valid discount details.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB object id of the associated product
 *               discountPercentage:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: The percentage discount amount
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the discount period (optional, defaults to now)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the discount period (optional, defaults to 1 day from now)
 *               isActive:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the discount is currently active (optional)
 *               maxUsage:
 *                 type: integer
 *                 minimum: 0
 *                 description: The maximum number of times this discount can be used (0 for unlimited, optional)
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 productId:
 *                   type: string
 *                   description: MongoDB object id of the associated product
 *                 discountPercentage:
 *                   type: integer
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: The discount end date
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *                 maxUsage:
 *                   type: integer
 *                   description: The maximum number of times this discount can be used
 *                 usageCount:
 *                   type: integer
 *                   description: The number of times this discount has been used
 *       400:
 *         description: Bad Request (e.g., invalid product ID)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discounts
 *     description: This endpoint is used for retrieving all discounts.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: Discounts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The discount id
 *                   productId:
 *                     type: string
 *                     description: MongoDB object id of the associated product
 *                   discountPercentage:
 *                     type: integer
 *                     description: The discount percentage
 *                   startDate:
 *                     type: string
 *                     format: date
 *                     description: The discount start date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: The discount end date
 *                   isActive:
 *                     type: boolean
 *                     description: The status of the discount
 *                   maxUsage:
 *                     type: integer
 *                     description: The maximum number of times this discount can be used
 *                   usageCount:
 *                     type: integer
 *                     description: The number of times this discount has been used
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Get discount by id
 *     description: This endpoint is used for retrieving a discount by id.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 productId:
 *                   type: string
 *                   description: MongoDB object id of the associated product
 *                 discountPercentage:
 *                   type: integer
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: The discount end date
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *                 maxUsage:
 *                   type: integer
 *                   description: The maximum number of times this discount can be used
 *                 usageCount:
 *                   type: integer
 *                   description: The number of times this discount has been used
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Update a discount by id
 *     description: This endpoint is used for updating a discount by id.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: MongoDB object id of the associated product (optional)
 *               discountPercentage:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: The percentage discount amount (optional)
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the discount period (optional)
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the discount period (optional)
 *               isActive:
 *                 type: boolean
 *                 description: The status of the discount (optional)
 *               maxUsage:
 *                 type: integer
 *                 minimum: 0
 *                 description: The maximum number of times this discount can be used (0 for unlimited, optional)
 *               usageCount:
 *                 type: integer
 *                 minimum: 0
 *                 description: The number of times this discount has been used (optional)
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 productId:
 *                   type: string
 *                   description: MongoDB object id of the associated product
 *                 discountPercentage:
 *                   type: integer
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: The discount end date
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *                 maxUsage:
 *                   type: integer
 *                   description: The maximum number of times this discount can be used
 *                 usageCount:
 *                   type: integer
 *                   description: The number of times this discount has been used
 *       400:
 *         description: Bad Request (e.g., invalid product ID)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Delete a discount by id
 *     description: This endpoint is used for deleting a discount by id.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Discount deleted
 *                   example: Discount deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /discounts/useDiscount/{id}:
 *   put:
 *     summary: Use a discount by id
 *     description: This endpoint is used for using a discount by id.
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discount used successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 productId:
 *                   type: string
 *                   description: MongoDB object id of the associated product
 *                 discountPercentage:
 *                   type: integer
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   format: date
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   format: date
 *                   description: The discount end date
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *                 maxUsage:
 *                   type: integer
 *                   description: The maximum number of times this discount can be used
 *                 usageCount:
 *                   type: integer
 *                   description: The number of times this discount has been used
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Discount usage limit reached or expired
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Internal server error
 */
