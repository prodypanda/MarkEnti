// src/routes/cart.routes.js

// skipcq: JS-0258
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

module.exports = router
