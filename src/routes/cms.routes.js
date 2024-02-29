const express = require('express');
const cmsController = require('../controllers/cms.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { validateMongoId, validatePageCreate, validatePageUpdate } = require('../validation/inputValidator')

const router = express.Router();

//removed.
router.post('/pages', isAuthenticated, validatePageCreate, cmsController.createPage);
router.put('/pages/:id', isAuthenticated, validateMongoId, validatePageUpdate, cmsController.updatePage);
router.delete('/pages/:id', isAuthenticated, validateMongoId, cmsController.deletePage);
router.get('/pages/:id', isAuthenticated, validateMongoId, cmsController.getPage);
router.get('/pages', isAuthenticated, cmsController.getPages);

module.exports = router;
