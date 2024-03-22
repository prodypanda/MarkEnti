// skipcq: JS-0258
const express = require('express')
const discountController = require('../controllers/discount.controller')
const {
  isAuthenticated
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
  isAuthenticated,
  validateMongoId,
  discountController.useDiscount
)
router.post(
  '/',
  isAuthenticated,
  validateDiscountCreate,
  discountController.createDiscount
)
router.put(
  '/:id',
  isAuthenticated,
  validateMongoId,
  validateDiscountUpdate,
  discountController.updateDiscount
)

/**
 * @swagger
 * /discount/{id}:
 *   get:
 *     summary: Get discount by id
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 name:
 *                   type: string
 *                   description: The discount name
 *                 percent:
 *                   type: number
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   description: The discount end date
 *                 products:
 *                   type: array
 *                   description: The list of products that the discount applies to
 *                 categories:
 *                   type: array
 *                   description: The list of categories that the discount applies to
 *                 stores:
 *                   type: array
 *                   description: The list of stores that the discount applies to
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /discount:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The discount name
 *               percent:
 *                 type: number
 *                 description: The discount percentage
 *               startDate:
 *                 type: string
 *                 description: The discount start date
 *               endDate:
 *                 type: string
 *                 description: The discount end date
 *               products:
 *                 type: array
 *                 description: The list of products that the discount applies to
 *               categories:
 *                 type: array
 *                 description: The list of categories that the discount applies to
 *               stores:
 *                 type: array
 *                 description: The list of stores that the discount applies to
 *               isActive:
 *                 type: boolean
 *                 description: The status of the discount
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 name:
 *                   type: string
 *                   description: The discount name
 *                 percent:
 *                   type: number
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   description: The discount end date
 *                 products:
 *                   type: array
 *                   description: The list of products that the discount applies to
 *                 categories:
 *                   type: array
 *                   description: The list of categories that the discount applies to
 *                 stores:
 *                   type: array
 *                   description: The list of stores that the discount applies to
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /discount/{id}:
 *   put:
 *     summary: Update a discount by id
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *                 description: The discount name
 *               percent:
 *                 type: number
 *                 description: The discount percentage
 *               startDate:
 *                 type: string
 *                 description: The discount start date
 *               endDate:
 *                 type: string
 *                 description: The discount end date
 *               products:
 *                 type: array
 *                 description: The list of products that the discount applies to
 *               categories:
 *                 type: array
 *                 description: The list of categories that the discount applies to
 *               stores:
 *                 type: array
 *                 description: The list of stores that the discount applies to
 *               isActive:
 *                 type: boolean
 *                 description: The status of the discount
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The discount id
 *                 name:
 *                   type: string
 *                   description: The discount name
 *                 percent:
 *                   type: number
 *                   description: The discount percentage
 *                 startDate:
 *                   type: string
 *                   description: The discount start date
 *                 endDate:
 *                   type: string
 *                   description: The discount end date
 *                 products:
 *                   type: array
 *                   description: The list of products that the discount applies to
 *                 categories:
 *                   type: array
 *                   description: The list of categories that the discount applies to
 *                 stores:
 *                   type: array
 *                   description: The list of stores that the discount applies to
 *                 isActive:
 *                   type: boolean
 *                   description: The status of the discount
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /discount/{id}:
 *   delete:
 *     summary: Delete a discount by id
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         required: true
 *         name: id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not Found
 */

/**
 * @swagger
 * /discount/all:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discount]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
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
 *                   name:
 *                     type: string
 *                     description: The discount name
 *                   percent:
 *                     type: number
 *                     description: The discount percentage
 *                   startDate:
 *                     type: string
 *                     description: The discount start date
 *                   endDate:
 *                     type: string
 *                     description: The discount end date
 *                   products:
 *                     type: array
 *                     description: The list of products that the discount applies to
 *                   categories:
 *                     type: array
 *                     description: The list of categories that the discount applies to
 *                   stores:
 *                     type: array
 *                     description: The list of stores that the discount applies to
 *                   isActive:
 *                     type: boolean
 *                     description: The status of the discount
 *       401:
 *         description: Unauthorized
 */
module.exports = router
