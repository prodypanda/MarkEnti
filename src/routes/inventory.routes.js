const express = require('express')
const inventoryController = require('../controllers/inventory.controller')
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validateInventoryNumeric
} = require('../validation/inputValidator')
const router = express.Router()

// id for productId
router.put(
  '/:id',
  isAuthenticated,
  validateMongoId,
  validateInventoryNumeric,
  inventoryController.updateInventory
)
router.get(
  '/:id',
  isAuthenticated,
  validateMongoId,
  inventoryController.getInventory
)

module.exports = router
