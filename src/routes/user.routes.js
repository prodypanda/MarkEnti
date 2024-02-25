const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/user.controller');
// const { isAuthenticated, isAdminOrOwner } = require('../middleware/authenticate.middleware');
const { isAuthenticated } = require('../middlewares/security/authenticate.middleware');
const { isAdminOrOwner } = require('../middlewares/security/verifyRoles.middleware');
const router = express.Router();

router.get('/profile', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, isAdminOrOwner, updateUserProfile);

module.exports = router;
