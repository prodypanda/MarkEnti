// src/routes/cart.routes.js

const express = require('express');
const cartController = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');

const router = express.Router();

// Apply isAuthenticated middleware to ensure only authenticated users can access the cart
router.get('/', isAuthenticated, cartController.viewCart);
router.post('/item', isAuthenticated, cartController.addItemToCart);
router.delete('/item/:itemId', isAuthenticated, cartController.removeItemFromCart);

module.exports = router;
