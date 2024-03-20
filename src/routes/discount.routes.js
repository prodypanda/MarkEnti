// skipcq: JS-0258
const express = require('express')
const discountController = require('../controllers/discount.controller')
const {
  isAuthenticated,
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateDiscountCreate,
  validateDiscountUpdate,
} = require('../validation/inputValidator')
const router = express.Router()

router.get('/', discountController.getAllDiscounts)
router.get('/:id', validateMongoId, discountController.getDiscountById)

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

module.exports = router
