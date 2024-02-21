const express = require('express');
const designController = require('../controllers/design.controller');
const { isAuthenticated } = require('../middleware/authenticate.middleware');
const { isAdminOrOwner } = require('../middleware/authCheck.middleware');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const router = express.Router();

router.get('/config/:userId', isAuthenticated, isAdminOrOwner, designController.getDesignConfig);
router.put('/config/:userId', isAuthenticated, isAdminOrOwner, designController.updateDesignConfig);

module.exports = router;
