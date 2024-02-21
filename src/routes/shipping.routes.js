const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');

router.get('/', isAuthenticated, shippingController.getShippingOptions);
router.post('/', isAuthenticated, shippingController.createShippingOption);
router.put('/:id', isAuthenticated, shippingController.updateShippingOption);
router.delete('/:id', isAuthenticated, shippingController.deleteShippingOption);

module.exports = router;
