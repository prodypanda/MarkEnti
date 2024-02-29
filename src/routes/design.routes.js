const express = require('express');
const designController = require('../controllers/design.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const { validateMongoId, validateDesignConfigCreate, validatePageUpdate } = require('../validation/inputValidator')
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const router = express.Router();


router.get('/config/:id', isAuthenticated, validateMongoId, isAdminOrOwner, designController.getDesignConfig);
router.put('/config/:id', isAuthenticated, validateMongoId, isAdminOrOwner, validateDesignConfigCreate, designController.updateDesignConfig);

module.exports = router;
