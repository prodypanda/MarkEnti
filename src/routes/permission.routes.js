const express = require('express')

// const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
// const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
// const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const {
  isAuthenticated
} = require('../middlewares/security/authenticate.middleware')
const {
  validatePermission,
  validateMongoId
} = require('../validation/inputValidator')

const {
  getMyPermissions,
  getPermission,
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission
} = require('../controllers/permission.controller')

const router = express.Router()

router.get('/myPermissions', isAuthenticated, getMyPermissions)

router.post('/', isAuthenticated, validatePermission, createPermission)
router.put(
  '/:id',
  isAuthenticated,
  validateMongoId,
  validatePermission,
  updatePermission
)

router.delete('/:id', isAuthenticated, validateMongoId, deletePermission)
router.get('/', isAuthenticated, getPermissions)
router.get('/:id', isAuthenticated, validateMongoId, getPermission)

module.exports = router
