// skipcq: JS-0258
const express = require('express')
const designController = require('../controllers/design.controller')
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const {
  isAdminOrOwner,
} = require('../middlewares/security/verifyRoles.middleware')
const {
  validateMongoId,
  validateDesignConfigCreate,
  validateDesignConfigUpdate,
} = require('../validation/inputValidator')
// const { authMiddleware, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const router = express.Router()

// just for the first time for configuration
router.post(
  '/config',
  authMiddleware,
  validateDesignConfigCreate,
  isAdminOrOwner,
  designController.createDesignConfig
)

router.get(
  '/config/:id',
  authMiddleware,
  validateMongoId,
  isAdminOrOwner,
  designController.getDesignConfig
)
router.put(
  '/config/:id',
  authMiddleware,
  validateMongoId,
  validateDesignConfigUpdate,
  isAdminOrOwner,
  designController.updateDesignConfig
)

module.exports = router
