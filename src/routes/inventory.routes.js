const express = require('express');
const inventoryController = require('../controllers/inventory.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validateMongoId } = require('../validation/inputValidator')
const router = express.Router();

router.put('/:productId', isAuthenticated, validateMongoId, inventoryController.updateInventory);
router.get('/:productId', isAuthenticated, validateMongoId, inventoryController.getInventory);

module.exports = router;
