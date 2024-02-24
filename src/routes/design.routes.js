const express = require('express');
const designController = require('../controllers/design.controller');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/authorityCheck.middleware');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const router = express.Router();


router.get('/config/:userId', isAuthenticated, isAdminOrOwner, designController.getDesignConfig);
router.put('/config/:userId', isAuthenticated, isAdminOrOwner, designController.updateDesignConfig);

module.exports = router;
