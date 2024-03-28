const express = require('express')
const cmsController = require('../controllers/cms.controller')
const {
  authMiddleware,
} = require('../middlewares/security/authenticate.middleware')
const {
  validateMongoId,
  validatePageCreate,
  validatePageUpdate,
} = require('../validation/inputValidator')

const router = express.Router()

//removed.
router.post(
  '/pages',
  authMiddleware,
  validatePageCreate,
  cmsController.createPage
)
router.put(
  '/pages/:id',
  authMiddleware,
  validateMongoId,
  validatePageUpdate,
  cmsController.updatePage
)
router.delete(
  '/pages/:id',
  authMiddleware,
  validateMongoId,
  cmsController.deletePage
)
router.get('/pages/:id', authMiddleware, validateMongoId, cmsController.getPage)
router.get('/pages', authMiddleware, cmsController.getPages)

module.exports = router
