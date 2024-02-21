const express = require('express');
const cmsController = require('../controllers/cms.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const router = express.Router();

router.post('/pages', isAuthenticated, cmsController.createPage);
router.put('/pages/:id', isAuthenticated, cmsController.updatePage);
router.delete('/pages/:id', isAuthenticated, cmsController.deletePage);
router.get('/pages/:id', isAuthenticated, cmsController.getPage);
router.get('/pages', isAuthenticated, cmsController.getPages);

module.exports = router;
