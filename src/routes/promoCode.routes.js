const express = require('express');
const promoCodeController = require('../controllers/promoCode.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const router = express.Router();

// POST route to create a promo code
router.post('/', isAuthenticated, promoCodeController.createPromoCode);

// GET route to retrieve all promo codes
router.get('/', isAuthenticated, promoCodeController.getPromoCodes);

// GET route to retrieve a single promo code by code
router.get('/:code', isAuthenticated, promoCodeController.getPromoCodeByCode);

// PUT route to update a promo code
router.put('/:code', isAuthenticated, promoCodeController.updatePromoCode);

// DELETE route to delete a promo code
router.delete('/:code', isAuthenticated, promoCodeController.deletePromoCode);
module.exports = router;