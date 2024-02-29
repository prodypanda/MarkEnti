const express = require('express');
const designController = require('../controllers/design.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const { validateMongoId, validateDesignConfigCreate, validateDesignConfigUpdate } = require('../validation/inputValidator')
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const router = express.Router();

// just for the first time for configuration
router.post('/config', isAuthenticated, validateDesignConfigCreate, isAdminOrOwner, designController.createDesignConfig);

router.get('/config/:id', isAuthenticated, validateMongoId, isAdminOrOwner, designController.getDesignConfig);
router.put('/config/:id', isAuthenticated, validateMongoId, validateDesignConfigUpdate, isAdminOrOwner, designController.updateDesignConfig);

module.exports = router;
