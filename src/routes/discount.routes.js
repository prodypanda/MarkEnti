const express = require('express');
const discountController = require('../controllers/discount.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');

const router = express.Router();

router.post('/', isAuthenticated, discountController.createDiscount);
router.put('/:id', isAuthenticated, discountController.updateDiscount);

module.exports = router;
