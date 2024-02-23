const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const router = express.Router();

router.put('/:productId', isAuthenticated, inventoryController.updateInventory);
router.get('/:productId', isAuthenticated, inventoryController.getInventory);

module.exports = router;
